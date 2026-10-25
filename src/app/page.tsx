"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { CarConfig } from "@/components/ThreeCarCanvas";
import HeroHUD from "@/components/HeroHUD";
import ModelSelector, { CAR_MODELS, CarModelData } from "@/components/ModelSelector";
import PerformanceTelemetry from "@/components/PerformanceTelemetry";
import InnovationsSection from "@/components/InnovationsSection";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import ConfiguratorDrawer from "@/components/ConfiguratorDrawer";
import TestDriveModal from "@/components/TestDriveModal";
import Footer from "@/components/Footer";
import { audioEngine } from "@/components/AudioEngine";

// Dynamic import ThreeCarCanvas with SSR disabled
const ThreeCarCanvas = dynamic(() => import("@/components/ThreeCarCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#04060a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(0, 240, 255, 0.2)",
          borderTopColor: "var(--bmw-cyan)",
          animation: "pulseGlow 1s ease-in-out infinite",
        }}
      />
      <div style={{ color: "var(--bmw-cyan)", fontWeight: 700, letterSpacing: "0.15em", fontSize: "0.9rem" }}>
        INITIALIZING BMW 3D SHOWROOM...
      </div>
    </div>
  ),
});

export default function Home() {
  // Car customizer configuration state
  const [config, setConfig] = useState<CarConfig>({
    paintColor: "#8c97a7", // Liquid Titanium Silver matching reference photo
    paintName: "Liquid Titanium Silver",
    caliperColor: "#e5b95c", // M Gold Ceramic
    rimColor: "#1a1c20", // Jet Black Forged matching reference rims
    rimName: "Jet Black Forged 863M",
    driveMode: "comfort",
    headlightsOn: true,
    activeHotspot: null,
    cameraPreset: "showcase",
  });

  const [activeModel, setActiveModel] = useState<CarModelData>(CAR_MODELS[0]);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isWarpSpeed, setIsWarpSpeed] = useState(false);

  // Update config helper
  const handleUpdateConfig = (newConfig: Partial<CarConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Switch model
  const handleSelectModel = (model: CarModelData) => {
    setActiveModel(model);
    setConfig((prev) => ({
      ...prev,
      paintColor: model.defaultPaint,
      paintName: model.defaultPaintName,
      cameraPreset: "showcase",
      activeHotspot: null,
    }));
  };

  // Launch Warp / Hyper Speed Mode
  const handleLaunchWarp = () => {
    if (isWarpSpeed) return;
    setIsWarpSpeed(true);
    handleUpdateConfig({ driveMode: "warp" });
    audioEngine.playWarpDrive();

    // Auto reset back to sport mode after 4.5 seconds
    setTimeout(() => {
      setIsWarpSpeed(false);
      handleUpdateConfig({ driveMode: "sport" });
    }, 4500);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Sticky Luxury Navbar */}
      <Navbar
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenTestDrive={() => setIsTestDriveOpen(true)}
      />

      {/* Hero 3D Interactive Showroom */}
      <section id="hero" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {/* Three.js Canvas */}
        <ThreeCarCanvas
          config={config}
          onSelectHotspot={(index) => handleUpdateConfig({ activeHotspot: index })}
          isWarpSpeed={isWarpSpeed}
        />

        {/* Floating Glass HUD Controls */}
        <HeroHUD
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onOpenConfigurator={() => setIsConfiguratorOpen(true)}
          onOpenTestDrive={() => setIsTestDriveOpen(true)}
          onLaunchWarp={handleLaunchWarp}
          isWarpSpeed={isWarpSpeed}
          selectedModelName={activeModel.name}
        />

        {/* Warp Speed Hyperspace Visual Banner */}
        {isWarpSpeed && (
          <div
            style={{
              position: "absolute",
              top: "160px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              background: "rgba(0, 240, 255, 0.2)",
              border: "1px solid var(--bmw-cyan)",
              backdropFilter: "blur(12px)",
              padding: "10px 28px",
              borderRadius: "9999px",
              boxShadow: "0 0 35px var(--bmw-cyan)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "pulseGlow 0.8s ease-in-out infinite",
            }}
          >
            <div className="audio-bar" style={{ height: "14px", background: "#fff" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 900, letterSpacing: "0.2em", color: "#ffffff" }}>
              WARP HYPER-ACCELERATION ACTIVE
            </span>
            <div className="audio-bar" style={{ height: "14px", background: "#fff" }} />
          </div>
        )}
      </section>

      {/* Model Selection Showcase */}
      <ModelSelector
        activeModelId={activeModel.id}
        onSelectModel={handleSelectModel}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenTestDrive={() => setIsTestDriveOpen(true)}
      />

      {/* Performance & Live Telemetry HUD */}
      <PerformanceTelemetry activeModelName={activeModel.name} />

      {/* Engineering Innovations Bento Grid */}
      <InnovationsSection />

      {/* Cinematic 8K Photo Gallery & Lightbox */}
      <ShowcaseGallery />

      {/* Studio Configurator Drawer */}
      <ConfiguratorDrawer
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        selectedModelName={activeModel.name}
        onOpenTestDrive={() => {
          setIsConfiguratorOpen(false);
          setIsTestDriveOpen(true);
        }}
      />

      {/* VIP Test Drive Reservation Modal */}
      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        selectedModelName={activeModel.name}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
