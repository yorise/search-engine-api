# Electronic Product Search Engine API

## Deskripsi

Proyek ini adalah implementasi **REST API** untuk **search engine produk elektronik**, dengan menggunakan **Node.js** dan **Express** sebagai server backend. API ini terhubung dengan **Google Cloud SQL** (MySQL) untuk pengelolaan data produk dan stok. Fitur yang tersedia antara lain pencarian produk, penambahan produk baru, pengeditan produk, dan penghapusan produk.

---

## 🔧 Framework dan Teknologi yang Digunakan

- **Node.js**: JavaScript runtime untuk server-side.
- **Express.js**: Framework web untuk Node.js untuk membangun RESTful API.
- **mysql2**: Untuk menghubungkan dan menjalankan query ke database **MySQL** di **Google Cloud SQL**.
- **express-session**: Middleware untuk pengelolaan session, menyimpan data sementara hasil pencarian produk.

---

## ⚙️ Pengelolaan Data & Session

- **Session** digunakan untuk menyimpan hasil pencarian sementara pada aplikasi.
- Setelah melakukan aksi seperti **menambah**, **mengedit**, atau **menghapus** data, halaman akan direfresh, dan hasil pencarian sebelumnya tetap dapat ditampilkan berkat penggunaan session.

---

## 🗂 Format Data

- **POST (Search Engine & Add Product)**:

  - **Format**: `x-www-form-urlencoded`
  - Digunakan untuk pengiriman data form input (misal: pencarian produk, menambah produk).

- **PUT (Edit/Update Product)**:

  - **Format**: `JSON (application/json)`
  - Digunakan untuk mengedit data produk dengan struktur objek yang fleksibel.

- **GET & DELETE (Berdasarkan ID)**:
  - Data diakses melalui **parameter URL** untuk mendapatkan produk atau menghapus produk berdasarkan ID.

---

## 🔌 Koneksi ke Database Google Cloud SQL

- **Google Cloud SQL** digunakan sebagai database untuk menyimpan informasi produk dan stok.
- **Cloud SQL Proxy** digunakan untuk menghubungkan server dengan database di Google Cloud.
- **Keamanan**:
  - Koneksi diamankan menggunakan **file kunci API** dari Google Cloud.
  - Pembatasan **IP akses** hanya diizinkan untuk server API, menghindari akses publik.
  - **Konfigurasi `.env`** digunakan untuk menyimpan kredensial, bukan hardcode di dalam kode sumber.

---

## 🔒 Keamanan Server

- **Header Keamanan**:
  - **CORS**: Mengatur izin akses dari domain tertentu.
  - **Custom API Key**: Digunakan di header untuk memastikan hanya client yang sah yang dapat mengakses API.

Dengan langkah-langkah ini, aplikasi dilindungi dari akses yang tidak sah dan penyalahgunaan.

---

## 🚀 Instalasi

1. **Clone repository ini:**

   ```bash
   git clone <URL_REPO>
   cd <folder_project>
   ```

2. **Install dependencies:**

   ```bash
    npm install
   ```

3. **Buat file .env untuk konfigurasi database:**

   ```bash
   DB_HOST=localhost
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=eproduct
   API_KEY=my-secret-api-key
   ```

4. **Jalankan aplikasi:**

   ```bash
   npm start
   ```

---

## 📄 API Endpoints

- **GET /products**: Menampilkan daftar produk.
- **POST /api/product**: Menambah produk baru.
- **PUT /api/product/:id**: Mengedit produk berdasarkan ID.
- **DELETE /api/product/:id**: Menghapus produk berdasarkan ID.

---
