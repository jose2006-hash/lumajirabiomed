import React, { useState } from "react";
import { useTelemetry } from "../hooks/useTelemetry";
import EMGChart from "./EMGChart";
import BioimpedanceGauge from "./BioimpedanceGauge";
import AIThresholds from "./AIThresholds";
import EmergencyStop from "./EmergencyStop";
import UsageHistory from "./UsageHistory";
import AIChat from "./AIChat";
import CalibrationWizard from "./CalibrationWizard";

function StatusBar({ connected, latency, isDemo }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 20px",
      background: "rgba(10,22,40,0.8)",
      borderBottom: "1px solid #1E3A5F",
      backdropFilter: "blur(10px)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "14px", fontWeight: 900,
          background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.1em",
        }}>BIONIC<span style={{ color: "#F59E0B", WebkitTextFillColor: "#F59E0B" }}>OS</span></span>
        {isDemo && (
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px", color: "#F59E0B",
            padding: "2px 8px",
            border: "1px solid rgba(245,158,11,0.4)",
            borderRadius: "4px",
            background: "rgba(245,158,11,0.08)",
          }}>MODO DEMO</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: connected ? "#10B981" : "#EF4444",
            boxShadow: connected ? "0 0 6px #10B981" : "0 0 6px #EF4444",
            animation: connected ? "pulse 2s ease infinite" : "none",
          }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: connected ? "#10B981" : "#EF4444",
          }}>
            {connected ? "EN LÍNEA" : "DESCONECTADO"}
          </span>
        </div>
        {connected && (
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: "#334155",
          }}>
            {latency}ms
          </span>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    emgData, bioimpedance, fatigue, thresholds, latency,
    connected, loading, usageHistory, emergencyStopped,
    triggerEmergencyStop, clearEmergencyStop,
    setCalibrationThreshold, isDemo,
  } = useTelemetry();

  const [showCalibration, setShowCalibration] = useState(false);
  const [activeTab, setActiveTab] = useState("telemetry");

  const currentEMG = emgData[emgData.length - 1]?.filtered ?? 100;

  const telemetryContext = {
    emg: currentEMG.toFixed(1),
    bioimpedance: bioimpedance.toFixed(0),
    fatigue: fatigue.level,
    torque: thresholds.torque,
    velocity: thresholds.velocity,
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#050A14",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "16px",
      }}>
        <div style={{
          width: "48px", height: "48px",
          border: "2px solid rgba(14,165,233,0.2)",
          borderTop: "2px solid #0EA5E9",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "12px", color: "#475569", letterSpacing: "0.2em",
        }}>CONECTANDO CON HARDWARE...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050A14",
      fontFamily: "'Exo 2', sans-serif",
    }}>
      <StatusBar connected={connected} latency={latency} isDemo={isDemo} />

      {/* Tab nav */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #1E3A5F",
        background: "rgba(10,22,40,0.5)",
      }}>
        {[
          { id: "telemetry", label: "TELEMETRÍA" },
          { id: "history", label: "HISTORIAL" },
          { id: "ai", label: "IA CHAT" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: "12px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #0EA5E9" : "2px solid transparent",
              color: activeTab === tab.id ? "#0EA5E9" : "#334155",
              fontFamily: "'Orbitron', monospace",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>

        {/* TELEMETRY TAB */}
        {activeTab === "telemetry" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Alert if fatigue critical */}
            {fatigue.level === "critical" && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ fontSize: "18px" }}>⚠️</span>
                <div>
                  <div style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "11px", color: "#EF4444",
                    fontWeight: 700, marginBottom: "2px",
                  }}>ALERTA DE FATIGA SEVERA</div>
                  <div style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "12px", color: "#94A3B8",
                  }}>
                    Bioimpedancia elevada detectada. Verifica la posición del socket y descansar 10-15 min.
                  </div>
                </div>
              </div>
            )}

            <EMGChart data={emgData} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <BioimpedanceGauge value={bioimpedance} fatigue={fatigue} />
              <AIThresholds thresholds={thresholds} fatigue={fatigue} />
            </div>

            {/* Control buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={() => setShowCalibration(true)}
                style={{
                  padding: "14px",
                  background: "rgba(14,165,233,0.08)",
                  border: "1px solid rgba(14,165,233,0.3)",
                  borderRadius: "10px",
                  color: "#0EA5E9",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.target.style.background = "rgba(14,165,233,0.15)"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(14,165,233,0.08)"; }}
              >
                ⚙️ CALIBRACIÓN GUIADA
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                style={{
                  padding: "14px",
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "10px",
                  color: "#8B5CF6",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                🤖 CONSULTAR IA
              </button>
            </div>

            <EmergencyStop
              onStop={triggerEmergencyStop}
              onClear={clearEmergencyStop}
              isStopped={emergencyStopped}
            />
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <UsageHistory data={usageHistory} />
            <div style={{
              background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
              border: "1px solid #1E3A5F",
              borderRadius: "12px",
              padding: "20px",
            }}>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "13px", fontWeight: 700, color: "#0EA5E9",
                marginBottom: "16px",
              }}>PROGRESO DE REHABILITACIÓN</div>
              {[
                { label: "Consistencia de uso", value: 86, color: "#10B981" },
                { label: "Precisión de movimientos", value: 73, color: "#0EA5E9" },
                { label: "Control muscular", value: 61, color: "#8B5CF6" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "#64748B" }}>{label}</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "12px", color, fontWeight: 700 }}>{value}%</span>
                  </div>
                  <div style={{ height: "5px", background: "#1E3A5F", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === "ai" && (
          <AIChat telemetryContext={telemetryContext} />
        )}
      </div>

      {/* Calibration wizard modal */}
      {showCalibration && (
        <CalibrationWizard
          currentEMG={currentEMG}
          onCalibrate={setCalibrationThreshold}
          onClose={() => setShowCalibration(false)}
        />
      )}
    </div>
  );
}
