"use client";

import React, { useState } from "react";
import { Camera, Maximize2, X, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  specs: string;
}

export default function ShowcaseGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "vision-front",
      title: "BMW Vision M NEXT Showcase",
      subtitle: "Sculpted for pure aerodynamic laminar flow in the Munich Innovation Studio.",
      image: "/images/bmw_vision_concept.jpg",
      tag: "CONCEPT LAB",
      specs: "600 HP PHEV • 0.24 Cd • Carbon Monocoque",
    },
    {
      id: "cockpit-interior",
      title: "Panoramic Curved OLED Cockpit",
      subtitle: "Merino leather sport seats, crystal gear selector, and dual M1/M2 drive mode toggles.",
      image: "/images/bmw_luxury_interior.jpg",
      tag: "INTERIOR LUXURY",
      specs: "14.9\" Curved Glass • OS 9.0 • Hans Zimmer Acoustics",
    },
    {
      id: "m8-highway",
      title: "BMW M8 Competition Night Run",
      subtitle: "M TwinPower Turbo V8 powering through wet asphalt with quad titanium exhausts.",
      image: "/images/bmw_m8_track.jpg",
      tag: "TRACK HIGHWAY",
      specs: "625 HP V8 • 3.2s 0-100 • 305 km/h Top Speed",
    },
  ];

  return (
    <section id="gallery" style={{ padding: "120px 0", background: "var(--bg-secondary)", position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-tag">
            <Camera size={14} />
            <span>CINEMATIC ARCHIVE</span>
          </div>
          <h2 className="section-title">THE ART OF MOTORSPORT LUXURY</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            High-definition visual impressions capturing the athletic stance, laserlight illumination, and race-bred cockpit architecture.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
          }}
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                audioEngine.playClick(900);
                setSelectedPhoto(item);
              }}
              className="glass-panel glass-panel-hover"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Image Container with Hover Zoom */}
              <div style={{ position: "relative", height: "260px", overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                />
                {/* Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
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
                  {item.tag}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Maximize2 size={16} />
                </div>
              </div>

              {/* Caption */}
              <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>
                  {item.subtitle}
                </p>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--bmw-cyan)",
                    background: "rgba(0, 240, 255, 0.08)",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 240, 255, 0.2)",
                  }}
                >
                  {item.specs}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="btn-icon"
            style={{ position: "absolute", top: "24px", right: "24px" }}
          >
            <X size={22} />
          </button>

          <div
            style={{ maxWidth: "1000px", width: "100%", borderRadius: "20px", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "16px" }}
            />
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff" }}>
                  {selectedPhoto.title}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {selectedPhoto.subtitle}
                </p>
              </div>
              <div
                style={{
                  background: "rgba(0, 102, 177, 0.3)",
                  border: "1px solid var(--bmw-cyan)",
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {selectedPhoto.specs}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
