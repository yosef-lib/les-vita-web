"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

/* ===== Intersection Observer Hook ===== */
function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const ref = (el: HTMLElement | null) => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
  };
  return { ref, inView };
}

/* ===== Data ===== */
const testimonials = [
  {
    name: "Ibu Rahmawati",
    role: "Mama dari Alif (SD Kelas 5)",
    quote: "Sejak les di Les Vita, Alif jadi jauh lebih percaya diri. Nilai matematikanya naik dari 65 menjadi 92! Pengajarnya sabar dan ramah banget sama anak-anak.",
    impact: "Peringkat 15 ➔ Peringkat 2 Kelas",
    stars: 5,
  },
  {
    name: "Ibu Maya Kartika",
    role: "Mama dari Dimas (SMP Kelas 8)",
    quote: "Laporan belajar rutin via WA sangat membantu kami pantau perkembangan Dimas. Anak senang belajar, gak lagi tertekan. Modul latihannya juga bagus!",
    impact: "Disiplin Belajar Meningkat Pesat",
    stars: 5,
  },
  {
    name: "Bapak Surya Pratama",
    role: "Papa dari Nadia (SD Kelas 3)",
    quote: "Nadia dulu takut matematika, sekarang malah semangat minta belajar. Les Vita paham cara mengajar anak kecil yang fun dan gak bikin stres.",
    impact: "Nilai Matematika 60 ➔ 88",
    stars: 5,
  },
  {
    name: "Ibu Lestari",
    role: "Mama dari Kevin (SMP Kelas 7)",
    quote: "Pengingat jadwal les lewat WA sangat membantu karena kami berdua bekerja. Kevin jadi disiplin belajar sendiri dan nilainya meningkat di semua mata pelajaran.",
    impact: "Ranking Naik 10 Peringkat",
    stars: 5,
  },
];



type ProgramTab = "sd" | "smp";

const programs: Record<ProgramTab, { icon: string; title: string; desc: string; price: string }[]> = {
  sd: [
    { icon: "🧒", title: "Calistung & Karakter (PAUD-Kelas 3)", desc: "Metode belajar sambil bermain untuk membaca, menulis, berhitung. Membangun karakter percaya diri sejak dini.", price: "Rp 250rb/bln" },
    { icon: "📐", title: "Matematika & IPA Cerdas SD", desc: "Memperkuat konsep dasar perhitungan, soal cerita, dan persiapan asesmen nasional sekolah dasar.", price: "Rp 350rb/bln" },
    { icon: "🇬🇧", title: "English Fun for Kids", desc: "Latihan percakapan bahasa Inggris dasar, vocabulary, dan cerita anak interaktif. Seru dan menyenangkan!", price: "Rp 300rb/bln" },
    { icon: "📚", title: "Les Semua Mapel SD (Kelas 4-6)", desc: "Pendampingan lengkap semua mata pelajaran SD, termasuk persiapan ujian semester dan asesmen nasional.", price: "Rp 400rb/bln" },
  ],
  smp: [
    { icon: "🧮", title: "Matematika & IPA SMP", desc: "Bedah aljabar, geometri, fisika dasar dengan rumus sakti dan trik pengerjaan soal yang mudah dipahami.", price: "Rp 400rb/bln" },
    { icon: "🏆", title: "Persiapan OSN & Lomba Sains", desc: "Pendampingan intensif bagi siswa berprestasi yang menargetkan medali olimpiade sains tingkat kota/nasional.", price: "Rp 500rb/bln" },
    { icon: "📝", title: "Sukses Ujian Sekolah SMP", desc: "Pembahasan bank soal ujian semester dan persiapan masuk SMA favorit impian anak.", price: "Rp 450rb/bln" },
    { icon: "🇬🇧", title: "Bahasa Inggris SMP", desc: "Grammar, reading comprehension, dan conversation practice untuk mengasah kemampuan bahasa Inggris.", price: "Rp 400rb/bln" },
  ],
};

const features = [
  { icon: "👨‍🏫", title: "Tutor Ramah & Sabar", desc: "Pengajar yang mengerti cara mengajar anak-anak dengan pendekatan yang fun dan tidak menekan." },
  { icon: "📲", title: "Laporan ke WA Orang Tua", desc: "Orang tua mendapat notifikasi jadwal les dan laporan perkembangan belajar anak langsung ke WhatsApp." },
  { icon: "📊", title: "Laporan Progres Berkala", desc: "Pantau perkembangan anak secara transparan. Setiap bulan orang tua mendapat laporan visual detail." },
  { icon: "📖", title: "Modul Latihan Lengkap", desc: "Tersedia modul sakti, bank soal, dan worksheet printable yang bisa dipakai latihan mandiri di rumah." },
];

const stats = [
  { value: "500+", label: "Siswa Aktif" },
  { value: "98%", label: "Orang Tua Puas" },
  { value: "15+", label: "Tutor Berpengalaman" },
  { value: "5 Tahun", label: "Berpengalaman" },
];

/* ===== Star Component ===== */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}


/* ===== Main Page ===== */
export default function Home() {
  const [activeTab, setActiveTab] = useState<ProgramTab>("sd");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroSection = useInView();
  const featureSection = useInView();
  const testimonialSection = useInView();
  const programSection = useInView();
  const storeSection = useInView();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Les Vita - Bimbingan Belajar SD & SMP",
    description: "Bimbingan Belajar & Les Privat SD dan SMP dengan Tutor Ramah, Laporan Berkala ke WA Orang Tua, dan Modul Latihan Lengkap.",
    url: "https://lesvita.com",
    telephone: "+6281234567890",
    address: { "@type": "PostalAddress", addressCountry: "ID" },
    sameAs: ["https://instagram.com/lesvita.official"],
  };

  const navLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#keunggulan", label: "Keunggulan" },
    { href: "#testimoni", label: "Testimoni" },
    { href: "#program", label: "Program Les" },
    { href: "#e-learning", label: "E-Learning" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ====================== NAVBAR ====================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "h-16 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-[var(--border-light)]"
            : "h-20 bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl overflow-hidden shadow-sm p-0.5 transition-all duration-300 ${scrolled ? "bg-white" : "bg-white/90"}`}>
              <img src="/logo.jpg" alt="Les Vita Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-lg tracking-tight transition-colors duration-300 leading-none ${scrolled ? "text-[var(--text-primary)]" : "text-white"}`}>
                Les Vita
              </span>
              <span className={`text-[9.5px] italic tracking-widest mt-1 font-serif transition-colors duration-300 ${scrolled ? "text-[var(--text-secondary)]" : "text-white/80"}`}>
                SCIENTIA VITA EST
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                  scrolled ? "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-muted)]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="relative group hidden md:block">
              <button className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[12px] transition-all duration-300 ${scrolled ? "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-muted)]" : "text-white hover:bg-white/10"}`}>
                Masuk
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[var(--border-light)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col p-1 overflow-hidden">
                <Link href="/login-siswa" className="px-4 py-2.5 text-[12px] font-bold text-[var(--text-primary)] hover:bg-[var(--primary-glow)] hover:text-[var(--primary)] rounded-lg transition-colors flex items-center gap-2">
                  🧑‍🎓 Login Siswa
                </Link>
                <Link href="/login" className="px-4 py-2.5 text-[12px] font-bold text-[var(--text-primary)] hover:bg-[var(--primary-glow)] hover:text-[var(--primary)] rounded-lg transition-colors flex items-center gap-2">
                  👩‍🏫 Login Pengajar
                </Link>
              </div>
            </div>
            <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Les%20Vita,%20saya%20ingin%20daftarkan%20anak%20saya"
              target="_blank" rel="noreferrer"
              className="gradient-btn text-white text-[12px] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5"
            >
              Daftar Les
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-[var(--text-primary)] hover:bg-[var(--bg-muted)]" : "text-white hover:bg-white/10"}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-[var(--border-light)] animate-fade-in">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-muted)] transition-colors">
                  {link.label}
                </a>
              ))}
              <div className="h-[1px] bg-[var(--border-light)] my-1" />
              <Link href="/login-siswa" onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-[var(--primary)] flex items-center gap-2 hover:bg-[var(--primary-glow)] transition-colors">
                🧑‍🎓 Login Siswa
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-[var(--primary)] flex items-center gap-2 hover:bg-[var(--primary-glow)] transition-colors">
                👩‍🏫 Login Pengajar
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ====================== HERO SECTION ====================== */}
        <section id="beranda" ref={heroSection.ref} className="relative w-full min-h-[100vh] flex items-center gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0369A1]/80 via-[#0EA5E9]/60 to-[#38BDF8]/90" />
          <div className="absolute top-20 right-[10%] w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-[5%] w-64 h-64 bg-[var(--primary-light)]/15 rounded-full blur-[80px]" />

          <div className={`relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${heroSection.inView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
                  Bimbel Terpercaya untuk Anak SD & SMP
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.12] tracking-tight">
                Les Privat{" "}
                <span className="text-[var(--accent-light)]">SD & SMP</span>{" "}
                yang Bikin Anak Semangat Belajar
              </h1>

              <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-lg">
                Tutor ramah & sabar yang paham cara mengajar anak-anak.{" "}
                <strong className="text-white/90">Laporan belajar rutin ke WA orang tua</strong> dan{" "}
                <strong className="text-white/90">modul latihan lengkap</strong> untuk latihan di rumah.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20les%20anak%20saya" target="_blank" rel="noreferrer"
                  className="gradient-btn text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-600/25 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex items-center gap-2.5 text-[15px]">
                  📲 Konsultasi Gratis via WA
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                {stats.map((s, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl lg:text-3xl font-extrabold text-white">{s.value}</div>
                    <div className="text-[11px] text-white/50 font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating Card */}
            <div className="hidden lg:block relative">
              <div className="relative animate-float">
                <div className="glass rounded-3xl p-7 shadow-2xl shadow-black/10 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--warm)] text-white flex items-center justify-center text-3xl shadow-lg">
                      🎓
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[var(--text-primary)] text-lg">Paket Belajar Les Vita</h3>
                      <p className="text-xs text-[var(--text-muted)]">SD & SMP • Privat / Kelompok</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { text: "Tutor ramah & sabar yang paham anak-anak", bg: "bg-[var(--primary-glow)]" },
                      { text: "Laporan belajar rutin dikirim ke WA orang tua", bg: "bg-[var(--accent-glow)]" },
                      { text: "Modul latihan lengkap bisa cetak di rumah", bg: "bg-emerald-500/10" },
                      { text: "Les privat 1-on-1 atau kelompok kecil", bg: "bg-blue-500/10" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3.5 rounded-2xl ${item.bg} text-[13px] font-medium text-[var(--text-primary)]`}>
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20les%20anak" target="_blank" rel="noreferrer"
                    className="w-full block text-center gradient-btn text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm hover:shadow-lg">
                    Konsultasi Gratis via WhatsApp 📲
                  </a>
                </div>

                <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 animate-bounce-subtle">
                  <span className="text-lg">⭐</span>
                  <div>
                    <div className="text-xs font-extrabold text-[var(--text-primary)]">Rating 4.9/5</div>
                    <div className="text-[10px] text-[var(--text-muted)]">dari 350+ Orang Tua</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 80 1440 80V100H0V40Z" fill="var(--bg-page)" />
            </svg>
          </div>
        </section>

        {/* ====================== KEUNGGULAN ====================== */}
        <section id="keunggulan" ref={featureSection.ref} className="w-full py-20 bg-[var(--bg-page)]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className={`text-center max-w-2xl mx-auto mb-14 ${featureSection.inView ? "animate-fade-in-up" : "opacity-0"}`}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] bg-[var(--primary-glow)] px-4 py-1.5 rounded-full">
                Kenapa Pilih Les Vita?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-4 tracking-tight">
                Kami Paham Kebutuhan Anak & Orang Tua
              </h2>
              <p className="text-[var(--text-secondary)] mt-3 text-base leading-relaxed">
                Bukan sekadar les biasa — kami fokus membuat anak semangat belajar dan orang tua tenang memantau.
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger ${featureSection.inView ? "" : "opacity-0"}`}>
              {features.map((f, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 border border-[var(--border-light)] card-hover ${featureSection.inView ? "animate-fade-in-up" : ""}`}>
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-glow)] flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-[var(--text-primary)] text-[15px] mb-2">{f.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== TESTIMONIALS ====================== */}
        <section id="testimoni" ref={testimonialSection.ref} className="w-full py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className={`text-center max-w-2xl mx-auto mb-14 ${testimonialSection.inView ? "animate-fade-in-up" : "opacity-0"}`}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--accent-dark)] bg-[var(--accent-glow)] px-4 py-1.5 rounded-full">
                💬 Cerita Orang Tua
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-4 tracking-tight">
                Dipercaya Ratusan Keluarga Indonesia
              </h2>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger ${testimonialSection.inView ? "" : "opacity-0"}`}>
              {testimonials.map((t, i) => (
                <div key={i} className={`relative bg-[var(--bg-muted)] rounded-2xl p-6 border border-[var(--border-light)] card-hover testimonial-card ${testimonialSection.inView ? "animate-fade-in-up" : ""}`}>
                  <Stars count={t.stars} />
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-4 mb-5 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-light)]">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs">
                      {t.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-[var(--text-primary)]">{t.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{t.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                    📈 {t.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== PROGRAMS ====================== */}
        <section id="program" ref={programSection.ref} className="w-full py-20 bg-[var(--bg-page)]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className={`text-center max-w-2xl mx-auto mb-10 ${programSection.inView ? "animate-fade-in-up" : "opacity-0"}`}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] bg-[var(--primary-glow)] px-4 py-1.5 rounded-full">
                📚 Program Les
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-4 tracking-tight">
                Pilihan Program Bimbel SD & SMP
              </h2>
              <p className="text-[var(--text-secondary)] mt-3 text-base">
                Dirancang sesuai kebutuhan dan usia anak. Metode belajar yang fun & mudah dipahami.
              </p>

              <div className="flex justify-center gap-2 mt-7">
                {(["sd", "smp"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                        : "bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-[var(--border-light)]"
                    }`}>
                    {tab === "sd" ? "🎒 PAUD & SD" : "📖 SMP"}
                  </button>
                ))}
              </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger ${programSection.inView ? "" : "opacity-0"}`}>
              {programs[activeTab].map((p, i) => (
                <div key={`${activeTab}-${i}`}
                  className={`bg-white rounded-2xl p-6 border border-[var(--border-light)] card-hover flex flex-col justify-between ${programSection.inView ? "animate-fade-in-up" : ""}`}>
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center text-2xl">{p.icon}</div>
                    <h3 className="font-bold text-[var(--text-primary)] text-[15px]">{p.title}</h3>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
                    <span className="font-extrabold text-[var(--primary)] text-sm">{p.price}</span>
                    <a href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20tanya%20program:%20${encodeURIComponent(p.title)}`}
                      target="_blank" rel="noreferrer"
                      className="text-[12px] font-bold text-[var(--accent-dark)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                      Info Detail
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        

        {/* ====================== CTA BANNER ====================== */}
        <section className="w-full py-20 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px]" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Yuk, Daftarkan Anak Bunda/Ayah Sekarang!
            </h2>
            <p className="text-white/70 mt-4 text-base leading-relaxed max-w-xl mx-auto">
              Bergabung dengan 500+ keluarga yang sudah mempercayakan les anak mereka di Les Vita. Konsultasi pertama <strong className="text-white">GRATIS</strong>!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Les%20Vita,%20saya%20ingin%20daftar%20les%20untuk%20anak%20saya"
                target="_blank" rel="noreferrer"
                className="gradient-btn text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/25 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-base flex items-center gap-2">
                📲 Daftar via WhatsApp
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link href="/register"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-semibold px-7 py-4 rounded-2xl transition-all text-base">
                📝 Formulir Pendaftaran
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-[#0B2028] text-white py-14 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 overflow-hidden">
                <img src="/logo.jpg" alt="Les Vita Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight leading-none text-white">Les Vita</span>
                <span className="text-[10px] italic tracking-widest mt-1 text-white/70 font-serif uppercase">Scientia Vita Est</span>
              </div>
            </div>
            <p className="text-[13px] text-white/50 leading-relaxed">
              Bimbingan Belajar & Les Privat SD dan SMP. Tutor ramah, laporan belajar ke WA orang tua, dan modul latihan lengkap.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-white mb-4 uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}><a href={link.href} className="text-[13px] text-white/50 hover:text-white transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-white mb-4 uppercase tracking-wider">Akses Internal</h4>
            <ul className="space-y-2.5">
              
              <li><Link href="/register" className="text-[13px] text-white/50 hover:text-white transition-colors">Pendaftaran Online</Link></li>
              <li><Link href="/login" className="text-[13px] text-white/50 hover:text-white transition-colors">Login Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[13px] text-white mb-4 uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-3">
              <p className="text-[13px] text-white/50">WhatsApp: <span className="text-white/70">+62 812-3456-7890</span></p>
              <p className="text-[13px] text-white/50">Email: <span className="text-white/70">info@lesvita.com</span></p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-[12px] px-4 py-2.5 rounded-xl border border-emerald-500/20 transition-colors">
                💬 Chat WA Admin
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto border-t border-white/10 mt-10 pt-6 text-center text-[12px] text-white/30">
          © 2026 Les Vita. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
