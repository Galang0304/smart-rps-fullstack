import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, Plus, Trash2, Edit, Loader2, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { courseAPI } from '../../services/api';

export default function CPMKManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cpmkData, setCpmkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [importType, setImportType] = useState('excel'); // 'excel' or 'csv'
  const [cpmkCsvFile, setCpmkCsvFile] = useState(null);
  const [subCpmkCsvFile, setSubCpmkCsvFile] = useState(null);
  const [editingCpmk, setEditingCpmk] = useState(null);
  const [editingSubCpmk, setEditingSubCpmk] = useState(null);

  const userRole = localStorage.getItem('role');
  const prodiId = localStorage.getItem('prodi_id');

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let res;
      if (userRole === 'admin') {
        res = await courseAPI.getAll();
      } else {
        res = await courseAPI.getByProgramId(prodiId);
      }
      
      let courseList = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        courseList = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        courseList = res.data.data;
      } else if (Array.isArray(res.data)) {
        courseList = res.data;
      }
      
      // Load CPMK count for each course
      const coursesWithCpmk = await Promise.all(
        courseList.map(async (course) => {
          try {
            const response = await fetch(`http://103.151.145.182:8080/api/v1/cpmk/course/${course.id}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();
            return {
              ...course,
              cpmkCount: data.success ? (data.data || []).length : 0,
            };
          } catch {
            return { ...course, cpmkCount: 0 };
          }
        })
      );
      
      setCourses(coursesWithCpmk);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCPMKForCourse = async (courseId) => {
    try {
      const response = await fetch(`http://103.151.145.182:8080/api/v1/cpmk/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setCpmkData(data.data || []);
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load CPMK:', error);
      return [];
    }
  };

  const handleViewCPMK = async (course) => {
    setSelectedCourse(course);
    setLoading(true);
    const data = await loadCPMKForCourse(course.id);
    setCpmkData(data);
    setShowDetailModal(true);
    setLoading(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('http://103.151.145.182:8080/api/v1/cpmk/template/excel', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Template_CPMK_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download template:', error);
      alert('Gagal download template: ' + error.message);
    }
  };

  const handleImportExcel = async () => {
    if (!excelFile) {
      alert('Pilih file Excel terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', excelFile);

      const response = await fetch('http://103.151.145.182:8080/api/v1/cpmk/import/excel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setUploadStatus({
        success: true,
        message: data.message || `Berhasil import ${data.imported_count} CPMK`,
        details: data.failed_count > 0 ? `${data.failed_count} gagal: ${data.errors?.slice(0, 3).join(', ')}` : null,
      });
      
      setExcelFile(null);
      setShowImportModal(false);
      loadCourses(); // Reload untuk update count
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (error) {
      console.error('Failed to import Excel:', error);
      setUploadStatus({
        success: false,
        message: 'Import gagal',
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportCSV = async () => {
    if (!cpmkCsvFile || !subCpmkCsvFile) {
      alert('Pilih kedua file CSV (CPMK dan Sub-CPMK)');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('cpmk_file', cpmkCsvFile);
      formData.append('sub_cpmk_file', subCpmkCsvFile);

      const response = await fetch('http://103.151.145.182:8080/api/v1/cpmk/import/csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setUploadStatus({
        success: true,
        message: data.message || `Berhasil import ${data.imported_count} CPMK`,
        details: data.failed_count > 0 ? `${data.failed_count} gagal: ${data.errors?.slice(0, 3).join(', ')}` : null,
      });
      
      setCpmkCsvFile(null);
      setSubCpmkCsvFile(null);
      setShowImportModal(false);
      loadCourses(); // Reload untuk update count
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (error) {
      console.error('Failed to import CSV:', error);
      setUploadStatus({
        success: false,
        message: 'Import gagal',
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`http://103.151.145.182:8080/api/v1/cpmk/export/excel?course_id=${selectedCourse}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CPMK_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setUploadStatus({
        success: true,
        message: 'Berhasil export CPMK ke Excel!',
      });
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Gagal export: ' + error.message);
    }
  };

  const handleDeleteAllCPMK = async (course) => {
    if (!confirm(`Yakin ingin menghapus SEMUA CPMK & Sub-CPMK untuk mata kuliah "${course.title}"?\n\nData ini tidak dapat dikembalikan.`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Load CPMK untuk course ini
      const cpmks = await loadCPMKForCourse(course.id);
      
      // Delete setiap CPMK (akan cascade delete Sub-CPMK)
      for (const cpmk of cpmks) {
        await fetch(`http://103.151.145.182:8080/api/v1/cpmk/${cpmk.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setUploadStatus({
        success: true,
        message: `Berhasil menghapus ${cpmks.length} CPMK untuk ${course.title}!`,
      });
      
      loadCourses(); // Reload untuk update count
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error('Failed to delete CPMK:', error);
      setUploadStatus({
        success: false,
        message: 'Gagal menghapus CPMK',
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingleCPMK = async (cpmkId, cpmkDesc) => {
    if (!confirm(`Yakin ingin menghapus CPMK "${cpmkDesc}"?\n\nSemua Sub-CPMK terkait juga akan dihapus.`)) {
      return;
    }

    try {
      const response = await fetch(`http://103.151.145.182:8080/api/v1/cpmk/${cpmkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadStatus({
          success: true,
          message: 'CPMK berhasil dihapus!',
        });
        // Reload CPMK data
        const newData = await loadCPMKForCourse(selectedCourse.id);
        setCpmkData(newData);
        loadCourses(); // Update count
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (error) {
      console.error('Failed to delete CPMK:', error);
      alert('Gagal menghapus CPMK: ' + error.message);
    }
  };

  const selectedCourseName = courses.find(c => c.id === selectedCourse)?.title || '';

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen CPMK & Sub-CPMK</h1>
          <p className="text-gray-600 mt-1">Kelola Capaian Pembelajaran Mata Kuliah</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            title="Download Template Excel"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div className={`mb-6 p-4 rounded-lg border ${
          uploadStatus.success
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {uploadStatus.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${uploadStatus.success ? 'text-green-900' : 'text-red-900'}`}>
                {uploadStatus.message}
              </p>
              {uploadStatus.details && (
                <p className="text-sm text-gray-600 mt-1">{uploadStatus.details}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">💡 Sistem Hybrid CPMK:</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Jika CPMK sudah diimport dari Excel → Data diambil dari database</li>
              <li>Jika CPMK belum ada → AI akan generate otomatis saat buat RPS</li>
              <li>Import Excel akan <strong>mengganti</strong> CPMK lama untuk mata kuliah yang sama</li>
              <li>Format Excel harus sesuai template (download dulu untuk contoh)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Kuliah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah CPMK
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.credits || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.tahun || '2025'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.cpmkCount > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.cpmkCount || 0} CPMK
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCPMK(course)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          title="Lihat & Edit CPMK"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                        {course.cpmkCount > 0 && (
                          <button
                            onClick={() => handleDeleteAllCPMK(course)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                            title="Hapus Semua CPMK"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {courses.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-medium">Belum ada mata kuliah</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import CPMK</h2>
            
            <div className="space-y-4">
              {/* Import Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Format Import
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="excel"
                      checked={importType === 'excel'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Excel (.xlsx) - Single File</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="csv"
                      checked={importType === 'csv'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">CSV - Dua File Terpisah</span>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Perhatian:</strong>
                </p>
                {importType === 'excel' ? (
                  <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc space-y-1">
                    <li>Download template terlebih dahulu</li>
                    <li>Isi sesuai format (2 sheet: CPMK Template & Sub-CPMK Template)</li>
                    <li>Nama mata kuliah harus <strong>sama persis</strong> dengan data di sistem</li>
                    <li>Import akan mengganti CPMK lama untuk mata kuliah yang sama</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc space-y-1">
                    <li>Upload <strong>2 file CSV terpisah</strong>: cpmk.csv dan subs-cpmk.csv</li>
                    <li>Format CSV harus sesuai dengan file di folder docs/</li>
                    <li>Nama mata kuliah harus <strong>sama persis</strong> dengan data di sistem</li>
                    <li>Import akan mengganti CPMK lama untuk mata kuliah yang sama</li>
                  </ul>
                )}
              </div>

              {/* File Upload */}
              {importType === 'excel' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Excel (.xlsx)
                  </label>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setExcelFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {excelFile && (
                    <p className="text-sm text-gray-600 mt-1">✓ {excelFile.name}</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File CPMK CSV
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCpmkCsvFile(e.target.files[0])}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {cpmkCsvFile && (
                      <p className="text-xs text-gray-600 mt-1">✓ {cpmkCsvFile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Sub-CPMK CSV
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setSubCpmkCsvFile(e.target.files[0])}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {subCpmkCsvFile && (
                      <p className="text-xs text-gray-600 mt-1">✓ {subCpmkCsvFile.name}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={importType === 'excel' ? handleImportExcel : handleImportCSV}
                  disabled={
                    loading || 
                    (importType === 'excel' ? !excelFile : (!cpmkCsvFile || !subCpmkCsvFile))
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Import {importType === 'excel' ? 'Excel' : 'CSV'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setExcelFile(null);
                    setCpmkCsvFile(null);
                    setSubCpmkCsvFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - View & Edit CPMK */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  CPMK & Sub-CPMK: {selectedCourse.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCourse.code} | {cpmkData.length} CPMK
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCourse(null);
                  setCpmkData([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cpmkData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-medium">Belum ada CPMK untuk mata kuliah ini</p>
                  <p className="text-sm mt-1">Import dari Excel/CSV atau akan di-generate otomatis oleh AI saat buat RPS</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cpmkData.map((cpmk) => (
                    <div key={cpmk.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded">
                              CPMK {cpmk.cpmk_number}
                            </span>
                          </div>
                          <p className="text-gray-900 leading-relaxed">{cpmk.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSingleCPMK(cpmk.id, cpmk.description)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus CPMK ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Sub-CPMKs */}
                      {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 ? (
                        <div className="mt-4 pl-6 border-l-2 border-blue-200">
                          <p className="text-xs font-semibold text-gray-600 mb-3">Sub-CPMK:</p>
                          <div className="space-y-2">
                            {cpmk.sub_cpmks.map((sub) => (
                              <div key={sub.id} className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-medium bg-blue-50 text-blue-700 rounded-full flex-shrink-0">
                                  {sub.sub_cpmk_number}
                                </span>
                                <p className="text-sm text-gray-700 flex-1 leading-relaxed">{sub.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pl-6 border-l-2 border-gray-200">
                          <p className="text-xs text-gray-500 italic">Belum ada Sub-CPMK</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCourse(null);
                  setCpmkData([]);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
