"use client";
import { useTracker } from "@/hooks/useTracker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";

const SECTIONS = [
    { title: "Sholat Wajib", ids: ["subuh", "dzuhur", "ashar", "maghrib", "isya"] },
    { title: "Ibadah Tambahan", ids: ["tarawih", "puasa", "quran", "dzikir", "sedekah"] },
];

export default function WorshipTracker() {
    const { selectedDate, tasks, toggleTask, progress, isToday, isSaving, goToPrevDay, goToNextDay, goToToday } = useTracker();
    const checkedCount = tasks.filter((t) => t.checked).length;
    const progressColor = progress >= 80 ? "#0F7173" : progress >= 50 ? "#F59E0B" : "#D1D5DB";

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
        >
            {/* ── Date Navigation ── */}
            <div style={{ padding: "20px 20px 0" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#F4F6F9",
                        borderRadius: 12,
                        padding: "4px 6px",
                    }}
                >
                    <button
                        onClick={goToPrevDay}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6B7280",
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ textAlign: "center", flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1D23", margin: 0 }}>
                            {isToday ? "Hari Ini" : format(selectedDate, "EEEE", { locale: id })}
                        </p>
                        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                            {format(selectedDate, "d MMMM yyyy", { locale: id })}
                        </p>
                    </div>
                    <button
                        onClick={goToNextDay}
                        disabled={isToday}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            border: "none",
                            background: "transparent",
                            cursor: isToday ? "default" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isToday ? "#D1D5DB" : "#6B7280",
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {!isToday && (
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                        <button
                            onClick={goToToday}
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#0F7173",
                                background: "#E8F4F4",
                                border: "none",
                                borderRadius: 999,
                                padding: "6px 16px",
                                cursor: "pointer",
                            }}
                        >
                            Kembali ke hari ini
                        </button>
                    </div>
                )}

                {/* ── Progress ── */}
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            {checkedCount} dari {tasks.length} ibadah selesai
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: progressColor }}>
                            {progress}%
                        </span>
                    </div>
                    <div
                        style={{
                            height: 8,
                            background: "#F0F2F5",
                            borderRadius: 999,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${progress}%`,
                                background: progressColor,
                                borderRadius: 999,
                                transition: "width 0.7s ease",
                            }}
                        />
                    </div>
                    {progress === 100 && (
                        <p style={{ textAlign: "center", color: "#0F7173", fontSize: 13, fontWeight: 600, marginTop: 10 }}>
                            🎉 MasyaAllah! Semua ibadah terpenuhi!
                        </p>
                    )}
                </div>
            </div>

            {/* ── Task Sections ── */}
            {SECTIONS.map((section) => {
                const sectionTasks = tasks.filter((t) => section.ids.includes(t.id));
                const sectionDone = sectionTasks.filter((t) => t.checked).length;

                return (
                    <div key={section.title}>
                        {/* Section header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 20px 8px",
                                background: "#F7F8FA",
                                borderTop: "1px solid #F0F2F5",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#9CA3AF",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                {section.title}
                            </span>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: sectionDone === sectionTasks.length ? "#0F7173" : "#9CA3AF",
                                }}
                            >
                                {sectionDone}/{sectionTasks.length}
                            </span>
                        </div>

                        {/* Task items */}
                        {sectionTasks.map((task, i) => (
                            <button
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "14px 20px",
                                    border: "none",
                                    borderBottom: i < sectionTasks.length - 1 ? "1px solid #F7F8FA" : "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    background: task.checked ? "#F0FAFA" : "#fff",
                                    transition: "background 0.15s ease",
                                }}
                            >
                                {task.checked ? (
                                    <CheckCircle2 size={22} style={{ color: "#0F7173", flexShrink: 0 }} />
                                ) : (
                                    <Circle size={22} style={{ color: "#E5E7EB", flexShrink: 0 }} />
                                )}
                                <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{task.emoji}</span>
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: task.checked ? "#9CA3AF" : "#1A1D23",
                                        textDecoration: task.checked ? "line-through" : "none",
                                        flex: 1,
                                    }}
                                >
                                    {task.label}
                                </span>
                            </button>
                        ))}
                    </div>
                );
            })}

            {/* ── Footer ── */}
            <div
                style={{
                    padding: "14px 20px",
                    textAlign: "center",
                    borderTop: "1px solid #F0F2F5",
                    background: "#FAFBFC",
                }}
            >
                <p style={{ fontSize: 12, color: isSaving ? "#0F7173" : "#9CA3AF", margin: 0 }}>
                    {isSaving
                        ? "☁️ Menyimpan ke cloud..."
                        : progress === 0
                            ? "Semangat beribadah hari ini! 💫"
                            : progress < 50
                                ? "Terus semangat, masih ada waktu! 🌟"
                                : progress < 80
                                    ? "Hampir setengah selesai, luar biasa! ✨"
                                    : progress < 100
                                        ? "Tinggal sedikit lagi, tetap istiqomah! 🌙"
                                        : "Alhamdulillah, semua ibadah terpenuhi! 🤲"}
                </p>
            </div>
        </div>
    );
}
