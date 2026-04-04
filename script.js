// VARIABEL GLOBAL
let slideIndex = 0;
let rekapData = [];
let failedAdminAttempts = 0;

// 1. NAVIGASI LANDING PAGE
function showRegister() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
}

function showLogin() {
  document.getElementById("register-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
}

// 2. LOGIKA LOGIN DENGAN DETEKSI ROLE
function validateLogin() {
  const idInput = document.getElementById("employeeID").value.toUpperCase();
  const name = document.getElementById("employeeName").value;
  const pass = document.getElementById("password").value;
  const errorDisplay = document.getElementById("error-text");

  function showError(message) {
    errorDisplay.innerText = message;
    errorDisplay.style.display = "block";
  }

  errorDisplay.style.display = "none";

  if (!idInput || !name || !pass) {
    showError("Harap lengkapi seluruh data logon!");
    return;
  }

  if (pass.length < 6) {
    showError("Password minimal 6 karakter!");
    return;
  }

  const prefix = idInput.substring(0, 3);
  if (prefix === "ADM") {
    showDashboardRole("ADM", name);
  } else if (prefix === "STF") {
    showDashboardRole("STF", name);
  } else {
    failedAdminAttempts++;
    showError("ID tidak valid! Gunakan awalan ADM atau STF.");
    return;
  }

  document.getElementById("main-app").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  showForm("dashboard-home");
  showSlides();
}

// 3. PENGATURAN TAMPILAN BERDASARKAN ROLE
function showDashboardRole(role, name) {
  const userDisplay = document.getElementById("user-display");
  const menuTransaksi = document.getElementById("menu-transaksi");
  const menuLaporan = document.getElementById("menu-laporan");
  const adminAlert = document.getElementById("admin-alert");

  userDisplay.innerText = name + " (" + role + ")";

  if (role === "ADM") {
    menuTransaksi.style.display = "inline-block";
    menuLaporan.style.display = "inline-block";
    if (failedAdminAttempts > 0) adminAlert.style.display = "block";
  } else {
    menuTransaksi.style.display = "none";
    menuLaporan.style.display = "none";
    adminAlert.style.display = "none";
  }
}

// 4. SLIDER AUTO FADE
function showSlides() {
  let slides = document.getElementsByClassName("slide-card");
  if (slides.length === 0) return;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000);
}

// 5. NAVIGASI MENU DASHBOARD
function showForm(formId) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    if (card.id !== "admin-alert") card.style.display = "none";
  });

  const target = document.getElementById(formId);
  if (target) target.style.display = "block";
}

// 6. PROSES EVALUASI TAM (MENGHITUNG 10 INDIKATOR)
function submitTAM() {
  // Mengambil semua jawaban PU (1-5) dan PEOU (1-5)
  const getVal = (name) => {
    const rb = document.querySelector(`input[name="${name}"]:checked`);
    return rb ? parseInt(rb.value) : null;
  };

  const puScores = [
    getVal("pu1"),
    getVal("pu2"),
    getVal("pu3"),
    getVal("pu4"),
    getVal("pu5"),
  ];
  const peouScores = [
    getVal("peou1"),
    getVal("peou2"),
    getVal("peou3"),
    getVal("peou4"),
    getVal("peou5"),
  ]; // Validasi apakah semua sudah diisi

  if (puScores.includes(null) || peouScores.includes(null)) {
    alert("Mohon lengkapi ke-10 pernyataan kuesioner!");
    return;
  } // Menghitung Rata-rata per Variabel

  const avgPU = puScores.reduce((a, b) => a + b) / 5;
  const avgPEOU = peouScores.reduce((a, b) => a + b) / 5;
  const totalY = (avgPU + avgPEOU) / 2; // Variabel Y (Kepuasan)
  // Tampilkan Skor Akhir

  document.getElementById("status-rating").innerText =
    totalY.toFixed(1) + " / 5.0"; // Logika Rekomendasi Berdasarkan Analisis Masalah

  let rekomendasi = "";
  if (totalY >= 4.0) {
    rekomendasi =
      "<strong>Rekomendasi:</strong> Kepuasan Tinggi. Pertahankan kualitas layanan digital dan lakukan pemeliharaan rutin.";
  } else if (avgPEOU < 3.5) {
    rekomendasi =
      "<strong>Rekomendasi:</strong> Perlu perbaikan antarmuka (UI/UX) karena skor kemudahan (PEOU) rendah. Staf memerlukan navigasi yang lebih sederhana.";
  } else {
    rekomendasi =
      "<strong>Rekomendasi:</strong> Skor kegunaan (PU) rendah. Pastikan fitur aplikasi benar-benar membantu percepatan input data kargo.";
  } // Simpan ke Rekapitulasi Laporan

  const name = document.getElementById("employeeName").value;
  rekapData.push({
    name: name,
    pu: avgPU.toFixed(1),
    peou: avgPEOU.toFixed(1),
    total: totalY.toFixed(1),
  });

  updateTabelRekap();
  document.getElementById("rekomendasi-teks").innerHTML = rekomendasi;
  showForm("hasil-tam");
  alert("Data evaluasi Anda telah terkirim dan dianalisis secara statistik.");
}

// 7. UPDATE TABEL REKAPITULASI (OTOMATIS)
function updateTabelRekap() {
  const tbody = document.getElementById("table-rekap-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  rekapData.forEach((data) => {
    let row = `<tr>
 <td>${data.name}</td>
<td>${data.pu}</td>
<td>${data.peou}</td>
<td>${data.total}</td>
</tr>`;
    tbody.innerHTML += row;
  });
}

// FUNGSI UNTUK MENGATUR TANGGAL OTOMATIS
function setAutomaticDate() {
  const dateElement = document.getElementById("print-date");
  if (dateElement) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const today = new Date(); // Format: 2 April 2026 (sesuai bahasa Indonesia)

    dateElement.innerText = today.toLocaleDateString("id-ID", options);
  }
}

function showForm(formId) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    if (card.id !== "admin-alert") card.style.display = "none";
  });

  const target = document.getElementById(formId);
  if (target) {
    target.style.display = "block"; // JIKA YANG DIBUKA ADALAH LAPORAN, UPDATE TANGGALNYA

    if (formId === "hasil-tam" || formId === "laporan-rekap") {
      setAutomaticDate();
    }
  }
}
