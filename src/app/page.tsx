"use client";
import { useState } from "react";
import WorshipTracker from "@/components/WorshipTracker";
import StatsCard from "@/components/StatsCard";
import LoginScreen from "@/components/LoginScreen";
import { useAuth } from "@/hooks/useAuth";
import { BarChart2, Lightbulb, LogOut } from "lucide-react";
import Image from "next/image";

type Tab = "home" | "stats";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showLogout, setShowLogout] = useState(false);

  const ramadanStart = new Date("2026-03-01");
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const ramadanDay = diffDays >= 0 ? Math.min(30, diffDays + 1) : null;
  const daysUntilRamadan = diffDays < 0 ? Math.abs(diffDays) : null;

  const tabs = [
    { id: "home" as Tab, label: "Beranda", emoji: "🏠" },
    { id: "stats" as Tab, label: "Statistik", emoji: "📊" },
  ];

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0B6A6C 0%, #0F9597 55%, #3ABCBE 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in → show login screen
  if (!user) return <LoginScreen />;

  return (
    <div style={{ background: "#F4F6F9", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div
        style={{
          background: "linear-gradient(150deg, #0B6A6C 0%, #0F9597 55%, #3ABCBE 100%)",
          paddingTop: 52,
          paddingBottom: 32,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              {/* Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "5px 14px",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 12 }}>🕌</span>
                <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 12, fontWeight: 600 }}>
                  {ramadanDay
                    ? `Hari ke-${ramadanDay} · Ramadan 1447H`
                    : daysUntilRamadan
                      ? `${daysUntilRamadan} hari lagi · Ramadan 1447H`
                      : "Ramadan 1447H"}
                </span>
              </div>
              <h1
                style={{
                  color: "#fff",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Ramadan Tracker
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 3 }}>
                Halo, {user.displayName?.split(" ")[0] || "Sahabat"} 👋
              </p>
            </div>

            {/* User avatar + logout */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowLogout((v) => !v)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  background: "transparent",
                  padding: 0,
                }}
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={44}
                    height={44}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {(user.displayName || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {showLogout && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 52,
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    padding: "6px",
                    minWidth: 160,
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid #F0F2F5" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1D23", margin: 0 }}>
                      {user.displayName || "User"}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => { logout(); setShowLogout(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      color: "#EF4444",
                      fontSize: 14,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB SWITCHER ── */}
      <div style={{ background: "#F4F6F9", padding: "16px 24px 0", maxWidth: 528, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            background: "#E8EBEF",
            borderRadius: 14,
            padding: 4,
            gap: 4,
          }}
        >
          {tabs.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 0",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
                background: activeTab === id ? "#FFFFFF" : "transparent",
                color: activeTab === id ? "#0F7173" : "#9CA3AF",
                boxShadow: activeTab === id ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay to close dropdown */}
      {showLogout && (
        <div
          onClick={() => setShowLogout(false)}
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
        />
      )}

      {/* ── CONTENT ── */}
      <main
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "20px 24px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {activeTab === "home" && (
          <>
            {/* Quote card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  className="font-arabic"
                  style={{ color: "#0F7173", fontSize: 20, lineHeight: 1.5 }}
                >
                  رَمَضَانُ شَهْرُ الْخَيْرِ
                </p>
                <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>
                  Ramadan, bulan kebaikan
                </p>
              </div>
              <span style={{ fontSize: 28, opacity: 0.75 }}>📖</span>
            </div>

            <StatsCard />
            <WorshipTracker />
          </>
        )}

        {activeTab === "stats" && (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#E8F4F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChart2 size={18} style={{ color: "#0F7173" }} />
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1D23", margin: 0 }}>
                  Statistik Ibadah
                </h2>
              </div>
              <StatsCard />
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FFF8E7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lightbulb size={18} style={{ color: "#C49A3C" }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1D23", margin: 0 }}>
                  Tips Ramadan
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { tip: "Jangan lewatkan sahur — ini sunnah Nabi ﷺ", icon: "🌙" },
                  { tip: "Perbanyak Al-Quran setelah Subuh", icon: "📖" },
                  { tip: "Manfaatkan 10 malam terakhir untuk Lailatul Qadar", icon: "✨" },
                  { tip: "Berbagi takjil — sedekah berlipat pahala", icon: "💝" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      background: "#F7F8FA",
                      borderRadius: 12,
                      padding: "12px 14px",
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{item.icon}</span>
                    <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
