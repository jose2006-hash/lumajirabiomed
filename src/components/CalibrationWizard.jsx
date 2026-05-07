import React, { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: 0, title: "Preparación", instruction: "Relaja completamente el músculo. Mantén el brazo en reposo durante 3 segundos.", action: "relajar", duration: 3000 },
  { id: 1, title: "Señal Mínima", instruction: "Haz una contracción suave (20% de tu fuerza). Mantén estable.", action: "leve", duration: 3000 },
  { id: 2, title: "Señal Máxima", instruction: "Realiza la contracción MÁxima que puedas. ¡Aprieta fuerte!", action: "maximo", duration: 3000 },
  { id: 3, title: "¡Calibrado!", instruction: "El sistema ha registrado tu umbral personal. Los parámetros fueron actualizados.", action: "done", duration: 0 },
];

export default function CalibrationWizard({ currentEMG, onCalibrate, onClose }) {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);
  const [captured, setCaptured] = useState({});
  const timerRef = useRef(null);

  const currentStep = STEPS[step];

  const startStep = () => {
    if (currentStep.action === "done") {
      onCalibrate(captured.max || 200);
      onClose();
      return;
    }
    setRunning(true);
    const duration = currentStep.duration;
    const start = Date.now();
    setCountdown(Math.ceil(duration / 1000));

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setCountdown(remaining);
      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        setRunning(false);
        if (currentStep.action === "maximo") {
          setCaptured((prev) => ({ ...prev, max: currentEMG }));
        }
        setStep((s) => s + 1);
      }
    }, 200);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(5,10,20,0.92)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "20px",
    }}>
      <div style={{
        background: "#0A1628",
        border: "1px solid #1E3A5F",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
      }}>
        {/* Corner accents */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "32px", height: "32px", borderTop: "2px solid #0EA5E9", borderLeft: "2px solid #0EA5E9", borderTopLeftRadius: "16px" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "32px", height: "32px", borderBottom: "2px solid #0EA5E9", borderRight: "2px solid #0EA5E9", borderBottomRightRadius: "16px" }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: "#64748B",
            letterSpacing: "0.2em", marginBottom: "6px",
          }}>ASISTENTE DE CALIBRACIÓN</div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "20px", fontWeight: 900, color: "#0EA5E9",
          }}>
            {currentStep.title}
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", justifyContent: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{
              flex: 1, height: "3px", borderRadius: "2px",
              background: i <= step ? "#0EA5E9" : "#1E3A5F",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Live EMG display */}
        <div style={{
          textAlign: "center",
          padding: "20px",
          background: "rgba(14,165,233,0.05)",
          border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: "10px",
          marginBottom: "20px",
        }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "42px", fontWeight: 900,
            color: running ? "#38BDF8" : "#1E3A5F",
            transition: "color 0.3s",
          }}>
            {currentEMG.toFixed(0)}
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "11px", color: "#475569",
          }}>μV — SEÑAL EMG EN VIVO</div>
        </div>

        {/* Instruction */}
        <div style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "14px", color: "#94A3B8",
          textAlign: "center", lineHeight: 1.6,
          marginBottom: "24px",
          minHeight: "48px",
        }}>
          {currentStep.instruction}
        </div>

        {/* Action button */}
        <button
          onClick={startStep}
          disabled={running}
          style={{
            width: "100%",
            padding: "16px",
            background: running
              ? "rgba(14,165,233,0.1)"
              : "linear-gradient(135deg, #0EA5E9, #06B6D4)",
            border: running ? "1px solid rgba(14,165,233,0.3)" : "none",
            borderRadius: "8px",
            color: running ? "#64748B" : "#050A14",
            fontFamily: "'Orbitron', monospace",
            fontSize: "14px", fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: running ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginBottom: "12px",
          }}
        >
          {running
            ? `MIDIENDO... ${countdown}s`
            : currentStep.action === "done"
            ? "✓ FINALIZAR CALIBRACIÓN"
            : "INICIAR MEDICIÓN"}
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px",
            background: "transparent",
            border: "1px solid #1E3A5F",
            borderRadius: "8px",
            color: "#475569",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}
