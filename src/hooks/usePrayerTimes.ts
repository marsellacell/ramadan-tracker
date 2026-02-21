"use client";
import { useState, useEffect, useCallback } from "react";
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
    nextPrayer: { name: string; time: string; countdown: string } | null;
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
        nextPrayer: null,
    });

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchPrayerTimes = useCallback(async (lat: number, lon: number, cityName: string) => {
        const today = format(new Date(), "dd-MM-yyyy");
        const cacheKey = `prayer_${today}_${lat.toFixed(2)}_${lon.toFixed(2)}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);
            setData(prev => ({ ...prev, times: parsed.times, city: cityName, loading: false }));
            return parsed.times;
        }

        try {
            const res = await fetch(
                `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lon}&method=11`
            );
            const json = await res.json();
            const timings = json.data.timings as PrayerTimes;
            localStorage.setItem(cacheKey, JSON.stringify({ times: timings, city: cityName }));
            setData(prev => ({ ...prev, times: timings, city: cityName, loading: false }));
            return timings;
        } catch {
            setData(prev => ({ ...prev, error: "Gagal mengambil jadwal shalat", loading: false }));
        }
    }, []);

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    // Reverse geocode using a simple API
                    try {
                        const geoRes = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const geoJson = await geoRes.json();
                        const city = geoJson.address.city || geoJson.address.town || geoJson.address.county || "Lokasimu";
                        fetchPrayerTimes(latitude, longitude, city);
                    } catch {
                        fetchPrayerTimes(latitude, longitude, "Lokasimu");
                    }
                },
                () => {
                    // Default: Jakarta
                    fetchPrayerTimes(-6.2088, 106.8456, "Jakarta");
                }
            );
        } else {
            fetchPrayerTimes(-6.2088, 106.8456, "Jakarta");
        }
    }, [fetchPrayerTimes]);

    // Calculate next prayer
    useEffect(() => {
        if (!data.times) return;

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

        // If all prayers passed, next is Imsak tomorrow
        if (!next) {
            next = {
                name: "Imsak",
                time: data.times.Imsak,
                countdown: "--:--:--",
            };
        }

        setData(prev => ({ ...prev, nextPrayer: next }));
    }, [now, data.times]);

    return { ...data, now };
}
