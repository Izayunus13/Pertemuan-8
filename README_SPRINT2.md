# PraktiKu — Sprint 2

Aplikasi Expo/React Native untuk jadwal, presensi, dan pengajuan izin Praktikan. Firebase Authentication mengelola akun; Firestore menyimpan data dan menyinkronkan perubahan; Cloud Functions menjalankan API klasifikasi alasan izin.

**Mulai dari [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).** File `.env.local` sudah disiapkan secara lokal dan perlu diisi dengan konfigurasi project milikmu, atau aktifkan mode emulator untuk mencoba tanpa project Firebase.

Fitur yang tersedia: registrasi/login/logout/reset password, peran yang dikelola pengelola, jadwal berdasarkan peserta/asisten, tambah/ubah/hapus sesi, buka/tutup presensi, pencatatan unik per UID/sesi, rekap dan riwayat, pengajuan izin, filter pemeriksaan, keputusan manual, klasifikasi AI dan percobaan ulang.

Model AI adalah baseline TF-IDF + Multinomial Naive Bayes dari 50 contoh sintetis, bukan model dari guide pengajar (guide belum tersedia). Baca [model card](./functions/README.md) untuk batasan dan cara menggantinya.

## Implementasi

- `src/context/AppContext.tsx`: sesi Auth, profil, listener Firestore, status koneksi, penanganan kesalahan.
- `src/services/repository.ts`: transaksi, validasi, ID unik dan timestamp server.
- `firestore.rules`: pembatasan identitas/peran dan field yang boleh berubah.
- `functions/`: model AI, callable API dan trigger latar belakang.
- `scripts/test-firestore.cjs`: pengujian rules termasuk akses ilegal dan konkurensi.
- `scripts/test-integration.cjs`: alur akun nyata di emulator menggunakan service repository aplikasi dan API AI.

`DemoContext`, `demo-state`, dummy data, `test:demo`, dan `DEMO.md` adalah peninggalan Sprint 1 dan tidak dipakai alur aplikasi aktif. Data dummy tidak dimigrasi ke cloud otomatis.

Firebase SDK dipin ke 12.19.0. Overrides `@firebase/app` dan `@firebase/app-compat` menyamakan versi inti dengan SDK tersebut agar peer dependency tidak mengambil inti dari seri Firebase yang lebih baru; tanpa penyelarasan ini registrasi komponen Firestore gagal pada pengujian compat. Jalankan kembali tes integrasi ketika menaikkan versi Firebase.

Penghapusan sesi memakai soft delete agar riwayat tidak hilang. Detail/peserta sesi hanya dapat diedit sebelum pembukaan. Keputusan izin final dan hanya boleh dibuat sekali oleh Asisten terkait. Penyimpanan harus online; tidak ada antrean tulis offline atau klaim sinkronisasi berhasil sebelum server mengonfirmasi.
