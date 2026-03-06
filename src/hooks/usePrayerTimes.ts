"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";

export interface PrayerTimes {
    Imsak: string;
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface PrayerData {
    times: PrayerTimes | null;
    city: string;
    loading: boolean;
    error: string | null;
}

const PRAYER_NAMES: Record<string, string> = {
    Imsak: "Imsak",
    Fajr: "Subuh",
    Dhuhr: "Dzuhur",
    Asr: "Ashar",
    Maghrib: "Maghrib",
    Isha: "Isya",
};

function timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

function formatCountdown(diffMs: number): string {
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function usePrayerTimes() {
    const [data, setData] = useState<PrayerData>({
        times: null,
        city: "Jakarta",
        loading: true,
        error: null,
    });

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadTimes = useCallback(async (lat: number, lon: number, cityName: string) => {
        const today = format(new Date(), "dd-MM-yyyy");
        const cacheKey = `prayer_${today}_${lat.toFixed(2)}_${lon.toFixed(2)}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);
            setData({ times: parsed.times, city: cityName, loading: false, error: null });
            return;
        }

        try {
            const res = await fetch(
                `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lon}&method=11`
            );
            const json = await res.json();
            const timings = json.data.timings as PrayerTimes;
            localStorage.setItem(cacheKey, JSON.stringify({ times: timings, city: cityName }));
            setData({ times: timings, city: cityName, loading: false, error: null });
        } catch {
            setData(prev => ({ ...prev, error: "Gagal mengambil jadwal shalat", loading: false }));
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        if (!isMounted) return;
                        const { latitude, longitude } = pos.coords;
                        try {
                            const geoRes = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                            );
                            const geoJson = await geoRes.json();
                            const city = geoJson.address.city || geoJson.address.town || geoJson.address.county || "Lokasimu";
                            if (isMounted) loadTimes(latitude, longitude, city);
                        } catch {
                            if (isMounted) loadTimes(latitude, longitude, "Lokasimu");
                        }
                    },
                    () => {
                        if (isMounted) loadTimes(-6.2088, 106.8456, "Jakarta");
                    }
                );
            } else {
                loadTimes(-6.2088, 106.8456, "Jakarta");
            }
        };

        initialize();

        return () => {
            isMounted = false;
        };
    }, [loadTimes]);

    // Calculate next prayer using useMemo instead of useEffect (Deriving state)
    const nextPrayer = useMemo(() => {
        if (!data.times) return null;

        const prayerOrder = ["Imsak", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let next: { name: string; time: string; countdown: string } | null = null;

        for (const prayer of prayerOrder) {
            const timeStr = data.times[prayer as keyof PrayerTimes];
            if (!timeStr) continue;
            const mins = timeToMinutes(timeStr);
            if (mins > nowMinutes) {
                const diffMs = (mins - nowMinutes) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
                next = {
                    name: PRAYER_NAMES[prayer] || prayer,
                    time: timeStr,
                    countdown: formatCountdown(diffMs),
                };
                break;
            }
        }

        if (!next) {
            next = {
                name: "Imsak",
                time: data.times.Imsak,
                countdown: "--:--:--",
            };
        }

        return next;
    }, [now, data.times]);

    return { ...data, nextPrayer, now };
}
