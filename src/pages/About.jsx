import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Image as ImageIcon, Video, File } from 'lucide-react';

export default function About() {
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
              Tentang SMART RPS
            </h1>
            <p className="text-lg sm:text-xl text-blue-900 text-center mb-12 max-w-3xl mx-auto">
              Sistem Manajemen Rencana Pembelajaran Semester Terintegrasi
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Placeholder untuk konten yang akan diisi user */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-4">
                Deskripsi Sistem
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>
                  SMART RPS (Sistem Manajemen Rencana Pembelajaran Semester Terintegrasi) adalah platform digital yang dikembangkan untuk memudahkan proses penyusunan dan pengelolaan Rencana Pembelajaran Semester (RPS) di Fakultas Teknik Universitas Muhammadiyah Makassar.
                </p>
                <p>
                  Sistem ini dilengkapi dengan fitur-fitur modern seperti AI Assistant untuk matching CPL (Capaian Pembelajaran Lulusan) dengan CPMK (Capaian Pembelajaran Mata Kuliah), import data dari Excel, export ke format Word dan PDF, serta dashboard monitoring yang interaktif.
                </p>
                <p>
                  Dikembangkan oleh tim mahasiswa Fakultas Teknik Unismuh Makassar sebagai bagian dari upaya digitalisasi dan peningkatan kualitas proses akademik di lingkungan kampus.
                </p>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-4">
                Tim Pengembang
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-6">
                <p className="font-semibold text-blue-950">
                  Sistem ini dikembangkan oleh 4 mahasiswa Fakultas Teknik Universitas Muhammadiyah Makassar:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-blue-500 flex-shrink-0">
                        <img 
                          src="/about-img/mahasiswa/1.jpeg" 
                          alt="Andi Arya Galang" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-blue-950">Andi Arya Galang</div>
                        <div className="text-sm text-slate-600">NIM: 105841117422</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">Product Engineer</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-sky-500 flex-shrink-0">
                        <img 
                          src="/about-img/mahasiswa/2.jpeg" 
                          alt="Galbi Nadifah" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-blue-950">Galbi Nadifah</div>
                        <div className="text-sm text-slate-600">NIM: 105841116322</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">System Organizer</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-indigo-500 flex-shrink-0">
                        <img 
                          src="/about-img/mahasiswa/3.jpeg" 
                          alt="Mahasiswa 3" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-blue-950">Mahasiswa 3</div>
                        <div className="text-sm text-slate-600">NIM: [NIM]</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">Api architecture</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500 flex-shrink-0">
                        <img 
                          src="/about-img/mahasiswa/4.jpeg" 
                          alt="Mahasiswa 4" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-blue-950">Mahasiswa 4</div>
                        <div className="text-sm text-slate-600">NIM: [NIM]</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">UI/UX Designer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-4">
                Tujuan Pengembangan
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                    <span>Mempermudah dan mempercepat proses penyusunan RPS bagi dosen dan kaprodi di lingkungan Fakultas Teknik Unismuh Makassar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                    <span>Meningkatkan kualitas dan konsistensi dokumen RPS melalui template terstandar dan validasi otomatis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                    <span>Mengintegrasikan teknologi AI untuk membantu mapping CPL dengan CPMK secara akurat dan efisien.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                    <span>Menyediakan sistem monitoring dan reporting yang memudahkan pimpinan dalam evaluasi kurikulum.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">5</span>
                    <span>Mendukung proses akreditasi dan penjaminan mutu akademik melalui dokumentasi yang terorganisir dan mudah diakses.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bukti Presentasi Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/40 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">Bukti Presentasi</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Dokumentasi presentasi dan pengembangan sistem SMART RPS
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Grid untuk bukti presentasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foto 1 */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="/about-img/1.jpeg" 
                  alt="Dokumentasi Presentasi 1" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-blue-950 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">Presentasi Sistem</span>
                </div>
                <p className="text-xs text-slate-600">Dokumentasi presentasi pengembangan SMART RPS</p>
              </div>
            </div>

            {/* Foto 2 */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="/about-img/2.jpeg" 
                  alt="Dokumentasi Presentasi 2" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-blue-950 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">Demo Aplikasi</span>
                </div>
                <p className="text-xs text-slate-600">Demonstrasi fitur-fitur sistem kepada stakeholder</p>
              </div>
            </div>

            {/* Foto 3 */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="/about-img/3.jpeg" 
                  alt="Dokumentasi Presentasi 3" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-blue-950 mb-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">Tim Pengembang</span>
                </div>
                <p className="text-xs text-slate-600">Tim mahasiswa pengembang SMART RPS</p>
              </div>
            </div>
          </div>

          {/* Instruksi untuk user */}
      
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

