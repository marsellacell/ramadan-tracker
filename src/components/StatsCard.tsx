"use client";
import { useState, useEffect } from "react";
import { useTracker } from "@/hooks/useTracker";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export default function StatsCard() {
    const { calculateStreak, tasks, progress } = useTracker();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setStreak(calculateStreak());
    }, [calculateStreak]);

    const checkedCount = tasks.filter((t) => t.checked).length;

    const stats = [
        {
            label: "Streak",
            value: `${streak}`,
            unit: "hari",
            icon: Flame,
            iconColor: "#F97316",
            iconBg: "#FFF3ED",
            valueColor: "#F97316",
        },
        {
            label: "Hari Ini",
            value: `${progress}`,
            unit: "%",
            icon: Trophy,
            iconColor: "#F59E0B",
            iconBg: "#FFFBEB",
            valueColor: "#F59E0B",
        },
        {
            label: "Ibadah",
            value: `${checkedCount}`,
            unit: `/${tasks.length}`,
            icon: TrendingUp,
            iconColor: "#0F7173",
            iconBg: "#E8F4F4",
            valueColor: "#0F7173",
        },
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {stats.map(({ label, value, unit, icon: Icon, iconColor, iconBg, valueColor }) => (
                <div
                    key={label}
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "16px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon size={19} style={{ color: iconColor }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: valueColor }}>{value}</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF" }}>{unit}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, fontWeight: 500 }}>{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
