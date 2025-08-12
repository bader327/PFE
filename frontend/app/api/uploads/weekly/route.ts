// app/api/file-stats/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/setupDB";

function formatYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}

function enumerateDaysBetween(startDate: Date, endDate: Date) {
  const dates: string[] = [];
  const cur = new Date(startDate);
  while (cur <= endDate) {
    dates.push(formatYMD(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get("startDate")!;
    const endDateStr = searchParams.get("endDate")!;
    const ligneId = searchParams.get("ligneId");
    const usineId = searchParams.get("usineId");

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "startDate and endDate required" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
      return NextResponse.json(
        { error: "invalid date format" },
        { status: 400 }
      );
    }

    // — the KPIs we want to roll up —
    const countFields = [
      "produitsConformes",
      "produitsNonConformes",
      "bobinesIncompletes",
      "ftq",
      "tauxProduction",
      "tauxderejets",
    ];

    // basic match on date range + optional usine or ligne
    const match: any = {
      fileDate: { $gte: startDate, $lte: endDate },
    };
    if (usineId) match.usineId = usineId;
    if (ligneId) match.ligneId = ligneId;

    const db = await connectToDatabase();
    const col = db.collection("File");

    // we'll need this full list of days to fill gaps
    const allDates = enumerateDaysBetween(startDate, endDate);

    if (ligneId) {
      // ——— LAST 14 HOURS MODE ———
      // ——— LAST 14 HOURS IN UTC+1 ———
      const now = new Date();

      // helper to pad numbers
      const pad = (n: number) => n.toString().padStart(2, "0");

      // 1) Build the 14 hourly labels in UTC+1
      const hours: string[] = [];
      for (let offset = 13; offset >= 0; offset--) {
        // subtract offset hours, then add one hour (to shift UTC→UTC+1)
        const ms = now.getTime() - offset * 3_600_000 + 3_600_000;
        const d = new Date(ms);
        const year = d.getUTCFullYear();
        const month = pad(d.getUTCMonth() + 1);
        const day = pad(d.getUTCDate());
        const hour = pad(d.getUTCHours());
        hours.push(`${year}-${month}-${day}T${hour}:00`);
      }

      // 2) Match the raw UTC range (earliest = now-13h)
      const earliest = new Date(now.getTime() - 13 * 3_600_000);
      const matchHours: any = {
        fileDate: { $gte: earliest, $lte: now },
        ligneId,
      };
      if (usineId) matchHours.usineId = usineId;

      // 3) Group by the UTC+1 hour bucket
      const groupStage: any = {
        _id: {
          hour: {
            $dateToString: {
              format: "%Y-%m-%dT%H:00",
              date: "$fileDate",
              timezone: "+01:00", // <— shift into UTC+1
            },
          },
        },
      };
      countFields.forEach((f) => {
        groupStage[f] = { $max: `$${f}` };
      });

      const agg = await col
        .aggregate([
          { $match: matchHours },
          { $group: groupStage },
          { $sort: { "_id.hour": 1 } },
        ])
        .toArray();

      // 4) Pivot into your final payload
      const byHour: Record<string, Record<string, number>> = {};
      agg.forEach((doc) => {
        const hr = doc._id.hour as string; // already in UTC+1
        const counts = { ...doc };
        delete (counts as any)._id;
        byHour[hr] = counts;
      });

      const result: Record<string, any[]> = { date: hours };
      countFields.forEach((f) => {
        result[f] = hours.map((h) => byHour[h]?.[f] ?? 0);
      });

      return NextResponse.json(result);
    } else {
      // ——— NEW: multi-line mode ———
      // 1) project all the ligne_* fields into an array
      // 2) unwind them, so each document becomes one { ligneKey, lineData, fileDate }
      // 3) group by both ligneKey and calendar-day

      const agg = await col
        .aggregate([
          { $match: match },
          {
            $project: {
              fileDate: 1,
              lines: {
                $filter: {
                  input: { $objectToArray: "$$ROOT" },
                  as: "it",
                  cond: { $regexMatch: { input: "$$it.k", regex: "^ligne_" } },
                },
              },
            },
          },
          { $unwind: "$lines" },
          {
            $project: {
              ligneKey: "$lines.k",
              data: "$lines.v",
              fileDate: 1,
            },
          },
          {
            $group: {
              _id: {
                ligneId: "$ligneKey",
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$fileDate" },
                },
              },
              // aggregate each KPI
              produitsConformes: { $max: "$data.produitsConformes" },
              produitsNonConformes: { $max: "$data.produitsNonConformes" },
              bobinesIncompletes: { $max: "$data.bobinesIncompletes" },
              ftq: { $max: "$data.ftq" },
              tauxProduction: { $max: "$data.tauxProduction" },
              tauxderejets: { $max: "$data.tauxderejets" },
            },
          },
          { $sort: { "_id.ligneId": 1, "_id.date": 1 } },
        ])
        .toArray();

      // reshape into { [ligneId]: { date: [...], produitsConformes: [...], … } }
      const byLigne: Record<
        string,
        Record<string, Record<string, number>>
      > = {};
      agg.forEach((doc) => {
        const { ligneId, date } = doc._id as { ligneId: string; date: string };
        const counts = { ...doc };
        delete (counts as any)._id;

        byLigne[ligneId] = byLigne[ligneId] || {};
        byLigne[ligneId][date] = counts as Record<string, number>;
      });

      // for each ligne produce its full timeseries (filling missing dates with 0)
      const result: Record<string, any> = {};
      Object.entries(byLigne).forEach(([lid, dayMap]) => {
        const series: Record<string, any[]> = { date: allDates };
        countFields.forEach((f) => {
          series[f] = allDates.map((d) => dayMap[d]?.[f] ?? 0);
        });
        result[lid] = series;
      });

      return NextResponse.json(result);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
