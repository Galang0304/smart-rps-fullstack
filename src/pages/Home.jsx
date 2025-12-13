import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-white/70 border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 shadow-sm shadow-blue-300" />
            <span className="text-xl font-semibold text-blue-900">SMART RPS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-blue-900/80 hover:text-blue-900 transition">Fitur</a>
            <a href="#how" className="text-blue-900/80 hover:text-blue-900 transition">Cara Kerja</a>
            <a href="#contact" className="text-blue-900/80 hover:text-blue-900 transition">Kontak</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-100 transition">Masuk</Link>
            <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-300 hover:bg-blue-700 transition">Mulai</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 mb-4">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-xs font-medium text-blue-800">Sederhana, cepat, dan rapi</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-900">
                Susun RPS Modern untuk Perkuliahan Anda
              </h1>
              <p className="mt-4 text-blue-900/80 leading-relaxed">
                Buat, kelola, dan ekspor RPS dengan mudah. Warna biru-putih yang bersih, antarmuka minimalis, dan pengalaman yang profesional.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/login" className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-300 hover:bg-blue-700 transition">
                  Buat RPS Sekarang
                </Link>
                <a href="#features" className="px-5 py-3 rounded-xl bg-white text-blue-900 font-medium border border-blue-200 hover:bg-blue-50 transition">
                  Lihat Fitur
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 text-blue-900/60">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-blue-100" />
                  <span>Terintegrasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-blue-100" />
                  <span>Efisien</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-blue-100" />
                  <span>Terstruktur</span>
                </div>
              </div>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-100/60 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-24" />
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-24 rounded-xl border border-blue-100 bg-blue-50" />
                    ))}
                  </div>
                  <div className="mt-6 h-12 rounded-xl bg-blue-600/10 border border-blue-200" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-blue-50 border border-blue-100" />
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white border border-blue-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Penyusunan Cepat',
                desc: 'Antarmuka sederhana memudahkan Anda menyusun RPS hanya dalam beberapa langkah.',
              },
              {
                title: 'Ekspor Dokumen',
                desc: 'Ekspor ke Word dengan template biru-putih profesional yang bersih.',
              },
              {
                title: 'Manajemen Terpusat',
                desc: 'Kelola mata kuliah, dosen, dan RPS dalam satu tempat yang rapi.',
              },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="h-10 w-10 rounded-lg bg-blue-600 mb-4 shadow-sm shadow-blue-300" />
                <h3 className="text-lg font-semibold text-blue-900">{f.title}</h3>
                <p className="mt-2 text-sm text-blue-900/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-100 bg-white p-8">
            <h2 className="text-2xl font-bold text-blue-900">Cara Kerja</h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {[
                'Masuk dan pilih mata kuliah',
                'Susun CPMK, Sub-CPMK, dan RPS',
                'Ekspor dokumen RPS yang rapi',
              ].map((step, i) => (
                <div key={i} className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-sm font-medium text-blue-900">Langkah {i + 1}</div>
                  <div className="mt-2 text-blue-900/80">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/login" className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-300 hover:bg-blue-700 transition">
                Coba Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-blue-900/70">© {new Date().getFullYear()} SMART RPS</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-blue-900/70 hover:text-blue-900">Privacy</a>
            <a href="#" className="text-blue-900/70 hover:text-blue-900">Terms</a>
            <a href="#" className="text-blue-900/70 hover:text-blue-900">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
