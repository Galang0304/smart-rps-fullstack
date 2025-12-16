/**
 * ==========================================
 * SMART RPS - Sistem Pembuatan RPS Otomatis
 * ==========================================
 * 
 * STRUKTUR RPS (6 TAHAPAN):
 * 
 * 1. DESKRIPSI MATA KULIAH
 *    - 1 paragraf formal akademik
 *    - Generate AI atau input manual
 * 
 * 2. CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)
 *    - 3–5 CPMK (bisa lebih)
 *    - Diturunkan dari CPL Prodi
 *    - Kata kerja operasional (Taksonomi Bloom)
 *    - Generate AI per item atau manual
 * 
 * 3. SUB-CPMK
 *    - Fixed 14 Sub-CPMK
 *    - 1 Sub-CPMK per pertemuan (14 pertemuan materi)
 *    - Urut dari dasar ke lanjut
 *    - Setiap Sub-CPMK terhubung ke CPMK tertentu
 *    - Generate AI individual atau batch
 * 
 * 4. BAHAN KAJIAN / MATERI
 *    - Daftar topik/materi inti
 *    - Selaras dengan Sub-CPMK
 *    - Generate AI atau manual
 * 
 * 5. RENCANA PEMBELAJARAN MINGGUAN (16 Minggu)
 *    - Minggu 1–7   : Materi + Sub-CPMK
 *    - Minggu 8     : UJIAN TENGAH SEMESTER (UTS)
 *    - Minggu 9–15  : Materi + Sub-CPMK
 *    - Minggu 16    : UJIAN AKHIR SEMESTER (UAS)
 *    
 *    Per minggu materi berisi:
 *    - Minggu ke-
 *    - Sub-CPMK yang dipelajari
 *    - Materi Pembelajaran
 *    - Metode Pembelajaran (Ceramah, Diskusi, Praktikum, dll)
 *    - Bentuk Penilaian (Tugas, Kuis, Presentasi, dll)
 * 
 * 6. REFERENSI
 *    - Minimal 3 buku
 *    - Minimal 2 jurnal
 *    - Relevan dengan mata kuliah
 *    - Format sitasi lengkap
 * 
 * OUTPUT:
 * - JSON structure untuk database
 * - Export ke Word (template RPS resmi)
 * ==========================================
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Bot, Save, Loader2, X, Plus, BookOpen, Eye, EyeOff, Database, PenLine, FileText, List, Calendar, Book } from 'lucide-react';
import { courseAPI, aiHelperAPI, generatedRPSAPI } from '../services/api';
import apiClient from '../services/api';

export default function RPSCreate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editRpsId = searchParams.get('edit');
  const courseIdFromQuery = searchParams.get('courseId');
  
  const userRole = localStorage.getItem('role');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || courseIdFromQuery || '');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedRpsId, setSavedRpsId] = useState(editRpsId || null);

  // Form Data State - Struktur Baru yang Lebih Kompleks
  const [formData, setFormData] = useState({
    // Step 1: Deskripsi Mata Kuliah
    description: '',
    
    // Step 2: CPMK
    cpmk: [
      { code: 'CPMK-1', description: '' },
      { code: 'CPMK-2', description: '' },
      { code: 'CPMK-3', description: '' },
    ],
    
    // Step 3: Sub-CPMK (14 items)
    subCpmk: Array.from({ length: 14 }, (_, i) => ({
      code: `Sub-CPMK-${i + 1}`,
      description: '',
      relatedCpmk: '' // Link ke CPMK mana
    })),
    
    // Step 4: Bahan Kajian
    bahanKajian: ['', '', ''],
    
    // Step 5: Rencana Pembelajaran (16 minggu)
    rencanaMingguan: Array.from({ length: 16 }, (_, i) => {
      const minggu = i + 1;
      if (minggu === 8) {
        return {
          minggu: 8,
          isUTS: true,
          subCpmk: '',
          materi: 'Ujian Tengah Semester',
          metode: '',
          penilaian: 'UTS'
        };
      } else if (minggu === 16) {
        return {
          minggu: 16,
          isUAS: true,
          subCpmk: '',
          materi: 'Ujian Akhir Semester',
          metode: '',
          penilaian: 'UAS'
        };
      } else {
        return {
          minggu,
          subCpmk: '',
          materi: '',
          metode: '',
          penilaian: ''
        };
      }
    }),
    
    // Step 6: Referensi
    referensi: ['', '', '']
  });

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await courseAPI.getAll();
        // Handle nested response: res.data.data.data for pagination or res.data.data for direct array
        const coursesData = res.data?.data?.data || res.data?.data || [];
        console.log('Courses loaded:', coursesData);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Failed to load courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Load selected course
  useEffect(() => {
    if (selectedCourseId && Array.isArray(courses) && courses.length > 0) {
      const foundCourse = courses.find(c => c.id.toString() === selectedCourseId.toString());
      setCourse(foundCourse || null);
    }
  }, [selectedCourseId, courses]);

  // Load existing RPS if editing
  useEffect(() => {
    if (editRpsId && course) {
      loadExistingRPS(editRpsId);
    }
  }, [editRpsId, course]);

  const loadExistingRPS = async (rpsId) => {
    try {
      const res = await generatedRPSAPI.getById(rpsId);
      if (res.data.success && res.data.data) {
        const rpsData = res.data.data;
        // Parse and load existing data
        // TODO: Implement parsing logic based on saved format
      }
    } catch (error) {
      console.error('Failed to load existing RPS:', error);
    }
  };

  const handleSave = async () => {
    if (!course) {
      alert('Pilih mata kuliah terlebih dahulu!');
      return;
    }

    // Validation
    if (!formData.description.trim()) {
      alert('Deskripsi mata kuliah harus diisi!');
      return;
    }

    const validCpmk = formData.cpmk.filter(c => c.description.trim());
    if (validCpmk.length === 0) {
      alert('Minimal 1 CPMK harus diisi!');
      return;
    }

    const validSubCpmk = formData.subCpmk.filter(s => s.description.trim());
    if (validSubCpmk.length < 14) {
      alert('Semua 14 Sub-CPMK harus diisi!');
      return;
    }

    setSaving(true);
    try {
      // Format data untuk disimpan
      const rpsContent = {
        deskripsi: formData.description,
        cpmk: formData.cpmk.filter(c => c.description.trim()),
        subCpmk: formData.subCpmk.filter(s => s.description.trim()),
        bahanKajian: formData.bahanKajian.filter(b => b.trim()),
        rencanaMingguan: formData.rencanaMingguan,
        referensi: formData.referensi.filter(r => r.trim())
      };

      const payload = {
        course_id: course.id,
        result: rpsContent,
        status: 'draft'
      };

      let res;
      if (savedRpsId) {
        res = await generatedRPSAPI.update(savedRpsId, payload);
      } else {
        res = await generatedRPSAPI.create(payload);
      }

      // Check if response has data (success)
      if (res.data && res.data.data) {
        setSavedRpsId(res.data.data.id);
        alert('✅ RPS berhasil disimpan!');
        // Navigate based on role
        const userRole = localStorage.getItem('role');
        if (userRole === 'kaprodi') {
          navigate('/kaprodi/rps');
        } else if (userRole === 'dosen') {
          navigate('/dosen/rps');
        } else {
          navigate('/rps');
        }
      }
    } catch (error) {
      console.error('Failed to save RPS:', error);
      alert('❌ Gagal menyimpan RPS');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (courses.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Belum ada mata kuliah.</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ke Halaman Mata Kuliah
        </button>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Deskripsi MK', icon: FileText },
    { id: 2, title: 'CPMK', icon: List },
    { id: 3, title: 'Sub-CPMK', icon: List },
    { id: 4, title: 'Bahan Kajian', icon: Book },
    { id: 5, title: 'Rencana 16 Minggu', icon: Calendar },
    { id: 6, title: 'Referensi', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Buat RPS Lengkap</h1>
        <p className="text-gray-600 mt-2">
          Sistem pembuatan RPS komprehensif dengan 6 tahapan lengkap
        </p>

        {/* Course Selector */}
        {!courseId && !courseIdFromQuery && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {Array.isArray(courses) && courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {course && (
          <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">{course.code} - {course.title}</p>
            <p className="text-xs text-blue-600 mt-1">{course.credits} SKS • Semester {course.semester}</p>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {!selectedCourseId && !courseId && !courseIdFromQuery ? (
        <div className="bg-gray-50 rounded-lg shadow p-12 mb-6 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pilih Mata Kuliah Terlebih Dahulu</h3>
          <p className="text-gray-500">
            Silakan pilih mata kuliah dari dropdown di atas untuk mulai membuat RPS
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            {currentStep === 1 && <DeskripsiStep formData={formData} setFormData={setFormData} course={course} />}
            {currentStep === 2 && <CPMKStep formData={formData} setFormData={setFormData} course={course} />}
            {currentStep === 3 && <SubCPMKStep formData={formData} setFormData={setFormData} course={course} />}
            {currentStep === 4 && <BahanKajianStep formData={formData} setFormData={setFormData} course={course} />}
            {currentStep === 5 && <RencanaMingguanStep formData={formData} setFormData={setFormData} course={course} />}
            {currentStep === 6 && <ReferensiStep formData={formData} setFormData={setFormData} course={course} />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
            >
              ← Kembali
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Langkah {currentStep} dari {steps.length}
              </p>
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!selectedCourseId}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
              >
                Lanjut →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !selectedCourseId}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Simpan RPS</span>
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ===== STEP COMPONENTS =====

// Step 1: Deskripsi Mata Kuliah
function DeskripsiStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!course) return;
    setGenerating(true);
    try {
      const res = await aiHelperAPI.generateCourseDescription({
        course_code: course.code,
        course_title: course.title,
        credits: course.credits
      });
      
      if (res.data.data && res.data.data.description) {
        setFormData({ ...formData, description: res.data.data.description });
      }
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Gagal generate deskripsi. Pastikan Gemini API key sudah diset.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Deskripsi Mata Kuliah</h2>
          <p className="text-gray-600">
            Tuliskan deskripsi lengkap tentang mata kuliah ini, termasuk tujuan dan gambaran umum pembelajaran.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate AI</span>
            </>
          )}
        </button>
      </div>

      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Masukkan deskripsi mata kuliah secara lengkap..."
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={12}
      />
      
      <p className="text-sm text-gray-500 mt-2">
        {formData.description.length} karakter
      </p>
    </div>
  );
}

// Step 2: CPMK
function CPMKStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);

  const handleGenerateOne = async (index) => {
    if (!course) return;
    setGenerating(true);
    setGeneratingIndex(index);
    try {
      const res = await aiHelperAPI.generateCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        existing_cpl: [],
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const newCpmk = [...formData.cpmk];
        newCpmk[index].description = res.data.data.items[0].description;
        setFormData({ ...formData, cpmk: newCpmk });
      }
    } catch (error) {
      console.error('Failed to generate CPMK:', error);
      alert('Gagal generate CPMK');
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const handleAdd = () => {
    const newNumber = formData.cpmk.length + 1;
    setFormData({
      ...formData,
      cpmk: [...formData.cpmk, { code: `CPMK-${newNumber}`, description: '' }]
    });
  };

  const handleRemove = (index) => {
    const newCpmk = formData.cpmk.filter((_, i) => i !== index);
    setFormData({ ...formData, cpmk: newCpmk });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Capaian Pembelajaran Mata Kuliah (CPMK)</h2>
        <p className="text-gray-600">
          Definisikan 3-5 CPMK untuk mata kuliah ini (bisa lebih). Gunakan kata kerja operasional (Taksonomi Bloom).
        </p>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Contoh kata kerja:</strong> Menjelaskan, Menganalisis, Merancang, Menerapkan, Mengevaluasi, Mengimplementasikan
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Array.isArray(formData.cpmk) && formData.cpmk.map((item, index) => (
          <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg">
                  {item.code}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newCpmk = [...formData.cpmk];
                    newCpmk[index].description = e.target.value;
                    setFormData({ ...formData, cpmk: newCpmk });
                  }}
                  placeholder="Masukkan deskripsi CPMK..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <button
                onClick={() => handleGenerateOne(index)}
                disabled={generating && generatingIndex === index}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {generating && generatingIndex === index ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </button>
              {formData.cpmk.length > 1 && (
                <button
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        <button
          onClick={handleAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
        >
          + Tambah CPMK
        </button>
      </div>
    </div>
  );
}

// Step 3: Sub-CPMK (14 items)
function SubCPMKStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const handleGenerateOne = async (index) => {
    if (!course) return;
    
    const subCpmk = formData.subCpmk[index];
    if (!Array.isArray(formData.cpmk)) {
      alert('Data CPMK tidak valid!');
      return;
    }
    const relatedCpmk = formData.cpmk.find(c => c.code === subCpmk.relatedCpmk);
    
    if (!relatedCpmk || !relatedCpmk.description) {
      alert('Pilih dan isi CPMK yang terkait terlebih dahulu!');
      return;
    }

    setGenerating(true);
    setGeneratingIndex(index);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        cpmk: `${relatedCpmk.code}: ${relatedCpmk.description}`,
        course_title: course.title,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const newSubCpmk = [...formData.subCpmk];
        newSubCpmk[index].description = res.data.data.items[0].description;
        setFormData({ ...formData, subCpmk: newSubCpmk });
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const handleGenerateAll = async () => {
    if (!Array.isArray(formData.cpmk) || formData.cpmk.length === 0) {
      alert('Harap isi CPMK terlebih dahulu!');
      return;
    }

    // Filter CPMK yang sudah terisi
    const validCpmk = formData.cpmk.filter(c => c.description && c.description.trim());
    if (validCpmk.length === 0) {
      alert('Harap isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setProgressText('Memulai generate...');
    
    try {
      const newSubCpmk = [...formData.subCpmk];
      
      // Auto-assign CPMK ke Sub-CPMK secara merata (14 Sub-CPMK untuk n CPMK)
      const subCpmkPerCpmk = Math.ceil(14 / validCpmk.length);
      
      for (let i = 0; i < 14; i++) {
        const cpmkIndex = Math.floor(i / subCpmkPerCpmk);
        const relatedCpmk = validCpmk[Math.min(cpmkIndex, validCpmk.length - 1)];
        
        // Auto-assign CPMK
        newSubCpmk[i].relatedCpmk = relatedCpmk.code;

        // Update progress
        const currentProgress = Math.round(((i + 1) / 14) * 100);
        setProgress(currentProgress);
        setProgressText(`Generating Sub-CPMK ${i + 1} dari 14...`);

        // Generate deskripsi jika belum ada
        if (!newSubCpmk[i].description.trim()) {
          try {
            const res = await aiHelperAPI.generateSubCPMK({
              course_id: course.id,
              cpmk: `${relatedCpmk.code}: ${relatedCpmk.description}`,
              course_title: course.title,
            });
            
            if (res.data.data.items && res.data.data.items.length > 0) {
              newSubCpmk[i].description = res.data.data.items[0].description;
            }
          } catch (error) {
            console.error(`Failed to generate Sub-CPMK ${i + 1}:`, error);
          }
        }
        
        // Update formData setiap iterasi agar user bisa lihat progress
        setFormData({ ...formData, subCpmk: newSubCpmk });
      }
      
      setProgress(100);
      setProgressText('Selesai!');
      setTimeout(() => {
        alert('✅ Generate selesai! CPMK telah dipilih dan Sub-CPMK terisi otomatis.');
      }, 500);
    } catch (error) {
      console.error('Failed to generate all:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        setProgressText('');
      }, 1000);
    }
  };

  return (
    <div>
      {/* Progress Modal Overlay */}
      {generating && generatingIndex === null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Bot className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Sub-CPMK</h3>
              <p className="text-sm text-gray-600">{progressText}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-bold text-purple-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end px-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="text-xs text-white font-bold">{progress}%</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Mohon tunggu, AI sedang bekerja...
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📝 Sub-Capaian Pembelajaran (Sub-CPMK)</h2>
          <p className="text-gray-600">
            Total 14 Sub-CPMK untuk 14 minggu pembelajaran (minggu 8 UTS, minggu 16 UAS).
          </p>
          <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700">
              <strong>Catatan:</strong> Urutkan Sub-CPMK dari dasar ke lanjut. Setiap Sub-CPMK harus terkait dengan salah satu CPMK di atas.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateAll}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {generating && generatingIndex === null ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating All...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate All</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(formData.subCpmk) && formData.subCpmk.map((item, index) => (
          <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-3 mb-2">
              <span className="inline-block px-3 py-1 bg-purple-600 text-white font-semibold rounded-lg text-sm">
                {item.code}
              </span>
              <select
                value={item.relatedCpmk}
                onChange={(e) => {
                  const newSubCpmk = [...formData.subCpmk];
                  newSubCpmk[index].relatedCpmk = e.target.value;
                  setFormData({ ...formData, subCpmk: newSubCpmk });
                }}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">- Pilih CPMK -</option>
                {Array.isArray(formData.cpmk) && formData.cpmk.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <button
                onClick={() => handleGenerateOne(index)}
                disabled={generating && generatingIndex === index}
                className="flex-shrink-0 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {generating && generatingIndex === index ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
              </button>
            </div>
            <textarea
              value={item.description}
              onChange={(e) => {
                const newSubCpmk = [...formData.subCpmk];
                newSubCpmk[index].description = e.target.value;
                setFormData({ ...formData, subCpmk: newSubCpmk });
              }}
              placeholder="Deskripsi Sub-CPMK..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 4: Bahan Kajian
function BahanKajianStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!course) return;
    setGenerating(true);
    try {
      // Generate bahan kajian berdasarkan course dan CPMK
      const res = await aiHelperAPI.generateBahanKajian({
        course_code: course.code,
        course_title: course.title,
        cpmk_list: formData.cpmk.filter(c => c.description.trim())
      });
      
      if (res.data.data && res.data.data.items) {
        // Ensure items are strings
        const items = res.data.data.items.map(item => {
          if (typeof item === 'string') {
            return item;
          }
          // If it's an object, try to extract meaningful string
          if (typeof item === 'object' && item !== null) {
            return item.title || item.description || item.name || JSON.stringify(item);
          }
          return String(item);
        });
        setFormData({ ...formData, bahanKajian: items });
      }
    } catch (error) {
      console.error('Failed to generate bahan kajian:', error);
      alert('Gagal generate bahan kajian');
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = () => {
    setFormData({ ...formData, bahanKajian: [...formData.bahanKajian, ''] });
  };

  const handleRemove = (index) => {
    const newBahan = formData.bahanKajian.filter((_, i) => i !== index);
    setFormData({ ...formData, bahanKajian: newBahan });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Bahan Kajian</h2>
          <p className="text-gray-600">
            Daftar topik/bahan kajian yang akan dipelajari dalam mata kuliah ini. Selaras dengan Sub-CPMK.
          </p>
          <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>Tips:</strong> Susun materi dari konsep dasar hingga aplikasi tingkat lanjut
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate AI</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {Array.isArray(formData.bahanKajian) && formData.bahanKajian.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newBahan = [...formData.bahanKajian];
                newBahan[index] = e.target.value;
                setFormData({ ...formData, bahanKajian: newBahan });
              }}
              placeholder="Nama bahan kajian / topik pembelajaran..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.bahanKajian.length > 1 && (
              <button
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={handleAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
        >
          + Tambah Bahan Kajian
        </button>
      </div>
    </div>
  );
}

// Step 5: Rencana Pembelajaran 16 Minggu
function RencanaMingguanStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateAll = async () => {
    if (!course) return;
    setGenerating(true);
    try {
      const res = await aiHelperAPI.generateRencanaPembelajaran({
        course_code: course.code,
        course_title: course.title,
        cpmk_list: formData.cpmk.filter(c => c.description.trim()),
        sub_cpmk_list: formData.subCpmk.filter(s => s.description.trim()),
        bahan_kajian: formData.bahanKajian.filter(b => b.trim())
      });
      
      if (res.data.data && res.data.data.weeks) {
        const newRencana = [...formData.rencanaMingguan];
        res.data.data.weeks.forEach((week, index) => {
          if (!newRencana[index].isUTS && !newRencana[index].isUAS) {
            newRencana[index] = { ...newRencana[index], ...week };
          }
        });
        setFormData({ ...formData, rencanaMingguan: newRencana });
      }
    } catch (error) {
      console.error('Failed to generate rencana:', error);
      alert('Gagal generate rencana pembelajaran');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Rencana Pembelajaran 16 Minggu</h2>
          <p className="text-gray-600">
            Rencana detail untuk setiap minggu (Minggu 8: UTS, Minggu 16: UAS).
          </p>
        </div>
        <button
          onClick={handleGenerateAll}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate All</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {Array.isArray(formData.rencanaMingguan) && formData.rencanaMingguan.map((minggu, index) => (
          <div 
            key={index} 
            className={`p-4 border-2 rounded-lg ${
              minggu.isUTS || minggu.isUAS 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 hover:border-blue-300'
            } transition-colors`}
          >
            <h3 className={`font-bold text-lg mb-3 ${minggu.isUTS || minggu.isUAS ? 'text-red-700' : 'text-blue-600'}`}>
              Minggu {minggu.minggu}
              {minggu.isUTS && ' - UJIAN TENGAH SEMESTER'}
              {minggu.isUAS && ' - UJIAN AKHIR SEMESTER'}
            </h3>
            
            {!minggu.isUTS && !minggu.isUAS && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-CPMK</label>
                  <select
                    value={minggu.subCpmk}
                    onChange={(e) => {
                      const newRencana = [...formData.rencanaMingguan];
                      newRencana[index].subCpmk = e.target.value;
                      setFormData({ ...formData, rencanaMingguan: newRencana });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">- Pilih Sub-CPMK -</option>
                    {Array.isArray(formData.subCpmk) && formData.subCpmk.map(s => (
                      <option key={s.code} value={s.code}>{s.code}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembelajaran</label>
                  <input
                    type="text"
                    value={minggu.metode}
                    onChange={(e) => {
                      const newRencana = [...formData.rencanaMingguan];
                      newRencana[index].metode = e.target.value;
                      setFormData({ ...formData, rencanaMingguan: newRencana });
                    }}
                    placeholder="Ceramah, Diskusi, Praktikum..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materi Pembelajaran</label>
                  <textarea
                    value={minggu.materi}
                    onChange={(e) => {
                      const newRencana = [...formData.rencanaMingguan];
                      newRencana[index].materi = e.target.value;
                      setFormData({ ...formData, rencanaMingguan: newRencana });
                    }}
                    placeholder="Deskripsi materi..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penilaian</label>
                  <input
                    type="text"
                    value={minggu.penilaian}
                    onChange={(e) => {
                      const newRencana = [...formData.rencanaMingguan];
                      newRencana[index].penilaian = e.target.value;
                      setFormData({ ...formData, rencanaMingguan: newRencana });
                    }}
                    placeholder="Tugas, Kuis, Presentasi..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 6: Referensi
function ReferensiStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!course) return;
    setGenerating(true);
    try {
      const res = await aiHelperAPI.generateReferensi({
        course_code: course.code,
        course_title: course.title,
        description: formData.description
      });
      
      if (res.data.data && res.data.data.items) {
        // Convert object format to string format
        const items = res.data.data.items.map(item => {
          if (typeof item === 'string') {
            return item;
          }
          // Format: Author. (Year). Title. Publisher.
          const author = item.author || 'Unknown Author';
          const year = item.year || 'n.d.';
          const title = item.title || 'Untitled';
          const publisher = item.publisher || '';
          const type = item.type === 'journal' ? '[Jurnal]' : '[Buku]';
          return `${author}. (${year}). ${title}. ${publisher} ${type}`.trim();
        });
        setFormData({ ...formData, referensi: items });
      }
    } catch (error) {
      console.error('Failed to generate referensi:', error);
      alert('Gagal generate referensi');
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = () => {
    setFormData({ ...formData, referensi: [...formData.referensi, ''] });
  };

  const handleRemove = (index) => {
    const newRef = formData.referensi.filter((_, i) => i !== index);
    setFormData({ ...formData, referensi: newRef });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Referensi</h2>
          <p className="text-gray-600">
            Daftar buku, jurnal, dan sumber pembelajaran lainnya.
          </p>
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700">
              <strong>Minimal:</strong> 3 buku + 2 jurnal ilmiah yang relevan dengan mata kuliah
            </p>
            <p className="text-xs text-green-600 mt-1">
              Format: Penulis. (Tahun). Judul. Penerbit/Jurnal.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate AI</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {Array.isArray(formData.referensi) && formData.referensi.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold mt-1">
              {index + 1}
            </span>
            <textarea
              value={item}
              onChange={(e) => {
                const newRef = [...formData.referensi];
                newRef[index] = e.target.value;
                setFormData({ ...formData, referensi: newRef });
              }}
              placeholder="Nama penulis, tahun, judul buku/jurnal, penerbit..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
            />
            {formData.referensi.length > 1 && (
              <button
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 p-2 mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={handleAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors font-medium"
        >
          + Tambah Referensi
        </button>
      </div>
    </div>
  );
}
