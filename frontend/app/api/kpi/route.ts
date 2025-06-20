import { NextResponse } from "next/server";
import { connectToDatabase } from "../announcements/route";

export async function GET(req: Request) {
  const db = await connectToDatabase();
  const url = new URL(req.url);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
  console.log(now, yesterday);

  try {
    const filter = {
      uploadedAt: {
        $gte: yesterday,
        $lte: now,
      },
    };

    // Fetch matching files from MongoDB
    const files = await db
      .collection("files")
      .find(filter)
      .sort({ uploadedAt: 1 }) // 1 for ascending
      .toArray();

    // Calculate aggregate KPIs
    const totalProduitsConformes = files.reduce(
      (sum, file) => sum + file.produitsConformes,
      0
    );
    const totalProduitsNonConformes = files.reduce(
      (sum, file) => sum + file.produitsNonConformes,
      0
    );
    const totalBobinesIncompletes = files.reduce(
      (sum, file) => sum + file.bobinesIncompletes,
      0
    );

    const totalProduits =
      totalProduitsConformes +
      totalProduitsNonConformes +
      totalBobinesIncompletes;

    // Calculate average KPIs
    const avgFtq = files.length
      ? files.reduce((sum, file) => sum + file.ftq, 0) / files.length
      : 0;
    const avgTauxProduction = files.length
      ? files.reduce((sum, file) => sum + file.tauxProduction, 0) / files.length
      : 0;
    const avgTauxRejets = files.length
      ? files.reduce((sum, file) => sum + file.tauxRejets, 0) / files.length
      : 0;

    // Group data by date for charts
    const dataByDate = files.reduce((acc: any, file) => {
      const dateString = file.uploadedAt.toISOString().split("T")[0];

      if (!acc[dateString]) {
        acc[dateString] = {
          date: dateString,
          produitsConformes: 0,
          produitsNonConformes: 0,
          bobinesIncompletes: 0,
          ftq: 0,
          tauxProduction: 0,
          tauxRejets: 0,
          count: 0,
        };
      }

      acc[dateString].produitsConformes += file.produitsConformes;
      acc[dateString].produitsNonConformes += file.produitsNonConformes;
      acc[dateString].bobinesIncompletes += file.bobinesIncompletes;
      acc[dateString].ftq += file.ftq;
      acc[dateString].tauxProduction += file.tauxProduction;
      acc[dateString].tauxRejets += file.tauxRejets;
      acc[dateString].count += 1;

      return acc;
    }, {});

    // Calculate daily averages
    Object.keys(dataByDate).forEach((date) => {
      const data = dataByDate[date];
      data.ftq = data.ftq / data.count;
      data.tauxProduction = data.tauxProduction / data.count;
      data.tauxRejets = data.tauxRejets / data.count;
    });

    const chartData = Object.values(dataByDate);

    // Prepare response
    const kpiData = {
      summary: {
        totalFiles: files.length,
        produitsConformes: totalProduitsConformes,
        produitsNonConformes: totalProduitsNonConformes,
        bobinesIncompletes: totalBobinesIncompletes,
        totalProduits,
        ftq: parseFloat(avgFtq.toFixed(2)),
        tauxProduction: parseFloat(avgTauxProduction.toFixed(2)),
        tauxRejets: parseFloat(avgTauxRejets.toFixed(2)),
      },
      chartData,
      files,
    };

    return NextResponse.json(kpiData);
  } catch (error) {
    console.error("Erreur lors de la récupération des KPI:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des KPI" },
      { status: 500 }
    );
  }
}
