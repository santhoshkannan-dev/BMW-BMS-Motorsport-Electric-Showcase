"use client";

import React, { useState } from "react";
import {
  Camera,
  Eye,
  Zap,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Shield,
  Layers,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import { CarConfig } from "./ThreeCarCanvas";
import { audioEngine } from "./AudioEngine";

interface HeroHUDProps {
  config: CarConfig;
  onUpdateConfig: (newConfig: Partial<CarConfig>) => void;
  onOpenConfigurator: () => void;
  onOpenTestDrive: () => void;
  onLaunchWarp: () => void;
  isWarpSpeed: boolean;
  selectedModelName: string;
}

export const PAINT_COLORS = [
  { name: "Liquid Titanium Silver", hex: "#8c97a7", badge: "Vision Concept" },
  { name: "Isle of Man Green", hex: "#114b3d", badge: "Metallic" },
  { name: "Frozen Deep Grey", hex: "#2b2e35", badge: "Matte" },
  { name: "Marina Bay Blue", hex: "#0062c4", badge: "M Exclusive" },
  { name: "Tanzanite Blue II", hex: "#0c2044", badge: "Individual" },
  { name: "Toronto Red", hex: "#c3112c", badge: "Metallic" },
  { name: "Sao Paulo Yellow", hex: "#e5ea1f", badge: "High-Gloss" },
  { name: "Black Sapphire", hex: "#0f1115", badge: "Metallic" },
];

export const CALIPER_COLORS = [
  { name: "M Gold Ceramic", hex: "#e5b95c" },
  { name: "M Sport Red", hex: "#e21b22" },
  { name: "M Performance Blue", hex: "#0066b1" },
];

export const RIM_STYLES = [
  { name: "Bicolor Star-Spoke 813M", hex: "#a1a8b3" },
  { name: "Jet Black Forged 863M", hex: "#1a1c20" },
  { name: "Frozen Bronze Performance", hex: "#9d835d" },
];

const HOTSPOT_DETAILS: Record<number, { title: string; subtitle: string; desc: string; stat: string }> = {
  0: {
    title: "BMW Laserlight Technology",
    subtitle: "Adaptive Matrix LED with High-Beam Laser",
    desc: "Provides up to 600 meters of illuminated vision—double that of conventional LEDs—with intelligent anti-dazzle matrix shielding for oncoming traffic.",
    stat: "600m Beam Range",
  },
  1: {
    title: "Illuminated Kidney Grille",
    subtitle: "Active Aerodynamic Air Flaps",
    desc: "Contour LED lighting frames the signature double-kidney grille. Active flaps open dynamically when the TwinPower Turbo engine requires cooling.",
    stat: "0.27 Cd Aero Efficiency",
  },
  2: {
    title: "M Carbon Ceramic Brakes",
    subtitle: "6-Piston High-Performance Monobloc Calipers",
    desc: "400mm front ventilated and cross-drilled ceramic composite discs offer extreme thermal resistance and fade-free stopping power with 50% reduced unsprung weight.",
    stat: "100-0 km/h in 29.5m",
  },
  3: {
    title: "Carbon Fiber Aerokit & Roof",
    subtitle: "CFR Carbon Fiber Reinforced Plastic",
    desc: "Direct motorsport transfer: the contoured CFR roof panel lowers the vehicle's center of gravity for supreme cornering agility and downforce stability.",
    stat: "-22 kg Weight Reduction",
  },
  4: {
    title: "Active Aero Spoiler",
    subtitle: "Speed-Actuated Rear Downforce Wing",
    desc: "Automatically adjusts angle of attack based on velocity and G-force, increasing rear axle downforce at high track speeds for peerless high-speed stability.",
    stat: "+120 kg High-Speed Downforce",
  },
};

export default function HeroHUD({
  config,
  onUpdateConfig,
  onOpenConfigurator,
  onOpenTestDrive,
  onLaunchWarp,
  isWarpSpeed,
  selectedModelName,
}: HeroHUDProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  const toggleSound = () => {
    const newMuted = !isAudioMuted;
    setIsAudioMuted(newMuted);
    audioEngine.setMuted(newMuted);
    if (!newMuted) {
      audioEngine.playEngineStart();
    }
  };

  const handleHeadlightToggle = () => {
    const nextVal = !config.headlightsOn;
    audioEngine.playHeadlightBeep(nextVal);
    onUpdateConfig({ headlightsOn: nextVal });
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {/* Top Floating Telemetry Header */}
      <div
        style={{
          position: "absolute",
          top: "84px",
          left: "24px",
          right: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        {/* Model Title Badge */}
        <div className="glass-panel" style={{ padding: "12px 22px", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div className="m-badge-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--bmw-cyan)", fontWeight: 700 }}>
              PRECISION SHOWROOM
            </span>
          </div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.01em", color: "#ffffff" }}>
            {selectedModelName}
          </h1>
          <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            <span>Color: <strong style={{ color: "#fff" }}>{config.paintName}</strong></span>
            <span>•</span>
            <span>Mode: <strong style={{ color: config.driveMode === "sport" ? "var(--bmw-red)" : "var(--bmw-cyan)", textTransform: "uppercase" }}>{config.driveMode}</strong></span>
          </div>
        </div>

        {/* Top Right Quick Toggles */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Headlights Toggle */}
          <button
            onClick={handleHeadlightToggle}
            className="btn-icon"
            style={{
              borderColor: config.headlightsOn ? "var(--bmw-cyan)" : "var(--border-glass)",
              color: config.headlightsOn ? "var(--bmw-cyan)" : "var(--text-muted)",
              boxShadow: config.headlightsOn ? "0 0 15px rgba(0, 240, 255, 0.4)" : "none",
            }}
            title={config.headlightsOn ? "Headlights & Laserlights ON" : "Headlights OFF"}
          >
            <Eye size={20} />
          </button>

          {/* Engine Sound Synthesizer */}
          <button
            onClick={toggleSound}
            className="btn-icon"
            style={{
              borderColor: !isAudioMuted ? "var(--bmw-cyan)" : "var(--border-glass)",
              color: !isAudioMuted ? "var(--bmw-cyan)" : "var(--text-muted)",
            }}
            title={isAudioMuted ? "Unmute V8 & Electric Engine Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* V8 Throttle Rev Button */}
          <button
            onClick={() => {
              if (isAudioMuted) toggleSound();
              audioEngine.playRev();
            }}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.85rem", gap: "8px" }}
          >
            <Zap size={16} color="var(--bmw-red)" />
            <span>REV ENGINE</span>
          </button>
        </div>
      </div>

      {/* Left Vertical HUD: Camera Angles & Views */}
      <div
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "auto",
        }}
      >
        <div className="glass-panel" style={{ padding: "8px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ padding: "4px 8px", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em" }}>
            PERSPECTIVES
          </div>
          {[
            { id: "showcase", label: "Hero 360°" },
            { id: "front", label: "Front Grille" },
            { id: "side", label: "Side Profile" },
            { id: "rear", label: "Rear Diffuser" },
            { id: "wheel", label: "Brake & Rim" },
            { id: "top", label: "Top Aero" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                audioEngine.playClick(850);
                onUpdateConfig({ cameraPreset: item.id as CarConfig["cameraPreset"] });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                background: config.cameraPreset === item.id ? "rgba(0, 102, 177, 0.35)" : "transparent",
                border: `1px solid ${config.cameraPreset === item.id ? "var(--bmw-blue)" : "transparent"}`,
                color: config.cameraPreset === item.id ? "#ffffff" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <Camera size={14} color={config.cameraPreset === item.id ? "var(--bmw-cyan)" : "currentColor"} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Vertical HUD: Paint Swatches & Calipers */}
      <div
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          pointerEvents: "auto",
        }}
      >
        {/* Exterior Paint Swatches */}
        <div className="glass-panel" style={{ padding: "14px", borderRadius: "16px", minWidth: "180px" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "8px" }}>
            EXTERIOR PAINT
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {PAINT_COLORS.map((paint) => {
              const isSelected = config.paintColor === paint.hex;
              return (
                <button
                  key={paint.name}
                  onClick={() => {
                    audioEngine.playClick(920);
                    onUpdateConfig({ paintColor: paint.hex, paintName: paint.name });
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: paint.hex,
                    border: isSelected ? "2.5px solid var(--bmw-cyan)" : "1.5px solid rgba(255,255,255,0.2)",
                    boxShadow: isSelected ? "0 0 12px var(--bmw-cyan)" : "none",
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                  title={`${paint.name} (${paint.badge})`}
                />
              );
            })}
          </div>

          <div style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 600, marginTop: "10px" }}>
            {config.paintName}
          </div>

          {/* Caliper Color Selection */}
          <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-glass)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "8px" }}>
              BRAKE CALIPER
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {CALIPER_COLORS.map((cal) => (
                <button
                  key={cal.name}
                  onClick={() => {
                    audioEngine.playClick(950);
                    onUpdateConfig({ caliperColor: cal.hex });
                  }}
                  style={{
                    flex: 1,
                    height: "22px",
                    borderRadius: "4px",
                    backgroundColor: cal.hex,
                    border: config.caliperColor === cal.hex ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title={cal.name}
                />
              ))}
            </div>
          </div>

          {/* Rim Finish Selection */}
          <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-glass)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "8px" }}>
              ALLOY RIMS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {RIM_STYLES.map((rim) => (
                <button
                  key={rim.name}
                  onClick={() => {
                    audioEngine.playClick(900);
                    onUpdateConfig({ rimColor: rim.hex, rimName: rim.name });
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    background: config.rimColor === rim.hex ? "rgba(0, 102, 177, 0.3)" : "transparent",
                    border: `1px solid ${config.rimColor === rim.hex ? "var(--bmw-cyan)" : "transparent"}`,
                    color: config.rimColor === rim.hex ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {rim.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Hotspot Info Card Modal (Overlay when a pin is clicked) */}
      {config.activeHotspot !== null && HOTSPOT_DETAILS[config.activeHotspot] && (
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            left: "24px",
            maxWidth: "360px",
            pointerEvents: "auto",
          }}
        >
          <div className="glass-panel" style={{ padding: "18px", borderRadius: "16px", borderColor: "var(--bmw-cyan)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <span className="section-tag" style={{ margin: 0, padding: "3px 10px", fontSize: "0.7rem" }}>
                HOTSPOT {config.activeHotspot + 1}
              </span>
              <button
                onClick={() => onUpdateConfig({ activeHotspot: null })}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {HOTSPOT_DETAILS[config.activeHotspot].title}
            </h4>
            <div style={{ fontSize: "0.82rem", color: "var(--bmw-cyan)", fontWeight: 600, marginBottom: "8px" }}>
              {HOTSPOT_DETAILS[config.activeHotspot].subtitle}
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
              {HOTSPOT_DETAILS[config.activeHotspot].desc}
            </p>
            <div style={{ display: "inline-block", background: "rgba(0, 240, 255, 0.1)", border: "1px solid rgba(0, 240, 255, 0.3)", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem", color: "var(--bmw-cyan)", fontWeight: 700 }}>
              {HOTSPOT_DETAILS[config.activeHotspot].stat}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          right: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "auto",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        {/* Drive Mode Switcher */}
        <div className="glass-panel" style={{ padding: "6px", borderRadius: "9999px", display: "flex", gap: "6px" }}>
          {[
            { id: "comfort", label: "COMFORT", color: "var(--bmw-blue)" },
            { id: "sport", label: "SPORT PLUS", color: "var(--bmw-red)" },
            { id: "warp", label: "WARP HYPER", color: "var(--bmw-cyan)" },
          ].map((mode) => {
            const isSelected = config.driveMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  audioEngine.playClick(1000);
                  if (mode.id === "warp") {
                    onLaunchWarp();
                  } else {
                    onUpdateConfig({ driveMode: mode.id as CarConfig["driveMode"] });
                  }
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: isSelected ? mode.color : "transparent",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  border: `1px solid ${isSelected ? "rgba(255,255,255,0.4)" : "transparent"}`,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? `0 0 15px ${mode.color}` : "none",
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Action CTAs: Studio Configurator & VIP Test Drive */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => {
              audioEngine.playClick(850);
              onOpenConfigurator();
            }}
            className="btn-secondary"
            style={{ padding: "12px 22px" }}
          >
            <Sliders size={16} />
            <span>STUDIO CONFIGURATOR</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick(900);
              onOpenTestDrive();
            }}
            className="btn-primary"
            style={{ padding: "12px 28px" }}
          >
            <span>BOOK TEST DRIVE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
