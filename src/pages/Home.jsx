import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-umm.png" alt="UMM" className="h-10 w-10" />
            <span className="text-xl font-bold text-blue-900">SMART RPS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#leadership" className="text-blue-900/80 hover:text-blue-900 transition">Pimpinan</a>
            <a href="#team" className="text-blue-900/80 hover:text-blue-900 transition">Tim</a>
            <a href="#features" className="text-blue-900/80 hover:text-blue-900 transition">Fitur</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-100 transition">Masuk</Link>
            <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition">Mulai</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/gedung-unismuh.jpg" alt="Universitas Muhammadiyah Makassar" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <img src="/logo-umm.png" alt="UMM" className="h-20 w-20" />
              <img src="/logo-ft.png" alt="Fakultas Teknik" className="h-20 w-20" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-blue-900 mb-4">
              SMART RPS
            </h1>
            <p className="text-2xl text-blue-700 font-semibold mb-2">
              Sistem Manajemen Rencana Pembelajaran Semester Terintegrasi
            </p>
            <p className="text-xl text-blue-600 mb-8">
              Universitas Muhammadiyah Makassar - Fakultas Teknik
            </p>
            <p className="text-lg text-blue-900/80 max-w-3xl mx-auto mb-12">
              Platform digital untuk mempermudah pengelolaan dan pembuatan RPS dengan bantuan AI
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition text-lg">
                Masuk ke Sistem
              </Link>
              <a href="#leadership" className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition text-lg">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Pimpinan Fakultas</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="text-center">
                <img 
                  src={`/pemimpin/${num}.jpg`} 
                  alt={`Pimpinan ${num}`}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim Pengembang */}
      <section id="team" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Tim Pengembang</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[7, 8, 9, 10].map((num) => (
              <div key={num} className="text-center">
                <img 
                  src={`/pengembang/${num}.jpg`} 
                  alt={`Pengembang ${num}`}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Fitur Unggulan</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Bantuan AI Cerdas</h3>
              <p className="text-blue-700">Teknologi AI yang membantu menyusun CPMK, Sub-CPMK, dan tugas dengan efisien</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Interface Modern</h3>
              <p className="text-blue-700">Antarmuka yang clean, intuitif, dan responsif untuk pengalaman optimal</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Export Professional</h3>
              <p className="text-blue-700">Export RPS ke format Word dengan template professional yang siap digunakan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img src="/logo-umm.png" alt="UMM" className="h-12 w-12" />
              <div>
                <div className="font-bold text-xl">SMART RPS</div>
                <div className="text-blue-200">Universitas Muhammadiyah Makassar</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-200">© 2025 Fakultas Teknik UMM</p>
              <p className="text-blue-300 text-sm">Platform RPS Terintegrasi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
