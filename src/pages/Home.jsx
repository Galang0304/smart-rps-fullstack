import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-blue-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            <a href="#leadership" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Pimpinan</a>
            <a href="#team" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Tim</a>
            <a href="#features" className="text-sm font-medium text-blue-950/80 hover:text-blue-950 transition">Fitur</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-blue-950 hover:bg-blue-100/70 transition text-sm sm:text-base font-semibold">Masuk</Link>
            <Link to="/login" className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition text-sm sm:text-base font-semibold">Mulai</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-24 -right-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <img src="/gedung-unismuh.jpg" alt="Universitas Muhammadiyah Makassar" className="w-full h-full object-cover opacity-[0.06]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6">
                <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-blue-100 flex items-center justify-center">
                  <img src="/logo-umm.png" alt="UMM" className="h-full w-full object-contain" />
                </div>
                <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-blue-100 flex items-center justify-center">
                  <img src="/logo-ft.png" alt="Fakultas Teknik" className="h-full w-full object-contain" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-blue-950 mb-4">
                SMART RPS
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-900 font-semibold mb-2">
                Sistem Manajemen Rencana Pembelajaran Semester Terintegrasi
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-blue-800/80 mb-7">
                Universitas Muhammadiyah Makassar - Fakultas Teknik
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 max-w-2xl mx-auto lg:mx-0 mb-8">
                Platform digital untuk mempermudah pengelolaan dan pembuatan RPS dengan bantuan AI
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/login" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition text-base sm:text-lg">
                  Masuk ke Sistem
                </Link>
                <a href="#features" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/80 text-blue-950 font-bold rounded-xl border border-blue-200 hover:bg-white transition text-base sm:text-lg backdrop-blur">
                  Lihat Fitur
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-blue-100 p-3 text-center">
                  <div className="text-lg sm:text-xl font-extrabold text-blue-950">AI</div>
                  <div className="text-[11px] sm:text-xs text-blue-800/70">Asisten Penyusunan</div>
                </div>
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-blue-100 p-3 text-center">
                  <div className="text-lg sm:text-xl font-extrabold text-blue-950">RPS</div>
                  <div className="text-[11px] sm:text-xs text-blue-800/70">Terintegrasi</div>
                </div>
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-blue-100 p-3 text-center">
                  <div className="text-lg sm:text-xl font-extrabold text-blue-950">DOCX</div>
                  <div className="text-[11px] sm:text-xs text-blue-800/70">Export Cepat</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-indigo-500/20 blur-xl" />
              <div className="relative rounded-[28px] bg-white/70 backdrop-blur border border-blue-100 shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 p-8 text-white text-center">
                    <div className="text-4xl font-extrabold mb-2">AI</div>
                    <div className="text-sm opacity-90">Asisten Cerdas</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 p-8 text-white text-center">
                    <div className="text-4xl font-extrabold mb-2">RPS</div>
                    <div className="text-sm opacity-90">Terintegrasi</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-8 text-white text-center">
                    <div className="text-4xl font-extrabold mb-2">DOCX</div>
                    <div className="text-sm opacity-90">Export Cepat</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 p-8 text-white text-center">
                    <div className="text-4xl font-extrabold mb-2">CPL</div>
                    <div className="text-sm opacity-90">Management</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm font-semibold text-blue-950">Sistem Modern & Efisien</div>
                  <div className="text-xs text-blue-800/70">Template Professional + AI Assistant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">Pimpinan Fakultas</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">Struktur pimpinan Fakultas Teknik Universitas Muhammadiyah Makassar.</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {['Dekan', 'Wakil Dekan I', 'Wakil Dekan II'].map((jabatan, idx) => (
              <div key={idx} className="group">
                <div className="relative rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-[3/4] bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
                    <img 
                      src={`/pemimpin/${idx + 1}.jpg`} 
                      alt={jabatan}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23e0f2fe" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%230c4a6e" font-family="sans-serif" font-size="24" font-weight="bold"%3E' + jabatan + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 text-center bg-white">
                    <div className="text-base font-bold text-blue-950 mb-1">{jabatan}</div>
                    <div className="text-sm text-blue-800/70">Fakultas Teknik</div>
                  </div>
                </div>
              </div>
            ))} bg-gradient-to-b from-blue-50/40 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">Tim Pengembang</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">Tim yang mengembangkan sistem SMART RPS agar mudah digunakan dan siap produksi.</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Developer 1', role: 'Fullstack Developer' },
              { name: 'Developer 2', role: 'Backend Engineer' },
              { name: 'Developer 3', role: 'Frontend Engineer' },
              { name: 'Developer 4', role: 'UI/UX Designer' }
            ].map((dev, idx) => (
              <div key={idx} className="group">
                <div className="relative rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 relative overflow-hidden">
                    <img 
                      src={`/pengembang/${idx + 1}.jpg`} 
                      alt={dev.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2393c5fd;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233b82f6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="400"/%3E%3Ccircle cx="200" cy="160" r="60" fill="white" opacity="0.3"/%3E%3Ccircle cx="200" cy="320" r="100" fill="white" opacity="0.3"/%3E%3Ctext x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="20" font-weight="bold"%3E' + dev.name + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 text-center bg-white">
                    <div className="text-sm font-bold text-blue-950 mb-1">{dev.name}</div>
                    <div className="text-xs text-blue-800/70">{dev.role}</div>
                  m-sky-50 to-white relative overflow-hidden">
                      <img 
                        src={`/kaprodi/${idx + 1}.jpg`} 
                        alt={`Kaprodi ${prodi}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"%3E%3Crect fill="%23dbeafe" width="300" height="400"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%231e40af" font-family="sans-serif" font-size="16" font-weight="600"%3EKaprodi%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%233b82f6" font-family="sans-serif" font-size="12"%3E' + prodi.substring(0, 15) + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="p-3 text-center bg-white">
                      <div className="text-xs sm:text-sm font-bold text-blue-950 mb-1">{prodi}</div>
                      <div className="text-[10px] sm:text-xs text-blue-800/70">Ketua Prodi</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">Fitur Unggulan</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">Dirancang untuk mempercepat penyusunan RPS dan memudahkan pengelolaan akademik.</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm hover:shadow-xl transition">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM4 15v3H1v-3a3 3 0 013.75-2.906A5.973 5.973 0 004 15z"/>
                  <path d="M18 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Bantuan AI Cerdas</h3>
              <p className="text-slate-600 text-sm">Membantu menyusun CPMK, Sub-CPMK, dan tugas secara efisien.</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm hover:shadow-xl transition">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Interface Modern</h3>
              <p className="text-slate-600 text-sm">Clean, intuitif, dan responsif untuk pengalaman terbaik di semua device.</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm hover:shadow-xl transition">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Export Professional</h3>
              <p className="text-slate-600 text-sm">Export RPS ke format Word dengan template yang siap digunakan.</p>
            </div>
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
