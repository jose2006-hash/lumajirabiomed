/**
 * Moving Average Filter — suaviza picos de ruido eléctrico de la señal EMG
 * @param {number[]} buffer - Ventana de muestras recientes
 * @param {number} newSample - Nueva muestra cruda
 * @param {number} windowSize - Tamaño de la ventana (default 8)
 * @returns {{ filtered: number, buffer: number[] }}
 */
export function movingAverageFilter(buffer, newSample, windowSize = 8) {
  const updated = [...buffer, newSample].slice(-windowSize);
  const filtered = updated.reduce((a, b) => a + b, 0) / updated.length;
  return { filtered: parseFloat(filtered.toFixed(3)), buffer: updated };
}

/**
 * Evalúa el nivel de fatiga muscular basado en bioimpedancia
 * @param {number} impedance - Valor de bioimpedancia (ohms)
 * @param {number} baseline - Valor baseline del paciente
 * @returns {{ level: 'normal'|'warning'|'critical', ratio: number, message: string }}
 */
export function evaluateFatigue(impedance, baseline = 500) {
  const ratio = impedance / baseline;
  if (ratio < 1.1) return { level: "normal", ratio, message: "Músculo en buen estado" };
  if (ratio < 1.3) return { level: "warning", ratio, message: "Fatiga moderada detectada" };
  return { level: "critical", ratio, message: "⚠️ Fatiga severa — recalibrar umbrales" };
}

/**
 * Calcula umbrales adaptativos de IA basados en fatiga
 * @param {number} baselineTorque - Torque máximo configurado
 * @param {number} fatigueRatio - Ratio de fatiga
 * @returns {{ torque: number, velocity: number }}
 */
export function computeAdaptiveThresholds(baselineTorque, fatigueRatio) {
  const damping = Math.max(0.5, 1 - (fatigueRatio - 1) * 0.8);
  return {
    torque: parseFloat((baselineTorque * damping).toFixed(2)),
    velocity: parseFloat((100 * damping).toFixed(1)),
  };
}

/**
 * Genera datos EMG simulados para modo demo
 */
export function generateDemoEMG(t, phase = 0) {
  const base = Math.sin(t * 0.3 + phase) * 40;
  const noise = (Math.random() - 0.5) * 15;
  const spike = Math.random() > 0.95 ? (Math.random() * 60) : 0;
  return parseFloat((base + noise + spike + 100).toFixed(2));
}

export function generateDemoBioimpedance(t) {
  return parseFloat((500 + Math.sin(t * 0.05) * 80 + Math.random() * 20).toFixed(1));
}
