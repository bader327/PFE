import { read, utils } from 'xlsx';

// Helper function to identify defect types from data
function getDefectTypes(data: any[]): string[] {
  const defectColumns = [
    "Défaut 1", "Défaut 2", "Défaut 3", "Défault 4", "Défaut 5",
    "Abrasion par grattage", "Adherance", "Allongement", "Aspect",
    "Bull d'aire", "Bulle d'air dans la purge", "Charge à la rupture", 
    "Couleur", "Diamétre", "Diamètre isolant", "Essai de grattage", 
    "Excés talc", "Oxydation", "Résistance", "Test de grattage", 
    "Trancannage", "Uniformité de la couleur"
  ];
  
  const defectTypes: string[] = [];
    data.forEach((row: any) => {
    defectColumns.forEach(column => {
      if (row[column] && 
        (row[column] === true || 
         String(row[column]).toLowerCase() === "nok" || 
         String(row[column]).toLowerCase().includes("défaut"))) {
        
        if (!defectTypes.includes(column)) {
          defectTypes.push(column);
        }
      }
    });
  });
  
  return defectTypes;
}

export interface BobineData {
  id: string;
  statut: 'Production' | 'Setup' | 'After Setup';
  defauts: {
    defaut1?: boolean;
    defaut2?: boolean;
    defaut3?: boolean;
    defaut4?: boolean;
    defaut5?: boolean;
  };
  hasDefect: boolean;
  numeroBobine: string;
  produit: string;
}

export async function processExcelFile(filePathOrBuffer: string | Buffer) {
  try {
    const workbook = typeof filePathOrBuffer === 'string' 
      ? read(filePathOrBuffer, { type: 'file' }) 
      : read(filePathOrBuffer, { type: 'buffer' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    
    // Values extracted from Excel file
    let produitsConformes = 0;
    let produitsNonConformes = 0;
    let bobinesIncompletes = 0;
    const bobinesData: BobineData[] = [];    // Process each row
    (data as any[]).forEach((row) => {
      // Extract status information from "Statut FTQ" or "FinalStatus" column
      const statutFTQ = row["Statut FTQ "] || row["FinalStatus"] || "";
      const isConforme = statutFTQ.toLowerCase().includes("conforme") || statutFTQ === "OK";
      const isIncomplete = statutFTQ.toLowerCase().includes("incomplet");
      
      // Count products by status
      if (isConforme) {
        produitsConformes++;
      } else if (isIncomplete) {
        bobinesIncompletes++;
      } else {
        produitsNonConformes++;
      }
      
      // Extract detailed bobine information for FPS detection
      // Determine status based on the "Report type" column (assuming it contains Production, Setup info)
      let bobineStatut: 'Production' | 'Setup' | 'After Setup';
      const reportType = row["Report type"] || "";
      
      if (reportType.toLowerCase().includes("production")) {
        bobineStatut = 'Production';
      } else if (reportType.toLowerCase().includes("setup")) {
        bobineStatut = 'Setup';
      } else {
        bobineStatut = 'After Setup'; // Default or follow-up status
      }
      
      // Check for defects in the dedicated defect columns
      const defauts = {
        defaut1: Boolean(row["Défaut 1"]),
        defaut2: Boolean(row["Défaut 2"]),
        defaut3: Boolean(row["Défaut 3"]),
        defaut4: Boolean(row["Défault 4"]),
        defaut5: Boolean(row["Défaut 5"]),
      };
      
      // Additional quality check columns that might indicate defects
      const qualityChecks = [
        "Allongement", "Aspect", "Couleur", "Diamétre", "Marquage", 
        "Oxydation", "Résistance", "Test de grattage", "Trancannage"
      ];
      
      // Check if any quality check failed
      qualityChecks.forEach(check => {
        if (row[check] && row[check].toString().toLowerCase().includes("nok")) {
          defauts.defaut1 = true;
        }
      });
      
      const hasDefect = Object.values(defauts).some(d => d);
      
      bobinesData.push({
        id: row["Serial Number"] || row["ID Line"] || `bobine-${bobinesData.length + 1}`,
        statut: bobineStatut,
        defauts,
        hasDefect,
        numeroBobine: row["Serial Number"] || row["SN Input"] || '',
        produit: row["Item"] || row["Description"] || '',
      });    });
    
    // Calculate KPIs
    const total = produitsConformes + produitsNonConformes + bobinesIncompletes;
    const ftq = total > 0 ? (produitsConformes / total) * 100 : 0;
    
    // Calculate production rate and rejection rate
    const tauxProduction = total > 0 ? (produitsConformes / total) * 100 : 0;
    const tauxRejets = total > 0 ? (produitsNonConformes / total) * 100 : 0;
    
    // Determine production target based on data or use fallback
    // Try to extract from quantity information (assuming total expected quantity is available)
    const totalQuantity = data.reduce((sum: number, row: any) => sum + (parseInt(row["Quantity"], 10) || 0), 0);
    const productionCible = totalQuantity > 0 ? totalQuantity : Math.max(100, Math.ceil(total * 1.2)); 
      // Get shift and date information if available
    const shifts = [...new Set(data.map((row: any) => row["Shift"]).filter(Boolean))];
    const dates = [...new Set(data.map((row: any) => row["Date"]).filter(Boolean))];
      // Process hour-based analytics
    const hourlyData: Record<number, {
      produitsConformes: number,
      produitsNonConformes: number,
      total: number
    }> = {};
    data.forEach((row: any) => {
      let rowDate = row["Date"];
      let rowTime = row["Time"] || "";
      
      if (rowDate && rowTime) {
        // Try to extract hour from time field
        const hourMatch = rowTime.toString().match(/^(\d{1,2}):/);
        const hour = hourMatch ? parseInt(hourMatch[1], 10) : null;
        
        if (hour !== null) {
          if (!hourlyData[hour]) {
            hourlyData[hour] = {
              produitsConformes: 0,
              produitsNonConformes: 0,
              total: 0
            };
          }
          
          const isConforme = (row["Statut FTQ "] || row["FinalStatus"] || "").toLowerCase().includes("conforme");
          
          hourlyData[hour].total++;
          if (isConforme) {
            hourlyData[hour].produitsConformes++;
          } else {
            hourlyData[hour].produitsNonConformes++;
          }
        }
      }
    });
    
    // Extended information for detailed analysis
    const extendedInfo = {
      shifts,
      dates,
      users: [...new Set(data.map((row: any) => row["User Name"]).filter(Boolean))],
      defectTypes: getDefectTypes(data as any[]),
      lineId: (data as any[])[0]?.["ID Line"] || null,
      hourlyData
    };
    
    return {
      produitsConformes,
      produitsNonConformes,
      bobinesIncompletes,
      conformityRate: parseFloat(ftq.toFixed(2)),
      productionRate: parseFloat(tauxProduction.toFixed(2)),
      rejectRate: parseFloat(tauxRejets.toFixed(2)),
      targetProduction: productionCible,
      bobinesData,
      extendedInfo
    };
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process Excel file');
  }
}
