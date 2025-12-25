import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Check, 
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Download,
  Upload,
  Loader
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { commonCourseAPI, prodiAPI } from '../../services/api';
import Toast from '../../components/Toast';

export default function CommonCourseManagement() {
  const navigate = useNavigate();
  
  // States
  const [courses, setCourses] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: '',
    semester: '',
    tahun: '2025',
    prodi_ids: []
  });
  
  // Assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [selectedProdis, setSelectedProdis] = useState([]);
  
  // Expanded rows
  const [expandedRows, setExpandedRows] = useState({});
  
  // Import states
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, message: '' });
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, prodisRes] = await Promise.all([
        commonCourseAPI.getAll(),
        prodiAPI.getActive()
      ]);
      setCourses(coursesRes.data?.data || []);
      setProdis(prodisRes.data?.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by search
  const filteredCourses = courses.filter(course => 
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.title.trim()) {
      showToast('Kode dan nama mata kuliah wajib diisi', 'error');
      return;
    }

    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        credits: formData.credits ? parseInt(formData.credits) : null,
        semester: formData.semester ? parseInt(formData.semester) : null,
        tahun: formData.tahun || '2025',
        prodi_ids: formData.prodi_ids
      };

      if (editingCourse) {
        await commonCourseAPI.update(editingCourse.id, payload);
        showToast('Mata kuliah berhasil diperbarui', 'success');
      } else {
        await commonCourseAPI.create(payload);
        showToast('Mata kuliah umum berhasil ditambahkan', 'success');
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save course:', error);
      showToast('Gagal menyimpan mata kuliah', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (course) => {
    if (!confirm(`Hapus mata kuliah "${course.title}"?\n\nSemua assignment ke prodi akan ikut terhapus.`)) {
      return;
    }

    try {
      await commonCourseAPI.delete(course.id);
      showToast('Mata kuliah berhasil dihapus', 'success');
      loadData();
    } catch (error) {
      console.error('Failed to delete course:', error);
      showToast('Gagal menghapus mata kuliah', 'error');
    }
  };

  // Handle edit
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      title: course.title || '',
      credits: course.credits || '',
      semester: course.semester || '',
      tahun: course.tahun || '2025',
      prodi_ids: course.assigned_prodis?.map(ap => ap.prodi_id) || []
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
      code: '',
      title: '',
      credits: '',
      semester: '',
      tahun: '2025',
      prodi_ids: []
    });
  };

  // Handle assign modal
  const openAssignModal = (course) => {
    setAssigningCourse(course);
    setSelectedProdis(course.assigned_prodis?.map(ap => ap.prodi_id) || []);
    setShowAssignModal(true);
  };

  // Handle save assignment
  const handleSaveAssignment = async () => {
    if (!assigningCourse) return;

    try {
      await commonCourseAPI.assignToProdi(assigningCourse.id, selectedProdis);
      showToast('Assignment berhasil disimpan', 'success');
      setShowAssignModal(false);
      setAssigningCourse(null);
      loadData();
    } catch (error) {
      console.error('Failed to save assignment:', error);
      showToast('Gagal menyimpan assignment', 'error');
    }
  };

  // Toggle prodi selection
  const toggleProdiSelection = (prodiId) => {
    setSelectedProdis(prev => 
      prev.includes(prodiId)
        ? prev.filter(id => id !== prodiId)
        : [...prev, prodiId]
    );
  };

  // Toggle expand row
  const toggleExpand = (courseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Download Import Template
  const handleDownloadTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Data template
      const data = [];
      
      // Header row
      data.push(['NO', 'KODE MK', 'NAMA MATA KULIAH', 'SKS', 'SEMESTER', 'TAHUN']);
      
      // Example data rows
      data.push([1, 'MKU001', 'Pendidikan Agama Islam', 2, 1, 2025]);
      data.push([2, 'MKU002', 'Pendidikan Pancasila', 2, 1, 2025]);
      data.push([3, 'MKU003', 'Bahasa Indonesia', 2, 2, 2025]);
      data.push([4, 'MKU004', 'Bahasa Inggris', 2, 3, 2025]);
      data.push([5, 'MKU005', 'Kewarganegaraan', 2, 4, 2025]);
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 5 },   // NO
        { wch: 12 },  // KODE MK
        { wch: 40 },  // NAMA MATA KULIAH
        { wch: 6 },   // SKS
        { wch: 10 },  // SEMESTER
        { wch: 8 }    // TAHUN
      ];
      
      // Style header row
      const headerRange = XLSX.utils.decode_range(ws['!ref']);
      for (let col = 0; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "7C3AED" } }, // Purple for common courses
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      }
      
      // Style data rows
      for (let row = 1; row <= headerRange.e.r; row++) {
        for (let col = 0; col <= headerRange.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
          
          const fillColor = row % 2 === 1 ? "F3E8FF" : "FFFFFF"; // Light purple alternating
          
          ws[cellAddress].s = {
            fill: { fgColor: { rgb: fillColor } },
            alignment: { 
              horizontal: col === 2 ? "left" : "center",
              vertical: "center"
            },
            border: {
              top: { style: "thin", color: { rgb: "D0D0D0" } },
              bottom: { style: "thin", color: { rgb: "D0D0D0" } },
              left: { style: "thin", color: { rgb: "D0D0D0" } },
              right: { style: "thin", color: { rgb: "D0D0D0" } }
            }
          };
        }
      }
      
      // Add instruction sheet
      const instrData = [];
      instrData.push(['PETUNJUK PENGGUNAAN TEMPLATE MATA KULIAH UMUM']);
      instrData.push(['']);
      instrData.push(['1. Isi data pada kolom yang tersedia:']);
      instrData.push(['   - NO: Nomor urut (opsional, diabaikan saat import)']);
      instrData.push(['   - KODE MK: Kode mata kuliah (wajib, harus unik)']);
      instrData.push(['   - NAMA MATA KULIAH: Nama lengkap mata kuliah (wajib)']);
      instrData.push(['   - SKS: Jumlah SKS (1-6)']);
      instrData.push(['   - SEMESTER: Semester (1-8)']);
      instrData.push(['   - TAHUN: Tahun kurikulum (default: 2025)']);
      instrData.push(['']);
      instrData.push(['2. Pastikan KODE MK tidak duplikat dengan mata kuliah yang sudah ada']);
      instrData.push(['3. Setelah import, Anda bisa assign mata kuliah ke prodi yang diinginkan']);
      instrData.push(['']);
      instrData.push(['Catatan: Mata kuliah umum adalah mata kuliah yang dapat diajarkan di beberapa prodi']);
      
      const instrWs = XLSX.utils.aoa_to_sheet(instrData);
      instrWs['!cols'] = [{ wch: 80 }];
      
      // Style instruction title
      if (instrWs['A1']) {
        instrWs['A1'].s = {
          font: { bold: true, sz: 14, color: { rgb: "7C3AED" } },
          alignment: { horizontal: "left", vertical: "center" }
        };
      }
      
      // Add sheets
      XLSX.utils.book_append_sheet(wb, ws, 'Matkul Umum');
      XLSX.utils.book_append_sheet(wb, instrWs, 'Instruksi');
      
      // Generate file
      XLSX.writeFile(wb, `Template_Matkul_Umum_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Template Excel berhasil diunduh', 'success');
    } catch (error) {
      console.error('Template download error:', error);
      showToast('Gagal mengunduh template', 'error');
    }
  };

  // Import from Excel
  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress({ current: 0, total: 0, message: 'Membaca file...' });
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Find the right sheet
      let worksheet = null;
      
      // Priority: Look for "Matkul Umum" or first non-instruction sheet
      if (workbook.Sheets['Matkul Umum']) {
        worksheet = workbook.Sheets['Matkul Umum'];
      } else {
        // Use first sheet that's not "Instruksi"
        for (const sheetName of workbook.SheetNames) {
          if (!sheetName.toLowerCase().includes('instruksi')) {
            worksheet = workbook.Sheets[sheetName];
            break;
          }
        }
      }
      
      if (!worksheet) {
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      if (jsonData.length < 2) {
        showToast('File Excel kosong atau tidak valid', 'error');
        return;
      }
      
      const headers = jsonData[0];
      
      // Find column indexes
      let codeColIdx = -1;
      let nameColIdx = -1;
      let sksColIdx = -1;
      let semesterColIdx = -1;
      let tahunColIdx = -1;
      
      headers.forEach((header, idx) => {
        const h = header?.toString().toLowerCase().trim() || '';
        if (h.includes('kode')) codeColIdx = idx;
        else if (h.includes('nama') || h.includes('mata kuliah')) nameColIdx = idx;
        else if (h.includes('sks')) sksColIdx = idx;
        else if (h.includes('semester')) semesterColIdx = idx;
        else if (h.includes('tahun')) tahunColIdx = idx;
      });
      
      // Fallback to positional columns if headers not found
      if (codeColIdx === -1) codeColIdx = 1; // Column B
      if (nameColIdx === -1) nameColIdx = 2; // Column C
      if (sksColIdx === -1) sksColIdx = 3;   // Column D
      if (semesterColIdx === -1) semesterColIdx = 4; // Column E
      if (tahunColIdx === -1) tahunColIdx = 5; // Column F
      
      // Count valid rows
      const validRows = jsonData.slice(1).filter(row => {
        const code = row[codeColIdx]?.toString().trim();
        const name = row[nameColIdx]?.toString().trim();
        return code && name;
      });
      
      if (validRows.length === 0) {
        showToast('Tidak ada data valid untuk diimport', 'error');
        return;
      }
      
      setImportProgress({ current: 0, total: validRows.length, message: 'Memulai import...' });
      
      let successCount = 0;
      let failedCount = 0;
      const errors = [];
      
      // Process each row
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        const code = row[codeColIdx]?.toString().trim();
        const name = row[nameColIdx]?.toString().trim();
        const sks = parseInt(row[sksColIdx]) || 2;
        const semester = parseInt(row[semesterColIdx]) || 1;
        const tahun = row[tahunColIdx]?.toString().trim() || '2025';
        
        setImportProgress({ 
          current: i + 1, 
          total: validRows.length, 
          message: `Importing: ${code} - ${name}` 
        });
        
        try {
          await commonCourseAPI.create({
            code,
            title: name,
            credits: sks,
            semester,
            tahun,
            prodi_ids: []
          });
          successCount++;
        } catch (error) {
          failedCount++;
          const errorMsg = error.response?.data?.error || error.message;
          errors.push(`${code}: ${errorMsg}`);
        }
      }
      
      // Reload data
      await loadData();
      
      // Show result
      if (failedCount === 0) {
        showToast(`Berhasil import ${successCount} mata kuliah umum`, 'success');
      } else {
        showToast(
          `Import selesai: ${successCount} berhasil, ${failedCount} gagal. ${errors.slice(0, 2).join('; ')}`,
          failedCount > successCount ? 'error' : 'warning'
        );
      }
      
    } catch (error) {
      console.error('Import error:', error);
      showToast('Gagal mengimpor data: ' + error.message, 'error');
    } finally {
      setImporting(false);
      setImportProgress({ current: 0, total: 0, message: '' });
      event.target.value = '';
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      if (courses.length === 0) {
        showToast('Tidak ada data untuk di-export', 'warning');
        return;
      }
      
      const wb = XLSX.utils.book_new();
      
      // Prepare data
      const data = [];
      data.push(['NO', 'KODE MK', 'NAMA MATA KULIAH', 'SKS', 'SEMESTER', 'TAHUN', 'JUMLAH PRODI']);
      
      courses.forEach((course, idx) => {
        data.push([
          idx + 1,
          course.code,
          course.title,
          course.credits || 0,
          course.semester || '-',
          course.tahun || '2025',
          course.assigned_prodis?.length || 0
        ]);
      });
      
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 5 },   // NO
        { wch: 12 },  // KODE MK
        { wch: 40 },  // NAMA MATA KULIAH
        { wch: 6 },   // SKS
        { wch: 10 },  // SEMESTER
        { wch: 8 },   // TAHUN
        { wch: 12 }   // JUMLAH PRODI
      ];
      
      // Style header row
      const headerRange = XLSX.utils.decode_range(ws['!ref']);
      for (let col = 0; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "7C3AED" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws, 'Matkul Umum');
      XLSX.writeFile(wb, `Matkul_Umum_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      showToast(`Berhasil export ${courses.length} mata kuliah umum`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Gagal mengexport data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mata Kuliah Umum</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Kelola mata kuliah yang bisa di-assign ke beberapa prodi
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Download Template */}
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                title="Download Template Excel"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Template</span>
              </button>
              
              {/* Import Excel */}
              <label className={`flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {importing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{importing ? 'Importing...' : 'Import'}</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  disabled={importing}
                  className="hidden"
                />
              </label>
              
              {/* Export Excel */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                title="Export ke Excel"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              
              {/* Add Button */}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Info Card */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Tentang Mata Kuliah Umum</h3>
              <p className="text-sm text-blue-700 mt-1">
                Mata kuliah umum adalah mata kuliah yang diajarkan di beberapa program studi sekaligus, 
                seperti Pendidikan Agama, Pancasila, Bahasa Indonesia, dll. 
                Anda dapat membuat satu mata kuliah dan meng-assign ke prodi-prodi yang membutuhkan.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Tidak ada hasil' : 'Belum ada mata kuliah umum'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Coba kata kunci lain' 
                : 'Tambahkan mata kuliah umum untuk mulai'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Tambah Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Course Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {course.credits || 0} SKS
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          Semester {course.semester || '-'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{course.title}</h3>
                      
                      {/* Assigned Prodis */}
                      <div className="mt-3">
                        <button
                          onClick={() => toggleExpand(course.id)}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>
                            {course.assigned_prodis?.length || 0} Prodi ter-assign
                          </span>
                          {expandedRows[course.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/cpmk?course_id=${course.id}`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Kelola CPMK"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openAssignModal(course)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Assign ke Prodi"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded - Show Assigned Prodis */}
                {expandedRows[course.id] && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Prodi yang mendapat mata kuliah ini:</h4>
                    {course.assigned_prodis?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {course.assigned_prodis.map((assign) => (
                          <div 
                            key={assign.id}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200"
                          >
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{assign.prodi?.nama_prodi || 'Unknown'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada prodi yang di-assign</p>
                    )}
                    <button
                      onClick={() => openAssignModal(course)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Kelola Assignment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Mata Kuliah Umum' : 'Tambah Mata Kuliah Umum'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode MK *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="MK001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Mata Kuliah *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Pendidikan Agama Islam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKS
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="2"
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="1"
                    min="1"
                    max="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Prodi Selection for new course */}
              {!editingCourse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign ke Prodi (opsional)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                    {prodis.map((prodi) => (
                      <label key={prodi.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.prodi_ids.includes(prodi.id)}
                          onChange={() => {
                            setFormData(prev => ({
                              ...prev,
                              prodi_ids: prev.prodi_ids.includes(prodi.id)
                                ? prev.prodi_ids.filter(id => id !== prodi.id)
                                : [...prev.prodi_ids, prodi.id]
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{prodi.nama_prodi}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCourse ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && assigningCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Assign ke Prodi</h2>
                  <p className="text-sm text-gray-600 mt-1">{assigningCourse.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningCourse(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-sm text-gray-600 mb-4">
                Pilih prodi yang akan mendapat mata kuliah ini:
              </p>
              <div className="space-y-2">
                {prodis.map((prodi) => (
                  <label
                    key={prodi.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProdis.includes(prodi.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProdis.includes(prodi.id)}
                      onChange={() => toggleProdiSelection(prodi.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{prodi.nama_prodi}</p>
                      <p className="text-xs text-gray-500">{prodi.fakultas}</p>
                    </div>
                    {selectedProdis.includes(prodi.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {selectedProdis.length} prodi dipilih
                </span>
                <button
                  onClick={() => setSelectedProdis(prodis.map(p => p.id))}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Pilih Semua
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningCourse(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveAssignment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Progress Modal */}
      {importing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mengimpor Mata Kuliah Umum...</h3>
              <p className="text-sm text-gray-600 mb-4 truncate px-2">{importProgress.message}</p>
              
              {importProgress.total > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {importProgress.current} dari {importProgress.total} mata kuliah
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
