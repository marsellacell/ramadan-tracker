# 🌙 Ramadan Tracker

Aplikasi pemantau ibadah harian berbasis _web_ yang dirancang khusus untuk membantu umat Muslim memantau progres ibadah mereka (Shalat Wajib dan Sunnah) di bulan suci bulan Ramadan.

Dibuat dengan Modern Stack: **Next.js**, **React**, dan **Firebase** untuk penyimpanan progres secara langsung (Real-time).

---

## ✨ Fitur Utama

- 🔐 **Google Authentication**: Login cepat dan aman menggunakan akun Google. Data otomatis tersimpan berdasarkan masing-masing akun.
- ✅ **Daily Worship Checklist**: Pantau ibadah wajib (Subuh, Dzuhur, Ashar, dll) maupun ibadah tambahan (Tarawih, Tilawah Quran, dll).
- 📊 **Progress Tracker**: Laporan progres ibadah harian yang divisualisasikan menggunakan *progress bar* yang cantik.
- 📱 **Mobile Responsive**: Tampilan yang rapi, modern, dan dioptimasi agar nyaman digunakan di *Handphone* maupun *Tablet*.
- ☁️ **Cloud Sync**: Data otomatis di-*sync* ke *Cloud Firestore database*.

## 🛠️ Tech Stack

Aplikasi ini menggunakan teknologi berikut:
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library UI**: React 19
- **Styling**: Tailwind CSS
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: `date-fns`

---

## 🚀 Cara Menjalankan di Komputer Lokal

Pastikan Anda memiliki instalasi [Node.js](https://nodejs.org/) versi terbaru, lalu ikuti panduan berikut:

### 1. Clone & Install
```bash
# Salin repository ini
git clone https://github.com/marsellacell/ramadan-tracker.git

# Masuk ke dalam direktori aplikasi
cd ramadan-tracker

# Install depedencies
npm install
```

### 2. Setup Firebase
Aplikasi ini membutuhkan konfigurasi Firebase agar dapat berjalan dengan sempurna. Buat file `.env.local` di *root server* aplikasi dan masukkan konfigurasi berikut:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="api-key-mu-disini"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="domain-mu-disini"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="project-id-mu-disini"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="storage-bucket-mu-disini"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="sender-id-mu-disini"
NEXT_PUBLIC_FIREBASE_APP_ID="app-id-mu-disini"
```

### 3. Jalankan Aplikasi
Jalankan perintah ini untuk menjalankan _development server_ lokal Next.js.
```bash
npm run dev
```

Buka peramban (*browser*) Anda ke alamat [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya!

---

## 📜 Lisensi
Dikembangkan oleh **marsell**
Lisensi resmi di bawah [MIT License](LICENSE).
