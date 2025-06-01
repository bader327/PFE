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
  
  // Computed metrics
  defects?: number;
  qualityScore?: number;
  incompleteness?: number;
  defectType?: string;
  productType?: string;
}

export interface HourlyMetrics {
  hour: number;
  produitsConformes: number;
  produitsNonConformes: number;
  total: number;
}

export interface FpsConditionResult {
  severity: 'low' | 'medium' | 'high';
  defaut?: string;
  produit?: string;
  numeroBobine?: string;
}
