import * as xlsx from "xlsx";
export async function processExcelFile(fileBuffer: ArrayBuffer) {
  const workbook = xlsx.read(fileBuffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  console.log("json data length ", jsonData.length);
  // console.log("json ", jsonData);
  const bobinesData = jsonData.map((row: any) => ({
    numero: (row["Serial Number"] as number) || -1,
    produit: row["Item"] || "",
    conforme: row["FinalStatus"].toUpperCase() === "OK",
    nonConforme: row["FinalStatus"].toUpperCase() === "NOK",
    incomplete: !["OK", "NOK"].includes(row["FinalStatus"].toUpperCase()),
    reportType: row["Report type"],
    defauts: [
      row["Défaut 1"].toLowerCase(),
      row["Défaut 2"].toLowerCase(),
      row["Défaut 3"].toLowerCase(),
      row["Défault 4"].toLowerCase(),
      row["Défaut 5"].toLowerCase(),
    ],
  }));
  console.log("bobines data length ", bobinesData.length);
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
  const tauxDeProduction = (bobinesData.length / 60) * 60;
  const tauxderejets = (produitsNonConformes / bobinesData.length) * 100;
  const productionCible = produitsConformes;
  const detectedFpsArr = [];
  // sort bobine data ascendingly based on numero
  const filteredBobineData = bobinesData.filter(
    (bobine) => bobine.reportType.toUpperCase() !== "SETUP"
  );
  const bobineSize = filteredBobineData.length;
  for (
    let bobineIndice = 0;
    bobineIndice < filteredBobineData.length - 2;
    ++bobineIndice
  ) {
    // 1ere bobine : bobinesData[bobineIndice], 2eme bobine: bobinesData[bobineIndice+1], 3eme
    const firstConditionArray =
      bobineIndice + 3 <= bobineSize
        ? filteredBobineData.slice(bobineIndice, bobineIndice + 3)
        : [];

    const defaultsTypes = firstConditionArray.map((e) => e.defauts);
    console.log(defaultsTypes);
    const fpsOneDetected = checkConditionFPS(defaultsTypes);

    const fpsInfo = { bobine: filteredBobineData[bobineIndice].numero };
    if (fpsOneDetected) {
      detectedFpsArr.push(fpsInfo);
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
    tauxderejets,
    productionCible,
    detectedFpsArr,
  };
}

function checkConditionFPS(defaultsPerBobine: string[][]): boolean {
  let defaultsCondition = false;
  for (let i = 0; i < 5 && !defaultsCondition; ++i) {
    defaultsCondition = defaultsCondition || checkDefault(defaultsPerBobine, i);
  }
  return defaultsCondition;
}

function checkSecondConditionFPS(
  reportTypes: string[],
  defaultsPerBobine: string[][]
): boolean {
  const validTypes = ["PRODUCTION", "AFTER SETUP"];

  const reportTypeCondition =
    (reportTypes[1] === "SETUP" &&
      validTypes.includes(reportTypes[0]) &&
      validTypes.includes(reportTypes[2]) &&
      validTypes.includes(reportTypes[3])) ||
    (reportTypes[2] === "SETUP" &&
      validTypes.includes(reportTypes[0]) &&
      validTypes.includes(reportTypes[1]) &&
      validTypes.includes(reportTypes[3]));

  let defaultsCondition = false;
  for (let i = 0; i < 4 && !defaultsCondition; ++i) {
    defaultsCondition = defaultsCondition || checkDefault(defaultsPerBobine, i);
  }

  return reportTypeCondition && defaultsCondition;
}

function checkThirdConditionFPS(
  reportTypes: string[],
  defaultsPerBobine: string[][]
): boolean {
  const validTypes = ["PRODUCTION", "AFTER SETUP"];

  const reportTypeCondition =
    reportTypes[1] === "SETUP" &&
    reportTypes[3] === "SETUP" &&
    validTypes.includes(reportTypes[0]) &&
    validTypes.includes(reportTypes[2]) &&
    validTypes.includes(reportTypes[4]);

  let defaultsCondition = false;
  for (let i = 0; i < 5 && !defaultsCondition; ++i) {
    defaultsCondition = defaultsCondition || checkDefault(defaultsPerBobine, i);
  }

  return reportTypeCondition && defaultsCondition;
}

function checkDefault(defauts: string[][], defaultToCheck: number) {
  return defauts.every(
    (v) =>
      v[defaultToCheck] === defauts[0][defaultToCheck] &&
      v[defaultToCheck] !== ""
  );
}
