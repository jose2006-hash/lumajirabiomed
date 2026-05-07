import React, { useState, useRef, useEffect } from "react";
import { useAIAssistant } from "../hooks/useAIAssistant";

export default function AIChat({ telemetryContext }) {
  const { messages, sendMessage, loading } = useAIAssistant();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim(), telemetryContext);
    setInput("");
  };

  const quickPrompts = [
    "¿Cómo está mi nivel de fatiga?",
    "Necesito calibrar",
    "Me duele el muñón",
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #0A1628, #0D1F3C)",
      border: "1px solid #1E3A5F",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      height: "340px",
    }}>
      <div style={{ marginBottom: "12px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px", color: "#64748B",
          letterSpacing: "0.2em", marginBottom: "4px",
        }}>ASISTENTE MÉDICO IA</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "13px", fontWeight: 700, color: "#0EA5E9",
          }}>BIONIC AI</div>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "10px", color: "#10B981",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
            GPT-4o mini
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "10px",
        marginBottom: "12px",
        paddingRight: "4px",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "82%",
              padding: "10px 13px",
              borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              background: msg.role === "user"
                ? "rgba(14,165,233,0.2)"
                : "rgba(30,58,95,0.4)",
              border: msg.role === "user"
                ? "1px solid rgba(14,165,233,0.3)"
                : "1px solid rgba(30,58,95,0.6)",
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "12px",
              color: msg.role === "user" ? "#BAE6FD" : "#94A3B8",
              lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "4px", paddingLeft: "8px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#0EA5E9",
                animation: `bounce 0.8s ${i * 0.15}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q, telemetryContext)}
            style={{
              padding: "4px 10px",
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.2)",
              borderRadius: "20px",
              color: "#64748B",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.target.style.color = "#0EA5E9"; e.target.style.borderColor = "rgba(14,165,233,0.5)"; }}
            onMouseLeave={e => { e.target.style.color = "#64748B"; e.target.style.borderColor = "rgba(14,165,233,0.2)"; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu pregunta..."
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "rgba(5,10,20,0.6)",
            border: "1px solid #1E3A5F",
            borderRadius: "8px",
            color: "#94A3B8",
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 16px",
            background: input.trim() ? "linear-gradient(135deg, #0EA5E9, #06B6D4)" : "rgba(30,58,95,0.4)",
            border: "none",
            borderRadius: "8px",
            color: input.trim() ? "#050A14" : "#334155",
            fontFamily: "'Orbitron', monospace",
            fontSize: "11px",
            fontWeight: 700,
            cursor: input.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          →
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
