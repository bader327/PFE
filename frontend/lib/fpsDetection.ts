import { BobineData, FpsConditionResult, HourlyMetrics } from './types';

export function checkFpsConditions(bobinesData: BobineData[], hourlyData?: HourlyMetrics[]): FpsConditionResult | null {
  // Initialize accumulators
  let totalDefects = 0;
  let consecutiveDefects = 0;
  let lastHourDefectRate = 0;
  let highDefectHours = 0;

  // Analyze hourly patterns if available
  if (hourlyData && hourlyData.length > 0) {
    hourlyData.forEach(hour => {
      const defectRate = hour.produitsNonConformes / (hour.total || 1); // Avoid division by zero
      
      // Check for high defect rate in any hour
      if (defectRate > 0.1) {
        highDefectHours++;
      }

      // Track consecutive hours with defects
      if (defectRate > 0.05) {
        consecutiveDefects++;
      } else {
        consecutiveDefects = 0;
      }

      // Keep track of last hour's defect rate
      if (hour.hour === hourlyData.length) {
        lastHourDefectRate = defectRate;
      }

      totalDefects += hour.produitsNonConformes;
    });
  }

  // Check bobine-specific issues with proper type guards
  const criticalBobine = bobinesData.find(b => 
    (b.defects !== undefined && b.defects > 5) || 
    (b.qualityScore !== undefined && b.qualityScore < 0.8) || 
    (b.incompleteness !== undefined && b.incompleteness > 0.2)
  );

  // Determine severity and create FPS condition result
  if (
    highDefectHours >= 3 ||
    consecutiveDefects >= 4 ||
    lastHourDefectRate > 0.15 ||
    criticalBobine
  ) {
    return {
      severity: 'high',
      defaut: criticalBobine?.defectType || 'Multiple quality issues detected',
      produit: criticalBobine?.productType,
      numeroBobine: criticalBobine?.numero
    };
  }

  if (
    highDefectHours >= 2 ||
    consecutiveDefects >= 2 ||
    lastHourDefectRate > 0.1
  ) {
    return {
      severity: 'medium',
      defaut: 'Quality issues detected',
      produit: undefined,
      numeroBobine: undefined
    };
  }

  if (totalDefects > 0) {
    return {
      severity: 'low',
      defaut: 'Minor quality deviations',
      produit: undefined,
      numeroBobine: undefined
    };
  }

  return null; // No FPS needed
}
