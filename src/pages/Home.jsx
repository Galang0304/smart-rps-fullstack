import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-12 bg-white border-b border-blue-100">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">SMART RPS</h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-blue-800">SISTEM MANAJEMEN RPS</p>
        <p className="text-blue-700 mt-1">UNIVERSITAS MUHAMMADIYAH MAKASSAR</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          {/* Admin Card */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
            <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">ADMIN</h3>
            <p className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded mb-3">Kelola Sistem</p>
            <Link to="/login" className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition">
              Masuk
            </Link>
          </div>

          {/* Kaprodi Card */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
            <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">KAPRODI</h3>
            <p className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded mb-3">Kepala Program Studi</p>
            <Link to="/login" className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition">
              Masuk
            </Link>
          </div>

          {/* Prodi Card */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
            <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">PRODI</h3>
            <p className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded mb-3">Program Studi</p>
            <Link to="/login" className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition">
              Masuk
            </Link>
          </div>

          {/* Dosen Card */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
            <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">DOSEN</h3>
            <p className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded mb-3">Pengajar</p>
            <Link to="/login" className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition">
              Masuk
            </Link>
          </div>

          {/* Guest Card */}
          <div className="bg-gradient-to-b from-gray-400 to-gray-500 rounded-lg p-6 text-white text-center shadow-lg">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-2-2H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2zm-5-4a2 2 0 100 4 2 2 0 000-4zM8.5 8c0-.28.22-.5.5-.5s.5.22.5.5-.22.5-.5.5-.5-.22-.5-.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">GUEST</h3>
            <p className="text-sm font-medium bg-white text-gray-600 px-3 py-1 rounded mb-3">Pengunjung</p>
            <a href="#info" className="inline-block bg-white text-gray-600 px-4 py-2 rounded font-medium hover:bg-gray-50 transition">
              Info
            </a>
          </div>

        </div>

        {/* Info Section */}
        <div id="info" className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Tentang SMART RPS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Manajemen RPS</h3>
              <p className="text-blue-800">Kelola Rencana Pembelajaran Semester dengan mudah dan terstruktur</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Multi-Role Access</h3>
              <p className="text-blue-800">Akses sesuai peran: Admin, Kaprodi, Prodi, dan Dosen</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Export Dokumen</h3>
              <p className="text-blue-800">Ekspor RPS ke format Word yang rapi dan profesional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-blue-200">© {new Date().getFullYear()} Universitas Muhammadiyah Makassar</p>
          <p className="text-blue-300 text-sm mt-2">Sistem Manajemen Rencana Pembelajaran Semester</p>
        </div>
      </footer>
    </div>
  );
}
