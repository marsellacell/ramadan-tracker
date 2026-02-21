"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function LoginScreen() {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code !== "auth/popup-closed-by-user") {
                setError("Gagal login. Coba lagi ya.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #0B6A6C 0%, #0F9597 55%, #3ABCBE 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
            }}
        >
            {/* Moon illustration */}
            <div style={{ fontSize: 72, marginBottom: 24, textAlign: "center" }}>🌙</div>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1
                    style={{
                        color: "#fff",
                        fontSize: 30,
                        fontWeight: 800,
                        margin: 0,
                        letterSpacing: -0.5,
                    }}
                >
                    Ramadan Tracker
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginTop: 8 }}>
                    Catat dan jaga istiqomah ibadahmu
                </p>
            </div>

            {/* Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: "32px 28px",
                    width: "100%",
                    maxWidth: 360,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <p
                        className="font-arabic"
                        style={{ color: "#0F7173", fontSize: 20, marginBottom: 6 }}
                    >
                        رَمَضَانُ شَهْرُ الْخَيْرِ
                    </p>
                    <p style={{ color: "#9CA3AF", fontSize: 13 }}>Ramadan, bulan kebaikan</p>
                </div>

                <div style={{ borderTop: "1px solid #F0F2F5", paddingTop: 24 }}>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#374151",
                            fontSize: 15,
                            fontWeight: 600,
                            marginBottom: 20,
                        }}
                    >
                        Masuk untuk mulai mencatat
                    </p>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            padding: "14px 20px",
                            borderRadius: 14,
                            border: "1.5px solid #E5E7EB",
                            background: loading ? "#F9FAFB" : "#fff",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#374151",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {loading ? (
                            <>
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        border: "2px solid #E5E7EB",
                                        borderTopColor: "#0F7173",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite",
                                    }}
                                />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                {/* Google "G" logo */}
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Lanjutkan dengan Google</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#EF4444",
                                fontSize: 13,
                                marginTop: 12,
                            }}
                        >
                            {error}
                        </p>
                    )}
                </div>

                <p
                    style={{
                        textAlign: "center",
                        color: "#9CA3AF",
                        fontSize: 12,
                        marginTop: 20,
                        lineHeight: 1.5,
                    }}
                >
                    Data ibadah kamu tersimpan aman di cloud
                    <br />
                    dan bisa diakses dari perangkat mana saja
                </p>
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
