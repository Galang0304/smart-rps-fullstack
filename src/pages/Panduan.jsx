import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogIn, FilePlus, Sparkles, Edit, Download, ArrowRight, CheckCircle, Youtube, Video, Calendar, Clock } from 'lucide-react';

export default function Panduan() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animateElements = entry.target.querySelectorAll('.scroll-animate');
          animateElements.forEach((el) => {
            el.classList.add('visible');
          });
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate-on-scroll]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    // Also observe individual scroll-animate elements
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
      animateElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  const steps = [
    {
      step: '1',
      title: 'Login ke Sistem',
      description: 'Masuk ke sistem menggunakan akun yang telah terdaftar. Jika belum memiliki akun, hubungi administrator untuk mendapatkan akses.',
      icon: <LogIn className="w-6 h-6" />,
      details: [
        'Buka halaman login di website SMART RPS',
        'Masukkan username dan password yang telah diberikan',
        'Klik tombol "Masuk ke Sistem"',
        'Sistem akan mengarahkan Anda ke dashboard sesuai peran Anda'
      ]
    },
    {
      step: '2',
      title: 'Buat RPS Baru',
      description: 'Klik tombol "Buat RPS Baru" dan pilih mata kuliah yang ingin dibuat RPS-nya. Isi informasi dasar mata kuliah seperti nama, kode, dan semester.',
      icon: <FilePlus className="w-6 h-6" />,
      details: [
        'Dari dashboard, klik menu "RPS" atau "RPS Saya"',
        'Klik tombol "Buat RPS Baru"',
        'Pilih mata kuliah dari daftar yang tersedia',
        'Lengkapi informasi dasar mata kuliah'
      ]
    },
    {
      step: '3',
      title: 'Gunakan Bantuan AI',
      description: 'Manfaatkan fitur AI untuk membantu menyusun CPMK, Sub-CPMK, dan deskripsi tugas. AI akan memberikan saran berdasarkan kurikulum yang berlaku.',
      icon: <Sparkles className="w-6 h-6" />,
      details: [
        'Setelah membuat RPS baru, Anda akan melihat opsi "Bantuan AI"',
        'Klik pada bagian yang ingin dibantu AI (CPMK, Sub-CPMK, dll)',
        'AI akan men-generate konten berdasarkan informasi mata kuliah',
        'Review dan edit konten yang dihasilkan sesuai kebutuhan'
      ]
    },
    {
      step: '4',
      title: 'Edit dan Lengkapi RPS',
      description: 'Tinjau dan edit konten yang dihasilkan oleh AI sesuai kebutuhan. Lengkapi informasi seperti referensi, penilaian, dan jadwal pembelajaran.',
      icon: <Edit className="w-6 h-6" />,
      details: [
        'Edit setiap bagian RPS sesuai kebutuhan',
        'Tambahkan referensi buku dan sumber pembelajaran',
        'Isi informasi penilaian dan bobot nilai',
        'Lengkapi jadwal pembelajaran per pertemuan',
        'Simpan perubahan secara berkala'
      ]
    },
    {
      step: '5',
      title: 'Export ke Format Word',
      description: 'Setelah RPS selesai, klik tombol "Export" untuk mengunduh RPS dalam format DOCX. File akan otomatis menggunakan template profesional yang telah disediakan.',
      icon: <Download className="w-6 h-6" />,
      details: [
        'Pastikan semua bagian RPS sudah lengkap',
        'Klik tombol "Export ke DOCX" atau "Download"',
        'File Word akan otomatis terunduh',
        'Buka file untuk review akhir sebelum disetujui',
        'File siap digunakan atau dicetak'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="backdrop-blur-xl bg-white/70 border border-blue-100/60 rounded-2xl shadow-lg h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100 flex items-center justify-center">
                <img src="/logo-umm.png" alt="UMM" className="h-full w-full object-contain" />
              </div>
              <div className="leading-tight">
                <span className="block text-base sm:text-lg font-bold text-blue-950">SMART RPS</span>
                <span className="hidden sm:block text-xs text-blue-800/70">Fakultas Teknik • Unismuh Makassar</span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Beranda</Link>
              <a href="/#leadership" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Pimpinan</a>
              <a href="/#team" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Tim</a>
              <a href="/#features" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Fitur</a>
              <Link to="/about" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Tentang</Link>
              <Link to="/panduan" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Panduan</Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-blue-950 hover:bg-blue-100/70 transition text-sm sm:text-base font-semibold">Masuk</Link>
              <Link to="/login" className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition text-sm sm:text-base font-semibold">Mulai</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-36 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/gedung-unismuh.webp" 
            alt="Gedung Unismuh" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/gedung-unismuh.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-blue-50/60 to-white/90" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-950 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-blue-950 mb-6 text-center">
              Panduan Menggunakan
            </h1>
            <p className="text-lg sm:text-xl text-blue-900 text-center mb-12 max-w-3xl mx-auto">
              Pelajari cara menggunakan sistem SMART RPS dengan mudah dan efisien
            </p>
          </div>
        </div>
      </section>

      {/* Guide Steps */}
      <section className="py-12 sm:py-16 bg-white" data-animate-on-scroll>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((guide, idx) => (
              <div key={idx} className="scroll-animate" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0 flex items-start gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg">
                        {guide.step}
                      </div>
                      <div className="text-blue-600 mt-2 sm:mt-3">
                        {guide.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-blue-950 mb-3">{guide.title}</h3>
                      <p className="text-base sm:text-lg text-slate-700 mb-4 leading-relaxed">
                        {guide.description}
                      </p>
                      
                      {/* Details List */}
                      <div className="space-y-2">
                        {guide.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-10 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Siap Memulai?
              </h2>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                Mulai gunakan sistem SMART RPS sekarang untuk mempermudah pembuatan RPS Anda
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all text-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rencana Video YouTube Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/40 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">Rencana Video YouTube</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Rencana konten video tutorial SMART RPS untuk channel YouTube
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Grid Video Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Pengenalan SMART RPS',
                description: 'Video pengenalan sistem SMART RPS, fitur-fitur utama, dan manfaatnya',
                duration: '5-7 menit',
                targetDate: '2025-01-15',
                notes: 'Fokus pada demo fitur AI dan export DOCX'
              },
              {
                title: 'Tutorial: Membuat RPS dengan AI',
                description: 'Step-by-step tutorial cara membuat RPS baru menggunakan bantuan AI',
                duration: '10-12 menit',
                targetDate: '2025-01-22',
                notes: 'Sertakan screen recording dan voice over'
              },
              {
                title: 'Cara Export RPS ke Word',
                description: 'Tutorial lengkap cara export RPS ke format DOCX dengan template profesional',
                duration: '5-6 menit',
                targetDate: '2025-01-29',
                notes: 'Highlight keunggulan template yang digunakan'
              },
              {
                title: 'Manajemen CPL dan CPMK',
                description: 'Cara mengelola CPL dan CPMK di sistem SMART RPS',
                duration: '8-10 menit',
                targetDate: '2025-02-05',
                notes: 'Fokus pada integrasi CPL-CPMK'
              }
            ].map((video, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-600 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-16 h-16 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-blue-950 mb-2">{video.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{video.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Durasi: {video.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Target: {new Date(video.targetDate).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {video.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800">
                          <strong>Catatan:</strong> {video.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center md:flex-row md:justify-between md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 md:mb-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-white/15 flex items-center justify-center">
                <img src="/logo-umm.png" alt="UMM" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-lg sm:text-xl">SMART RPS</div>
                <div className="text-blue-200 text-sm sm:text-base">Universitas Muhammadiyah Makassar</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-200 text-sm sm:text-base">© 2025 Fakultas Teknik UMM</p>
              <p className="text-blue-300 text-xs sm:text-sm">Platform RPS Terintegrasi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

