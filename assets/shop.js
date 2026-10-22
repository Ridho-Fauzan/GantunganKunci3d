// ===================================================================
//  Data toko & katalog. Edit file ini untuk mengganti nama, kontak,
//  produk, dan harga. Dipakai oleh index.html, katalog.html, preorder.html
// ===================================================================
window.SHOP = {
  nama: 'Toko Aksesoris Persahabatan',
  instagram: 'toko.aksesoris.persahabatan',
  // Nomor WhatsApp format internasional tanpa "+" atau spasi, contoh: '6281234567890'.
  // Kosongkan ('') kalau pesanan hanya lewat DM Instagram.
  whatsapp: '',
  catatanPO: 'Pre-order diproses setelah desain dikonfirmasi lewat DM. Estimasi pengerjaan dikonfirmasi admin.'
};

// harga: angka dalam Rupiah (contoh 15000), atau null untuk menampilkan "Harga via DM"
// preset: tampilan yang dibuka di editor 3D (index.html?preset=...)
window.KATALOG = [
  {
    id: 'hati', nama: 'Akrilik Hati + Nama', kategori: 'akrilik', preset: 'hati', harga: null,
    gambar: 'katalog/hati.jpg', spek: '60 mm · tebal 4 mm · glossy',
    deskripsi: 'Bentuk hati dengan tulisan nama timbul di kedua sisi. Pilih warna sesukamu.'
  },
  {
    id: 'bintang', nama: 'Bintang Metalik', kategori: 'metal', preset: 'bintang', harga: null,
    gambar: 'katalog/bintang.jpg', spek: '60 mm · tebal 4 mm · metalik',
    deskripsi: 'Bintang dengan finishing metalik mengilap dan tulisan timbul.'
  },
  {
    id: 'tag', nama: 'Tag Nama', kategori: 'akrilik', preset: 'tag', harga: null,
    gambar: 'katalog/tag.jpg', spek: '60 mm · tebal 4 mm · glossy',
    deskripsi: 'Tag persegi rounded, cocok untuk nama, inisial, atau kode kelas.'
  },
  {
    id: 'bulat', nama: 'Bulat Bening', kategori: 'akrilik', preset: 'bulat', harga: null,
    gambar: 'katalog/bulat.jpg', spek: '60 mm · tebal 4 mm · bening',
    deskripsi: 'Akrilik bening bentuk bulat dengan tulisan putih.'
  },
  {
    id: 'custom', nama: 'Akrilik Custom Logo', kategori: 'custom', preset: 'custom', harga: null,
    gambar: 'katalog/custom.jpg', spek: 'ukuran bebas · bentuk ikut outline',
    deskripsi: 'Kirim logo / gambarmu, bentuk akrilik dipotong mengikuti outline gambar.'
  },
  {
    id: 'chrome-emas', nama: 'Chrome + Emas Timbul', kategori: 'metal', preset: 'chrome-emas', harga: null,
    gambar: 'katalog/chrome-emas.jpg', spek: 'ukuran bebas · chrome + emas',
    deskripsi: 'Badan chrome mengilap dengan artwork emas timbul. Paling premium.'
  },
  {
    id: 'bundle', nama: 'Bundle Bestie (3 gantungan)', kategori: 'bundle', preset: 'bundle', harga: null,
    gambar: 'katalog/bundle.jpg', spek: '3 gantungan · 1 ring',
    deskripsi: 'Tiga gantungan berbeda dalam satu ring. Cocok buat kado persahabatan.'
  }
];

window.SHOP_UTIL = {
  igUrl: () => `https://www.instagram.com/${SHOP.instagram}/`,
  igDmUrl: () => `https://ig.me/m/${SHOP.instagram}`,
  waUrl: text => SHOP.whatsapp ? `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text || '')}` : '',
  harga: h => (typeof h === 'number' ? 'Rp' + h.toLocaleString('id-ID') : 'Harga via DM'),
  produk: id => KATALOG.find(p => p.id === id)
};
