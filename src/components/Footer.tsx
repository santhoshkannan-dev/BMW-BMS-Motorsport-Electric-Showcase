"use client";

import React, { useState } from "react";
import { ArrowUp, Mail, Shield, CheckCircle } from "lucide-react";
import { audioEngine } from "./AudioEngine";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    audioEngine.playClick(950);
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#030407", borderTop: "1px solid var(--border-glass)", padding: "80px 0 40px" }}>
      <div className="container">
        {/* Top Newsletter & VIP Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "32px",
            paddingBottom: "50px",
            borderBottom: "1px solid var(--border-glass)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div className="m-badge-bar" style={{ width: "36px" }}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--bmw-cyan)", fontWeight: 700, letterSpacing: "0.15em" }}>
                THE M PRIVILEGE CLUB
              </span>
            </div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff" }}>
              RECEIVE EXCLUSIVE PRIVATE TRACK INVITATIONS
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              Gain privileged access to prototype unveilings, Nürburgring hot laps, and bespoke Individual allocations.
            </p>
          </div>

          {/* Form */}
          {!subscribed ? (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "10px", minWidth: "320px", maxWidth: "440px", flex: 1 }}>
              <input
                type="email"
                placeholder="Enter your VIP email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "9999px",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "12px 24px" }}>
                JOIN
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--bmw-cyan)", fontWeight: 700 }}>
              <CheckCircle size={20} />
              <span>INVITATION REGISTERED. WELCOME TO THE M CLUB.</span>
            </div>
          )}
        </div>

        {/* Footer Navigation Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            padding: "50px 0",
            borderBottom: "1px solid var(--border-glass)",
          }}
        >
          {/* Col 1 */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "16px" }}>
              FLAGSHIP MODELS
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <a href="#models" style={{ color: "inherit", transition: "color 0.2s" }}>BMW M8 Gran Coupé</a>
              <a href="#models" style={{ color: "inherit", transition: "color 0.2s" }}>BMW Vision M NEXT</a>
              <a href="#models" style={{ color: "inherit", transition: "color 0.2s" }}>BMW i7 M70 xDrive</a>
              <a href="#models" style={{ color: "inherit", transition: "color 0.2s" }}>BMW M4 CSL Lightweight</a>
              <a href="#models" style={{ color: "inherit", transition: "color 0.2s" }}>BMW XM Label Red</a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "16px" }}>
              INNOVATION & RACING
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <a href="#innovations" style={{ color: "inherit", transition: "color 0.2s" }}>BMW M Hybrid V8 (LMDh)</a>
              <a href="#innovations" style={{ color: "inherit", transition: "color 0.2s" }}>Curved Display OS 9.0</a>
              <a href="#innovations" style={{ color: "inherit", transition: "color 0.2s" }}>M Carbon Ceramic Brakes</a>
              <a href="#innovations" style={{ color: "inherit", transition: "color 0.2s" }}>Hans Zimmer IconicSounds</a>
              <a href="#innovations" style={{ color: "inherit", transition: "color 0.2s" }}>Level 3 Autonomous AI</a>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "16px" }}>
              EXPERIENCE HUBS
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span>BMW Welt, Munich, Germany</span>
              <span>M Studio, Beverly Hills, USA</span>
              <span>Flagship Studio, 57th St, Manhattan</span>
              <span>BMW Group Tokyo Bay, Odaiba</span>
              <span>Park Lane, Mayfair, London</span>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", marginBottom: "16px" }}>
              CONCIERGE CONTACT
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span>VIP Line: +1 (800) 831-1117</span>
              <span>Email: concierge@bmw-m-experience.com</span>
              <span>Hours: 24/7 Dedicated Concierge</span>
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={scrollToTop}
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "0.78rem", gap: "6px" }}
                >
                  <ArrowUp size={14} />
                  <span>BACK TO TOP</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & WLTP Official Energy Ratings */}
        <div style={{ paddingTop: "36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <div style={{ maxWidth: "780px", lineHeight: 1.6 }}>
            Official WLTP figures: BMW M8 Competition Gran Coupé: Fuel consumption combined: 11.6–11.2 l/100 km; CO2 emissions combined: 265–256 g/km.
            BMW i7 M70 xDrive: Power consumption combined: 23.8–20.8 kWh/100 km; Electric range: 488–560 km. Zero local CO2 emissions.
          </div>
          <div>
            © 2026 BMW AG & BMS Performance Showcase. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
