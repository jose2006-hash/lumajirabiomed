import { useState, useCallback } from "react";

export function useAIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hola, soy tu asistente BionicAI. Puedo analizar tus datos de telemetría y ayudarte con la calibración y rehabilitación. ¿En qué te ayudo hoy?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userMessage, telemetryContext) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey || apiKey === "sk-your_openai_api_key") {
      const demoResponse = getDemoResponse(userMessage, telemetryContext);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: demoResponse },
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    const systemPrompt = `Eres BionicAI, un asistente médico especializado en control de prótesis biónicas.
Tienes acceso a los datos de telemetría en tiempo real del paciente:
- Señal EMG actual: ${telemetryContext?.emg ?? "N/A"} μV
- Bioimpedancia: ${telemetryContext?.bioimpedance ?? "N/A"} Ω
- Nivel de fatiga: ${telemetryContext?.fatigue ?? "N/A"}
- Torque máximo adaptativo: ${telemetryContext?.torque ?? "N/A"} Nm
- Velocidad máxima: ${telemetryContext?.velocity ?? "N/A"}%

Responde siempre en español, de manera empática y profesional. 
Máximo 3 oraciones por respuesta. Si detectas fatiga crítica o riesgo, sé directo y conciso.
No eres un médico y debes recomendar consultar al especialista para decisiones clínicas.`;

    const newMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error("Error en API OpenAI");

      const data = await response.json();
      const reply = data.choices[0]?.message?.content ?? "Sin respuesta";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error de conexión con la IA. Verifica tu API key." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return { messages, sendMessage, loading, error };
}

function getDemoResponse(message, ctx) {
  const msg = message.toLowerCase();
  if (msg.includes("fatiga") || msg.includes("cansado")) {
    return `Tu bioimpedancia actual es ${ctx?.bioimpedance ?? 500}Ω. ${
      ctx?.fatigue === "critical"
        ? "⚠️ Detecto fatiga severa — te recomiendo descansar 15 minutos y recalibrar los umbrales."
        : "Los niveles de fatiga están en rango normal, puedes continuar con tu actividad."
    }`;
  }
  if (msg.includes("calibr")) {
    return "Para calibrar, ve a la sección de Calibración Guiada, relaja el músculo completamente y sigue los pasos. El sistema registrará automáticamente tu señal máxima.";
  }
  if (msg.includes("duele") || msg.includes("dolor")) {
    return "Si sientes dolor o molestia, activa la Parada de Emergencia inmediatamente y consulta con tu médico rehabilitador. La prótesis no debe causar dolor.";
  }
  return "Estoy monitoreando tu señal EMG y bioimpedancia en tiempo real. Todo parece estar dentro de los parámetros normales. ¿Tienes alguna pregunta específica sobre tu rehabilitación?";
}
