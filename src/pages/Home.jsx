import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Data for faculty leaders
  const facultyLeaders = [
    { name: "Prof. Dr. H. Ambo Asse, M.Ag.", position: "Rektor", image: "/logo-umm.png" },
    { name: "Prof. Dr. Ir. H. Muhammad Arsyad Thaha, M.T.", position: "Wakil Rektor I", image: "/logo-umm.png" },
    { name: "Prof. Dr. H. Abd. Rahman Rahim, SE., MM.", position: "Wakil Rektor II", image: "/logo-umm.png" },
    { name: "Prof. Dr. Ir. Wahyu Caesarendra, M.Eng.", position: "Dekan Fakultas Teknik", image: "/logo-umm.png" },
    { name: "Dr. Eng. Intan Sari Areni, S.T., M.T.", position: "Wakil Dekan", image: "/logo-umm.png" }
  ];

  // Data for department heads
  const departmentHeads = [
    { name: "Dr. Muhammad Syafaat, S.Kom., M.T.", position: "Kaprodi Teknik Informatika", dept: "Informatika" },
    { name: "Dr. Ir. Wahidin Nuriana, M.T.", position: "Kaprodi Teknik Sipil", dept: "Sipil" },
    { name: "Dr. Ir. Muhammad Isran Ramli, M.T.", position: "Kaprodi Teknik Mesin", dept: "Mesin" },
    { name: "Dr. Ir. Andi Erwin Eka Putra, M.T.", position: "Kaprodi Teknik Elektro", dept: "Elektro" },
    { name: "Dr. Ir. Andi Arwin Amiruddin, M.T.", position: "Kaprodi Arsitektur", dept: "Arsitektur" }
  ];

  // Development team
  const devTeam = [
    { name: "Muhammad Galang", position: "Lead Developer", tech: "Full-Stack" },
    { name: "Tim AI", position: "AI Integration", tech: "Machine Learning" },
    { name: "Tim Backend", position: "Server Development", tech: "Go & PostgreSQL" },
    { name: "Tim Frontend", position: "UI/UX Development", tech: "React & Tailwind" },
    { name: "Tim Quality", position: "Testing & QA", tech: "Quality Assurance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center py-20 px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-2xl">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">S</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            SMART RPS
          </h1>
          
          <div className="w-32 h-1 bg-gradient-to-r from-blue-300 to-white mx-auto mb-8 rounded-full"></div>
          
          <p className="text-2xl md:text-3xl font-bold text-blue-100 mb-3">
            SISTEM MANAJEMEN RPS
          </p>
          <p className="text-xl text-blue-200 mb-2">
            FAKULTAS TEKNIK
          </p>
          <p className="text-lg text-blue-300">
            UNIVERSITAS MUHAMMADIYAH MAKASSAR
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Masuk ke Sistem
            </Link>
            <a 
              href="#leadership" 
              className="px-8 py-4 bg-blue-600/30 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Lihat Tim
            </a>
          </div>
        </div>
      </div>

      {/* Faculty Leadership Section */}
      <section id="leadership" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4">
              PIMPINAN FAKULTAS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              Kepemimpinan yang visioner untuk implementasi SMART RPS di seluruh program studi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {facultyLeaders.map((leader, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-blue-900 mb-2 leading-tight">
                      {leader.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                      {leader.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Heads Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4">
              KEPALA PROGRAM STUDI
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              Para kaprodi yang akan mengimplementasikan SMART RPS di setiap program studi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {departmentHeads.map((head, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-blue-900 mb-2 leading-tight">
                      {head.name}
                    </h3>
                    <p className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-full mb-2">
                      {head.dept}
                    </p>
                    <p className="text-xs text-gray-600">
                      {head.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Team Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              TIM PENGEMBANG
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-white mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Tim ahli yang mengembangkan dan memelihara sistem SMART RPS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {devTeam.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/20 transform hover:-translate-y-2 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-xs text-green-300 font-semibold bg-green-500/20 px-2 py-1 rounded-full mb-2">
                      {member.tech}
                    </p>
                    <p className="text-xs text-blue-200">
                      {member.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-6">
            SIAP MEMULAI?
          </h2>
          <p className="text-xl text-blue-700 mb-10 leading-relaxed">
            Bergabunglah dengan sistem manajemen RPS terdepan untuk meningkatkan kualitas pembelajaran di Fakultas Teknik
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Link 
              to="/login" 
              className="group bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl font-bold mb-2">ADMIN</div>
              <div className="text-sm opacity-90">Kelola Sistem</div>
            </Link>
            
            <Link 
              to="/login" 
              className="group bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl font-bold mb-2">KAPRODI</div>
              <div className="text-sm opacity-90">Kelola Prodi</div>
            </Link>
            
            <Link 
              to="/login" 
              className="group bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl font-bold mb-2">PRODI</div>
              <div className="text-sm opacity-90">Staff Prodi</div>
            </Link>
            
            <Link 
              to="/login" 
              className="group bg-green-600 hover:bg-green-700 text-white p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl font-bold mb-2">DOSEN</div>
              <div className="text-sm opacity-90">Pengampu</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-black mb-4">SMART RPS</h3>
            <p className="text-blue-200 text-lg">
              Sistem Manajemen Rencana Pembelajaran Semester
            </p>
          </div>
          
          <div className="border-t border-blue-700 pt-8">
            <p className="text-blue-300 mb-2">
              © {new Date().getFullYear()} Universitas Muhammadiyah Makassar
            </p>
            <p className="text-blue-400 text-sm">
              Fakultas Teknik - Dikembangkan dengan ❤️ untuk pendidikan yang lebih baik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

            <div className="border-l-2 border-dashed border-blue-100 h-4 ml-5 md:ml-6"></div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-400 text-white flex items-center justify-center font-bold shadow-md">
                  3
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold text-blue-900">
                    Tim Pengembang
                  </h3>
                  <p className="text-sm text-blue-700">
                    Tim pengembang yang mendukung integrasi sistem dan peningkatan kualitas RPS berbasis teknologi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Selamat Datang</h2>
          <p className="text-lg text-gray-700">Pilih peran Anda untuk mengakses sistem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Admin Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">ADMIN</h3>
            <p className="text-blue-100 mb-6">Kelola seluruh sistem dan pengguna</p>
            <Link to="/login" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Masuk sebagai Admin
            </Link>
          </div>

          {/* Kaprodi Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-indigo-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">KAPRODI</h3>
            <p className="text-indigo-100 mb-6">Kepala Program Studi</p>
            <Link to="/login" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
              Masuk sebagai Kaprodi
            </Link>
          </div>

          {/* Prodi Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">PRODI</h3>
            <p className="text-purple-100 mb-6">Staff Program Studi</p>
            <Link to="/login" className="inline-block bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
              Masuk sebagai Prodi
            </Link>
          </div>

          {/* Dosen Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-green-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">DOSEN</h3>
            <p className="text-green-100 mb-6">Dosen Pengampu Mata Kuliah</p>
            <Link to="/login" className="inline-block bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              Masuk sebagai Dosen
            </Link>
          </div>

        </div>

        {/* Info Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Tentang SMART RPS</h2>
            <p className="text-lg text-gray-700">Sistem manajemen RPS yang mudah dan efisien</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v1h1a1 1 0 100-2H9a1 1 0 00-1 1v1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Kelola RPS</h3>
              <p className="text-gray-600">Buat dan kelola Rencana Pembelajaran Semester dengan mudah dan terstruktur</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4">Multi User</h3>
              <p className="text-gray-600">Akses berbeda sesuai peran: Admin, Kaprodi, Prodi, dan Dosen</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-4">Export Dokumen</h3>
              <p className="text-gray-600">Ekspor RPS ke format Word yang rapi dan siap digunakan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">SMART RPS</h3>
            <p className="text-blue-200">Sistem Manajemen Rencana Pembelajaran Semester</p>
          </div>
          <div className="border-t border-blue-800 pt-6">
            <p className="text-blue-300">© {new Date().getFullYear()} Universitas Muhammadiyah Makassar</p>
            <p className="text-blue-400 text-sm mt-2">Fakultas Teknik - Program Studi Teknik Informatika</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
