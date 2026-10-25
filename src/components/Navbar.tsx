"use client";

import React, { useState } from "react";
import { Menu, X, Sliders, Calendar, Volume2, VolumeX, ShieldCheck } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface NavbarProps {
  onOpenConfigurator: () => void;
  onOpenTestDrive: () => void;
}

export default function Navbar({ onOpenConfigurator, onOpenTestDrive }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    audioEngine.setMuted(next);
    if (!next) {
      audioEngine.playEngineStart();
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "72px",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "rgba(5, 7, 11, 0.75)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--border-glass)",
      }}
    >
      {/* Brand & M Logo */}
      <a href="#hero" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
        {/* BMW Emblem & M Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Circular BMW Badge */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "2px solid #ffffff",
              background: "conic-gradient(#0066b1 0deg 90deg, #ffffff 90deg 180deg, #0066b1 180deg 270deg, #ffffff 270deg 360deg)",
              boxShadow: "0 0 12px rgba(0, 102, 177, 0.5)",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 900, fontSize: "1.15rem", letterSpacing: "0.08em", color: "#ffffff" }}>
                BMW <span style={{ color: "var(--bmw-cyan)" }}>&</span> BMS
              </span>
              <div className="m-badge-bar" style={{ width: "32px", height: "3px" }}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Motorsport & Electric Showcase
            </div>
          </div>
        </div>
      </a>

      {/* Desktop Navigation Links */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <a
          href="#hero"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bmw-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          3D SHOWROOM
        </a>
        <a
          href="#models"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bmw-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          MODELS
        </a>
        <a
          href="#telemetry"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bmw-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          TELEMETRY
        </a>
        <a
          href="#innovations"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bmw-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          INNOVATIONS
        </a>
        <a
          href="#gallery"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bmw-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          GALLERY
        </a>
      </nav>

      {/* Right Action CTAs */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Sound toggle pill */}
        <button
          onClick={toggleSound}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: `1px solid ${!muted ? "var(--bmw-cyan)" : "var(--border-glass)"}`,
            padding: "6px 14px",
            borderRadius: "9999px",
            color: !muted ? "var(--bmw-cyan)" : "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
          }}
          title={muted ? "Unmute Engine Audio" : "Mute Engine Audio"}
        >
          {!muted ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {!muted ? (
            <div className="audio-waves">
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
            </div>
          ) : (
            <span>SOUND FX</span>
          )}
        </button>

        {/* Studio Configurator Button */}
        <button
          onClick={() => {
            audioEngine.playClick(900);
            onOpenConfigurator();
          }}
          className="btn-secondary"
          style={{ padding: "8px 18px", fontSize: "0.85rem" }}
        >
          <Sliders size={15} />
          <span>STUDIO</span>
        </button>

        {/* Book Test Drive Button */}
        <button
          onClick={() => {
            audioEngine.playClick(950);
            onOpenTestDrive();
          }}
          className="btn-primary"
          style={{ padding: "8px 22px", fontSize: "0.85rem" }}
        >
          <Calendar size={15} />
          <span>TEST DRIVE</span>
        </button>
      </div>
    </header>
  );
}
