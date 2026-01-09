# 📊 Laporan Proyek Akhir Metode Numerik
## Kalkulator Integral Numerik

**Kelompok:**
- Cahyadi Prasetyo
- Rusydi Ardani
- Ezzy Auriel Syach Lie
- Syawal Rizal Utama
- Azmi Novi Athaya

**Mata Kuliah:** Metode Numerik  
**Semester:** 5 (2025)

---

## 📋 1. RENCANA PROYEK

### 1.1 Latar Belakang
Integral numerik adalah teknik penting dalam metode numerik untuk menghitung nilai integral dari fungsi yang sulit atau tidak mungkin diselesaikan secara analitik. Proyek ini bertujuan membangun aplikasi web interaktif yang membantu mahasiswa memahami dan membandingkan berbagai metode integrasi numerik.

### 1.2 Tujuan
1. Mengimplementasikan 3 metode integrasi numerik: **Trapesium**, **Simpson 1/3**, dan **Simpson 3/8**.
2. Menyediakan visualisasi grafik untuk memahami konsep geometri di balik setiap metode.
3. Menampilkan langkah-langkah perhitungan secara detail.
4. Membandingkan akurasi antar metode dengan menghitung error.

### 1.3 Ruang Lingkup
| Aspek | Keterangan |
|-------|------------|
| Platform | Web Application (HTML, CSS, JavaScript) |
| Metode | Trapesium, Simpson 1/3, Simpson 3/8 |
| Input | Fungsi matematika, batas bawah (a), batas atas (b), jumlah partisi (n) |
| Output | Hasil integral, error, langkah perhitungan, grafik |

### 1.4 Teknologi yang Digunakan
- **HTML5** — Struktur halaman
- **CSS3** — Styling dan responsivitas
- **JavaScript (Vanilla)** — Logika aplikasi
- **Math.js** — Parsing fungsi matematika
- **Chart.js** — Visualisasi grafik
- **MathJax** — Rendering rumus LaTeX

---

## 📈 2. KEMAJUAN PROYEK

### 2.1 Timeline Pengembangan

| Fase | Aktivitas | Status |
|------|-----------|--------|
| 1 | Desain UI/UX dasar | ✅ Selesai |
| 2 | Implementasi algoritma Trapesium | ✅ Selesai |
| 3 | Implementasi algoritma Simpson 1/3 | ✅ Selesai |
| 4 | Implementasi algoritma Simpson 3/8 | ✅ Selesai |
| 5 | Visualisasi grafik interaktif | ✅ Selesai |
| 6 | Langkah perhitungan detail | ✅ Selesai |
| 7 | Fitur perbandingan semua metode | ✅ Selesai |
| 8 | Input nilai eksak manual | ✅ Selesai |
| 9 | Responsivitas mobile | ✅ Selesai |
| 10 | Halaman Teori dan Tentang | ✅ Selesai |
| 11 | Integrasi GitHub | ✅ Selesai |

### 2.2 Fitur yang Diimplementasikan
1. **Kalkulator Integral** — Input fungsi bebas dengan parsing otomatis.
2. **3 Metode Integrasi** — Trapesium, Simpson 1/3, Simpson 3/8.
3. **Visualisasi Grafik** — Menampilkan kurva fungsi dan area pendekatan.
4. **Langkah Detail** — Menampilkan rumus, perhitungan h, tabel nilai fungsi, dan hasil akhir.
5. **Perhitungan Error** — Absolute Error dan Relative Error.
6. **Mode Bandingkan** — Membandingkan semua metode sekaligus dengan kesimpulan metode terbaik.
7. **Input Nilai Eksak Manual** — Untuk fungsi custom yang nilai eksak-nya diketahui.
8. **Preset Fungsi** — Fungsi contoh dengan nilai eksak yang sudah terhitung.
9. **Math Keyboard** — Tombol shortcut untuk simbol matematika.
10. **Dark/Light Mode** — Toggle tema gelap dan terang.
11. **Halaman Teori** — Penjelasan rumus dan konsep setiap metode.
12. **Responsif** — Dapat digunakan di desktop maupun mobile.

---

## 🏆 3. HASIL PROYEK

### 3.1 Tampilan Aplikasi

**URL Repository:** https://github.com/Cahyadi-Prasetyo/numerical_integral

Aplikasi dapat diakses dengan membuka file `index.html` di browser.

### 3.2 Contoh Penggunaan

**Kasus:** Hitung ∫₀¹ x² dx dengan n = 4

| Metode | Hasil | Nilai Eksak | Absolute Error | Relative Error |
|--------|-------|-------------|----------------|----------------|
| Trapesium | 0.34375 | 0.33333... | 0.01042 | 3.125% |
| Simpson 1/3 | 0.33333 | 0.33333... | 0.00000 | 0.000% |
| Simpson 3/8 | 0.33333 | 0.33333... | 0.00000 | 0.000% |

**Kesimpulan:** Metode Simpson memberikan hasil yang lebih akurat karena menggunakan polinomial orde lebih tinggi.

### 3.3 Perbandingan Akurasi Metode

| Metode | Order Error | Keterangan |
|--------|-------------|------------|
| Trapesium | O(h²) | Akurat untuk fungsi linier |
| Simpson 1/3 | O(h⁴) | Akurat untuk fungsi polinomial hingga orde 3 |
| Simpson 3/8 | O(h⁴) | Sama dengan Simpson 1/3, membutuhkan n kelipatan 3 |

### 3.4 Kelebihan Aplikasi
- ✅ User-friendly dengan antarmuka modern
- ✅ Mendukung berbagai fungsi matematika kompleks
- ✅ Visualisasi membantu pemahaman konsep
- ✅ Langkah perhitungan transparan
- ✅ Responsif untuk berbagai perangkat

### 3.5 Keterbatasan
- ⚠️ Bergantung pada browser untuk menjalankan
- ⚠️ Perhitungan besar (n > 1000) mungkin lambat
- ⚠️ Tidak mendukung integral improper (batas tak hingga)

---

## 📚 4. KESIMPULAN

Proyek Kalkulator Integral Numerik berhasil diimplementasikan dengan fitur lengkap mencakup 3 metode integrasi, visualisasi grafik, perhitungan error, dan antarmuka yang responsif. Aplikasi ini dapat menjadi alat bantu pembelajaran yang efektif bagi mahasiswa dalam memahami konsep integrasi numerik.

---

## 📎 5. LAMPIRAN

### Struktur File Proyek
```
numerical_integral/
├── index.html          # Halaman utama
├── css/
│   └── style.css       # Styling aplikasi
├── js/
│   ├── calculator.js   # Algoritma integrasi
│   ├── visualizer.js   # Logika grafik
│   └── main.js         # Logika UI
└── .gitignore          # File Git ignore
```

### Referensi
1. Chapra, S.C. & Canale, R.P. (2015). *Numerical Methods for Engineers*. McGraw-Hill.
2. Burden, R.L. & Faires, J.D. (2011). *Numerical Analysis*. Brooks/Cole.
