import { useState, useEffect, useRef, useCallback } from "react";
import { ref, onValue, set, push } from "firebase/database";
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
  const demoIntervalRef = useRef(null);

  // Log usage to Firebase
  const logUsage = useCallback((sessionMinutes) => {
    if (DEMO_MODE) return;
    const today = new Date().toISOString().split("T")[0];
    push(ref(db, `dispositivo/historial/${today}`), {
      timestamp: Date.now(),
      minutes: sessionMinutes,
    });
  }, []);

  // Emergency stop
  const triggerEmergencyStop = useCallback(async () => {
    setEmergencyStopped(true);
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/control/emergency_stop"), true);
      await set(ref(db, "dispositivo/control/timestamp"), Date.now());
    }
    console.warn("🚨 PARADA DE EMERGENCIA ACTIVADA");
  }, []);

  const clearEmergencyStop = useCallback(async () => {
    setEmergencyStopped(false);
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/control/emergency_stop"), false);
    }
  }, []);

  // Send calibration threshold to Firebase
  const setCalibrationThreshold = useCallback(async (maxEMG) => {
    if (!DEMO_MODE) {
      await set(ref(db, "dispositivo/calibracion/emg_max"), maxEMG);
      await set(ref(db, "dispositivo/calibracion/timestamp"), Date.now());
    }
    console.log("✅ Umbral calibrado:", maxEMG);
  }, []);

  // Process a telemetry sample
  const processSample = useCallback((rawEMG, rawImpedance) => {
    const pingStart = Date.now();

    // EMG filtering
    const { filtered, buffer } = movingAverageFilter(emgBufferRef.current, rawEMG);
    emgBufferRef.current = buffer;

    // Fatigue evaluation
    const fatigueResult = evaluateFatigue(rawImpedance);
    const adaptiveThresholds = computeAdaptiveThresholds(5.0, fatigueResult.ratio);

    setEmgData((prev) => {
      const next = [
        ...prev.slice(1),
        { t: tickRef.current++, raw: rawEMG, filtered },
      ];
      return next;
    });

    setBioimpedance(rawImpedance);
    setFatigue(fatigueResult);
    setThresholds(adaptiveThresholds);
    setLatency(Date.now() - pingStart);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      // Simulate data
      setLoading(false);
      setConnected(true);
      let t = 0;
      demoIntervalRef.current = setInterval(() => {
        const rawEMG = generateDemoEMG(t);
        const rawImpedance = generateDemoBioimpedance(t);
        processSample(rawEMG, rawImpedance);
        setLatency(Math.round(Math.random() * 12 + 3));
        t++;
      }, 100);

      // Fake usage history
      const today = new Date();
      setUsageHistory(
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toLocaleDateString("es", { weekday: "short" }),
            hours: parseFloat((Math.random() * 6 + 1).toFixed(1)),
          };
        })
      );

      return () => clearInterval(demoIntervalRef.current);
    }

    // Real Firebase mode
    setLoading(true);
    const telRef = ref(db, "dispositivo/telemetria");
    const pingRef = ref(db, "dispositivo/ping");

    const unsub = onValue(
      telRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pingStart = Date.now();
          processSample(data.emg ?? 100, data.bioimpedancia ?? 500);
          setLatency(Date.now() - pingStart);
          setConnected(true);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setConnected(false);
        setLoading(false);
      }
    );

    // Fetch usage history
    const histRef = ref(db, "dispositivo/historial");
    const unsubHistory = onValue(histRef, (snap) => {
      const data = snap.val();
      if (data) {
        const entries = Object.entries(data).map(([date, sessions]) => ({
          date,
          hours: parseFloat(
            (Object.values(sessions).reduce((a, b) => a + (b.minutes || 0), 0) / 60).toFixed(1)
          ),
        }));
        setUsageHistory(entries.slice(-7));
      }
    });

    return () => {
      unsub();
      unsubHistory();
    };
  }, [processSample]);

  return {
    emgData,
    bioimpedance,
    fatigue,
    thresholds,
    latency,
    connected,
    loading,
    usageHistory,
    emergencyStopped,
    triggerEmergencyStop,
    clearEmergencyStop,
    setCalibrationThreshold,
    isDemo: DEMO_MODE,
  };
}
