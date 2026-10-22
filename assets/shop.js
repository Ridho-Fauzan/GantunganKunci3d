// ===================================================================
//  Data toko & katalog. Edit file ini untuk mengganti nama, kontak,
//  produk, dan harga. Dipakai oleh index.html, katalog.html, preorder.html
// ===================================================================
window.SHOP = {
  nama: 'Toko Aksesoris Persahabatan',
  tagline: 'Band Merch · Keychain Custom',
  instagram: 'toko.aksesoris.persahabatan',
  // Nomor WhatsApp format internasional tanpa "+" atau spasi, contoh: '6281234567890'.
  // Kosongkan ('') kalau pesanan hanya lewat DM Instagram.
  whatsapp: '',
  catatanPO: 'Pre-order diproses setelah desain dikonfirmasi lewat DM. Estimasi pengerjaan dikonfirmasi admin.'
};

// harga: angka dalam Rupiah (contoh 15000), atau null untuk menampilkan "Harga via DM"
// preset: tampilan yang dibuka di editor 3D (index.html?preset=...)
// badge: label kecil di pojok gambar (opsional)
window.KATALOG = [
  {
    id: 'pick', nama: 'Pick Gitar + Nama Band', kategori: 'akrilik', preset: 'pick', harga: null, badge: 'Best seller',
    gambar: 'katalog/pick.jpg', spek: '50–60 mm · tebal 3–4 mm · glossy',
    deskripsi: 'Bentuk pick gitar dengan nama band atau nama kamu timbul di kedua sisi.'
  },
  {
    id: 'custom', nama: 'Logo Band Custom', kategori: 'custom', preset: 'custom', harga: null, badge: 'Custom',
    gambar: 'katalog/custom.jpg', spek: 'ukuran bebas · bentuk ikut outline',
    deskripsi: 'Kirim logo bandmu, akrilik dipotong mengikuti outline logo. Cocok untuk merch gig.'
  },
  {
    id: 'chrome-emas', nama: 'Chrome + Emas Timbul', kategori: 'metal', preset: 'chrome-emas', harga: null, badge: 'Premium',
    gambar: 'katalog/chrome-emas.jpg', spek: 'ukuran bebas · chrome + emas',
    deskripsi: 'Badan chrome mengilap dengan logo emas timbul. Vibes rockstar.'
  },
  {
    id: 'tag', nama: 'Backstage Pass', kategori: 'akrilik', preset: 'tag', harga: null,
    gambar: 'katalog/tag.jpg', spek: '60 mm · tebal 4 mm · glossy',
    deskripsi: 'Tag ala kartu backstage: CREW, VIP, nama, atau tanggal konser.'
  },
  {
    id: 'bintang', nama: 'Rockstar Metalik', kategori: 'metal', preset: 'bintang', harga: null,
    gambar: 'katalog/bintang.jpg', spek: '60 mm · tebal 4 mm · metalik',
    deskripsi: 'Bintang finishing metalik dengan tulisan timbul.'
  },
  {
    id: 'hati', nama: 'Love Rock', kategori: 'akrilik', preset: 'hati', harga: null,
    gambar: 'katalog/hati.jpg', spek: '60 mm · tebal 4 mm · glossy',
    deskripsi: 'Hati merah dengan tulisan timbul, buat kamu yang cinta musik keras.'
  },
  {
    id: 'bulat', nama: 'Encore Badge', kategori: 'akrilik', preset: 'bulat', harga: null,
    gambar: 'katalog/bulat.jpg', spek: '60 mm · tebal 4 mm · glossy',
    deskripsi: 'Akrilik bulat hitam glossy, cocok untuk nama lagu, setlist, atau tanggal gig.'
  },
  {
    id: 'bundle', nama: 'Bundle Personel Band (4 pcs)', kategori: 'bundle', preset: 'bundle', harga: null, badge: 'Bundle',
    gambar: 'katalog/bundle.jpg', spek: '4 gantungan · 1 ring',
    deskripsi: 'Satu ring isi 4: VOX, GTR, BASS, DRUM. Bisa diganti nama personel bandmu.'
  }
];

window.SHOP_UTIL = {
  igUrl: () => `https://www.instagram.com/${SHOP.instagram}/`,
  igDmUrl: () => `https://ig.me/m/${SHOP.instagram}`,
  waUrl: text => SHOP.whatsapp ? `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text || '')}` : '',
  harga: h => (typeof h === 'number' ? 'Rp' + h.toLocaleString('id-ID') : 'Harga via DM'),
  produk: id => KATALOG.find(p => p.id === id)
};
