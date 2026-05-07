import React, { useMemo } from "react";

const BASELINE = 500;
const MAX_IMPEDANCE = 750;

export default function BioimpedanceGauge({ value, fatigue }) {
  const ratio = Math.min((value - BASELINE) / (MAX_IMPEDANCE - BASELINE), 1);
  const clampedRatio = Math.max(0, ratio);

  const color = useMemo(() => {
    if (fatigue.level === "normal") return "#10B981";
    if (fatigue.level === "warning") return "#F59E0B";
    return "#EF4444";
  }, [fatigue.level]);

  const bgColor = useMemo(() => {
    if (fatigue.level === "normal") return "rgba(16,185,129,0.08)";
    if (fatigue.level === "warning") return "rgba(245,158,11,0.08)";
    return "rgba(239,68,68,0.1)";
  }, [fatigue.level]);

  // SVG arc math
  const cx = 80, cy = 75, r = 58;
  const startAngle = 210, endAngle = 330;
  // Arc from -210deg to 30deg (240 degree sweep)
  const sweepDeg = 240;
  const filled = clampedRatio * sweepDeg;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const arcPath = (startDeg, sweepDegree, radius) => {
    const start = toRad(startDeg - 90);
    const end = toRad(startDeg + sweepDegree - 90);
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const large = sweepDegree > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const START_DEG = 150;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
      border: `1px solid ${color}30`,
      borderRadius: "12px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.5s",
      backgroundColor: bgColor,
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "40px", height: "40px",
        borderTop: `2px solid ${color}`,
        borderRight: `2px solid ${color}`,
        borderTopRightRadius: "12px",
        transition: "border-color 0.5s",
      }} />

      <div style={{ marginBottom: "12px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#64748B",
          letterSpacing: "0.2em", marginBottom: "4px",
        }}>SENSOR BIOELÉCTRICO</div>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "13px", fontWeight: 700, color,
          letterSpacing: "0.1em", transition: "color 0.5s",
        }}>BIOIMPEDANCIA</div>
      </div>

      {/* SVG Gauge */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="160" height="105" viewBox="0 0 160 105">
          {/* Background track */}
          <path
            d={arcPath(START_DEG, 240, r)}
            fill="none" stroke="#1E3A5F" strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          {filled > 0 && (
            <path
              d={arcPath(START_DEG, filled, r)}
              fill="none" stroke={color} strokeWidth="10"
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.3s, stroke 0.5s" }}
            />
          )}
          {/* Center value */}
          <text x={cx} y={cy - 6} textAnchor="middle"
            style={{ fontFamily: "'Orbitron', monospace", fontSize: "22px", fontWeight: 900, fill: color }}>
            {value.toFixed(0)}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", fill: "#475569" }}>
            Ω (ohms)
          </text>
          {/* Labels */}
          <text x="20" y="98"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", fill: "#334155" }}>
            BAJO
          </text>
          <text x="118" y="98"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", fill: "#334155" }}>
            ALTO
          </text>
        </svg>
      </div>

      {/* Status badge */}
      <div style={{
        marginTop: "8px",
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 12px",
        background: `${color}15`,
        borderRadius: "6px",
        border: `1px solid ${color}30`,
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: fatigue.level === "critical" ? "pulse 1s ease infinite" : "none",
        }} />
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "11px", color,
          transition: "color 0.5s",
        }}>
          {fatigue.message}
        </span>
      </div>
    </div>
  );
}
