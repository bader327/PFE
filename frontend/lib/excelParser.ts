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
      row["Défaut 1"],
      row["Défaut 2"],
      row["Défaut 3"],
      row["Défault 4"],
      row["Défaut 5"],
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
  

  // sort bobine data ascendingly based on numero
  for (
    let bobineIndice = 0;
    bobineIndice < bobinesData.length - 2;
    ++bobineIndice
  ) {
    // 1ere bobine : bobinesData[bobineIndice], 2eme bobine: bobinesData[bobineIndice+1], 3eme
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
  // console.log(
  //   bobinesData,
  //   produitsConformes,
  //   produitsNonConformes,
  //   bobinesIncompletes,
  //   serialsNOK,
  //   serialsIncomplets,
  //   alertes,
  //   ftq,
  //   tauxDeProduction
  // );
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

function checkDefault(defauts: string[][], defaultToCheck: number) {
  return defauts.every((v) => v[defaultToCheck] === defauts[0][defaultToCheck]);
}
