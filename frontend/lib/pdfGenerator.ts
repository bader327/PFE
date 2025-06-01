// lib/pdfGenerator.ts
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FpsData {
  id: string;
  operateur: string;
  defaut: string;
  produit: string;
  numeroBobine: string;
  cause: string;
  actions: string;
  enregistrer: boolean;
  fpsNiveau1: boolean;
  file?: {
    path: string;
    ligneId: string;
    produitsConformes: number;
    produitsNonConformes: number;
    bobinesIncompletes: number;
    ftq: number;
    tauxProduction: number;
    tauxRejets: number;
    productionCible: number;
    uploadedAt: string;
  };
  fps2?: {
    id: string;
    chefEquipeProd: string;
    chefEquipeQualite: string;
    probleme: string;
    numeroBobine: string;
    causeApparente: string;
    cause1: string;
    cause2: string;
    cause3: string;
    cause4: string;
    action: string;
    enregistrer: boolean;
    passerNiveau2: boolean;
    fps3?: {
      id: string;
      // autres propriétés niveau 3
    };
  };
}

export async function generateFpsReport(fps: FpsData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add company logo
  doc.addImage('/logo.png', 'PNG', 10, 10, 30, 30);
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 102);
  doc.text('Fiche de Performance du Système', 105, 20, { align: 'center' });
  
  // FPS level and color coding
  doc.setFontSize(16);
  if (fps.fps2?.fps3) {
    doc.setTextColor(255, 0, 0); // Red for level 3 (critical)
    doc.text('Niveau 3 - Analyse Approfondie', 105, 30, { align: 'center' });
  } else if (fps.fps2) {
    doc.setTextColor(255, 165, 0); // Orange for level 2 (important)
    doc.text('Niveau 2 - Analyse détaillée', 105, 30, { align: 'center' });
  } else {
    doc.setTextColor(0, 128, 0); // Green for level 1 (initial)
    doc.text('Niveau 1 - Détection initiale', 105, 30, { align: 'center' });
  }
  
  // Reset text color
  doc.setTextColor(0, 51, 102);
  
  // Header info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Référence: ${fps.id}`, 10, 50);
  doc.text(`Date: ${new Date(fps.file?.uploadedAt || new Date()).toLocaleDateString()}`, 10, 55);
  doc.text(`Produit: ${fps.produit}`, 10, 60);
  doc.text(`Bobine: ${fps.numeroBobine}`, 10, 65);
  
  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(10, 70, 200, 70);
  
  // Section 1: Détails de l'anomalie
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Détails de l\'anomalie', 10, 80);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Défaut détecté: ${fps.defaut}`, 15, 90);
  doc.text(`Opérateur: ${fps.operateur}`, 15, 95);
  doc.text(`Cause identifiée: ${fps.cause}`, 15, 100);
  doc.text(`Actions correctives: ${fps.actions}`, 15, 105);
  
  // Métriques de production
  if (fps.file) {
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Métriques de production', 10, 120);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Produits conformes: ${fps.file.produitsConformes}`, 15, 130);
    doc.text(`Produits non conformes: ${fps.file.produitsNonConformes}`, 15, 135);
    doc.text(`FTQ: ${fps.file.ftq.toFixed(2)}%`, 15, 140);
    doc.text(`Taux de production: ${fps.file.tauxProduction.toFixed(2)}%`, 15, 145);
    doc.text(`Taux de rejets: ${fps.file.tauxRejets.toFixed(2)}%`, 15, 150);
  }
  
  // If FPS level 2 exists, add its data
  if (fps.fps2) {
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Analyse Niveau 2', 10, 165);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Chef d'équipe production: ${fps.fps2.chefEquipeProd}`, 15, 175);
    doc.text(`Chef d'équipe qualité: ${fps.fps2.chefEquipeQualite}`, 15, 180);
    doc.text(`Problème: ${fps.fps2.probleme}`, 15, 185);
    doc.text(`Cause apparente: ${fps.fps2.causeApparente}`, 15, 190);
    
    // Add Ishikawa diagram causes (5M)
    doc.text('Analyse des causes (5M):', 15, 195);
    doc.text(`1. Main d'oeuvre: ${fps.fps2.cause1}`, 20, 200);
    doc.text(`2. Matière: ${fps.fps2.cause2}`, 20, 205);
    doc.text(`3. Méthode: ${fps.fps2.cause3}`, 20, 210);
    doc.text(`4. Machine: ${fps.fps2.cause4}`, 20, 215);
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Document généré automatiquement par le système KPI Dashboard', 105, 285, { align: 'center' });
  doc.text(`Date d'impression: ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
  
  return doc.output('blob');
}

export async function generateIshikawaDiagram(
  causes: { 
    mainOeuvre: string; 
    matiere: string; 
    methode: string; 
    machine: string;
    milieu: string; 
  }, 
  problem: string
): Promise<string> {
  // This function will create a canvas element with an Ishikawa diagram,
  // capture it using html2canvas, and return a data URL
  
  // Create a hidden container for the diagram
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.height = '600px';
  container.style.background = 'white';
  
  const html = `
    <div style="width: 800px; height: 600px; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="text-align: center; margin-bottom: 30px;">Diagramme d'Ishikawa - Analyse des causes</h2>
      
      <!-- Problem box -->
      <div style="position: absolute; top: 250px; left: 650px; width: 140px; height: 80px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: bold;">
        ${problem}
      </div>
      
      <!-- Main arrow -->
      <div style="position: absolute; top: 290px; left: 100px; width: 550px; height: 2px; background-color: #333;"></div>
      
      <!-- Main d'oeuvre -->
      <div style="position: absolute; top: 100px; left: 100px; transform: rotate(-45deg); width: 200px; height: 2px; background-color: #333;"></div>
      <div style="position: absolute; top: 70px; left: 75px; width: 150px; text-align: center; font-weight: bold;">Main d'oeuvre</div>
      <div style="position: absolute; top: 90px; left: 75px; width: 150px; text-align: center; font-size: 12px;">${causes.mainOeuvre}</div>
      
      <!-- Matière -->
      <div style="position: absolute; top: 100px; left: 350px; transform: rotate(-45deg); width: 200px; height: 2px; background-color: #333;"></div>
      <div style="position: absolute; top: 70px; left: 325px; width: 150px; text-align: center; font-weight: bold;">Matière</div>
      <div style="position: absolute; top: 90px; left: 325px; width: 150px; text-align: center; font-size: 12px;">${causes.matiere}</div>
      
      <!-- Méthode -->
      <div style="position: absolute; top: 480px; left: 100px; transform: rotate(45deg); width: 200px; height: 2px; background-color: #333;"></div>
      <div style="position: absolute; top: 500px; left: 75px; width: 150px; text-align: center; font-weight: bold;">Méthode</div>
      <div style="position: absolute; top: 520px; left: 75px; width: 150px; text-align: center; font-size: 12px;">${causes.methode}</div>
      
      <!-- Machine -->
      <div style="position: absolute; top: 480px; left: 350px; transform: rotate(45deg); width: 200px; height: 2px; background-color: #333;"></div>
      <div style="position: absolute; top: 500px; left: 325px; width: 150px; text-align: center; font-weight: bold;">Machine</div>
      <div style="position: absolute; top: 520px; left: 325px; width: 150px; text-align: center; font-size: 12px;">${causes.machine}</div>
      
      <!-- Milieu -->
      <div style="position: absolute; top: 290px; left: 200px; width: 2px; height: 150px; background-color: #333;"></div>
      <div style="position: absolute; top: 450px; left: 175px; width: 50px; text-align: center; font-weight: bold;">Milieu</div>
      <div style="position: absolute; top: 470px; left: 125px; width: 150px; text-align: center; font-size: 12px;">${causes.milieu}</div>
    </div>
  `;
  
  container.innerHTML = html;
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container);
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  } finally {
    document.body.removeChild(container);
  }
}

export async function addIshikawaToPdf(pdf: jsPDF, causes: { 
  mainOeuvre: string; 
  matiere: string; 
  methode: string; 
  machine: string;
  milieu: string; 
}, problem: string): Promise<void> {
  const dataUrl = await generateIshikawaDiagram(causes, problem);
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Diagramme d\'Ishikawa - Analyse des causes', 105, 20, { align: 'center' });
  pdf.addImage(dataUrl, 'PNG', 10, 30, 190, 150);
}

export async function generateQualityTrendChart(qualityData: {
  dates: string[];
  ftqValues: number[];
  rejectRates: number[];
}): Promise<string> {
  // Create a hidden container for the chart
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.height = '400px';
  container.style.background = 'white';
  
  const html = `
    <div style="width: 800px; height: 400px; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="text-align: center; margin-bottom: 20px;">Tendance Qualité sur les 7 derniers jours</h2>
      
      <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
        <div>
          <div style="height: 10px; width: 30px; background-color: #3b82f6; display: inline-block;"></div>
          <span style="margin-left: 5px;">FTQ (%)</span>
        </div>
        <div>
          <div style="height: 10px; width: 30px; background-color: #ef4444; display: inline-block;"></div>
          <span style="margin-left: 5px;">Taux de rejet (%)</span>
        </div>
      </div>
      
      <svg width="760" height="300" style="overflow: visible;">
        <!-- X and Y axes -->
        <line x1="50" y1="250" x2="730" y2="250" stroke="#333" stroke-width="2" />
        <line x1="50" y1="20" x2="50" y2="250" stroke="#333" stroke-width="2" />
        
        <!-- X axis labels -->
        ${qualityData.dates.map((date, index) => {
          const xPosition = 50 + (index * (680 / (qualityData.dates.length - 1 || 1)));
          return `
            <text x="${xPosition}" y="270" text-anchor="middle" style="font-size: 12px;">${date}</text>
            <line x1="${xPosition}" y1="250" x2="${xPosition}" y2="255" stroke="#333" stroke-width="1" />
          `;
        }).join('')}
        
        <!-- Y axis labels -->
        <text x="25" y="250" text-anchor="middle" style="font-size: 12px;">0</text>
        <text x="25" y="180" text-anchor="middle" style="font-size: 12px;">25</text>
        <text x="25" y="110" text-anchor="middle" style="font-size: 12px;">50</text>
        <text x="25" y="40" text-anchor="middle" style="font-size: 12px;">100</text>
        
        <!-- FTQ line -->
        ${qualityData.ftqValues.map((val, index, arr) => {
          if (index === arr.length - 1) return '';
          
          const x1 = 50 + (index * (680 / (arr.length - 1 || 1)));
          const y1 = 250 - (val * 2.3);
          const x2 = 50 + ((index + 1) * (680 / (arr.length - 1 || 1)));
          const y2 = 250 - (arr[index + 1] * 2.3);
          
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3b82f6" stroke-width="3" />`;
        }).join('')}
        
        <!-- Reject rates line -->
        ${qualityData.rejectRates.map((val, index, arr) => {
          if (index === arr.length - 1) return '';
          
          const x1 = 50 + (index * (680 / (arr.length - 1 || 1)));
          const y1 = 250 - (val * 2.3);
          const x2 = 50 + ((index + 1) * (680 / (arr.length - 1 || 1)));
          const y2 = 250 - (arr[index + 1] * 2.3);
          
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="3" />`;
        }).join('')}
        
        <!-- Data points for FTQ -->
        ${qualityData.ftqValues.map((val, index) => {
          const x = 50 + (index * (680 / (qualityData.ftqValues.length - 1 || 1)));
          const y = 250 - (val * 2.3);
          
          return `
            <circle cx="${x}" cy="${y}" r="5" fill="#3b82f6" />
            <text x="${x}" y="${y-10}" text-anchor="middle" style="font-size: 10px;">${val.toFixed(1)}%</text>
          `;
        }).join('')}
        
        <!-- Data points for reject rates -->
        ${qualityData.rejectRates.map((val, index) => {
          const x = 50 + (index * (680 / (qualityData.rejectRates.length - 1 || 1)));
          const y = 250 - (val * 2.3);
          
          return `
            <circle cx="${x}" cy="${y}" r="5" fill="#ef4444" />
            <text x="${x}" y="${y+20}" text-anchor="middle" style="font-size: 10px;">${val.toFixed(1)}%</text>
          `;
        }).join('')}
      </svg>
    </div>
  `;
  
  container.innerHTML = html;
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container);
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  } finally {
    document.body.removeChild(container);
  }
}

export async function addQualityTrendToPdf(pdf: jsPDF, qualityData: {
  dates: string[];
  ftqValues: number[];
  rejectRates: number[];
}): Promise<void> {
  const dataUrl = await generateQualityTrendChart(qualityData);
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Tendance de la qualité sur 7 jours', 105, 20, { align: 'center' });
  pdf.addImage(dataUrl, 'PNG', 10, 30, 190, 100);
  
  // Add analysis text
  const avgFtq = qualityData.ftqValues.reduce((sum, val) => sum + val, 0) / qualityData.ftqValues.length;
  const avgReject = qualityData.rejectRates.reduce((sum, val) => sum + val, 0) / qualityData.rejectRates.length;
  
  pdf.setFontSize(12);
  pdf.text('Analyse de la tendance:', 20, 140);
  
  pdf.setFontSize(10);
  pdf.text(`• FTQ moyenne: ${avgFtq.toFixed(2)}%`, 25, 150);
  pdf.text(`• Taux de rejet moyen: ${avgReject.toFixed(2)}%`, 25, 160);
  
  // Add trend analysis
  const ftqTrend = qualityData.ftqValues[qualityData.ftqValues.length - 1] > qualityData.ftqValues[0] ? 'hausse' : 'baisse';
  pdf.text(`• La tendance FTQ est à la ${ftqTrend} sur la période analysée.`, 25, 170);
  
  // Add recommendation based on trend
  pdf.setTextColor(0, 0, 0);
  pdf.text('Recommandation:', 20, 185);
  
  if (avgFtq < 85) {
    pdf.setTextColor(255, 0, 0);
    pdf.text('Action corrective immédiate recommandée pour améliorer le FTQ.', 25, 195);
  } else if (avgFtq < 90) {
    pdf.setTextColor(255, 165, 0);
    pdf.text('Surveillance accrue et action préventive recommandée.', 25, 195);
  } else {
    pdf.setTextColor(0, 128, 0);
    pdf.text('Continuer les bonnes pratiques et chercher des optimisations.', 25, 195);
  }
}
