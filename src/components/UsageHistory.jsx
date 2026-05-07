import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function UsageHistory({ data }) {
  const maxHours = Math.max(...data.map((d) => d.hours), 1);

  return (
    <div style={{
      background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
      border: "1px solid #1E3A5F",
      borderRadius: "12px",
      padding: "20px",
    }}>
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#64748B",
          letterSpacing: "0.2em", marginBottom: "4px",
        }}>REHABILITACIÓN</div>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "13px", fontWeight: 700, color: "#0EA5E9",
          letterSpacing: "0.1em",
        }}>HISTORIAL DE USO (7 DÍAS)</div>
      </div>

      <div style={{ height: "120px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="30%">
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fill: "#334155" }}
              axisLine={false} tickLine={false}
            />
            <YAxis hide domain={[0, maxHours * 1.2]} />
            <Tooltip
              contentStyle={{
                background: "#0A1628", border: "1px solid #1E3A5F",
                borderRadius: "6px", fontFamily: "'Share Tech Mono', monospace",
                fontSize: "11px", color: "#94A3B8",
              }}
              formatter={(v) => [`${v} hrs`, "Uso"]}
            />
            <Bar dataKey="hours" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={index === data.length - 1 ? "#0EA5E9" : "rgba(14,165,233,0.35)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: "12px", paddingTop: "12px",
        borderTop: "1px solid rgba(30,58,95,0.5)",
      }}>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px", color: "#334155", marginBottom: "2px",
          }}>TOTAL SEMANA</div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "16px", fontWeight: 700, color: "#38BDF8",
          }}>
            {data.reduce((a, b) => a + b.hours, 0).toFixed(1)} hrs
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "9px", color: "#334155", marginBottom: "2px",
          }}>PROMEDIO DIARIO</div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "16px", fontWeight: 700, color: "#8B5CF6",
          }}>
            {(data.reduce((a, b) => a + b.hours, 0) / data.length).toFixed(1)} hrs
          </div>
        </div>
      </div>
    </div>
  );
}
