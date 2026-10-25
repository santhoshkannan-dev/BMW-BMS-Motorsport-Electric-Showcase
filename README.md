# BMW-BMS-Motorsport-Electric-Showcase

A luxury, interactive 3D landing page and vehicle showcase for BMW & BMS high-performance and electric vehicles built with **React**, **Next.js (App Router)**, and **Three.js**.

![BMW Showcase Demo](/public/images/bmw_vision_concept.jpg)

---

## ✨ Key Features

- **🏎️ Real-Time 3D Showroom (Three.js)**:
  - High-fidelity 3D model of the **BMW M4 Competition M Package**.
  * Photorealistic automotive paint with `MeshPhysicalMaterial`, metallic luster, and `RoomEnvironment` HDRI studio reflections.
  * Real-time exterior paint customizer (*Isle of Man Green*, *Frozen Deep Grey*, *Marina Bay Blue*, *Tanzanite Blue II*, *Toronto Red*, *Sao Paulo Yellow*, *Alpine White*, *Black Sapphire*).
  * Brake caliper and alloy rim finish switchers.
  * 6 smooth camera perspectives (*Hero 360°*, *Front Grille*, *Side Profile*, *Rear Diffuser*, *Brake & Rim*, *Top Aero*) with 360° orbit drag controls.
  * Interactive 3D telemetry hotspot pins tracking directly in 3D screen space.
  * **Warp Speed Hyperspace Mode**: 600+ animated particle streaks, rapid wheel spin, and electric acceleration warp audio.

- **🔊 Synthesized Engine Audio (Web Audio API)**:
  - 100% self-contained audio synthesizer with zero external sound files.
  - V8 TwinPower Turbo starter crank and muscular idle roar.
  - Interactive high-RPM throttle revs.
  - Futuristic electric hyperspace acceleration sound.
  - Headlight and UI metallic haptic chimes.

- **🎛️ Studio Configurator Drawer**:
  - Live options for carbon packages, ceramic brakes, Bowers & Wilkins audio, and Merino leather trims.
  - Real-time MSRP calculator and estimated monthly lease computation.
  - Unique build code generation.

- **📊 Real-Time Performance Telemetry HUD**:
  - Interactive **0-100 km/h Launch Control test** with digital chronometer and tachometer.
  - Dynamic 2-axis **Lateral G-Force accelerometer radar**.
  - Active aerodynamic wing downforce and differential lock ratios.

- **⚡ Engineering Innovations Bento Grid**:
  - Curved Display OS 9.0, Carbon Core Monocoque, Hans Zimmer IconicSounds, and Level 3 Highway Assistant.

- **📸 8K Cinematic Photo Gallery**:
  - High-definition showroom, cockpit, and track impressions with full-screen interactive lightbox.

- **📅 VIP Test Drive Reservation Modal**:
  - Dealership experience hub selection (*Munich BMW Welt*, *Beverly Hills*, *Manhattan 57th*, *Tokyo Bay*, *London Mayfair*), date/time session picker, and booking confirmation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) (`GLTFLoader`, `RoomEnvironment`, `PMREMGenerator`)
- **Styling**: Vanilla CSS (Custom dark luxury design system & glassmorphism)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or newer)
- npm or yarn or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/santhoshkannan-dev/BMW-BMS-Motorsport-Electric-Showcase.git

# Navigate to directory
cd BMW-BMS-Motorsport-Electric-Showcase

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
