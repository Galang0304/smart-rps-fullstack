import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">SMART RPS</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-2xl font-semibold text-blue-800 mb-2">SISTEM MANAJEMEN</p>
        <p className="text-xl text-blue-700 mb-1">RENCANA PEMBELAJARAN SEMESTER</p>
        <p className="text-lg text-blue-600">UNIVERSITAS MUHAMMADIYAH MAKASSAR</p>
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
