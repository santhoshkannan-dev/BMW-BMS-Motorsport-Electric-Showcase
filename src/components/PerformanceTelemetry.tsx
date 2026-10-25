"use client";

import React, { useState, useEffect } from "react";
import { Gauge, Zap, Wind, Compass, Play, RotateCcw, Activity } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface PerformanceTelemetryProps {
  activeModelName: string;
}

export default function PerformanceTelemetry({ activeModelName }: PerformanceTelemetryProps) {
  const [isTestingAccel, setIsTestingAccel] = useState(false);
  const [accelProgress, setAccelProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0.00");
  const [gForce, setGForce] = useState({ x: 0, y: 0 });

  // Interactive 0-100 Launch Simulation
  const handleLaunchTest = () => {
    if (isTestingAccel) return;
    setIsTestingAccel(true);
    setAccelProgress(0);
    setCurrentSpeed(0);
    setElapsedTime("0.00");
    audioEngine.playRev();

    const startTime = performance.now();
    const duration = 2850; // 2.85s

    const interval = setInterval(() => {
      const now = performance.now();
      const diff = now - startTime;
      const progress = Math.min(1, diff / duration);

      // Non-linear power delivery curve
      const speed = Math.round(progress * 100);
      setCurrentSpeed(speed);
      setAccelProgress(progress * 100);
      setElapsedTime((diff / 1000).toFixed(2));

      // Simulate G-Force peak
      setGForce({
        x: Math.sin(progress * Math.PI) * 1.35,
        y: Math.cos(progress * Math.PI * 0.5) * 0.4,
      });

      if (progress >= 1) {
        clearInterval(interval);
        setIsTestingAccel(false);
        setElapsedTime("2.82");
        setCurrentSpeed(100);
        setTimeout(() => setGForce({ x: 0, y: 0 }), 1500);
      }
    }, 30);
  };

  return (
    <section id="telemetry" style={{ padding: "100px 0", background: "var(--bg-secondary)", position: "relative" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-tag">
            <Activity size={14} />
            <span>REAL-TIME DYNAMICS</span>
          </div>
          <h2 className="section-title">PERFORMANCE TELEMETRY HUD</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Direct motorsport sensor telemetry delivering split-second throttle response, lateral G-vectoring, and electronic launch control.
          </p>
        </div>

        {/* Telemetry Dashboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Card 1: Interactive 0-100 km/h Launch Meter */}
          <div className="glass-panel" style={{ padding: "28px", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Gauge size={22} color="var(--bmw-cyan)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  M LAUNCH CONTROL
                </h3>
              </div>
              <span style={{ fontSize: "0.75rem", color: isTestingAccel ? "var(--bmw-red)" : "var(--bmw-cyan)", fontWeight: 700 }}>
                {isTestingAccel ? "ACCELERATING" : "STANDBY"}
              </span>
            </div>

            {/* Speed Display */}
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "4.5rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "#ffffff" }}>
                {currentSpeed}
                <span style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-muted)", marginLeft: "8px" }}>km/h</span>
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--bmw-cyan)", marginTop: "8px" }}>
                Time: {elapsedTime}s
              </div>
            </div>

            {/* Acceleration Gauge Bar */}
            <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden", marginBottom: "24px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${accelProgress}%`,
                  background: "linear-gradient(90deg, #0066b1, #00f0ff, #e21b22)",
                  transition: "width 0.05s linear",
                  boxShadow: "0 0 15px var(--bmw-cyan)",
                }}
              />
            </div>

            {/* Launch Test Button */}
            <button
              onClick={handleLaunchTest}
              disabled={isTestingAccel}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                background: isTestingAccel ? "rgba(226, 27, 34, 0.8)" : undefined,
                opacity: isTestingAccel ? 0.7 : 1,
              }}
            >
              <Play size={16} />
              <span>{isTestingAccel ? "LAUNCHING..." : "TEST 0-100 KM/H LAUNCH"}</span>
            </button>
          </div>

          {/* Card 2: Lateral G-Force Vectoring */}
          <div className="glass-panel" style={{ padding: "28px", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Compass size={22} color="var(--bmw-cyan)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  LATERAL G-METER
                </h3>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                AXLE DYNAMICS
              </span>
            </div>

            {/* Circular G-Force Radar */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "180px", position: "relative" }}>
              {/* Outer ring */}
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  border: "1px dashed rgba(255, 255, 255, 0.15)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Middle ring */}
                <div style={{ width: "90px", height: "90px", borderRadius: "50%", border: "1px solid rgba(0, 240, 255, 0.2)" }} />
                {/* Center crosshair */}
                <div style={{ position: "absolute", width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
                <div style={{ position: "absolute", height: "100%", width: "1px", background: "rgba(255, 255, 255, 0.1)" }} />

                {/* Moving G-Force indicator dot */}
                <div
                  style={{
                    position: "absolute",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--bmw-red)",
                    boxShadow: "0 0 15px var(--bmw-red)",
                    transform: `translate(${gForce.x * 40}px, ${-gForce.y * 40}px)`,
                    transition: "transform 0.15s ease-out",
                  }}
                />
              </div>
            </div>

            {/* Numerical readings */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", textAlign: "center", marginTop: "12px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>LATERAL PEAK</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>
                  {gForce.x.toFixed(2)} G
                </div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>LONGITUDINAL</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--bmw-cyan)" }}>
                  {gForce.y.toFixed(2)} G
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Aero Downforce & Differential */}
          <div className="glass-panel" style={{ padding: "28px", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Wind size={22} color="var(--bmw-cyan)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  ACTIVE AERODYNAMICS
                </h3>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--bmw-gold)", fontWeight: 700 }}>
                OPTIMIZED
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Active Wing Downforce</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>140 kg @ 250 km/h</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "85%", height: "100%", background: "var(--bmw-blue)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Active M Differential Lock</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>100% Variable</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "95%", height: "100%", background: "var(--bmw-cyan)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Brake Thermal Reserve</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>800°C Max Rating</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "72%", height: "100%", background: "var(--bmw-gold)" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", padding: "12px", borderRadius: "12px", background: "rgba(0, 102, 177, 0.12)", border: "1px solid rgba(0, 102, 177, 0.25)" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Active air vent control behind the kidney grille automatically modulates airflow to maximize engine cooling or minimize drag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
