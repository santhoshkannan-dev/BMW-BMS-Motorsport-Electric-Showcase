"use client";

import React, { useState } from "react";
import { X, Check, DollarSign, Sparkles, Sliders, Shield, Award, Share2 } from "lucide-react";
import { CarConfig } from "./ThreeCarCanvas";
import { PAINT_COLORS, CALIPER_COLORS, RIM_STYLES } from "./HeroHUD";
import { audioEngine } from "./AudioEngine";

interface ConfiguratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: CarConfig;
  onUpdateConfig: (newConfig: Partial<CarConfig>) => void;
  selectedModelName: string;
  onOpenTestDrive: () => void;
}

export default function ConfiguratorDrawer({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  selectedModelName,
  onOpenTestDrive,
}: ConfiguratorDrawerProps) {
  // Configurator options state
  const [hasCarbonPackage, setHasCarbonPackage] = useState(true);
  const [hasCeramicBrakes, setHasCeramicBrakes] = useState(true);
  const [hasBowersWilkins, setHasBowersWilkins] = useState(true);
  const [interiorColor, setInteriorColor] = useState("Kyalami Orange / Black");
  const [buildCodeCopied, setBuildCodeCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate pricing
  const basePrice = 138800;
  const paintPrice = config.paintColor === "#2b2e35" ? 3600 : config.paintColor === "#0c2044" ? 1950 : 0;
  const carbonPrice = hasCarbonPackage ? 5400 : 0;
  const brakesPrice = hasCeramicBrakes ? 8500 : 0;
  const audioPrice = hasBowersWilkins ? 3400 : 0;
  const totalPrice = basePrice + paintPrice + carbonPrice + brakesPrice + audioPrice;
  const monthlyLease = Math.round((totalPrice * 0.0145) + 320);

  const INTERIOR_OPTIONS = [
    { name: "Kyalami Orange / Black", swatch: "#d85c27" },
    { name: "Silverstone Merino", swatch: "#d8dadf" },
    { name: "Sakhir Orange II", swatch: "#b83b26" },
    { name: "Tartufo Extended Leather", swatch: "#7b4f2c" },
    { name: "Black Merino Full Leather", swatch: "#181a1d" },
  ];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("BMW-SPEC-2026-M8-" + Math.floor(1000 + Math.random() * 9000));
    setBuildCodeCopied(true);
    setTimeout(() => setBuildCodeCopied(false), 2500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border-glass)",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.8)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border-glass)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "var(--bg-secondary)",
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div className="m-badge-bar" style={{ width: "28px" }}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--bmw-cyan)", fontWeight: 700, letterSpacing: "0.1em" }}>
                STUDIO CONFIGURATOR
              </span>
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff" }}>
              {selectedModelName}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Paint Swatches */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>EXTERIOR PAINT</span>
              <span style={{ fontSize: "0.82rem", color: "var(--bmw-cyan)", fontWeight: 600 }}>
                {config.paintName} {paintPrice > 0 ? `(+$${paintPrice.toLocaleString()})` : "(Standard)"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
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
                      padding: "8px",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      border: `1.5px solid ${isSelected ? "var(--bmw-cyan)" : "var(--border-glass)"}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: paint.hex,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                      }}
                    />
                    <span style={{ fontSize: "0.68rem", color: isSelected ? "#fff" : "var(--text-secondary)", textAlign: "center" }}>
                      {paint.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alloy Rims */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>WHEELS & RIMS</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{config.rimName}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {RIM_STYLES.map((rim) => {
                const isSelected = config.rimColor === rim.hex;
                return (
                  <button
                    key={rim.name}
                    onClick={() => {
                      audioEngine.playClick(900);
                      onUpdateConfig({ rimColor: rim.hex, rimName: rim.name });
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(0, 102, 177, 0.25)" : "rgba(255, 255, 255, 0.03)",
                      border: `1.5px solid ${isSelected ? "var(--bmw-blue)" : "var(--border-glass)"}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      color: isSelected ? "#fff" : "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span>{rim.name}</span>
                    {isSelected && <Check size={16} color="var(--bmw-cyan)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interior Upholstery */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>FULL MERINO LEATHER</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{interiorColor}</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {INTERIOR_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => {
                    audioEngine.playClick(850);
                    setInteriorColor(opt.name);
                  }}
                  style={{
                    flex: 1,
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: opt.swatch,
                    border: interiorColor === opt.name ? "2.5px solid var(--bmw-cyan)" : "1px solid rgba(255,255,255,0.2)",
                    boxShadow: interiorColor === opt.name ? "0 0 10px var(--bmw-cyan)" : "none",
                    cursor: "pointer",
                  }}
                  title={opt.name}
                />
              ))}
            </div>
          </div>

          {/* Performance Packages Toggles */}
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", display: "block", marginBottom: "12px" }}>
              PERFORMANCE UPGRADES
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Carbon Package */}
              <div
                onClick={() => setHasCarbonPackage(!hasCarbonPackage)}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: hasCarbonPackage ? "rgba(0, 102, 177, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${hasCarbonPackage ? "var(--bmw-cyan)" : "var(--border-glass)"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>M Carbon Exterior Package</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Roof, front splitter, side air blades & rear diffuser</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--bmw-cyan)" }}>+$5,400</div>
                  {hasCarbonPackage ? <Check size={16} color="var(--bmw-cyan)" /> : null}
                </div>
              </div>

              {/* Ceramic Brakes */}
              <div
                onClick={() => setHasCeramicBrakes(!hasCeramicBrakes)}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: hasCeramicBrakes ? "rgba(0, 102, 177, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${hasCeramicBrakes ? "var(--bmw-cyan)" : "var(--border-glass)"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>M Carbon Ceramic Brakes</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Gold 6-piston calipers & 400mm ceramic rotors</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--bmw-cyan)" }}>+$8,500</div>
                  {hasCeramicBrakes ? <Check size={16} color="var(--bmw-cyan)" /> : null}
                </div>
              </div>

              {/* Bowers & Wilkins */}
              <div
                onClick={() => setHasBowersWilkins(!hasBowersWilkins)}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: hasBowersWilkins ? "rgba(0, 102, 177, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${hasBowersWilkins ? "var(--bmw-cyan)" : "var(--border-glass)"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>Bowers & Wilkins Diamond Audio</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>1,965W 36-speaker 4D acoustic soundstage</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--bmw-cyan)" }}>+$3,400</div>
                  {hasBowersWilkins ? <Check size={16} color="var(--bmw-cyan)" /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer: Total Price & Order CTA */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border-glass)",
            background: "rgba(9, 14, 23, 0.95)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>TOTAL MSRP (AS CONFIGURED)</div>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#ffffff" }}>
                ${totalPrice.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>EST. LEASE</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--bmw-cyan)" }}>
                ${monthlyLease.toLocaleString()}/mo
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCopyCode}
              className="btn-secondary"
              style={{ flex: 1, padding: "12px", fontSize: "0.82rem" }}
            >
              <Share2 size={16} />
              <span>{buildCodeCopied ? "CODE COPIED!" : "SAVE BUILD"}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenTestDrive();
              }}
              className="btn-primary"
              style={{ flex: 1.5, padding: "12px", fontSize: "0.82rem" }}
            >
              <span>TEST DRIVE THIS SPEC</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
