"use client";

import React, { useState } from "react";
import { X, Calendar, MapPin, CheckCircle, ShieldCheck, Clock, User, Phone, Mail } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelName: string;
}

export default function TestDriveModal({
  isOpen,
  onClose,
  selectedModelName,
}: TestDriveModalProps) {
  const [model, setModel] = useState(selectedModelName);
  const [dealership, setDealership] = useState("BMW Welt Experience Centre, Munich");
  const [date, setDate] = useState("2026-11-15");
  const [timeSlot, setTimeSlot] = useState("Afternoon VIP Track Experience (14:00)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playRev();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "24px",
          padding: "32px",
          position: "relative",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 240, 255, 0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div className="m-badge-bar" style={{ width: "32px" }}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--bmw-cyan)", fontWeight: 700, letterSpacing: "0.15em" }}>
                  VIP RESERVATION
                </span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                RESERVE YOUR TEST DRIVE
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Experience unbridled M TwinPower and eDrive performance on a closed private circuit or scenic motorway.
              </p>
            </div>

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Selected Model */}
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  VEHICLE OF CHOICE
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  <option value="BMW M8 Competition Gran Coupé" style={{ background: "#090e17" }}>BMW M8 Competition Gran Coupé (625 HP)</option>
                  <option value="BMW Vision M NEXT" style={{ background: "#090e17" }}>BMW Vision M NEXT Concept (600 HP)</option>
                  <option value="BMW i7 M70 xDrive" style={{ background: "#090e17" }}>BMW i7 M70 xDrive Electric (660 HP)</option>
                  <option value="BMW M4 CSL" style={{ background: "#090e17" }}>BMW M4 CSL Lightweight (550 HP)</option>
                </select>
              </div>

              {/* Dealership Experience Center */}
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  FLAGSHIP EXPERIENCE CENTER
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={dealership}
                    onChange={(e) => setDealership(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 38px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    <option value="BMW Welt Experience Centre, Munich" style={{ background: "#090e17" }}>BMW Welt Experience Centre, Munich</option>
                    <option value="BMW M Studio, Beverly Hills, CA" style={{ background: "#090e17" }}>BMW M Studio, Beverly Hills, CA</option>
                    <option value="BMW Flagship Studio, Manhattan 57th, NY" style={{ background: "#090e17" }}>BMW Flagship Studio, Manhattan 57th, NY</option>
                    <option value="BMW Group Tokyo Bay, Odaiba" style={{ background: "#090e17" }}>BMW Group Tokyo Bay, Odaiba</option>
                    <option value="BMW Park Lane, Mayfair, London" style={{ background: "#090e17" }}>BMW Park Lane, Mayfair, London</option>
                  </select>
                  <MapPin size={16} color="var(--bmw-cyan)" style={{ position: "absolute", left: "12px", top: "14px" }} />
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    PREFERRED DATE
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    SESSION TIME
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  >
                    <option value="Morning Track Session (10:00)" style={{ background: "#090e17" }}>Morning Track (10:00)</option>
                    <option value="Afternoon VIP Track (14:00)" style={{ background: "#090e17" }}>Afternoon VIP (14:00)</option>
                    <option value="Sunset Highway Cruise (17:30)" style={{ background: "#090e17" }}>Sunset Highway (17:30)</option>
                  </select>
                </div>
              </div>

              {/* Personal Contact Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number (for VIP Concierge SMS confirmation)"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Disclaimer & Submit */}
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                <ShieldCheck size={16} color="var(--bmw-cyan)" />
                <span>Complimentary BMW M certified driving instructor & track insurance included.</span>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px" }}>
                CONFIRM VIP TEST DRIVE
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success State */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(0, 240, 255, 0.15)",
                border: "2px solid var(--bmw-cyan)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 0 25px var(--bmw-cyan)",
              }}
            >
              <CheckCircle size={36} color="var(--bmw-cyan)" />
            </div>

            <div className="section-tag" style={{ margin: "0 auto 12px" }}>
              BOOKING CONFIRMED
            </div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
              YOU ARE READY TO DRIVE
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "24px" }}>
              Your VIP session for the <strong>{model}</strong> has been prioritized at <strong>{dealership}</strong>.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid var(--border-glass)",
                textAlign: "left",
                fontSize: "0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>CONFIRMATION CODE:</span>
                <strong style={{ color: "var(--bmw-cyan)" }}>#BMW-VIP-8824</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>DATE & SESSION:</span>
                <span style={{ color: "#fff" }}>{date} ({timeSlot.split(" ")[0]})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>DRIVER:</span>
                <span style={{ color: "#fff" }}>{name || "VIP Guest"}</span>
              </div>
            </div>

            <button onClick={handleReset} className="btn-primary" style={{ width: "100%", padding: "14px" }}>
              RETURN TO SHOWROOM
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
