const express = require("express");
const pool = require("./db");
const dotenv = require("dotenv");
const app = express();
const session = require("express-session");

dotenv.config();
const apiKeyAuth = require("./middleware/apiKeyAuth");

app.use("/api", apiKeyAuth);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const PORT = process.env.PORT || 3000;

// Session untuk menyimpan query search
app.use((req, res, next) => {
  if (req.method === "POST" && !req.body.query && req.session.lastQuery) {
    req.body.query = req.session.lastQuery;
  }
  next();
});

// Halaman utama (form pencarian)
app.get("/", (req, res) => {
  const sql = `SELECT name, brand, price FROM products`;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send("Gagal mengambil data produk");
    } else {
      res.render("index", { results });
    }
  });
});

// Proses pencarian produk
app.post("/search", (req, res) => {
  const query = req.body.query;
  req.session.lastQuery = query;
  const sql = `SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?)`;
  const search = `%${query}%`;

  pool.query(sql, [search, search], (err, results) => {
    if (err) {
      console.error(err);
      res.send("Error saat pencarian");
    } else {
      res.render("results", { query, results });
    }
  });
});

//  Menambah produk
app.post("/api/add-product", (req, res) => {
  const { name, brand, price, stock_total } = req.body;
  const sql = `INSERT INTO products (name, brand, price, stock_total) VALUES (?, ?, ?, ?)`;

  pool.query(sql, [name, brand, price, stock_total], (err, result) => {
    if (err) {
      console.error(err);
      res.send("Gagal menambahkan produk");
    } else {
      const lastQuery = req.session.lastQuery;
      if (lastQuery) {
        res.redirect(307, "/search"); // Gunakan 307 untuk tetap sebagai POST
      } else {
        res.redirect("/");
      }
    }
  });
});

// Mengedit produk
app.put("/api/product/:id", (req, res) => {
  const { id } = req.params;
  const { name, brand, price, stock_total } = req.body;

  const sql = `UPDATE products SET name = ?, brand = ?, price = ?, stock_total = ? WHERE id = ?`;
  pool.query(sql, [name, brand, price, stock_total, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Gagal mengedit produk");
    } else {
      res.send("Produk berhasil diupdate");
    }
  });
});

// Menghapus produk
app.delete("/api/product/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM products WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Gagal menghapus produk");
    } else {
      res.send("Produk berhasil dihapus");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
