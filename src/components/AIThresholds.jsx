import React from "react";

function ThresholdBar({ label, value, max, unit, color = "#0EA5E9" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#64748B", letterSpacing: "0.15em",
        }}>{label}</span>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "13px", fontWeight: 700, color,
        }}>
          {value.toFixed(1)}<span style={{ fontSize: "9px", marginLeft: "3px", color: "#475569" }}>{unit}</span>
        </span>
      </div>
      <div style={{
        height: "6px",
        background: "rgba(30,58,95,0.6)",
        borderRadius: "3px",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: "3px",
          transition: "width 0.4s ease",
          position: "relative",
        }}>
          {/* Glow at tip */}
          <div style={{
            position: "absolute", right: 0, top: "-2px",
            width: "4px", height: "10px",
            background: color,
            borderRadius: "2px",
            boxShadow: `0 0 8px ${color}`,
          }} />
        </div>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: "3px",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "9px", color: "#1E3A5F",
      }}>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function AIThresholds({ thresholds, fatigue }) {
  const isAdapted = fatigue.level !== "normal";

  return (
    <div style={{
      background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
      border: "1px solid #1E3A5F",
      borderRadius: "12px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "30px", height: "30px",
        borderBottom: "2px solid #0EA5E9",
        borderLeft: "2px solid #0EA5E9",
        borderBottomLeftRadius: "12px",
      }} />

      <div style={{ marginBottom: "20px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#64748B",
          letterSpacing: "0.2em", marginBottom: "4px",
        }}>MÓDULO IA ADAPTATIVO</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "13px", fontWeight: 700, color: "#0EA5E9",
            letterSpacing: "0.1em",
          }}>UMBRALES DINÁMICOS</div>
          {isAdapted && (
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "9px", color: "#F59E0B",
              padding: "2px 8px",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "4px",
              background: "rgba(245,158,11,0.08)",
            }}>
              ADAPTADO
            </div>
          )}
        </div>
      </div>

      <ThresholdBar
        label="TORQUE MÁXIMO"
        value={thresholds.torque}
        max={5}
        unit="Nm"
        color="#06B6D4"
      />
      <ThresholdBar
        label="VELOCIDAD MÁXIMA"
        value={thresholds.velocity}
        max={100}
        unit="%"
        color="#8B5CF6"
      />

      {/* IA note */}
      <div style={{
        marginTop: "4px",
        padding: "10px 12px",
        background: "rgba(14,165,233,0.05)",
        borderRadius: "6px",
        border: "1px solid rgba(14,165,233,0.15)",
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#334155",
          letterSpacing: "0.1em", marginBottom: "3px",
        }}>NOTA IA</div>
        <div style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "11px", color: "#475569", lineHeight: 1.5,
        }}>
          {isAdapted
            ? "⚡ Umbrales reducidos por fatiga detectada. La IA protege el tejido muscular automáticamente."
            : "✓ Operando en parámetros óptimos. Umbrales al máximo calibrado."}
        </div>
      </div>
    </div>
  );
}
