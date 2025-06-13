import * as xlsx from "xlsx";

interface BobineData {
  numero: number;
  produit: string;
  conforme: boolean;
  nonConforme: boolean;
  incomplete: boolean;
  reportType: string;
  defauts: string[];
}

interface ProcessedData {
  bobinesData: BobineData[];
  produitsConformes: number;
  produitsNonConformes: number;
  bobinesIncompletes: number;
  serialsNOK: number[];
  serialsIncomplets: number[];
  alertes: string[];
  ftq: number;
  tauxDeProduction: number;
  productionRate: number;
  rejectRate: number;
  conformityRate: number;
  targetProduction: number;
  hourlyData: { [key: string]: any };
}

export async function processExcelFile(fileBuffer: ArrayBuffer): Promise<ProcessedData> {
  const workbook = xlsx.read(fileBuffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  const bobinesData = jsonData.map((row: any) => ({
    numero: (row["Serial Number"] as number) || -1,
    produit: row["Item"] || "",
    conforme: row["FinalStatus"].toUpperCase() === "OK",
    nonConforme: row["FinalStatus"].toUpperCase() === "NOK",
    incomplete: !["OK", "NOK"].includes(row["FinalStatus"].toUpperCase()),
    reportType: row["Report type"],
    defauts: [
      row["Défaut 1"],
      row["Défaut 2"],
      row["Défaut 3"],
      row["Défault 4"],
      row["Défaut 5"],
    ],
  }));

  const produitsConformes = bobinesData.filter((b) => b.conforme).length;
  const produitsNonConformes = bobinesData.filter((b) => b.nonConforme).length;
  const bobinesIncompletes = bobinesData.filter((b) => b.incomplete).length;

  const serialsNOK = bobinesData
    .filter((b) => b.nonConforme)
    .map((b) => b.numero);
  const serialsIncomplets = bobinesData
    .filter((b) => b.incomplete)
    .map((b) => b.numero);

  const alertes = [];

  const ftq = (produitsConformes / bobinesData.length) * 100;
  const tauxDeProduction = (bobinesData.length / 60) * 100;
  
  // Calculate additional rates
  const productionRate = tauxDeProduction;
  const rejectRate = (produitsNonConformes / bobinesData.length) * 100;
  const conformityRate = ftq;
  const targetProduction = 100; // Default target

  // Mock hourly data
  const hourlyData: { [key: string]: any } = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyData[hour.toString()] = {
      production: Math.floor(Math.random() * 100),
      defects: Math.floor(Math.random() * 10),
    };
  }

  // Check for FPS conditions
  for (let bobineIndice = 0; bobineIndice < bobinesData.length - 2; ++bobineIndice) {
    const fb = bobinesData[bobineIndice];
    const sb = bobinesData[bobineIndice + 1];
    const tb = bobinesData[bobineIndice + 2];
    const reportTypes = [fb, sb, tb].map((v) => v.reportType);
    const defaults = [fb, sb, tb].map((v) => v.defauts);
    if (checkFirstConditionFPS(reportTypes, defaults)) {
      //
    }
  }

  if (produitsNonConformes > 5) {
    alertes.push("⚠️ Trop de produits non conformes");
  }
  if (bobinesIncompletes > 3) {
    alertes.push("⚠️ Trop de bobines incomplètes");
  }

  return {
    bobinesData,
    produitsConformes,
    produitsNonConformes,
    bobinesIncompletes,
    serialsNOK,
    serialsIncomplets,
    alertes,
    ftq,
    tauxDeProduction,
    productionRate,
    rejectRate,
    conformityRate,
    targetProduction,
    hourlyData,
  };
}

function checkFirstConditionFPS(
  reportTypes: string[],
  defaultsPerBobine: string[][]
): boolean {
  const reportTypeCondition = reportTypes.some((v) =>
    ["PRODUCTION", "AFTER SETUP"].includes(v)
  );
  let defaultsCondition = false;
  for (let i = 0; i < 3 && !defaultsCondition; ++i) {
    defaultsCondition = defaultsCondition || checkDefault(defaultsPerBobine, i);
  }
  return reportTypeCondition && defaultsCondition;
}

function checkDefault(defauts: string[][], defaultToCheck: number): boolean {
  return defauts.every((v) => v[defaultToCheck] === defauts[0][defaultToCheck]);
}
