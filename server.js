const express = require("express");
const pool = require("./db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const session = require("express-session");

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
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

// Route Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }

      const user = results[0];

      // Bandingkan password menggunakan bcrypt
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Compare error:", err);
          return res
            .status(500)
            .json({ message: "Error saat membandingkan password" });
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Password salah" });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          SECRET_KEY,
          { expiresIn: "2h" }
        );

        res.json({
          token,
          username: user.username,
        });
      });
    }
  );
});

// auth token route
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

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
app.post("/add-product", authenticate, (req, res) => {
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
app.put("/product/:id", authenticate, (req, res) => {
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
app.delete("/product/:id", authenticate, (req, res) => {
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
