# Menjalankan Sprint 2 PraktiKu

Kode aplikasi sudah memakai Firebase Authentication dan Firestore, bukan login dummy. Project Firebase milikmu belum dibuat/dihubungkan. Pilih **cloud** untuk pemakaian antarperangkat, atau **emulator lokal** untuk mencoba tanpa akun/billing Firebase.

## 1. Buat project dan layanan Firebase

1. Buka https://console.firebase.google.com/ dan login dengan akun Google milikmu.
2. Pilih **Create a project / Add project**, beri nama **PraktiKu**. Analytics tidak diperlukan untuk aplikasi ini. Catat **Project ID** (bukan sekadar nama tampilan).
3. Buka **Build → Authentication → Get started → Sign-in method**, aktifkan **Email/Password**, lalu Save.
4. Buka **Build → Firestore Database → Create database**. Gunakan database **Standard**, ID `(default)`, dan **production mode**. Pilih lokasi yang sesuai; backend di repo menggunakan `asia-southeast2` (Jakarta).
5. Buka **Project settings → General → Your apps**, pilih ikon **Web `</>`**, beri nama `PraktiKu`, lalu register. Hosting tidak diperlukan untuk memperoleh konfigurasi.
6. Salin nilai dari objek `firebaseConfig` ke `.env.local` di root repo. Jika file belum ada, salin `.env.example` terlebih dahulu. Jangan mengganti kode inisialisasi aplikasi dengan contoh dari Console.

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=nilai_apiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=nilai_authDomain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=nilai_projectId
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=nilai_storageBucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=nilai_messagingSenderId
EXPO_PUBLIC_FIREBASE_APP_ID=nilai_appId
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false
```

Konfigurasi web bukan service-account credential. Jangan memasukkan private key, file service account, atau kunci API rahasia ke variabel `EXPO_PUBLIC_*`. `.env.local` diabaikan Git.

## 2. Pasang aturan akses sebelum registrasi

Jalankan dari root repo. Ganti `PROJECT_ID_KAMU` dengan ID project yang baru dibuat:

```powershell
npx firebase login
npx firebase deploy --only firestore --project PROJECT_ID_KAMU
```

Login membuka browser untuk akun Google kamu. Tidak perlu menjalankan `firebase init`: konfigurasi dan rules sudah tersedia. Jika deployment CLI belum bisa dilakukan, salin seluruh isi `firestore.rules` ke **Firestore → Rules → Publish**. Jangan memakai rules `allow read, write: if true`.

## 3. Jalankan dan buat akun

```powershell
npm ci
npm --prefix functions ci
npx expo start --clear
```

Tekan `w` untuk web. Untuk Android/iOS, gunakan Expo Go atau development build yang kompatibel dengan SDK 57. Setelah perubahan `.env.local`, hentikan dan mulai ulang Expo.

1. Klik **Belum punya akun? Daftar**. Isi nama, NIM, email dan kata sandi minimal 8 karakter.
2. Semua akun baru menjadi **Praktikan**. Buat satu akun untuk Asisten dan setidaknya satu akun Praktikan dengan email berbeda.
3. Untuk menetapkan Asisten, buka **Firebase Console → Firestore → users → dokumen UID akun Asisten**. Ubah field `role` dari `Praktikan` menjadi **`Asisten`**, persis kapitalisasinya. Ini tindakan pengelola project; aplikasi tidak memberikan hak mengubah peran sendiri.
4. Perubahan peran dibaca otomatis. Jika koneksi terputus, masuk kembali setelah internet tersedia.
5. Praktikan membuka **Akun saya**, menyalin UID dan memberikannya kepada Asisten. UID berbeda dari NIM.
6. Asisten membuka **Kelola sesi → Tambah sesi**, mengisi tanggal `YYYY-MM-DD`, waktu `HH:mm` WIB, dan UID peserta (koma atau baris baru). Nama/kelas/peserta bisa diubah sebelum sesi dibuka. Maksimal 100 peserta per sesi.

Jika akun Auth berhasil dibuat tetapi profil gagal tersimpan, login kembali: halaman **Lengkapi profil** memungkinkan menyelesaikan profil tanpa membuat akun kedua.

## 4. Aktifkan API dan model klasifikasi AI

Tidak ada API pengajar atau ZIP guide yang tersedia saat implementasi. Repo ini menyediakan **baseline TF-IDF + Multinomial Naive Bayes** sendiri. Model bukan LLM dan tidak memakai kunci layanan AI eksternal. Dataset sintetis dan keterbatasannya dijelaskan di `functions/README.md`. Konfirmasikan dengan pengajar jika nantinya ada ketentuan model tertentu.

Untuk menjalankan backend di cloud, Firebase meminta project menggunakan paket **Blaze** dan billing aktif. Aktivasi billing dilakukan sendiri di Console setelah kamu memahami biaya project. Emulator lokal di bagian berikut dapat digunakan untuk latihan tanpa mengaktifkan billing.

```powershell
npm --prefix functions ci
npx firebase deploy --only functions --project PROJECT_ID_KAMU
```

Backend yang dibuat:

- `classifyPermission`: callable API, hanya dapat dipanggil pemilik pengajuan atau Asisten yang menangani sesi itu.
- `analyzeNewPermission`: trigger Firestore sebagai pemroses latar belakang ketika izin dibuat.

Aplikasi menyimpan pengajuan dahulu, kemudian memanggil API. Trigger dan API aman dijalankan berulang: hasil selesai tidak ditulis ulang. Jika API/trigger belum aktif atau gagal, pengajuan tetap ada dengan status **Menunggu Pemeriksaan**. Asisten tetap bisa menerima/menolak tanpa hasil AI. Tombol **Coba klasifikasi AI** tersedia untuk mencoba kembali.

## 5. Alternatif: emulator lokal tanpa project/billing

CLI seri 14 di repo kompatibel dengan Java 17 yang tersedia pada komputer ini. Untuk pindah ke CLI 15+, gunakan Java 21+. Gunakan Node 22 untuk menyamakan runtime Cloud Functions, atau versi Node yang didukung dependensi aplikasi.

Di `.env.local`, cukup aktifkan:

```dotenv
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true
EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1
```

Di terminal pertama:

```powershell
npm --prefix functions ci
npm run emulators
```

Di terminal kedua:

```powershell
npx expo start --clear
```

Buka web di komputer yang sama. UI emulator berada di http://127.0.0.1:4000. Registrasi melalui aplikasi, lalu ubah `users/{uid}.role` di UI emulator Firestore untuk akun Asisten. Semua data ini lokal dan terpisah dari cloud. Secara default data emulator tidak dipertahankan saat proses dihentikan; untuk menyimpan demo lokal gunakan opsi CLI `--export-on-exit` dan `--import` pada folder khusus emulator.

Alamat `127.0.0.1` hanya untuk browser di komputer itu. Untuk mencoba ponsel, paling sederhana gunakan konfigurasi Firebase cloud. Jangan lupa mengubah `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false` sebelum memakai cloud.

## 6. Checklist dua akun

Gunakan browser biasa untuk Asisten dan browser incognito/perangkat lain untuk Praktikan (dua tab biasa berbagi sesi Auth).

1. Daftar dua akun dan tetapkan Asisten melalui Console. Pastikan Praktikan tidak memiliki menu ganti peran.
2. Buat sesi dengan UID Praktikan. Akun lain yang tidak didaftarkan tidak boleh melihat sesi.
3. Asisten membuka sesi. Status pada Praktikan berubah tanpa refresh.
4. Praktikan presensi sekali. Rekap Asisten berubah langsung; klik kedua/dua perangkat tidak menghasilkan duplikasi.
5. Asisten menutup sesi. Presensi baru ditolak.
6. Praktikan mengajukan izin pada sesi lain. Periksa nama, NIM, alasan, waktu, dan status menunggu. Pengajuan kedua untuk sesi sama ditolak.
7. Periksa kategori AI; gunakan alasan yang tidak dikenal untuk melihat kategori pemeriksaan manual. AI tidak mengubah status izin.
8. Asisten memfilter dan menerima/menolak izin. Praktikan melihat keputusan tanpa refresh; dokumen menyimpan UID pemeriksa dan timestamp server.
9. Matikan internet: banner koneksi muncul dan penyimpanan baru diblokir. Sambungkan lagi untuk sinkronisasi otomatis. Jika listener gagal, tekan **Coba sambungkan ulang**.
10. Logout, tutup aplikasi, dan login kembali: data cloud tetap tersedia. Login native memakai AsyncStorage untuk persistensi sesi, sedangkan data Firestore dimuat lagi dari server. Aplikasi tidak menyediakan antrean tulis offline.
11. Hapus sesi yang belum dibuka/selesai. Sesi hilang dari jadwal, tetapi riwayat tetap ada (soft delete untuk audit).

## Pemeriksaan otomatis

```powershell
npx expo lint
npx tsc --noEmit
npm run test:ai
npm run test:rules
npm run test:integration
```

Tes rules dan integrasi memakai project `demo-*`, bukan data Firebase sungguhan. Tutup emulator yang berjalan sebelum menjalankan perintah tes agar port tidak bertabrakan.

## Struktur data

| Koleksi | ID | Isi utama |
| --- | --- | --- |
| `users` | Firebase UID | Nama, NIM, email, peran |
| `sessions` | ID otomatis | Asisten pemilik, daftar UID peserta, jadwal, status, deleted |
| `attendance` | `sessionId_UID` | Identitas peserta, sesi, timestamp server |
| `permissions` | `sessionId_UID` | Alasan, kategori/model AI, status, timestamp pengajuan/pemeriksaan, UID pemeriksa |

NIM adalah identitas tampilan yang diisi pengguna, bukan kunci autentikasi atau verifikasi status mahasiswa. UID Auth menjadi identitas database. Registrasi NIM tidak memverifikasi ke sistem akademik dan tidak menjamin NIM unik; pengelola perlu memverifikasi data peserta sebelum memasukkannya ke sesi.

## Jika ada masalah

- **Firebase belum dikonfigurasi**: periksa `.env.local`, bukan `.env.example`, lalu restart Expo.
- **Akses ditolak**: periksa rules sudah dipublish, profil `users/{uid}` ada, peran sesuai, dan UID ada pada sesi.
- **Email/Password belum aktif**: aktifkan provider di Authentication.
- **Izin tersimpan tetapi AI menunggu/gagal**: pastikan Functions sudah dideploy pada project dan region yang benar. Pengajuan tetap bisa diperiksa manual.
- **Port 8080/9099/5001 dipakai**: hentikan emulator lama sebelum menjalankan tes.
- **Java tidak tersedia**: pasang JDK yang sesuai dan pastikan `java -version` bisa dijalankan.

Referensi resmi: [Expo + Firebase](https://docs.expo.dev/guides/using-firebase/), [Auth email/password](https://firebase.google.com/docs/auth/web/password-auth), [Cloud Functions setup dan deployment](https://firebase.google.com/docs/functions/get-started), [Firebase Emulator](https://firebase.google.com/docs/emulator-suite/install_and_configure).
