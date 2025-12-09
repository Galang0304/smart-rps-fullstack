import React from 'react';
import { FileText, Download } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

/**
 * WordPreview - Komponen preview dokumen RPS seperti Word
 * Menampilkan live preview dari data form RPS
 */
export default function WordPreview({ course, formData, rpsId }) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleExport = () => {
    if (rpsId) {
      window.open(`${API_BASE_URL}/generated/${rpsId}/export`, '_blank');
    } else {
      alert('Simpan RPS terlebih dahulu untuk dapat mengexport ke Word');
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      {/* Word-like Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700">Preview RPS</span>
        </div>
        <button
          onClick={handleExport}
          disabled={!rpsId}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Word
        </button>
      </div>

      {/* Document Preview */}
      <div className="p-8 bg-gray-50 max-h-[600px] overflow-y-auto">
        <div className="bg-white shadow-md mx-auto max-w-4xl p-8" style={{ minHeight: '800px' }}>
          {/* Title */}
          <h1 className="text-center text-xl font-bold mb-6">DESKRIPSI RPS</h1>

          {/* Course Info Table */}
          <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold w-1/4">Kode MK</td>
                <td className="border border-gray-400 px-3 py-2">{course?.code || '-'}</td>
                <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold w-1/4">SKS</td>
                <td className="border border-gray-400 px-3 py-2">{course?.credits || '-'}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Nama MK</td>
                <td className="border border-gray-400 px-3 py-2" colSpan="3">{course?.title || '-'}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Tanggal Penyusunan</td>
                <td className="border border-gray-400 px-3 py-2" colSpan="3">{today}</td>
              </tr>
            </tbody>
          </table>

          {/* CPMK Section */}
          <h2 className="font-bold text-lg mb-3 mt-6">CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)</h2>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-3 py-2 w-24">Kode</th>
                <th className="border border-gray-400 px-3 py-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {formData.cpmk.filter(c => c.description).length > 0 ? (
                formData.cpmk.filter(c => c.description).map((cpmk, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-400 px-3 py-2 font-medium">{cpmk.code}</td>
                    <td className="border border-gray-400 px-3 py-2">{cpmk.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-400 px-3 py-2 text-gray-400 text-center" colSpan="2">
                    <em>Belum ada CPMK</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Sub-CPMK Section */}
          <h2 className="font-bold text-lg mb-3 mt-6">SUB-CAPAIAN PEMBELAJARAN MATA KULIAH (Sub-CPMK)</h2>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-3 py-2 w-24">Kode</th>
                <th className="border border-gray-400 px-3 py-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {formData.subCPMK.filter(s => s.description).length > 0 ? (
                formData.subCPMK.filter(s => s.description).map((sub, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-400 px-3 py-2 font-medium">{sub.code}</td>
                    <td className="border border-gray-400 px-3 py-2">{sub.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-400 px-3 py-2 text-gray-400 text-center" colSpan="2">
                    <em>Belum ada Sub-CPMK</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Topik Section */}
          <h2 className="font-bold text-lg mb-3 mt-6">RENCANA PEMBELAJARAN PER MINGGU</h2>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-3 py-2 w-20">Minggu</th>
                <th className="border border-gray-400 px-3 py-2">Topik</th>
                <th className="border border-gray-400 px-3 py-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {formData.topik.filter(t => t.topic).length > 0 ? (
                formData.topik.filter(t => t.topic).map((topik, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-400 px-3 py-2 text-center">{topik.week}</td>
                    <td className="border border-gray-400 px-3 py-2 font-medium">{topik.topic}</td>
                    <td className="border border-gray-400 px-3 py-2">{topik.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-400 px-3 py-2 text-gray-400 text-center" colSpan="3">
                    <em>Belum ada topik pembelajaran</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tugas Section */}
          <h2 className="font-bold text-lg mb-3 mt-6">RENCANA TUGAS</h2>
          {formData.tugas.filter(t => t.judul_tugas).length > 0 ? (
            formData.tugas.filter(t => t.judul_tugas).map((tugas, idx) => (
              <div key={idx} className="mb-4 p-4 border border-gray-300 rounded">
                <h3 className="font-semibold mb-2">Tugas {tugas.nomor || idx + 1}: {tugas.judul_tugas}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 pr-4 font-medium w-40">Sub-CPMK:</td>
                      <td className="py-1">{tugas.sub_cpmk || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">Indikator:</td>
                      <td className="py-1">{tugas.indikator || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">Batas Waktu:</td>
                      <td className="py-1">{tugas.batas_waktu || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">Bobot:</td>
                      <td className="py-1">{tugas.bobot || 0}%</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium">Kriteria:</td>
                      <td className="py-1">{tugas.kriteria || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-4 border border-gray-300 rounded">
              <em>Belum ada rencana tugas</em>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
