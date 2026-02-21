import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function saveDailyLog(
    uid: string,
    date: string,
    tasks: Record<string, boolean>
) {
    const ref = doc(db, "users", uid, "dailyLogs", date);
    await setDoc(ref, {
        tasks,
        progress: Math.round(
            (Object.values(tasks).filter(Boolean).length / Object.keys(tasks).length) * 100
        ),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function getDailyLog(
    uid: string,
    date: string
): Promise<Record<string, boolean> | null> {
    const ref = doc(db, "users", uid, "dailyLogs", date);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return snap.data().tasks as Record<string, boolean>;
    }
    return null;
}
