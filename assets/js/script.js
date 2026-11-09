// Interaksi website: menu mobile, ripple, toast, salin teks, skill highlight, scroll reveal.
document.documentElement.classList.add("js");

// ---- Toast (notifikasi kecil) ----
function tampilkanToast(pesan) {
  let wadah = document.querySelector(".toast-wadah");
  if (!wadah) {
    wadah = document.createElement("div");
    wadah.className = "toast-wadah";
    wadah.setAttribute("role", "status");
    wadah.setAttribute("aria-live", "polite");
    document.body.appendChild(wadah);
  }
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = pesan;
  wadah.appendChild(t);
  setTimeout(() => {
    t.classList.add("keluar");
    setTimeout(() => t.remove(), 320);
  }, 2200);
}

// ---- Salin teks ke clipboard ----
async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = teks;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

// ---- Skill highlight: klik skill -> proyek terkait menyala ----
function terapkanSkill(tombol) {
  const wadah = tombol.closest(".skill-wadah");
  const info = document.getElementById("skill-info");
  const sudahAktif = tombol.getAttribute("aria-pressed") === "true";

  document.querySelectorAll(".skill").forEach((s) => s.setAttribute("aria-pressed", "false"));
  document.querySelectorAll(".proyek").forEach((p) => p.classList.remove("menyala", "redup"));
  document.querySelectorAll(".tag-list li.cocok").forEach((t) => t.classList.remove("cocok"));

  if (sudahAktif) {
    if (info) info.innerHTML = info.dataset.awal;
    return;
  }

  tombol.setAttribute("aria-pressed", "true");
  const kunci = tombol.dataset.skill;
  const nama = tombol.textContent.trim();
  const cocok = [];

  document.querySelectorAll(".proyek").forEach((p) => {
    const dipakai = (p.dataset.skills || "").split(" ").includes(kunci);
    p.classList.add(dipakai ? "menyala" : "redup");
    if (dipakai) {
      cocok.push(p.dataset.nama);
      p.querySelectorAll('.tag-list li[data-skill="' + kunci + '"]').forEach((t) => t.classList.add("cocok"));
    }
  });

  if (info) {
    if (cocok.length) {
      info.innerHTML = "<b>" + nama + "</b> dipakai di: " + cocok.join(" dan ");
    } else {
      info.innerHTML = "<b>" + nama + "</b> " + (tombol.dataset.catatan || "dipakai di berbagai pekerjaan saya.");
    }
  }

  // pada layar kecil, pastikan hasilnya terlihat
  if (cocok.length && wadah && window.innerWidth < 900) {
    const proyek = document.getElementById("proyek");
    if (proyek) proyek.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ---- Klik (delegasi) ----
document.addEventListener("click", async (e) => {
  // menu hamburger
  const toggle = e.target.closest(".nav-toggle");
  if (toggle) {
    const menu = toggle.closest(".navbar").querySelector(".nav-links");
    const terbuka = menu.classList.toggle("buka");
    toggle.setAttribute("aria-expanded", terbuka ? "true" : "false");
    toggle.innerHTML = terbuka ? "&#10005;" : "&#9776;";
    return;
  }

  // skill
  const skill = e.target.closest(".skill");
  if (skill) {
    terapkanSkill(skill);
    return;
  }

  // salin teks
  const salin = e.target.closest("[data-salin]");
  if (salin) {
    const ok = await salinTeks(salin.dataset.salin);
    if (ok) {
      tampilkanToast("Berhasil disalin: " + salin.dataset.salin);
      salin.classList.add("sukses", "tersalin");
      const label = salin.querySelector(".label-salin");
      const awal = label ? label.textContent : "";
      if (label) label.textContent = "Tersalin";
      setTimeout(() => {
        salin.classList.remove("sukses", "tersalin");
        if (label) label.textContent = awal;
      }, 1800);
    } else {
      tampilkanToast("Gagal menyalin, silakan salin manual");
    }
    return;
  }

  // gulir ke bagian tertentu
  const gulir = e.target.closest("[data-gulir]");
  if (gulir) {
    const target = document.querySelector(gulir.dataset.gulir);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // kembali ke atas
  if (e.target.closest(".tombol-atas")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // pesan toast untuk tombol/tautan tertentu
  const pesan = e.target.closest("[data-toast]");
  if (pesan) tampilkanToast(pesan.dataset.toast);
});

// ---- Efek ripple pada tombol ----
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".btn, .chip-aksi, .skill, .btn-salin, .k-btn, .pipe-btn");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const ukuran = Math.max(r.width, r.height);
  const rp = document.createElement("span");
  rp.className = "ripple";
  rp.style.width = rp.style.height = ukuran + "px";
  rp.style.left = e.clientX - r.left - ukuran / 2 + "px";
  rp.style.top = e.clientY - r.top - ukuran / 2 + "px";
  el.appendChild(rp);
  setTimeout(() => rp.remove(), 650);
});

// ---- Navbar berubah saat scroll + tombol kembali ke atas ----
function aturScroll() {
  document.querySelectorAll(".navbar").forEach((n) => n.classList.toggle("scrolled", window.scrollY > 30));
  document.querySelectorAll(".tombol-atas").forEach((b) => b.classList.toggle("tampil", window.scrollY > 500));
}
window.addEventListener("scroll", aturScroll, { passive: true });
aturScroll();

// ---- Animasi muncul saat scroll ----
function lepasReveal(el) {
  const d = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
  setTimeout(() => el.classList.remove("reveal", "tampil"), 900 + d * 1000);
}
const elemen = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const pengamat = new IntersectionObserver((daftar) => {
    daftar.forEach((d) => {
      if (d.isIntersecting) {
        d.target.classList.add("tampil");
        lepasReveal(d.target);
        pengamat.unobserve(d.target);
      }
    });
  }, { threshold: 0.12 });
  elemen.forEach((el) => pengamat.observe(el));
} else {
  elemen.forEach((el) => { el.classList.add("tampil"); lepasReveal(el); });
}

// ---- Spotlight kursor pada kartu kaca ----
const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");
let rafSpot = 0;
document.addEventListener("pointermove", (e) => {
  if (e.pointerType === "touch" || kurangiGerak.matches) return;
  const el = e.target.closest && e.target.closest(".kaca");
  if (!el) return;
  cancelAnimationFrame(rafSpot);
  rafSpot = requestAnimationFrame(() => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  });
});
document.addEventListener("pointerout", (e) => {
  const el = e.target.closest && e.target.closest(".kaca");
  if (el && !el.contains(e.relatedTarget)) {
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  }
});

// ---- Tombol "kembali ke atas" di footer ----
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-atas]")) window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---- Buka entri devlog yang dituju lewat #hash ----
function bukaEntriDariHash() {
  if (!location.hash) return;
  const el = document.querySelector(location.hash);
  if (el && el.tagName === "DETAILS") {
    el.open = true;
    el.scrollIntoView({ block: "center" });
  }
}
bukaEntriDariHash();
window.addEventListener("hashchange", bukaEntriDariHash);


// ---- Progres scroll ----
function aturProgres() {
  const h = document.documentElement;
  const maks = h.scrollHeight - window.innerHeight;
  const p = maks > 0 ? Math.min(1, Math.max(0, window.scrollY / maks)) : 0;
  h.style.setProperty("--p", p.toFixed(4));
}
window.addEventListener("scroll", () => requestAnimationFrame(aturProgres), { passive: true });
window.addEventListener("resize", aturProgres);
aturProgres();

// ---- Tilt 3D kartu proyek ----
document.addEventListener("pointermove", (e) => {
  if (e.pointerType === "touch" || kurangiGerak.matches) return;
  const el = e.target.closest && e.target.closest(".proyek");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
  const sudut = Math.min(1, Math.hypot(nx, ny)) * 6;
  el.style.setProperty("--tilt", (-ny).toFixed(3) + " " + nx.toFixed(3) + " 0 " + sudut.toFixed(2) + "deg");
});
document.addEventListener("pointerout", (e) => {
  const el = e.target.closest && e.target.closest(".proyek");
  if (el && !el.contains(e.relatedTarget)) el.style.removeProperty("--tilt");
});

// ---- Teks hero berganti (efek mengetik) ----
(function () {
  const el = document.getElementById("peran-teks");
  if (!el) return;
  const frasa = (el.dataset.frasa || "").split("|").filter(Boolean);
  if (frasa.length < 2 || kurangiGerak.matches) return; // tampilan statis jika gerak dikurangi
  let f = 0, c = 0, hapus = false;
  el.textContent = "";
  function tik() {
    const teks = frasa[f];
    if (!hapus) {
      c++;
      el.textContent = teks.slice(0, c);
      if (c === teks.length) { hapus = true; return setTimeout(tik, 1900); }
      return setTimeout(tik, 70);
    }
    c--;
    el.textContent = teks.slice(0, c);
    if (c === 0) { hapus = false; f = (f + 1) % frasa.length; return setTimeout(tik, 380); }
    return setTimeout(tik, 38);
  }
  tik();
})();

// ---- Pipeline data skripsi ----
(function () {
  const fig = document.getElementById("pipeline");
  if (!fig) return;
  const tabs = [...fig.querySelectorAll(".pipe-btn")];
  const panels = [...fig.querySelectorAll(".pipe-isi")];
  const play = fig.querySelector(".pipe-play");
  const labelPlay = play.querySelector(".label-play");
  const ikon = play.querySelector(".ikon-play");
  let idx = 0, timer = null;

  // tabel ilustrasi: 15 kolom (Density, BodyFat, 13 fitur) x 9 baris contoh
  fig.querySelectorAll("[data-tabel]").forEach((el) => {
    el.dataset.state = el.dataset.tabel;
    let html = "";
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 15; c++) {
        const kls = c === 0 ? "c-den" : c === 1 ? "c-tgt" : "c-fit";
        const o = (0.55 + ((r * 7 + c * 13) % 5) / 10).toFixed(2);
        html += '<i class="' + kls + '" data-c="' + c + '" style="--o:' + o + '"></i>';
      }
    }
    el.innerHTML = html;
  });

  function setK(k) {
    fig.querySelectorAll('[data-tabel="s3"] i.c-fit').forEach((cell) => {
      cell.classList.toggle("pilih", Number(cell.dataset.c) - 2 < k);
    });
    const info = fig.querySelector(".k-info");
    if (info) info.innerHTML = "<b>k = " + k + "</b> dari 13 fitur dipilih";
    fig.querySelectorAll(".k-btn").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.k) === k)));
  }
  fig.querySelectorAll(".k-btn").forEach((b) => b.addEventListener("click", () => setK(Number(b.dataset.k))));
  setK(5);

  function tampil(i, fokus) {
    idx = i;
    tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.tabIndex = j === i ? 0 : -1;
      t.classList.toggle("lewat", j < i);
    });
    panels.forEach((p, j) => { p.hidden = j !== i; });
    fig.style.setProperty("--w", (((i + 1) / panels.length) * 100).toFixed(1) + "%");
    if (fokus) tabs[i].focus();
  }
  function henti() {
    clearInterval(timer);
    timer = null;
    play.setAttribute("aria-pressed", "false");
    labelPlay.textContent = idx === panels.length - 1 ? "Ulangi" : "Putar otomatis";
    ikon.innerHTML = "&#9654;";
  }
  function mulai() {
    if (idx === panels.length - 1) tampil(0);
    play.setAttribute("aria-pressed", "true");
    labelPlay.textContent = "Jeda";
    ikon.innerHTML = "&#10074;&#10074;";
    timer = setInterval(() => {
      tampil(idx + 1);
      if (idx >= panels.length - 1) henti();
    }, 4200);
  }
  tabs.forEach((t, j) => {
    t.addEventListener("click", () => { if (timer) henti(); tampil(j); });
    t.addEventListener("keydown", (e) => {
      const n = tabs.length;
      let k = null;
      if (e.key === "ArrowRight") k = (j + 1) % n;
      else if (e.key === "ArrowLeft") k = (j - 1 + n) % n;
      else if (e.key === "Home") k = 0;
      else if (e.key === "End") k = n - 1;
      if (k !== null) { e.preventDefault(); if (timer) henti(); tampil(k, true); }
    });
  });
  play.addEventListener("click", () => (timer ? henti() : mulai()));
  tampil(0);
})();

// ---- Simulasi alur percakapan NATA ----
(function () {
  const wadah = document.querySelector(".sim");
  const arsi = document.querySelector(".arsi");
  if (!wadah || !arsi) return;
  const NAMA = {
    pengguna: "Pengguna", inti: "Inti NATA", memori: "Memori berlapis", planner: "Perencana tugas",
    tool: "Registry tool", sqlite: "SQLite", chroma: "ChromaDB", ollama: "Ollama"
  };
  const SKENARIO = {
    ingatan: [
      { n: "pengguna", t: "“Apa yang kita bahas soal skripsi kemarin?”", tipe: "user" },
      { n: "inti", t: "NATA menerima pesan dan memutuskan perlu membuka ingatan." },
      { n: "memori", t: "Memori berlapis mencari catatan yang relevan, termasuk riwayat dan tingkat keyakinannya." },
      { n: "chroma", t: "Pencarian vektor menemukan catatan yang maknanya paling dekat." },
      { n: "sqlite", t: "Detail catatan diambil dari penyimpanan terstruktur." },
      { n: "ollama", t: "Model bahasa lokal menyusun jawaban dari ingatan yang ditemukan." },
      { n: "pengguna", t: "Jawaban dikirim kembali. Semua diproses di perangkat sendiri.", tipe: "jawab" }
    ],
    tugas: [
      { n: "pengguna", t: "“Bantu aku menyusun rencana belajar minggu ini.”", tipe: "user" },
      { n: "inti", t: "NATA menilai permintaan ini butuh beberapa langkah." },
      { n: "planner", t: "Perencana tugas memecahnya menjadi graf langkah yang saling bergantung." },
      { n: "tool", t: "Tool read-only dijalankan di dalam sandbox untuk mengumpulkan informasi." },
      { n: "sqlite", t: "Status tiap langkah disimpan, sehingga bisa dilanjutkan jika terhenti." },
      { n: "ollama", t: "Model bahasa lokal menyusun rencana dari hasil langkah-langkah tadi." },
      { n: "pengguna", t: "Rencana dikirim kembali ke pengguna.", tipe: "jawab" }
    ]
  };
  const btnMain = wadah.querySelector(".sim-main");
  const label = btnMain.querySelector(".label-sim");
  const ikon = btnMain.querySelector(".ikon-play");
  const log = wadah.querySelector(".sim-log");
  const skBtns = [...wadah.querySelectorAll(".k-btn")];
  const panah = arsi.querySelectorAll(".arsi-panah");
  let sk = "ingatan", token = 0, jalan = false;

  const cari = (n) => arsi.querySelector('[data-n="' + n + '"]');
  const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
  function bersih() {
    arsi.querySelectorAll(".aktif").forEach((e) => e.classList.remove("aktif"));
    panah.forEach((p) => p.classList.remove("hidup"));
  }
  function atur(n) {
    bersih();
    const e = cari(n);
    if (e) e.classList.add("aktif");
    const bawah = ["sqlite", "chroma", "ollama"].includes(n);
    const tengah = ["inti", "memori", "planner", "tool"].includes(n);
    if (panah[0] && (tengah || bawah)) panah[0].classList.add("hidup");
    if (panah[1] && bawah) panah[1].classList.add("hidup");
  }
  function setTombol(sedang, selesai) {
    label.textContent = sedang ? "Hentikan" : selesai ? "Ulangi simulasi" : "Simulasikan percakapan";
    ikon.innerHTML = sedang ? "&#9632;" : "&#9654;";
    btnMain.setAttribute("aria-pressed", sedang ? "true" : "false");
  }
  async function jalankan() {
    const saya = ++token;
    jalan = true;
    log.innerHTML = "";
    setTombol(true);
    for (const langkah of SKENARIO[sk]) {
      if (saya !== token) return;
      atur(langkah.n);
      const li = document.createElement("li");
      if (langkah.tipe) li.className = langkah.tipe;
      const b = document.createElement("b");
      b.textContent = NAMA[langkah.n];
      li.appendChild(b);
      li.appendChild(document.createTextNode(langkah.t));
      log.appendChild(li);
      await tidur(1500);
    }
    if (saya !== token) return;
    bersih();
    jalan = false;
    setTombol(false, true);
  }
  function hentikan() {
    token++;
    jalan = false;
    bersih();
    setTombol(false);
  }
  btnMain.addEventListener("click", () => (jalan ? hentikan() : jalankan()));
  skBtns.forEach((b) => b.addEventListener("click", () => {
    sk = b.dataset.sk;
    skBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    hentikan();
    log.innerHTML = "";
  }));
})();


// ---- Peta tanggung jawab model layanan (Materi) ----
(function () {
  const fig = document.getElementById("peta-model");
  if (!fig) return;
  const PEMILIK = {
    onprem: ["aplikasi", "data", "runtime", "os", "virt", "server", "jaringan"],
    iaas: ["aplikasi", "data", "runtime", "os"],
    paas: ["aplikasi", "data"],
    saas: []
  };
  const TEKS = {
    onprem: "Tanpa cloud, semua lapisan dibeli, dipasang, dan dirawat sendiri.",
    iaas: "IaaS: penyedia mengurus perangkat keras dan virtualisasi. Sistem operasi dan ke atas tetap tanggung jawab pengguna.",
    paas: "PaaS: pengguna fokus pada aplikasi dan datanya. Sistem operasi dan runtime dikelola penyedia.",
    saas: "SaaS: hampir seluruh lapisan dikelola penyedia. Pengguna tetap mengatur akses dan isi datanya sendiri."
  };
  const rows = [...fig.querySelectorAll(".lapis")];
  const btns = [...fig.querySelectorAll(".k-btn")];
  const ringkas = fig.querySelector(".model-ringkas");
  function pilih(m) {
    rows.forEach((r) => {
      const anda = PEMILIK[m].includes(r.dataset.lapis);
      r.classList.toggle("anda", anda);
      r.classList.toggle("penyedia", !anda);
      r.querySelector(".lapis-pemilik").textContent = anda ? "Anda" : "Penyedia";
    });
    btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.model === m)));
    ringkas.innerHTML = "<strong>Anda mengelola " + PEMILIK[m].length + " dari " + rows.length + " lapisan.</strong> " + TEKS[m];
  }
  btns.forEach((b) => b.addEventListener("click", () => pilih(b.dataset.model)));
  pilih("iaas");
})();

// ---- Riwayat versi mengikuti lencana versi di footer ----
(function () {
  const daftar = document.getElementById("riwayat-daftar");
  const lencana = document.querySelector(".footer .versi");
  if (!daftar || !lencana) return;
  const m = lencana.textContent.match(/(\d+\.\d+)/);
  if (!m) return;
  const sekarang = parseFloat(m[1]);
  daftar.querySelectorAll(".riwayat-item").forEach((li) => {
    const v = parseFloat(li.dataset.versi);
    const chip = li.querySelector("[data-status]");
    chip.className = "status-chip " + (v === sekarang ? "selesai" : v < sekarang ? "" : "rencana");
    chip.textContent = v === sekarang ? "Saat ini" : v < sekarang ? "Sebelumnya" : "Berikutnya";
  });
})();
