# 🔑 Gantungan Kunci 3D

Animasi 3D gantungan kunci interaktif yang dibuat dengan [Three.js](https://threejs.org/). Semuanya ada dalam satu file HTML, jadi tidak perlu build atau install apa pun.

| Hati – Akrilik Glossy | Bintang – Akrilik Bening | Tag – Metalik |
|---|---|---|
| ![Hati](docs/hati.png) | ![Bintang](docs/bintang.png) | ![Tag](docs/tag.png) |

## Fitur
- Rantai yang berayun dengan fisika pendulum sederhana, plus bandul yang ikut berputar
- Goyang otomatis, tombol **Goyangkan!**, atau klik langsung gantungannya
- Tulisan custom yang timbul di kedua sisi bandul
- 4 bentuk: Hati, Bintang, Tag, Bulat
- 4 material: Akrilik Glossy, Akrilik Bening, Metalik, Doff
- Pilihan warna siap pakai dan color picker
- Rekam animasi 6 detik ke video `.webm`
- Kamera bisa diputar (drag) dan di-zoom (scroll)

## Cara menjalankan
Buka `index.html` di browser modern (Chrome, Edge, Firefox, Safari). Perlu koneksi internet karena Three.js dimuat dari CDN.

Bisa juga lewat server lokal:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Atau aktifkan **GitHub Pages** (Settings → Pages → Deploy from branch `main`, folder `/root`) supaya bisa diakses online di `https://ridho-fauzan.github.io/GantunganKunci3d/`.
