# NumIntegral - Kalkulator Integral Numerik

Aplikasi web interaktif untuk menghitung dan memvisualisasikan integral numerik menggunakan berbagai metode.

## 📐 Metode yang Tersedia

1. **Metode Trapesium** - Aproksimasi menggunakan trapesium
2. **Metode Simpson 1/3** - Aproksimasi menggunakan parabola (n harus genap)
3. **Metode Simpson 3/8** - Aproksimasi kubik (n harus kelipatan 3)
4. **Metode Midpoint** - Aproksimasi menggunakan titik tengah

## 🚀 Cara Menjalankan

1. Buka file `index.html` di browser
2. Atau gunakan Live Server di VS Code

## ✨ Fitur

- Input fungsi matematika (preset atau custom)
- Visualisasi grafik kurva dan partisi
- Perbandingan hasil dari semua metode
- Analisis galat (error analysis)
- Grafik perbandingan error
- UI responsif dan modern

## 📊 Struktur Project

```
metnum-integral/
├── index.html          # Halaman utama
├── css/
│   └── style.css       # Styling UI
├── js/
│   ├── main.js         # Logic utama & UI control
│   ├── methods.js      # Implementasi metode numerik
│   ├── parser.js       # Parsing fungsi matematika
│   └── visualizer.js   # Visualisasi canvas/chart
└── README.md           # Dokumentasi
```

## 🧮 Rumus

### Trapesium
```
I ≈ (h/2) × [f(x₀) + 2Σf(xᵢ) + f(xₙ)]
```

### Simpson 1/3
```
I ≈ (h/3) × [f(x₀) + 4Σf(x_ganjil) + 2Σf(x_genap) + f(xₙ)]
```

### Simpson 3/8
```
I ≈ (3h/8) × [f(x₀) + 3Σf(xᵢ) + 2Σf(x₃ₖ) + f(xₙ)]
```

### Midpoint
```
I ≈ h × Σf(x_mid)
```

## 📁 Penjelasan File

| File | Deskripsi |
|------|-----------|
| `index.html` | Halaman utama dengan struktur HTML |
| `css/style.css` | Styling dengan dark theme modern |
| `js/parser.js` | Parsing ekspresi matematika & kalkulasi error |
| `js/methods.js` | Implementasi 4 metode integrasi numerik |
| `js/visualizer.js` | Visualisasi grafik menggunakan Canvas |
| `js/main.js` | Logic UI, event handling, & Chart.js |

## 🛠️ Teknologi

- HTML5, CSS3, JavaScript (ES6+)
- [math.js](https://mathjs.org/) - Parsing ekspresi matematika
- [Chart.js](https://www.chartjs.org/) - Grafik perbandingan error
- Canvas API - Visualisasi kurva

## 👨‍💻 Dibuat untuk Tugas Metode Numerik 2026
