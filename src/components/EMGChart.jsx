import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";

export default function EMGChart({ data }) {
  const latest = data[data.length - 1]?.filtered ?? 100;
  const peak = Math.max(...data.map((d) => d.filtered));
  const avg = (data.reduce((a, b) => a + b.filtered, 0) / data.length).toFixed(1);

  return (
    <div style={{
      background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
      border: "1px solid #1E3A5F",
      borderRadius: "12px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "40px", height: "40px",
        borderTop: "2px solid #0EA5E9",
        borderLeft: "2px solid #0EA5E9",
        borderTopLeftRadius: "12px",
      }} />
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: "24px", height: "24px",
        borderBottom: "1px solid rgba(14,165,233,0.3)",
        borderRight: "1px solid rgba(14,165,233,0.3)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: "#64748B",
            letterSpacing: "0.2em", marginBottom: "4px",
          }}>
            CANAL EMG-01
          </div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "13px", fontWeight: 700, color: "#0EA5E9",
            letterSpacing: "0.1em",
          }}>
            ELECTROMIOGRAFÍA
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 900,
            color: "#38BDF8",
            lineHeight: 1,
          }}>
            {latest.toFixed(1)}
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: "#475569",
          }}>μV</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "120px", margin: "0 -4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="emgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="rawGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 250]} hide />
            <Tooltip
              contentStyle={{
                background: "#0A1628", border: "1px solid #1E3A5F",
                borderRadius: "6px", fontFamily: "'Share Tech Mono', monospace",
                fontSize: "11px", color: "#94A3B8",
              }}
              formatter={(v) => [`${v.toFixed(1)} μV`]}
              labelFormatter={() => ""}
            />
            {/* Raw signal (muted) */}
            <Area
              type="monotone" dataKey="raw"
              stroke="rgba(30,58,95,0.8)" strokeWidth={1}
              fill="url(#rawGradient)" dot={false} isAnimationActive={false}
            />
            {/* Filtered signal (prominent) */}
            <Area
              type="monotone" dataKey="filtered"
              stroke="#0EA5E9" strokeWidth={2}
              fill="url(#emgGradient)" dot={false} isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", gap: "16px", marginTop: "12px",
        paddingTop: "12px",
        borderTop: "1px solid rgba(30,58,95,0.5)",
      }}>
        {[
          { label: "PICO", value: `${peak.toFixed(1)} μV`, color: "#38BDF8" },
          { label: "PROM", value: `${avg} μV`, color: "#64748B" },
          { label: "FILTRO", value: "MA-8", color: "#10B981" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "9px", color: "#334155",
              letterSpacing: "0.15em", marginBottom: "2px",
            }}>{label}</div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "12px", color,
            }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
