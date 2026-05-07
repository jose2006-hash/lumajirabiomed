import React, { useState } from "react";

export default function EmergencyStop({ onStop, onClear, isStopped }) {
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  let holdTimer = null;
  let progressInterval = null;

  const startHold = () => {
    if (isStopped) return;
    setHolding(true);
    let progress = 0;
    progressInterval = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 60);
    holdTimer = setTimeout(() => {
      setHolding(false);
      setHoldProgress(0);
      onStop();
    }, 1200);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer);
    clearInterval(progressInterval);
    setHolding(false);
    setHoldProgress(0);
  };

  if (isStopped) {
    return (
      <div style={{
        background: "rgba(239,68,68,0.08)",
        border: "2px solid #EF4444",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        animation: "pulse 1.5s ease infinite",
      }}>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "18px", fontWeight: 900,
          color: "#EF4444", marginBottom: "8px",
          letterSpacing: "0.1em",
        }}>
          🚨 SISTEMA DETENIDO
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "11px", color: "#94A3B8",
          marginBottom: "16px",
        }}>
          Todos los motores han sido bloqueados.
        </div>
        <button
          onClick={onClear}
          style={{
            padding: "10px 24px",
            background: "transparent",
            border: "1px solid #10B981",
            borderRadius: "6px",
            color: "#10B981",
            fontFamily: "'Orbitron', monospace",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.background = "rgba(16,185,129,0.1)"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; }}
        >
          REANUDAR SISTEMA
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "10px", color: "#475569",
        marginBottom: "12px", letterSpacing: "0.2em",
      }}>
        MANTÉN PRESIONADO 1.2s PARA ACTIVAR
      </div>
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        style={{
          width: "100%",
          padding: "18px",
          background: holding
            ? "rgba(239,68,68,0.2)"
            : "rgba(239,68,68,0.08)",
          border: `2px solid ${holding ? "#EF4444" : "rgba(239,68,68,0.4)"}`,
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.15s",
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* Hold progress bar */}
        {holding && (
          <div style={{
            position: "absolute", bottom: 0, left: 0,
            height: "3px",
            width: `${holdProgress}%`,
            background: "#EF4444",
            transition: "width 0.06s linear",
            boxShadow: "0 0 8px #EF4444",
          }} />
        )}
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "16px", fontWeight: 900,
          color: "#EF4444",
          letterSpacing: "0.15em",
        }}>
          ⚡ PARADA DE EMERGENCIA
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "rgba(239,68,68,0.6)",
          marginTop: "4px",
        }}>
          emergency_stop → Firebase
        </div>
      </button>
    </div>
  );
}
