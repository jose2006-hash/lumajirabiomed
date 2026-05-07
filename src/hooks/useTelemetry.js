import { useState, useEffect, useRef, useCallback } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../lib/firebase";
import {
  movingAverageFilter,
  evaluateFatigue,
  computeAdaptiveThresholds,
  generateDemoEMG,
  generateDemoBioimpedance,
} from "../lib/signalProcessing";

const DEMO_MODE = !process.env.REACT_APP_FIREBASE_API_KEY ||
  process.env.REACT_APP_FIREBASE_API_KEY === "your_firebase_api_key";

const MAX_EMG_POINTS = 80;

export function useTelemetry() {
  const [emgData, setEmgData] = useState(
    Array.from({ length: MAX_EMG_POINTS }, (_, i) => ({ t: i, raw: 100, filtered: 100 }))
  );
  const [bioimpedance, setBioimpedance] = useState(500);
  const [fatigue, setFatigue] = useState({ level: "normal", ratio: 1, message: "Cargando..." });
  const [thresholds, setThresholds] = useState({ torque: 5.0, velocity: 100 });
  const [latency, setLatency] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usageHistory, setUsageHistory] = useState([]);
  const [emergencyStopped, setEmergencyStopped] = useState(false);

  const emgBufferRef = useRef([]);
  const tickRef = useRef(0);

  const triggerEmergencyStop = useCallback(async () => {
    setEmergencyStopped(true);
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/control/emergency_stop"), true);
      await set(ref(db, "dispositivo/control/timestamp"), Date.now());
    }
  }, []);

  const clearEmergencyStop = useCallback(async () => {
    setEmergencyStopped(false);
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/control/emergency_stop"), false);
    }
  }, []);

  const setCalibrationThreshold = useCallback(async (maxEMG) => {
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/calibracion/emg_max"), maxEMG);
      await set(ref(db, "dispositivo/calibracion/timestamp"), Date.now());
    }
  }, []);

  const processSample = useCallback((rawEMG, rawImpedance) => {
    const { filtered, buffer } = movingAverageFilter(emgBufferRef.current, rawEMG);
    emgBufferRef.current = buffer;
    const fatigueResult = evaluateFatigue(rawImpedance);
    const adaptiveThresholds = computeAdaptiveThresholds(5.0, fatigueResult.ratio);
    setEmgData((prev) => [...prev.slice(1), { t: tickRef.current++, raw: rawEMG, filtered }]);
    setBioimpedance(rawImpedance);
    setFatigue(fatigueResult);
    setThresholds(adaptiveThresholds);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      setLoading(false);
      setConnected(true);
      let t = 0;
      const interval = setInterval(() => {
        processSample(generateDemoEMG(t), generateDemoBioimpedance(t));
        setLatency(Math.round(Math.random() * 12 + 3));
        t++;
      }, 100);
      const today = new Date();
      setUsageHistory(
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (6 - i));
          return { date: d.toLocaleDateString("es", { weekday: "short" }), hours: parseFloat((Math.random() * 6 + 1).toFixed(1)) };
        })
      );
      return () => clearInterval(interval);
    }

    setLoading(true);
    const telRef = ref(db, "dispositivo/telemetria");
    const unsub = onValue(telRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pingStart = Date.now();
        processSample(data.emg ?? 100, data.bioimpedancia ?? 500);
        setLatency(Date.now() - pingStart);
        setConnected(true);
        setLoading(false);
      }
    }, () => { setConnected(false); setLoading(false); });

    const histRef = ref(db, "dispositivo/historial");
    const unsubHistory = onValue(histRef, (snap) => {
      const data = snap.val();
      if (data) {
        const entries = Object.entries(data).map(([date, sessions]) => ({
          date,
          hours: parseFloat((Object.values(sessions).reduce((a, b) => a + (b.minutes || 0), 0) / 60).toFixed(1)),
        }));
        setUsageHistory(entries.slice(-7));
      }
    });

    return () => { unsub(); unsubHistory(); };
  }, [processSample]);

  return {
    emgData, bioimpedance, fatigue, thresholds, latency,
    connected, loading, usageHistory, emergencyStopped,
    triggerEmergencyStop, clearEmergencyStop, setCalibrationThreshold,
    isDemo: DEMO_MODE,
  };
}
