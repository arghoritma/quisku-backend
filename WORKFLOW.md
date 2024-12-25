Alur Proses Kerja Aplikasi QuisKU

1. Registrasi dan Login:

   - Registrasi: Pengguna baru mendaftar dengan mengisi form registrasi yang mencakup username, email, password, dll.
   - Login: Pengguna yang sudah terdaftar melakukan login dengan memasukkan email dan password.
   - Autentikasi: Server memverifikasi kredensial pengguna menggunakan Firebase Auth dan mengembalikan token UID.

2. Dashboard Utama:

   - Token Verifikasi: Pengguna yang sudah berhasil login mengirimkan token UID di header setiap permintaan (request) ke server.
   - Verifikasi Token: Middleware authMiddleware memverifikasi token UID menggunakan Firebase Admin.
   - Akses Dashboard: Setelah verifikasi berhasil, pengguna dapat mengakses dashboard utama yang menampilkan ringkasan skor, XP, dan kuis yang direkomendasikan.

3. Memilih Kuis:

   - Pilih Kategori dan Tingkat Kesulitan: Pengguna memilih kategori kuis (misalnya, Matematika, Sejarah) dan tingkat kesulitan (SD-Kelas-1 hingga S2).
   - Mengambil Kuis: Setelah memilih kategori dan tingkat kesulitan, server menghasilkan kuis menggunakan Gemini AI, yang mencakup 10 pertanyaan pilihan ganda.

4. Mengambil Kuis:

   - Pertanyaan Kuis: Pengguna menjawab 10 pertanyaan pilihan ganda satu per satu.
   - Umpan Balik: Setelah menjawab setiap pertanyaan, pengguna dapat menerima umpan balik langsung mengenai jawaban mereka.

5. Menyelesaikan Kuis:

   - Pengumpulan Jawaban: Setelah menjawab semua pertanyaan, jawaban pengguna dikirimkan ke server.
   - Penilaian: Server menghitung jumlah jawaban benar dan menentukan skor akhir serta XP yang diperoleh pengguna (10 XP per kuis).
   - Pembaruan Skor dan XP: Skor dan XP yang diperoleh pengguna ditambahkan ke total skor dan XP mereka di database.
   - Penyimpanan Riwayat: Data kuis yang telah diselesaikan disimpan di tabel user_quiz_scores.

6. Pembaruan Leaderboard:
   - Peringkat Global: Server memperbarui leaderboard global berdasarkan total skor dan XP pengguna.
   - Peringkat Kategori: Server juga memperbarui leaderboard berdasarkan kategori tertentu.
   - Pemberitahuan: Pengguna diberi tahu tentang posisi peringkat mereka di leaderboard.
