function openModal() {
  document.getElementById("productModal").style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

// Controll DOM
// Cek apakah sudah login
if (localStorage.getItem("token")) {
  showUserSection();
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      alert("Login berhasil!");
      closeLoginModal();
      location.reload();
    } else {
      alert("Login gagal!");
    }
  });

// verify add, edit, delete button with login auth
function toggleAuthElements() {
  const isLoggedIn = localStorage.getItem("token") !== null;

  const authOnlyElements = document.querySelectorAll(".auth-only");
  authOnlyElements.forEach((el) => {
    el.style.display = isLoggedIn ? "block" : "none";
  });
}

// Jalankan saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
  toggleAuthElements();
});

// Tampilkan bagian setelah login
function showUserSection() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("user-section").style.display = "block";
  document.getElementById("welcome").innerText =
    "Login sebagai: " + localStorage.getItem("username");
}

function showAuthSection() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("user-section").style.display = "none";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  showAuthSection();
  location.reload();
}

// Service Route

function addProduct(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const form = e.target;
  const data = {
    name: form.name.value,
    brand: form.brand.value,
    price: form.price.value,
    stock_total: form.stock_total.value,
  };

  const res = fetch("/add-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert("Produk ditambahkan!");
  } else {
    alert("Gagal menambahkan produk");
  }
}

function deleteProduct(id) {
  const token = localStorage.getItem("token");

  if (confirm("Yakin ingin menghapus produk ini?")) {
    fetch(`/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        alert("Produk berhasil dihapus");
        location.reload(); // refresh hasil pencarian
      } else {
        alert("Gagal menghapus produk");
      }
    });
  }
}

function editProduct(e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const brand = document.getElementById("editBrand").value;
  const price = document.getElementById("editPrice").value;
  const stock_total = document.getElementById("editStock").value;
  const token = localStorage.getItem("token");

  fetch(`/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, brand, price, stock_total }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Produk berhasil diedit");
        closeEditModal();
        location.reload(); // refresh hasil pencarian
      } else {
        alert("Gagal mengedit produk");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengedit produk");
    });
}

window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function openEditModal(id, name, brand, price, stock_total) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editBrand").value = brand;
  document.getElementById("editPrice").value = price;
  document.getElementById("editStock").value = stock_total;
  document.getElementById("editModal").style.display = "block";
}
