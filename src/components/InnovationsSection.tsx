"use client";

import React from "react";
import { Cpu, ShieldCheck, Music, Zap, Navigation, Award } from "lucide-react";

export default function InnovationsSection() {
  const innovations = [
    {
      icon: Cpu,
      title: "BMW Curved Display & OS 9.0",
      category: "COCKPIT INTELLIGENCE",
      desc: "A floating frameless monolith uniting the 12.3\" digital cluster and 14.9\" infotainment display. Augmented reality heads-up navigation projects turns directly onto the road ahead.",
      tag: "5G Connected",
      span: "col-span-2",
    },
    {
      icon: ShieldCheck,
      title: "Carbon Core Monocoque",
      category: "LIGHTWEIGHT RACING",
      desc: "CFRP hybrid carbon architecture delivers exceptional torsional rigidity while shedding up to 130 kg of chassis mass for razor-sharp steering turn-in.",
      tag: "Motorsport Tech",
      span: "col-span-1",
    },
    {
      icon: Music,
      title: "IconicSounds by Hans Zimmer",
      category: "ACOUSTIC COMPOSITION",
      desc: "Academy Award-winner Hans Zimmer composed bespoke acoustic sound profiles responding dynamically to accelerator pedal angle and G-force load.",
      tag: "Bespoke Symphony",
      span: "col-span-1",
    },
    {
      icon: Zap,
      title: "M xDrive with Pure 2WD Drift Mode",
      category: "INTELLIGENT ALL-WHEEL DRIVE",
      desc: "Shift seamlessly from rear-biased AWD stability into pure, unfiltered 2WD rear-wheel drive with DSC completely disengaged for exhilarating track days.",
      tag: "Track Calibrated",
      span: "col-span-2",
    },
    {
      icon: Navigation,
      title: "Level 3 Highway Assistant",
      category: "AUTONOMOUS CAPABILITY",
      desc: "Hands-free driving on designated motorways up to 135 km/h. Eye-activation lane change automatically steers into the passing lane with a simple glance in the side mirror.",
      tag: "LiDAR + AI",
      span: "col-span-1",
    },
    {
      icon: Award,
      title: "Bowers & Wilkins Diamond Surround",
      category: "STUDIO AUDIO",
      desc: "36 high-fidelity diamond dome tweeters, 4D seat exciters, and 1,965 watts of pure acoustic immersion engineered specifically for the cabin acoustics.",
      tag: "4D Immersion",
      span: "col-span-2",
    },
  ];

  return (
    <section id="innovations" style={{ padding: "120px 0", background: "var(--bg-primary)", position: "relative" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-tag">
            <Cpu size={14} />
            <span>CUTTING-EDGE INNOVATION</span>
          </div>
          <h2 className="section-title">THE FUTURE OF DRIVING HAS ARRIVED</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Pioneering engineering that melds computational intelligence, carbon composites, and high-voltage electric performance.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {innovations.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glowing top line accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "24px",
                    right: "24px",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent)",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "rgba(0, 102, 177, 0.2)",
                      border: "1px solid rgba(0, 240, 255, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--bmw-cyan)",
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-glass)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--bmw-cyan)",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "6px" }}>
                  {item.category}
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, flex: 1 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
