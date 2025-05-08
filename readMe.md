# Electronic Product Search Engine API

## Deskripsi

Proyek ini adalah implementasi **REST API** untuk **search engine produk elektronik**, menggunakan **Node.js** dan **Express** sebagai backend. API ini terhubung dengan **Google Cloud SQL (MySQL)** untuk pengelolaan data produk dan stok.

Fitur yang tersedia:

- Login dan autentikasi menggunakan JWT
- Pencarian produk elektronik
- Menambah, mengedit, dan menghapus data produk (hanya tersedia saat login)
- Session untuk menyimpan hasil pencarian produk

---

## 🔧 Teknologi yang Digunakan

- **Node.js**: Runtime JavaScript untuk backend
- **Express.js**: Framework minimalis untuk membangun API
- **mysql2**: Driver MySQL yang mendukung promise dan prepared statement
- **bcrypt**: Untuk enkripsi dan verifikasi password
- **jsonwebtoken**: Untuk pembuatan dan verifikasi token JWT
- **express-session**: Menyimpan session pencarian produk

---

## ⚙️ Pengelolaan Data & Session

- **Session** digunakan untuk menyimpan hasil pencarian produk terakhir.
- Tombol **Add**, **Edit**, dan **Delete** hanya muncul saat user berhasil login.
- Setelah login berhasil, halaman otomatis direfresh dan username ditampilkan.

---

## 🗂 Format Data

- **POST (Search Engine & Add Product)**:

  - **Format**: `JSON (application/json)`
  - Digunakan untuk pengiriman data form input (menambah produk).
  - **Session**
  - Menyimpan hasil pencarian di session untuk digunalkan kembali.

- **PUT (Edit/Update Product)**:

  - **Format**: `JSON (application/json)`
  - Digunakan untuk mengedit data produk dengan struktur objek yang fleksibel.

- **GET & DELETE (Berdasarkan ID)**:
  - Data diakses melalui **parameter URL** untuk mendapatkan produk atau menghapus produk berdasarkan ID.

---

## 🔌 Koneksi ke Database Google Cloud SQL

- Menggunakan database **MySQL** yang disimpan di **Google Cloud SQL**
- Gunakan **Cloud SQL Proxy** untuk koneksi lokal
- Informasi kredensial disimpan dalam `.env`

Contoh isi `.env`:

```env
DB_HOST=localhost
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=eproduct
SECRET_KEY=your-secret-jwt-key
```

---

## 🔐 Otentikasi & Keamanan

- **Otentikasi dilakukan menggunakan JWT token**:

  - Token disimpan di **localStorage** browser.
  - Token ini kemudian dikirim dalam **Authorization header** untuk mengakses endpoint yang dilindungi.

- **Middleware authenticate()**:

  - Digunakan untuk memverifikasi token dan memastikan user yang terautentikasi dapat mengakses endpoint tertentu seperti **Add**, **Edit**, dan **Delete** produk.

- **Username disimpan di localStorage** untuk ditampilkan di frontend setelah login.

- **Tombol Add, Edit, dan Delete** hanya muncul jika user telah login dan token valid.

---

## 🚀 Instalasi

1. **Clone repository ini:**

   ```bash
   git clone <URL_REPO>
   cd <folder_project>
   ```

2. **Install dependencies:**

### Dependencies yang Diinstal

- **express** – Web framework untuk Node.js
- **mysql2** – Untuk koneksi ke database MySQL
- **dotenv** – Untuk membaca variabel dari file `.env`
- **bcrypt** – Untuk hashing password pengguna
- **jsonwebtoken** – Untuk menghasilkan dan memverifikasi JWT token
- **express-session** – Untuk menyimpan session di sisi server

  ```bash
   npm install
  ```

3. **Buat file .env untuk konfigurasi database:**

   ```bash
   DB_HOST=localhost
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=eproduct
   SECRET_KEY=your-secret-jwt-key
   ```

4. **Jalankan aplikasi:**

   ```bash
   npm start
   ```

---

## 📄 API Endpoints

- **POST /login**: Login untuk mendapat akses menambah, mengedit, dan menghapus produk.
- **GET /products**: Menampilkan daftar produk.
- **POST /product**: Menambah produk baru.
- **PUT /product/:id**: Mengedit produk berdasarkan ID.
- **DELETE /product/:id**: Menghapus produk berdasarkan ID.

---

## Fitur Tambahan

- **Tombol Add, Edit, dan Delete hanya muncul saat user berhasil login**
  Tombol-tombol ini hanya dapat dilihat dan digunakan setelah user berhasil login. Hal ini menjamin bahwa hanya user yang telah terautentikasi yang dapat mengakses fitur pengelolaan produk.

- **Username ditampilkan di UI setelah login**
  Setelah berhasil login, username user akan ditampilkan di UI, memberikan informasi bahwa user sedang terautentikasi.

- **Session hasil pencarian dipertahankan saat halaman di-reload**
  Hasil pencarian produk yang dilakukan oleh user akan disimpan dalam session, sehingga ketika halaman di-refresh, hasil pencarian tersebut tetap muncul tanpa harus melakukan pencarian ulang.

  ## Catatan Frontend (Client)

### Menyimpan Token dan Username di LocalStorage Setelah Login

Setelah pengguna login, token dan username akan disimpan di `localStorage` sebagai berikut:

```js
localStorage.setItem("token", data.token);
localStorage.setItem("username", data.username);
```

### Pengecekan Token di LocalStorage

Tombol Add, Edit, dan Delete hanya tampil jika token tersedia:

```js
if (localStorage.getItem("token")) {
  // tampilkan tombol
}
```

---

# Rencana Pengembangan Lanjutan

## ✅ Middleware Role (admin/user)

- Implementasi middleware untuk membatasi akses berdasarkan peran (role).
- **Admin** dapat mengakses semua fitur (tambah, edit, hapus produk).
- **User** hanya dapat melihat produk dan melakukan pencarian.

## ✅ Pagination untuk Produk

- Menambahkan fitur pagination pada endpoint yang menampilkan daftar produk (`GET /products`).
- Memungkinkan pengguna untuk menampilkan produk dalam jumlah terbatas per halaman.

## 🔜 Validasi Input Produk

- Menambahkan validasi untuk memastikan data produk yang diterima melalui request POST dan PUT adalah valid.
- Validasi meliputi:
  - Nama produk tidak kosong
  - Jenis produk sesuai pilihan
  - Stok tidak negatif

## 🔜 Upload Gambar Produk via Cloud Storage

- Menambahkan fitur untuk mengupload gambar produk ke Cloud Storage (misalnya, Google Cloud Storage atau AWS S3).
- Gambar produk yang diupload akan disimpan di cloud dan link gambar akan disimpan di database produk.
