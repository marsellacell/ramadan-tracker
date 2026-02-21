"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { saveDailyLog, getDailyLog } from "@/lib/db";

export interface DailyTask {
    id: string;
    label: string;
    emoji: string;
    checked: boolean;
}

const DEFAULT_TASKS: Omit<DailyTask, "checked">[] = [
    { id: "subuh", label: "Sholat Subuh", emoji: "🌅" },
    { id: "dzuhur", label: "Sholat Dzuhur", emoji: "☀️" },
    { id: "ashar", label: "Sholat Ashar", emoji: "🌤️" },
    { id: "maghrib", label: "Sholat Maghrib", emoji: "🌇" },
    { id: "isya", label: "Sholat Isya", emoji: "🌙" },
    { id: "tarawih", label: "Sholat Tarawih", emoji: "🕌" },
    { id: "puasa", label: "Puasa Hari Ini", emoji: "✨" },
    { id: "quran", label: "Baca Al-Quran", emoji: "📖" },
    { id: "dzikir", label: "Dzikir Pagi/Sore", emoji: "📿" },
    { id: "sedekah", label: "Sedekah", emoji: "💝" },
];

function getDateKey(date: Date) {
    return format(date, "yyyy-MM-dd");
}

function tasksToMap(tasks: DailyTask[]): Record<string, boolean> {
    const obj: Record<string, boolean> = {};
    tasks.forEach((t) => { obj[t.id] = t.checked; });
    return obj;
}

function mapToTasks(map: Record<string, boolean>): DailyTask[] {
    return DEFAULT_TASKS.map((t) => ({ ...t, checked: map[t.id] ?? false }));
}

// localStorage helpers
function loadLocal(date: Date): DailyTask[] | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`tracker_${getDateKey(date)}`);
    if (!stored) return null;
    return mapToTasks(JSON.parse(stored));
}

function saveLocal(date: Date, tasks: DailyTask[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(`tracker_${getDateKey(date)}`, JSON.stringify(tasksToMap(tasks)));
}

export function useTracker() {
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<DailyTask[]>(
        DEFAULT_TASKS.map((t) => ({ ...t, checked: false }))
    );
    const [isSaving, setIsSaving] = useState(false);

    // ── Load tasks when date or uid changes ──
    useEffect(() => {
        let cancelled = false;

        async function load() {
            // 1. Immediately show localStorage data (feels fast)
            const localData = loadLocal(selectedDate);
            if (localData && !cancelled) {
                setTasks(localData);
            } else if (!cancelled) {
                setTasks(DEFAULT_TASKS.map((t) => ({ ...t, checked: false })));
            }

            // 2. Fetch from Firestore in background (if uid ready)
            if (!uid) return;
            try {
                const firestoreData = await getDailyLog(uid, getDateKey(selectedDate));
                if (firestoreData && !cancelled) {
                    const merged = mapToTasks(firestoreData);
                    setTasks(merged);
                    saveLocal(selectedDate, merged); // update local cache
                }
            } catch (err) {
                console.warn("Firestore load failed, using local:", err);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [selectedDate, uid]);

    // ── Toggle task ──
    const toggleTask = useCallback(
        async (id: string) => {
            setTasks((prev) => {
                const updated = prev.map((t) =>
                    t.id === id ? { ...t, checked: !t.checked } : t
                );

                // Save to localStorage immediately
                saveLocal(selectedDate, updated);

                // Save to Firestore async (fire and forget)
                if (uid) {
                    setIsSaving(true);
                    saveDailyLog(uid, getDateKey(selectedDate), tasksToMap(updated))
                        .catch((err) => console.warn("Firestore save failed:", err))
                        .finally(() => setIsSaving(false));
                }

                return updated;
            });
        },
        [selectedDate, uid]
    );

    // ── Date navigation ──
    const goToPrevDay = () => {
        setSelectedDate((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            return d;
        });
    };

    const goToNextDay = () => {
        setSelectedDate((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            return d;
        });
    };

    const goToToday = () => setSelectedDate(new Date());

    // ── Streak ──
    const calculateStreak = useCallback((): number => {
        if (typeof window === "undefined") return 0;
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const stored = localStorage.getItem(`tracker_${getDateKey(d)}`);
            if (!stored) break;
            const parsed = JSON.parse(stored) as Record<string, boolean>;
            const count = Object.values(parsed).filter(Boolean).length;
            if (count / DEFAULT_TASKS.length >= 0.5) streak++;
            else break;
        }
        return streak;
    }, []);

    const progress =
        tasks.length > 0
            ? Math.round((tasks.filter((t) => t.checked).length / tasks.length) * 100)
            : 0;

    const isToday =
        getDateKey(selectedDate) === getDateKey(new Date());

    return {
        uid,
        selectedDate,
        tasks,
        toggleTask,
        progress,
        isToday,
        isSaving,
        goToPrevDay,
        goToNextDay,
        goToToday,
        calculateStreak,
    };
}
