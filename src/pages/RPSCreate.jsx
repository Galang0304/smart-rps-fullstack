import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Bot, Save, Loader2, Sparkles, X, Plus, Trash2, BookOpen, Eye, EyeOff, Database, PenLine } from 'lucide-react';
import { courseAPI, aiHelperAPI, generatedRPSAPI, API_BASE_URL } from '../services/api';
import apiClient from '../services/api';
import WordPreview from '../components/WordPreview';
import InputModeSelector from '../components/InputModeSelector';

export default function RPSCreate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editRpsId = searchParams.get('edit');
  const courseIdFromQuery = searchParams.get('courseId');
  
  const userRole = localStorage.getItem('role');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('RPSCreate loaded - userRole:', userRole, 'userData:', userData);
  
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || courseIdFromQuery || '');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [savedRpsId, setSavedRpsId] = useState(editRpsId || null);
  const [hasDBCpmk, setHasDBCpmk] = useState(false);
  
  const [formData, setFormData] = useState({
    cpmk: [
      { code: 'CPMK-1', description: '' },
      { code: 'CPMK-2', description: '' },
      { code: 'CPMK-3', description: '' },
    ],
    subCPMK: [
      { code: 'Sub-CPMK-1', description: '', cpmk_id: 'CPMK-1' },
      { code: 'Sub-CPMK-2', description: '', cpmk_id: 'CPMK-1' },
      { code: 'Sub-CPMK-3', description: '', cpmk_id: 'CPMK-1' },
    ],
    topik: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      topic: '',
      description: '',
    })),
    tugas: [
      { 
        nomor: 1, 
        sub_cpmk: '', 
        indikator: '',
        judul_tugas: '',
        batas_waktu: '',
        petunjuk_pengerjaan: '',
        luaran_tugas: '',
        kriteria: '',
        teknik_penilaian: '', 
        bobot: 0,
        daftar_rujukan: []
      },
      { 
        nomor: 2, 
        sub_cpmk: '', 
        indikator: '',
        judul_tugas: '',
        batas_waktu: '',
        petunjuk_pengerjaan: '',
        luaran_tugas: '',
        kriteria: '',
        teknik_penilaian: '', 
        bobot: 0,
        daftar_rujukan: []
      },
      { 
        nomor: 3, 
        sub_cpmk: '', 
        indikator: '',
        judul_tugas: '',
        batas_waktu: '',
        petunjuk_pengerjaan: '',
        luaran_tugas: '',
        kriteria: '',
        teknik_penilaian: '', 
        bobot: 0,
        daftar_rujukan: []
      },
    ],
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourse(selectedCourseId);
    } else if (courseIdFromQuery) {
      // Set course ID dari URL query parameter
      setSelectedCourseId(courseIdFromQuery);
    } else {
      setLoading(false);
    }
  }, [selectedCourseId, courseIdFromQuery]);

  // Load RPS data jika mode edit
  useEffect(() => {
    if (editRpsId) {
      loadRPSData(editRpsId);
    }
  }, [editRpsId]);

  const loadCourses = async () => {
    try {
      let res;
      const prodiId = localStorage.getItem('prodi_id');
      
      // Jika role kaprodi/prodi, ambil courses by prodi_id
      if ((userRole === 'kaprodi' || userRole === 'prodi') && prodiId) {
        console.log('Loading courses for prodi:', prodiId);
        res = await courseAPI.getByProgramId(prodiId);
      } else {
        // Admin atau role lain
        res = await courseAPI.getAll();
      }
      
      console.log('Courses response:', res);
      
      // Handle nested response structure
      let courseList = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        courseList = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        courseList = res.data.data;
      } else if (Array.isArray(res.data)) {
        courseList = res.data;
      }
      
      console.log('Parsed courseList:', courseList);
      
      setCourses(courseList);
      
      // Set selected course dari URL params atau query, jangan auto-select
      if (courseIdFromQuery && !selectedCourseId) {
        setSelectedCourseId(courseIdFromQuery);
      } else if (courseId && !selectedCourseId) {
        setSelectedCourseId(courseId);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      // Jangan redirect ke login jika hanya 404 atau masalah lain
      if (error.response?.status !== 401) {
        console.warn('Could not load courses, but continuing anyway');
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async (id) => {
    setLoading(true);
    try {
      const res = await courseAPI.getById(id);
      setCourse(res.data.data);
      
      // Check if this course already has RPS (only in create mode, not edit)
      if (!editRpsId) {
        try {
          const rpsRes = await generatedRPSAPI.getAll();
          let rpsList = [];
          if (rpsRes.data?.data?.data && Array.isArray(rpsRes.data.data.data)) {
            rpsList = rpsRes.data.data.data;
          } else if (rpsRes.data?.data && Array.isArray(rpsRes.data.data)) {
            rpsList = rpsRes.data.data;
          } else if (Array.isArray(rpsRes.data)) {
            rpsList = rpsRes.data;
          }
          
          const existingRPS = rpsList.find(rps => rps.course_id === id);
          if (existingRPS) {
            alert('RPS untuk mata kuliah ini sudah ada. Anda akan diarahkan ke daftar RPS.');
            navigate(userRole === 'prodi' || userRole === 'kaprodi' ? '/prodi/rps' : '/rps');
            return;
          }
        } catch (rpsError) {
          console.error('Failed to check existing RPS:', rpsError);
          // Continue anyway if check fails
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
      if (error.response?.status !== 401) {
        console.warn('Could not load course details');
        setCourse(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRPSData = async (rpsId) => {
    try {
      const res = await generatedRPSAPI.getById(rpsId);
      const rpsData = res.data.data;
      
      // Load data dari result field
      if (rpsData.result) {
        setFormData({
          cpmk: rpsData.result.cpmk || formData.cpmk,
          subCPMK: rpsData.result.subCPMK || formData.subCPMK,
          topik: rpsData.result.topik || formData.topik,
          tugas: rpsData.result.tugas || formData.tugas,
        });
      }
    } catch (error) {
      console.error('Failed to load RPS data:', error);
      if (error.response?.status !== 401) {
        alert('Gagal memuat data RPS untuk edit');
      }
    }
  };

  const handleSave = async () => {
    if (!selectedCourseId) {
      alert('Pilih mata kuliah terlebih dahulu');
      return;
    }
    
    // Validasi minimal ada data
    if (formData.cpmk.length === 0) {
      alert('Minimal harus ada 1 CPMK untuk menyimpan RPS');
      return;
    }
    
    setSaving(true);
    try {
      if (editRpsId) {
        // Mode edit - update existing RPS (status tetap seperti sebelumnya)
        await generatedRPSAPI.update(editRpsId, {
          result: formData,
        });
        alert('RPS berhasil diupdate!');
      } else {
        // Mode create - buat RPS baru dengan status draft
        const createPayload = {
          template_version_id: null,
          course_id: selectedCourseId,
          generated_by: null,
        };
        
        const createRes = await generatedRPSAPI.create(createPayload);
        const newRpsId = createRes.data.data.id;
        
        const completePayload = {
          job_id: newRpsId,
          status: 'draft',
          result: formData,
        };
        
        await generatedRPSAPI.createDraft(completePayload);
        alert('RPS berhasil disimpan sebagai Draft!');
      }
      
      // Navigate based on role
      const rpsListRoute = userRole === 'prodi' ? '/prodi/rps' : '/rps/list';
      navigate(rpsListRoute);
    } catch (error) {
      console.error('Failed to save RPS:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert('Gagal menyimpan RPS: ' + errorMsg);
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
        <p className="text-sm text-gray-400">Silakan upload data mata kuliah terlebih dahulu di halaman Mata Kuliah.</p>
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
    { id: 1, title: 'CPMK', component: CPMKStep },
    { id: 2, title: 'Sub-CPMK', component: SubCPMKStep },
    { id: 3, title: 'Topik Pembelajaran', component: TopikStep },
    { id: 4, title: 'Rencana Tugas', component: TugasStep },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buat RPS Baru</h1>
        <p className="text-gray-600 mt-1">
          Buat Rencana Pembelajaran Semester dengan bantuan AI
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
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
            {!selectedCourseId && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Silakan pilih mata kuliah terlebih dahulu untuk melanjutkan
              </p>
            )}
          </div>
        )}
        {course && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">{course.code} - {course.title}</p>
            <p className="text-xs text-blue-600">{course.credits} SKS</p>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-sm mt-2 text-gray-600">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Toggle Preview Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showPreview 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview Word'}
        </button>
      </div>

      {/* Main Content with Optional Preview */}
      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Form Section */}
        <div>
          {/* Current Step Content */}
          {!selectedCourseId && !courseId && !courseIdFromQuery ? (
            <div className="bg-gray-50 rounded-lg shadow p-12 mb-6 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pilih Mata Kuliah Terlebih Dahulu</h3>
              <p className="text-gray-500">
                Silakan pilih mata kuliah dari dropdown di atas untuk mulai membuat RPS
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <CurrentStepComponent
                course={course}
                formData={formData}
                setFormData={setFormData}
                hasDBCpmk={hasDBCpmk}
                setHasDBCpmk={setHasDBCpmk}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || !selectedCourseId}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kembali
            </button>
            
            <div className="flex gap-3">
              {currentStep < steps.length ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!selectedCourseId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving || !selectedCourseId}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <WordPreview 
              course={course} 
              formData={formData} 
              rpsId={savedRpsId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// === STEP COMPONENTS ===

function CPMKStep({ course, formData, setFormData, hasDBCpmk, setHasDBCpmk }) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null); // Track which CPMK is being generated
  const [loadingDB, setLoadingDB] = useState(false);
  const [inputMode, setInputMode] = useState(null); // 'manual', 'database', 'ai'
  const [checkingDB, setCheckingDB] = useState(true);
  const [saving, setSaving] = useState(false);
  const userRole = localStorage.getItem('role');

  // Load CPMK from database on mount
  useEffect(() => {
    const loadDBCpmk = async () => {
      if (!course?.id) return;
      setCheckingDB(true);
      try {
        const res = await apiClient.get(`/cpmk/course/${course.id}`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const dbCpmks = res.data.data.map((cpmk, index) => ({
            code: `CPMK-${cpmk.cpmk_number}`,
            description: cpmk.description,
            id: cpmk.id,
            fromDB: true
          }));
          setFormData({ ...formData, cpmk: dbCpmks });
          setHasDBCpmk(true);
          setInputMode('database');
        }
      } catch (error) {
        console.error('Failed to load CPMK from DB:', error);
        setHasDBCpmk(false);
      } finally {
        setCheckingDB(false);
      }
    };
    loadDBCpmk();
  }, [course?.id]);

  const handleLoadFromDB = async () => {
    setLoadingDB(true);
    setInputMode('database');
    try {
      // Load from DB via direct API call (already done in useEffect)
      // This button is just to refresh if needed
      const res = await apiClient.get(`/cpmk/course/${course.id}`);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        const dbCpmks = res.data.data.map((cpmk) => ({
          code: `CPMK-${cpmk.cpmk_number}`,
          description: cpmk.description,
          id: cpmk.id,
          fromDB: true
        }));
        
        // Merge with existing non-DB CPMK
        const existingNonDB = formData.cpmk.filter(c => !c.fromDB);
        const merged = [...dbCpmks, ...existingNonDB];
        
        setFormData({ ...formData, cpmk: merged });
        setHasDBCpmk(true);
        alert(`✅ ${dbCpmks.length} CPMK berhasil dimuat dari database!`);
      } else {
        alert('❌ Tidak ada data CPMK di database untuk mata kuliah ini');
        setInputMode(null);
      }
    } catch (error) {
      console.error('Failed to load CPMK from DB:', error);
      alert('Gagal memuat CPMK dari database');
      setInputMode(null);
    } finally {
      setLoadingDB(false);
    }
  };

  const handleGenerateAI = async () => {
    // Hapus tombol global generate - sekarang generate per CPMK saja
    setInputMode('manual');
  };

  const handleGenerateAIForCPMK = async (index) => {
    setGenerating(true);
    setGeneratingIndex(index);
    try {
      const res = await aiHelperAPI.generateCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        existing_cpl: [],
        force_ai: true,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        // Get the generated description
        const generatedDescription = res.data.data.items[0].description;
        
        // Update only the specific CPMK
        const newCPMK = [...formData.cpmk];
        newCPMK[index].description = generatedDescription;
        newCPMK[index].fromDB = false;
        setFormData({ ...formData, cpmk: newCPMK });
        
        if (!inputMode) setInputMode('manual');
      }
    } catch (error) {
      console.error('Failed to generate CPMK:', error);
      alert('Gagal generate CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const handleManualMode = () => {
    setInputMode('manual');
  };

  const handleSaveToDB = async () => {
    if (!course?.id) {
      alert('Course ID tidak ditemukan');
      return;
    }

    // Filter CPMK yang valid (ada deskripsi)
    const validCpmks = formData.cpmk.filter(c => c.description && c.description.trim());
    if (validCpmks.length === 0) {
      alert('Tidak ada CPMK yang valid untuk disimpan');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        course_id: course.id,
        cpmks: validCpmks.map(cpmk => ({
          code: cpmk.code,
          description: cpmk.description,
          sub_cpmks: [] // Sub-CPMK akan ditambah di step berikutnya
        }))
      };

      const res = await apiClient.post('/cpmk/batch', payload);
      
      if (res.data.success) {
        // Mark all saved CPMK as fromDB
        const updatedCpmks = formData.cpmk.map(cpmk => ({
          ...cpmk,
          fromDB: true
        }));
        setFormData({ ...formData, cpmk: updatedCpmks });
        setHasDBCpmk(true);
        alert(`✅ Berhasil menyimpan ${validCpmks.length} CPMK ke database!`);
      }
    } catch (error) {
      console.error('Failed to save CPMK to DB:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`❌ Gagal menyimpan CPMK: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Capaian Pembelajaran Mata Kuliah (CPMK)
          </h2>
          <p className="text-sm text-gray-600">
            Pilih metode untuk mengisi CPMK: input manual, ambil dari database, atau generate dengan AI.
          </p>
        </div>
        <button
          onClick={handleSaveToDB}
          disabled={saving || formData.cpmk.every(c => c.fromDB)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan ke Database</span>
            </>
          )}
        </button>
      </div>

      {/* Input Mode Selector */}
      {userRole !== 'dosen' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Pilih Metode Input:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Manual Input */}
            <button
              onClick={handleManualMode}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                inputMode === 'manual' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <PenLine className={`w-6 h-6 ${inputMode === 'manual' ? 'text-blue-600' : 'text-gray-500'}`} />
                <div>
                  <p className="font-medium">Input Manual</p>
                  <p className="text-xs text-gray-500">Isi data sendiri</p>
                </div>
              </div>
            </button>

            {/* From Database */}
            <button
              onClick={handleLoadFromDB}
              disabled={loadingDB || checkingDB}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                inputMode === 'database' 
                  ? 'border-green-500 bg-green-50' 
                  : hasDBCpmk 
                    ? 'border-gray-200 bg-white hover:border-green-300' 
                    : 'border-gray-200 bg-gray-100 opacity-60'
              } ${(loadingDB || checkingDB) ? 'cursor-wait' : ''}`}
            >
              <div className="flex items-center gap-3">
                {loadingDB ? (
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                ) : (
                  <Database className={`w-6 h-6 ${inputMode === 'database' ? 'text-green-600' : hasDBCpmk ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
                <div>
                  <p className="font-medium">Dari Database</p>
                  <p className="text-xs text-gray-500">
                    {checkingDB ? 'Mengecek...' : hasDBCpmk ? 'Data tersedia ✓' : 'Tidak ada data'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* CPMK Form */}
      <div className="space-y-3">
        {formData.cpmk.map((item, index) => (
          <div key={index} className={`p-4 border-2 rounded-lg ${item.fromDB ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold text-blue-600 min-w-[70px]">{item.code}</span>
                {item.fromDB && (
                  <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
                    Database
                  </span>
                )}
                {!item.fromDB && item.description && (
                  <span className="text-xs px-2 py-0.5 bg-orange-600 text-white rounded-full">
                    Baru
                  </span>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newCPMK = [...formData.cpmk];
                    newCPMK[index].description = e.target.value;
                    // Mark as modified (not from DB anymore if edited)
                    if (item.fromDB) {
                      newCPMK[index].fromDB = false;
                    }
                    setFormData({ ...formData, cpmk: newCPMK });
                    if (!inputMode) setInputMode('manual');
                  }}
                  placeholder="Masukkan deskripsi CPMK..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <button
                onClick={() => handleGenerateAIForCPMK(index)}
                disabled={generating && generatingIndex === index}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Generate dengan AI"
              >
                {generating && generatingIndex === index ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-sm">AI</span>
              </button>
              <button
                onClick={() => {
                  if (item.fromDB) {
                    if (!confirm('CPMK ini dari database. Yakin ingin menghapus? (Tidak akan terhapus dari database, hanya dari form ini)')) {
                      return;
                    }
                  }
                  const newCPMK = formData.cpmk.filter((_, i) => i !== index);
                  setFormData({ ...formData, cpmk: newCPMK });
                }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Hapus CPMK"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            const newCPMK = [...formData.cpmk, { code: `CPMK-${formData.cpmk.length + 1}`, description: '', fromDB: false }];
            setFormData({ ...formData, cpmk: newCPMK });
            if (!inputMode) setInputMode('manual');
          }}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Tambah CPMK
        </button>
      </div>
    </div>
  );
}

function SubCPMKStep({ course, formData, setFormData }) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null); // Track which Sub-CPMK is being generated
  const [selectedCPMK, setSelectedCPMK] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem('role');

  // Load Sub-CPMK from database when component mounts or selectedCPMK changes
  useEffect(() => {
    const loadSubCpmk = async () => {
      if (!course?.id) return;
      setLoading(true);
      try {
        const res = await apiClient.get(`/cpmk/course/${course.id}`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          // Find CPMK with sub_cpmks
          const allSubCpmks = [];
          res.data.data.forEach((cpmk, cpmkIndex) => {
            if (cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0) {
              cpmk.sub_cpmks.forEach(subCpmk => {
                allSubCpmks.push({
                  code: `Sub-CPMK-${cpmk.cpmk_number}-${subCpmk.sub_cpmk_number}`,
                  description: subCpmk.description,
                  cpmk_id: `CPMK-${cpmk.cpmk_number}`,
                  id: subCpmk.id,
                  fromDB: true
                });
              });
            }
          });
          
          if (allSubCpmks.length > 0) {
            setFormData({ ...formData, subCPMK: allSubCpmks });
          }
        }
      } catch (error) {
        console.error('Failed to load Sub-CPMK from DB:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSubCpmk();
  }, [course?.id]);

  const handleSaveToDB = async () => {
    if (!course?.id) {
      alert('Course ID tidak ditemukan');
      return;
    }

    // Group Sub-CPMK by CPMK
    const cpmkGroups = {};
    formData.subCPMK.forEach(subCpmk => {
      if (subCpmk.description && subCpmk.description.trim()) {
        if (!cpmkGroups[subCpmk.cpmk_id]) {
          cpmkGroups[subCpmk.cpmk_id] = [];
        }
        cpmkGroups[subCpmk.cpmk_id].push(subCpmk);
      }
    });

    // Build payload with CPMK and their Sub-CPMKs
    const cpmks = formData.cpmk.map((cpmk, index) => {
      const subCpmks = cpmkGroups[cpmk.code] || [];
      return {
        code: cpmk.code,
        description: cpmk.description,
        sub_cpmks: subCpmks.map(sub => ({
          code: sub.code,
          description: sub.description
        }))
      };
    });

    setSaving(true);
    try {
      const payload = {
        course_id: course.id,
        cpmks: cpmks
      };

      const res = await apiClient.post('/cpmk/batch', payload);
      
      if (res.data.success) {
        // Mark all saved Sub-CPMK as fromDB
        const updatedSubCpmks = formData.subCPMK.map(sub => ({
          ...sub,
          fromDB: true
        }));
        setFormData({ ...formData, subCPMK: updatedSubCpmks });
        alert(`✅ Berhasil menyimpan CPMK dan Sub-CPMK ke database!`);
      }
    } catch (error) {
      console.error('Failed to save Sub-CPMK to DB:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`❌ Gagal menyimpan Sub-CPMK: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.cpmk[selectedCPMK] || !formData.cpmk[selectedCPMK].description.trim()) {
      alert('Pilih CPMK yang sudah terisi terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: formData.cpmk[selectedCPMK].description,
      });
      
      // Check source to inform user if data came from database
      const source = res.data.source;
      if (source === 'database') {
        alert('✅ Sub-CPMK berhasil dimuat dari database!');
      } else if (source === 'ai') {
        alert('✨ Sub-CPMK berhasil di-generate dengan AI (tidak ada data di database)');
      }
      
      // Ganti isi form yang ada dengan hasil generate
      const generatedItems = res.data.data.items;
      const updatedSubCPMK = [...formData.subCPMK];
      
      // Hanya isi sejumlah form yang ada, jangan tambah form baru
      for (let i = 0; i < updatedSubCPMK.length && i < generatedItems.length; i++) {
        updatedSubCPMK[i] = { ...generatedItems[i], cpmk_id: formData.cpmk[selectedCPMK].code };
      }
      
      setFormData({ ...formData, subCPMK: updatedSubCPMK });
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAIForSubCPMK = async (index) => {
    if (!formData.cpmk[selectedCPMK] || !formData.cpmk[selectedCPMK].description.trim()) {
      alert('Pilih CPMK yang sudah terisi terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    setGeneratingIndex(index);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: formData.cpmk[selectedCPMK].description,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        // Get the first generated description
        const generatedDescription = res.data.data.items[0].description;
        
        // Update only the specific Sub-CPMK
        const newSubCPMK = [...formData.subCPMK];
        newSubCPMK[index].description = generatedDescription;
        newSubCPMK[index].cpmk_id = formData.cpmk[selectedCPMK].code;
        newSubCPMK[index].fromDB = false;
        setFormData({ ...formData, subCPMK: newSubCPMK });
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Sub-CPMK</h2>
          <select
            value={selectedCPMK}
            onChange={(e) => setSelectedCPMK(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {formData.cpmk.map((cpmk, index) => (
              <option key={index} value={index}>{cpmk.code}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {userRole !== 'dosen' && (
            <>
              <button
                onClick={handleGenerate}
                disabled={generating || formData.cpmk.length === 0 || loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
                Generate AI
              </button>
              <button
                onClick={handleSaveToDB}
                disabled={saving || formData.subCPMK.every(s => s.fromDB) || loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan ke DB</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {formData.subCPMK.map((item, index) => (
            <div key={index} className={`p-4 border-2 rounded-lg ${item.fromDB ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-purple-600 min-w-[90px] text-sm">{item.code}</span>
                  {item.fromDB && (
                    <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
                      Database
                    </span>
                  )}
                  {!item.fromDB && item.description && (
                    <span className="text-xs px-2 py-0.5 bg-orange-600 text-white rounded-full">
                      Baru
                    </span>
                  )}
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newSubCPMK = [...formData.subCPMK];
                    newSubCPMK[index].description = e.target.value;
                    if (item.fromDB) {
                      newSubCPMK[index].fromDB = false;
                    }
                    setFormData({ ...formData, subCPMK: newSubCPMK });
                  }}
                  placeholder="Masukkan Sub-CPMK atau klik 'AI'"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={2}
                />
                <button
                  onClick={() => handleGenerateAIForSubCPMK(index)}
                  disabled={generating && generatingIndex === index}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Generate dengan AI"
                >
                  {generating && generatingIndex === index ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-sm">AI</span>
                </button>
                <button
                  onClick={() => {
                    if (item.fromDB) {
                      if (!confirm('Sub-CPMK ini dari database. Yakin ingin menghapus? (Tidak akan terhapus dari database, hanya dari form ini)')) {
                        return;
                      }
                    }
                    const newSubCPMK = formData.subCPMK.filter((_, i) => i !== index);
                    setFormData({ ...formData, subCPMK: newSubCPMK });
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Hapus Sub-CPMK"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              // Hitung jumlah Sub-CPMK yang sudah ada untuk CPMK yang dipilih
              const selectedCpmkCode = formData.cpmk[selectedCPMK]?.code || 'CPMK-1';
              const existingSubCpmksForThisCpmk = formData.subCPMK.filter(
                sub => sub.cpmk_id === selectedCpmkCode
              );
              const nextNumber = existingSubCpmksForThisCpmk.length + 1;
              
              // Extract CPMK number from code (e.g., "CPMK-2" -> "2")
              const cpmkNumber = selectedCpmkCode.split('-')[1] || '1';
              
              const newSubCPMK = [...formData.subCPMK, { 
                code: `Sub-CPMK-${cpmkNumber}-${nextNumber}`, 
                description: '', 
                cpmk_id: selectedCpmkCode, 
                fromDB: false 
              }];
              setFormData({ ...formData, subCPMK: newSubCPMK });
            }}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"
          >
            + Tambah Sub-CPMK
          </button>
        </div>
      )}
    </div>
  );
}

function TopikStep({ course, formData, setFormData }) {
  const [generating, setGenerating] = useState(false);
  const userRole = localStorage.getItem('role');

  const handleGenerate = async () => {
    const filledCPMK = formData.cpmk.find(c => c.description.trim());
    const filledSubCPMK = formData.subCPMK.find(s => s.description.trim());
    
    if (!filledCPMK || !filledSubCPMK) {
      alert('Lengkapi minimal 1 CPMK dan 1 Sub-CPMK terlebih dahulu');
      return;
    }

    setGenerating(true);
    try {
      const res = await aiHelperAPI.generateTopik({
        course_code: course.code,
        course_title: course.title,
        cpmk: filledCPMK.description,
        sub_cpmk: filledSubCPMK.description,
      });
      
      // Hanya isi topik yang kosong
      const generatedItems = res.data.data.items;
      const updatedTopik = [...formData.topik];
      
      let genIndex = 0;
      for (let i = 0; i < updatedTopik.length && genIndex < generatedItems.length; i++) {
        if ((!updatedTopik[i].topic || updatedTopik[i].topic.trim() === '') && 
            (!updatedTopik[i].description || updatedTopik[i].description.trim() === '')) {
          updatedTopik[i] = { ...generatedItems[genIndex], week: updatedTopik[i].week };
          genIndex++;
        }
      }
      
      setFormData({ ...formData, topik: updatedTopik });
    } catch (error) {
      console.error('Failed to generate Topik:', error);
      alert('Gagal generate Topik');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Topik Pembelajaran (16 Minggu)</h2>
        {userRole !== 'dosen' && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
            Generate AI
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Minggu</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Topik</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.topik.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.week}</td>
                  <td className="px-4 py-2">
                    <input
                      value={item.topic}
                      onChange={(e) => {
                        const newTopik = [...formData.topik];
                        newTopik[index].topic = e.target.value;
                        setFormData({ ...formData, topik: newTopik });
                      }}
                      placeholder="Topik minggu ini"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newTopik = [...formData.topik];
                        newTopik[index].description = e.target.value;
                        setFormData({ ...formData, topik: newTopik });
                      }}
                      placeholder="Deskripsi pembelajaran"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                      rows={2}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

function TugasStep({ course, formData, setFormData }) {
  const [generatingTugas, setGeneratingTugas] = useState(null);
  const userRole = localStorage.getItem('role');

  const addTugas = () => {
    const newTugasNumber = formData.tugas.length + 1;
    const newTugas = {
      nomor: newTugasNumber,
      sub_cpmk: '',
      indikator: '',
      judul_tugas: '',
      batas_waktu: '',
      petunjuk_pengerjaan: '',
      luaran_tugas: '',
      kriteria: '',
      teknik_penilaian: '',
      bobot: 0,
      daftar_rujukan: []
    };
    setFormData({ ...formData, tugas: [...formData.tugas, newTugas] });
  };

  const removeTugas = (index) => {
    if (formData.tugas.length <= 1) {
      alert('Minimal harus ada 1 tugas');
      return;
    }
    const newTugas = formData.tugas.filter((_, i) => i !== index);
    // Reindex nomor tugas
    newTugas.forEach((t, i) => t.nomor = i + 1);
    setFormData({ ...formData, tugas: newTugas });
  };

  const generateTugasWithAI = async (tugasIndex) => {
    setGeneratingTugas(tugasIndex);
    try {
      // Siapkan context dari CPMK dan Sub-CPMK
      const cpmkContext = formData.cpmk.map(c => `${c.code}: ${c.description}`).join('\n');
      const subCPMKContext = formData.subCPMK.map(s => `${s.code}: ${s.description}`).join('\n');
      const topikContext = formData.topik.slice(0, 16).map((t, i) => 
        `Minggu ${i+1}: ${t.topik || 'Belum diisi'}`
      ).join('\n');

      const response = await fetch(`${API_BASE_URL}/ai/generate/tugas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_code: course.code,
          course_title: course.title,
          tugas_number: tugasIndex + 1,
          cpmk_context: cpmkContext,
          sub_cpmk_context: subCPMKContext,
          topik_context: topikContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate tugas');
      
      const data = await response.json();
      
      // Update tugas dengan data dari AI
      const newTugas = [...formData.tugas];
      newTugas[tugasIndex] = {
        ...newTugas[tugasIndex],
        sub_cpmk: data.data.sub_cpmk || '',
        indikator: data.data.indikator || '',
        judul_tugas: data.data.judul_tugas || '',
        batas_waktu: data.data.batas_waktu || '',
        petunjuk_pengerjaan: data.data.petunjuk_pengerjaan || '',
        luaran_tugas: data.data.luaran_tugas || '',
        kriteria: data.data.kriteria || '',
        teknik_penilaian: data.data.teknik_penilaian || '',
        bobot: data.data.bobot || newTugas[tugasIndex].bobot,
        daftar_rujukan: data.data.daftar_rujukan || [],
      };
      
      setFormData({ ...formData, tugas: newTugas });
      alert('✨ Tugas berhasil digenerate dengan AI!');
    } catch (error) {
      console.error('Error generating tugas:', error);
      alert('Gagal generate tugas dengan AI: ' + error.message);
    } finally {
      setGeneratingTugas(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Rencana Tugas ({formData.tugas.length} Tugas)</h2>
          <p className="text-sm text-gray-600">
            Isi rencana tugas yang akan diberikan kepada mahasiswa selama semester.
          </p>
        </div>
        <button
          onClick={addTugas}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas</span>
        </button>
      </div>

      <div className="space-y-6">
        {formData.tugas.map((tugas, index) => (
          <div key={index} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">Tugas {tugas.nomor}</h3>
              <div className="flex gap-2">
                {userRole !== 'dosen' && (
                  <button
                    onClick={() => generateTugasWithAI(index)}
                    disabled={generatingTugas === index}
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-sm transition-all"
                  >
                    {generatingTugas === index ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate AI</span>
                      </>
                    )}
                  </button>
                )}
                {formData.tugas.length > 1 && (
                  <button
                    onClick={() => removeTugas(index)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 bg-white p-4 rounded">
              {/* Sub-CPMK */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sub-CPMK
                </label>
                <input
                  type="text"
                  value={tugas.sub_cpmk}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].sub_cpmk = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Contoh: Sub-CPMK 1.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              {/* Indikator */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Indikator
                </label>
                <textarea
                  value={tugas.indikator}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].indikator = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Indikator capaian yang spesifik dan terukur"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Judul Tugas */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  value={tugas.judul_tugas}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].judul_tugas = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Judul tugas yang jelas"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              {/* Batas Waktu */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Batas Waktu
                </label>
                <input
                  type="text"
                  value={tugas.batas_waktu}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].batas_waktu = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Minggu ke-6"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              {/* Petunjuk Pengerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Petunjuk Pengerjaan Tugas
                </label>
                <textarea
                  value={tugas.petunjuk_pengerjaan}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].petunjuk_pengerjaan = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Langkah-langkah pengerjaan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  rows={4}
                />
              </div>

              {/* Luaran Tugas */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Luaran Tugas
                </label>
                <textarea
                  value={tugas.luaran_tugas}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].luaran_tugas = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Deskripsi output yang diharapkan (laporan, presentasi, dll)"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Kriteria Penilaian */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kriteria Penilaian
                </label>
                <input
                  type="text"
                  value={tugas.kriteria}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].kriteria = e.target.value;
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Kriteria 1, Kriteria 2, Kriteria 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Teknik Penilaian */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Teknik Penilaian
                  </label>
                  <input
                    type="text"
                    value={tugas.teknik_penilaian}
                    onChange={(e) => {
                      const newTugas = [...formData.tugas];
                      newTugas[index].teknik_penilaian = e.target.value;
                      setFormData({ ...formData, tugas: newTugas });
                    }}
                    placeholder="Rubrik penilaian, dll"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* Bobot */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bobot (%)
                  </label>
                  <input
                    type="number"
                    value={tugas.bobot}
                    onChange={(e) => {
                      const newTugas = [...formData.tugas];
                      newTugas[index].bobot = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, tugas: newTugas });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Daftar Rujukan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Daftar Rujukan
                </label>
                <textarea
                  value={(tugas.daftar_rujukan || []).join('\n')}
                  onChange={(e) => {
                    const newTugas = [...formData.tugas];
                    newTugas[index].daftar_rujukan = e.target.value.split('\n').filter(r => r.trim());
                    setFormData({ ...formData, tugas: newTugas });
                  }}
                  placeholder="Rujukan 1&#10;Rujukan 2&#10;Rujukan 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Pisahkan setiap rujukan dengan enter</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
