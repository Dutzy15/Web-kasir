# KasirKu — Web Kasir Sederhana

Aplikasi kasir statis menggunakan HTML, CSS, dan JavaScript. Bisa di-host gratis dengan GitHub Pages.

## Fitur
- Login demo (nama kasir bebas, PIN `1234`)
- Daftar menu dan pencarian produk
- Keranjang belanja dan pengaturan jumlah
- Hitung total, pembayaran, dan kembalian
- Simpan transaksi dan lihat riwayat
- Cetak struk dan ekspor riwayat ke CSV
- Data tersimpan di `localStorage` browser

## Cara menjalankan
Buka `index.html` di browser. Tidak membutuhkan instalasi atau database.

## Cara upload ke GitHub Pages
1. Login atau daftar di https://github.com
2. Klik **New repository**, beri nama misalnya `web-kasir`, pilih **Public**, lalu **Create repository**.
3. Klik **Add file → Upload files**.
4. Upload `index.html`, `style.css`, `app.js`, dan `README.md` dari folder ini.
5. Klik **Commit changes**.
6. Buka **Settings → Pages**.
7. Pada **Build and deployment**, pilih **Deploy from a branch**.
8. Pilih branch **main** dan folder **/(root)**, lalu klik **Save**.
9. Tunggu proses selesai. Alamat web akan muncul di halaman Pages, biasanya `https://USERNAME.github.io/web-kasir/`.

## Catatan penting
Versi ini menyimpan data di browser/perangkat yang digunakan, bukan di server. Riwayat tidak otomatis tersinkron ke perangkat lain dan dapat hilang jika data browser dihapus. Login PIN ini hanya contoh tampilan, bukan sistem keamanan untuk penggunaan bisnis sungguhan. Untuk multi-kasir, sinkronisasi, backup online, dan keamanan, perlu backend serta database.
