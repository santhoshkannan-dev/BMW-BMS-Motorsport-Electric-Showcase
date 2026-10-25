"use client";

import React from "react";
import { ArrowRight, Gauge, Zap, Trophy, Shield } from "lucide-react";
import { audioEngine } from "./AudioEngine";
import { CarConfig } from "./ThreeCarCanvas";

export interface CarModelData {
  id: string;
  name: string;
  tagline: string;
  category: string;
  badge: string;
  hp: number;
  accel: string;
  topSpeed: string;
  drivetrain: string;
  price: string;
  defaultPaint: string;
  defaultPaintName: string;
  description: string;
  image: string;
}

export const CAR_MODELS: CarModelData[] = [
  {
    id: "m8-competition",
    name: "BMW M8 Competition Gran Coupé",
    tagline: "The Uncompromising Apex of Grand Touring",
    category: "Motorsport Flagship",
    badge: "M POWER",
    hp: 625,
    accel: "3.2s",
    topSpeed: "305 km/h",
    drivetrain: "4.4L M TwinPower Turbo V8 / M xDrive",
    price: "$138,800",
    defaultPaint: "#114b3d",
    defaultPaintName: "Isle of Man Green",
    description: "An icon of progressive luxury combining supercar lap times with sublime grand touring four-door comfort and an active M Differential.",
    image: "/images/bmw_m8_track.jpg",
  },
  {
    id: "vision-m-next",
    name: "BMW Vision M NEXT",
    tagline: "The Electrified Supercar of Tomorrow",
    category: "Hypercar Concept",
    badge: "NEXT VISION",
    hp: 600,
    accel: "2.8s",
    topSpeed: "330 km/h",
    drivetrain: "Intelligent PHEV AWD / Dual eDrive",
    price: "Concept Prototype",
    defaultPaint: "#2b2e35",
    defaultPaintName: "Frozen Deep Grey",
    description: "A glimpse into the future of active driving: gullwing doors, Boost Pod augmented reality HUD, and synthetic Hans Zimmer acoustics.",
    image: "/images/bmw_vision_concept.jpg",
  },
  {
    id: "i7-m70",
    name: "BMW i7 M70 xDrive",
    tagline: "Pure All-Electric Supremacy & Executive Lounge",
    category: "Electric Luxury",
    badge: "100% ELECTRIC",
    hp: 660,
    accel: "3.7s",
    topSpeed: "250 km/h",
    drivetrain: "Dual Electric Motors / 105.7 kWh Battery",
    price: "$168,500",
    defaultPaint: "#0c2044",
    defaultPaintName: "Tanzanite Blue II",
    description: "The most powerful all-electric BMW ever built. Featuring the 31.3\" 8K Theater Screen, executive lounge seating, and crystal glass accents.",
    image: "/images/bmw_luxury_interior.jpg",
  },
  {
    id: "m4-csl",
    name: "BMW M4 CSL",
    tagline: "Coupe Sport Leichtbau – Track Weapon",
    category: "Pure Lightweight",
    badge: "LIMITED EDITION",
    hp: 550,
    accel: "3.6s",
    topSpeed: "307 km/h",
    drivetrain: "3.0L Twin-Turbo Inline-6 / Rear-Wheel Drive",
    price: "$140,800",
    defaultPaint: "#c3112c",
    defaultPaintName: "Toronto Red",
    description: "Strictly limited to 1,000 units. 100 kg stripped, rear seat delete, titanium silencer, and laser taillights tuned for the Nürburgring Nordschleife.",
    image: "/images/bmw_m8_track.jpg",
  },
];

interface ModelSelectorProps {
  activeModelId: string;
  onSelectModel: (model: CarModelData) => void;
  onOpenConfigurator: () => void;
  onOpenTestDrive: () => void;
}

export default function ModelSelector({
  activeModelId,
  onSelectModel,
  onOpenConfigurator,
  onOpenTestDrive,
}: ModelSelectorProps) {
  return (
    <section id="models" style={{ padding: "120px 0 80px", background: "var(--bg-primary)", position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-tag">
            <Trophy size={14} />
            <span>MODEL PORTFOLIO</span>
          </div>
          <h2 className="section-title">ENGINEERED FOR THE UNCOMPROMISING</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Select any flagship model to instantly load its aerodynamic chassis, performance telemetry, and bespoke paint finishes into the 3D showcase.
          </p>
        </div>

        {/* Model Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "24px",
          }}
        >
          {CAR_MODELS.map((car) => {
            const isSelected = activeModelId === car.id;
            return (
              <div
                key={car.id}
                onClick={() => {
                  audioEngine.playRev();
                  onSelectModel(car);
                }}
                className="glass-panel glass-panel-hover"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isSelected ? "2px solid var(--bmw-cyan)" : "1px solid var(--border-glass)",
                  boxShadow: isSelected ? "0 0 30px rgba(0, 240, 255, 0.25)" : "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Preview Image */}
                <div style={{ height: "190px", position: "relative", overflow: "hidden" }}>
                  <img
                    src={car.image}
                    alt={car.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  {/* Category Pill */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "rgba(5, 7, 11, 0.8)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "9999px",
                      padding: "4px 12px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--bmw-cyan)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {car.badge}
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        background: "var(--bmw-cyan)",
                        color: "#05070b",
                        borderRadius: "9999px",
                        padding: "4px 10px",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                      }}
                    >
                      ACTIVE IN 3D
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>
                    {car.category}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                    {car.name}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "18px", flex: 1 }}>
                    {car.tagline}
                  </p>

                  {/* Quick Specs telemetry row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                      background: "rgba(0, 0, 0, 0.35)",
                      padding: "12px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>0-100</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--bmw-cyan)" }}>{car.accel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>POWER</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>{car.hp} HP</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>TOP SPEED</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>{car.topSpeed}</div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Starting at</span>
                      <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>{car.price}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playClick(900);
                        onSelectModel(car);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: isSelected ? "var(--bmw-cyan)" : "rgba(255, 255, 255, 0.08)",
                        color: isSelected ? "#05070b" : "#ffffff",
                        border: "none",
                        borderRadius: "9999px",
                        padding: "8px 16px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <span>VIEW IN 3D</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
