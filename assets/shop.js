// ===================================================================
//  Data toko & katalog. Edit file ini untuk mengganti nama, kontak,
//  event, produk, dan harga. Dipakai oleh index.html (katalog),
//  desain.html (editor 3D) dan preorder.html.
// ===================================================================
window.SHOP = {
  nama: 'Toko Aksesoris "Persahabatan"',
  tagline: 'Band Merch · Keychain Custom',
  instagram: 'toko.aksesoris.persahabatan',
  // Nomor WhatsApp format internasional tanpa "+" atau spasi, contoh: '6281234567890'.
  // Kosongkan ('') kalau pesanan hanya lewat DM Instagram.
  whatsapp: '',
  // Pesanan TIDAK dikirim: semua pre-order diambil di booth saat event ini.
  event: {
    nama: 'Binus Festival (Bifest)',
    lokasi: 'Binus Anggrek, Lantai 1',
    hari: 'Rabu, 26 November',
    jam: '09.00 – 17.00'
  },
  catatanPO: 'Pre-order dikonfirmasi admin lewat DM. Pesanan hanya bisa diambil di booth saat Bifest, tidak ada pengiriman.'
};

// harga: angka dalam Rupiah (contoh 15000), atau null untuk "Harga via DM".
// aset: gambar logo/artwork (PNG transparan paling rapi, latar putih polos juga bisa). Spasi di nama file ditulis %20.
// video/gambar: preview 360° & poster di katalog (dibuat dari editor 3D, lihat README).
// desain: tampilan awal di editor 3D (desain.html?produk=<id>).
window.KATALOG = [
  {
    id: 'feast', nama: 'Feast', harga: null, badge: 'Best seller',
    aset: 'katalog/asetAsli/feast.png', gambar: 'katalog/feast.jpg', video: 'katalog/feast.mp4',
    spek: '60 mm · akrilik bening · cetak 2 sisi',
    deskripsi: 'Logo Feast, akrilik dipotong mengikuti outline logo.',
    desain: { material: 'clear', warna: '#ffffff', border: 12 }
  },
  {
    id: 'bunny', nama: 'NewJeans Bunny', harga: null, badge: 'Cute',
    aset: 'katalog/asetAsli/new%20jeans%20bunny.png', gambar: 'katalog/bunny.jpg', video: 'katalog/bunny.mp4',
    spek: '60 mm · akrilik bening · cetak 2 sisi',
    deskripsi: 'Bunny NewJeans main sepatu roda, garis biru di akrilik bening.',
    desain: { material: 'clear', warna: '#ffffff', border: 14 }
  },
  {
    id: 'radiohead', nama: 'Radiohead Bear', harga: null,
    aset: 'katalog/asetAsli/RadioHead.png', gambar: 'katalog/radiohead.jpg', video: 'katalog/radiohead.mp4',
    spek: '55 mm · akrilik bening · cetak 2 sisi',
    deskripsi: 'Logo beruang Radiohead, hitam tegas di akrilik bening.',
    desain: { material: 'clear', warna: '#ffffff', border: 12, ukuran: 55 }
  },
  {
    id: 'club', nama: 'Reality Club', harga: null,
    aset: 'katalog/asetAsli/RealityClub.png', gambar: 'katalog/club.jpg', video: 'katalog/club.mp4',
    spek: '60 mm · akrilik bening · cetak 2 sisi',
    deskripsi: 'Logo Reality Club, tulisan script biru.',
    desain: { material: 'clear', warna: '#ffffff', border: 14 }
  },
  {
    id: 'the1975', nama: 'The 1975', harga: null,
    aset: 'katalog/asetAsli/The1975.png', gambar: 'katalog/the1975.jpg', video: 'katalog/the1975.mp4',
    spek: '70 mm · akrilik bening · cetak 2 sisi',
    deskripsi: 'Logo THE1975 biru navy, bentuk memanjang.',
    desain: { material: 'clear', warna: '#ffffff', border: 16, ukuran: 70 }
  }
];

window.SHOP_UTIL = {
  igUrl: () => `https://www.instagram.com/${SHOP.instagram}/`,
  igDmUrl: () => `https://ig.me/m/${SHOP.instagram}`,
  waUrl: text => SHOP.whatsapp ? `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text || '')}` : '',
  harga: h => (typeof h === 'number' ? 'Rp' + h.toLocaleString('id-ID') : 'Harga via DM'),
  produk: id => KATALOG.find(p => p.id === id),
  eventTeks: () => `${SHOP.event.nama}, ${SHOP.event.lokasi}, ${SHOP.event.hari}, ${SHOP.event.jam}`
};
