"use client";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MapPin, Clock, Star } from "lucide-react";

const PRAYER_DISPLAY = [
    { key: "Imsak", label: "Imsak", icon: "🌙" },
    { key: "Fajr", label: "Subuh", icon: "🌅" },
    { key: "Dhuhr", label: "Dzuhur", icon: "☀️" },
    { key: "Asr", label: "Ashar", icon: "🌤️" },
    { key: "Maghrib", label: "Maghrib", icon: "🌇" },
    { key: "Isha", label: "Isya", icon: "🌙" },
];

export default function PrayerCard() {
    const { times, city, loading, nextPrayer, now } = usePrayerTimes();

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const isPassed = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m < nowMinutes;
    };

    const isNext = (label: string) => nextPrayer?.name === label;

    if (loading) {
        return (
            <div className="glass rounded-2xl p-6 animate-pulse-slow">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-700 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="teal-gradient p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin size={14} />
                        <span>{city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock size={14} />
                        <span>
                            {format(now, "HH:mm:ss")}
                        </span>
                    </div>
                </div>
                <p className="text-white/60 text-sm">
                    {format(now, "EEEE, d MMMM yyyy", { locale: id })}
                </p>

                {/* Next Prayer Countdown */}
                {nextPrayer && (
                    <div className="mt-4 bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                            Shalat {nextPrayer.name} dalam
                        </p>
                        <p className="text-white text-2xl font-bold font-mono tracking-wider">
                            {nextPrayer.countdown}
                        </p>
                        <p className="text-white/60 text-xs mt-1">Pukul {nextPrayer.time} WIB</p>
                    </div>
                )}
            </div>

            {/* Prayer Times List */}
            <div className="p-4 space-y-2">
                {PRAYER_DISPLAY.map(({ key, label, icon }) => {
                    const timeStr = times?.[key as keyof typeof times];
                    const passed = timeStr ? isPassed(timeStr) : false;
                    const next = isNext(label);

                    return (
                        <div
                            key={key}
                            className={`flex items-center justify-between rounded-xl px-4 py-3 
                ${next ? "bg-yellow-500/15 border border-yellow-500/40" :
                                    passed ? "opacity-40" : "bg-white/5"}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{icon}</span>
                                <div>
                                    <p className={`text-sm font-medium ${next ? "text-yellow-400" : "text-white"}`}>
                                        {label}
                                    </p>
                                    {key === "Imsak" && (
                                        <p className="text-xs text-gray-500">Batas makan sahur</p>
                                    )}
                                    {key === "Fajr" && (
                                        <p className="text-xs text-gray-500">Mulai puasa</p>
                                    )}
                                    {key === "Maghrib" && (
                                        <p className="text-xs text-gray-500">Waktu berbuka 🎉</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {next && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                                <span className={`font-mono text-sm font-semibold ${next ? "text-yellow-400" : "text-gray-300"}`}>
                                    {timeStr || "--:--"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
