import React, { useEffect, useState } from "react";
import prosthesisImg from "../assets/prosthesis.png";

export default function SplashScreen({ onEnter }) {
  const [phase, setPhase] = useState(0); // 0=loading, 1=ready

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="splash-screen" style={{
      minHeight: "100vh",
      background: "#050A14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Exo 2', sans-serif",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Scan line animation */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #0EA5E9, transparent)",
        animation: "scanLine 3s linear infinite",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes scanLine {
          0% { top: -2px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14,165,233,0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(14,165,233,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }
        @keyframes barLoad {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Logo */}
      <div style={{ animation: "fadeUp 0.8s ease forwards", textAlign: "center", zIndex: 10 }}>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "0.15em",
          background: "linear-gradient(135deg, #0EA5E9, #06B6D4, #38BDF8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "4px",
        }}>
          BIONIC<span style={{ color: "#F59E0B", WebkitTextFillColor: "#F59E0B" }}>OS</span>
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
          color: "#64748B",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}>
          Sistema de Control de Prótesis Biónica
        </div>
      </div>

      {/* Prosthesis image with glow ring */}
      <div style={{
        margin: "clamp(24px, 5vw, 48px) 0",
        position: "relative",
        animation: "fadeUp 0.8s 0.3s ease both",
        zIndex: 10,
      }}>
        <div style={{
          width: "clamp(200px, 45vw, 320px)",
          height: "clamp(200px, 45vw, 320px)",
          borderRadius: "50%",
          border: "2px solid rgba(14,165,233,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulseRing 2.5s ease-in-out infinite",
          position: "relative",
        }}>
          {/* Inner ring */}
          <div style={{
            position: "absolute", inset: "12px",
            borderRadius: "50%",
            border: "1px solid rgba(6,182,212,0.25)",
          }} />
          <img
            src={prosthesisImg}
            alt="Prótesis Biónica BionicOS"
            style={{
              width: "85%",
              height: "85%",
              objectFit: "cover",
              borderRadius: "50%",
              filter: "drop-shadow(0 0 20px rgba(14,165,233,0.4)) brightness(1.05)",
            }}
          />
          {/* HUD corner accents */}
          {[
            { top: 0, left: 0, borderTop: "2px solid #0EA5E9", borderLeft: "2px solid #0EA5E9" },
            { top: 0, right: 0, borderTop: "2px solid #0EA5E9", borderRight: "2px solid #0EA5E9" },
            { bottom: 0, left: 0, borderBottom: "2px solid #0EA5E9", borderLeft: "2px solid #0EA5E9" },
            { bottom: 0, right: 0, borderBottom: "2px solid #0EA5E9", borderRight: "2px solid #0EA5E9" },
          ].map((style, i) => (
            <div key={i} style={{
              position: "absolute",
              width: "20px", height: "20px",
              ...style,
            }} />
          ))}
        </div>

        {/* Floating labels */}
        <div style={{
          position: "absolute", top: "15%", right: "-80px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#0EA5E9",
          display: "flex", alignItems: "center", gap: "6px",
          whiteSpace: "nowrap",
        }}>
          <div style={{ width: "30px", height: "1px", background: "#0EA5E9" }} />
          EMG ACTIVO
        </div>
        <div style={{
          position: "absolute", bottom: "20%", left: "-90px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#06B6D4",
          display: "flex", alignItems: "center", gap: "6px",
          whiteSpace: "nowrap",
        }}>
          BIOIMPEDANCIA
          <div style={{ width: "30px", height: "1px", background: "#06B6D4" }} />
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        width: "clamp(240px, 60vw, 320px)",
        zIndex: 10,
        animation: "fadeUp 0.8s 0.6s ease both",
      }}>
        {phase === 0 ? (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "11px", color: "#475569",
              marginBottom: "8px",
            }}>
              <span>INICIALIZANDO SISTEMA...</span>
              <span style={{ color: "#0EA5E9" }}>v2.1.0</span>
            </div>
            <div style={{
              height: "3px", background: "rgba(14,165,233,0.15)",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #0EA5E9, #06B6D4)",
                animation: "barLoad 2s ease forwards",
              }} />
            </div>
            <div style={{
              marginTop: "12px",
              display: "flex", gap: "16px", justifyContent: "center",
            }}>
              {["SENSORES", "FIREBASE", "IA"].map((label, i) => (
                <div key={label} style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "10px", color: "#334155",
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#10B981",
                    animation: `pulse 1s ${i * 0.3}s ease-in-out infinite`,
                    boxShadow: "0 0 6px #10B981",
                  }} />
                  {label}
                </div>
              ))}
            </div>
          </>
        ) : (
          <button
            onClick={onEnter}
            style={{
              width: "100%",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              border: "none",
              borderRadius: "6px",
              color: "#050A14",
              fontFamily: "'Orbitron', monospace",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.15em",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(14,165,233,0.4)",
              animation: "fadeUp 0.4s ease forwards",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            INGRESAR AL SISTEMA
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: "24px",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "10px", color: "#1E293B",
        letterSpacing: "0.2em",
        zIndex: 10,
      }}>
        MEDTECH BIÓNICS © 2025 — LIMA, PERÚ
      </div>
    </div>
  );
}
