import React, { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./components/Dashboard";
import "./index.css";

export default function App() {
  const [entered, setEntered] = useState(false);

  return entered ? (
    <Dashboard />
  ) : (
    <SplashScreen onEnter={() => setEntered(true)} />
  );
}
