# Baseline klasifikasi alasan izin

Model `tfidf-multinomial-nb-id-v1` adalah model pembelajaran terawasi kecil: tokenisasi bahasa Indonesia sederhana → pembobotan TF-IDF → Multinomial Naive Bayes dengan Laplace smoothing. Model dilatih dalam memori dari `training-data.json` saat backend dimuat. Tidak ada pengiriman alasan ke layanan AI pihak ketiga.

Dataset berisi 50 kalimat sintetis buatan untuk demonstrasi, 10 per kategori: Kesehatan, Keluarga, Akademik, Transportasi atau keadaan darurat, Keperluan pribadi. Kalimat tersebut bukan data mahasiswa sungguhan dan belum divalidasi pengajar. Model ini belum dinilai pada dataset representatif sehingga tidak ada klaim akurasi produksi.

Jika kosakata yang dikenali kurang dari dua kata unik atau selisih dua skor tertinggi kurang dari 1.5, hasilnya **Perlu pemeriksaan manual**. Skor bukan probabilitas terkalibrasi dan tidak ditampilkan sebagai kepastian. Model sederhana dapat keliru pada negasi, bahasa gaul, alasan campuran, dan kalimat di luar dataset. Contoh unit test adalah smoke test, bukan evaluasi akurasi.

`classifyPermission` menerima `{ permissionId }` melalui Firebase callable API dengan token Auth. Backend membaca alasan asli dari Firestore agar klien tidak dapat mengganti teks/model output. API memeriksa pemilik pengajuan atau Asisten terkait. Trigger `analyzeNewPermission` memakai fungsi klasifikasi yang sama untuk pemrosesan otomatis/idempoten.

Hanya backend menulis `aiCategory`, `aiStatus`, `aiModelVersion`, dan `aiUpdatedAt`. Model tidak menghasilkan keputusan diterima/ditolak. Hanya Asisten terkait yang dapat menulis `status`, `reviewedBy`, dan `reviewedAt` melalui Security Rules. Kegagalan model tidak menghapus pengajuan.

Untuk meningkatkan model: kumpulkan contoh yang telah dianonimkan dan diberi label dengan izin, pisahkan data train/validation/test, ukur precision/recall per kategori, periksa kebingungan Kesehatan vs Keluarga, dan sesuaikan ambang abstain. Jangan menyimpulkan kebenaran alasan dari kategorinya. Jika guide asli tersedia nanti, ganti implementasi `classify()` dengan model yang diwajibkan sambil mempertahankan batasan hak akses dan keputusan manusia.

```powershell
npm run test:ai
```

Perintah dijalankan dari root repo. Cloud Functions menggunakan Node 22, region `asia-southeast2`, dan maksimal 5 instance per fungsi. Deployment cloud memerlukan billing Firebase; emulator dapat digunakan tanpa billing. Lihat `../FIREBASE_SETUP.md`.
