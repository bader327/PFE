export interface BobineData {
  numero: string;
  produit: string;
  conforme: boolean;
  nonConforme: boolean;
  incomplete: boolean;
  reportType: string;
  defauts: string[];
  hasDefect: boolean;
  
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
