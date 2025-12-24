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

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Bot, Save, Loader2, X, Plus, BookOpen, Eye, EyeOff, Database, PenLine, FileText, List, Calendar, Book, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { courseAPI, aiHelperAPI, generatedRPSAPI, cpmkAPI } from '../services/api';
import apiClient from '../services/api';
import CPMKWithCPLMapping from '../components/CPMKWithCPLMapping';
import CPMKIntegrated from '../components/CPMKIntegrated';

export default function RPSCreate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editRpsId = searchParams.get('edit');
  const courseIdFromQuery = searchParams.get('courseId');
  const viewMode = searchParams.get('view') === 'true'; // Read-only mode
  
  const userRole = localStorage.getItem('role');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || courseIdFromQuery || '');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedRpsId, setSavedRpsId] = useState(editRpsId || null);
  const isLoadingRPS = useRef(false); // Gunakan useRef untuk track loading tanpa trigger re-render
  const [useIntegratedView, setUseIntegratedView] = useState(true); // Mode tampilan CPMK terintegrasi
  const [autoCompleting, setAutoCompleting] = useState(false); // State untuk Auto Complete All
  const [autoCompleteProgress, setAutoCompleteProgress] = useState({ step: '', current: 0, total: 0 });

  // Form Data State - Struktur Baru yang Lebih Kompleks
  const [formData, setFormData] = useState({
    // Step 1: Deskripsi Mata Kuliah
    description: '',
    
    // Step 2: CPMK
    cpmk: [
      { code: 'CPMK-1', description: '', selected_cpls: [] },
      { code: 'CPMK-2', description: '', selected_cpls: [] },
      { code: 'CPMK-3', description: '', selected_cpls: [] },
    ],
    
    // Step 3: Sub-CPMK (14 items)
    subCpmk: Array.from({ length: 14 }, (_, i) => ({
      code: `Sub-CPMK-${i + 1}`,
      description: '',
      cpmk_id: '', // Link ke CPMK mana (format: 'CPMK-1', 'CPMK-2', dll)
      relatedCpmk: '' // Link ke CPMK mana (deprecated, pakai cpmk_id)
    })),
    
    // Step 4: Bahan Kajian
    bahanKajian: ['', '', ''],
    
    // Step 5: Rencana Pembelajaran (14 minggu pembelajaran)
    rencanaMingguan: Array.from({ length: 14 }, (_, i) => ({
      minggu: i + 1,
      subCpmk: '',
      materi: '',
      metode: '',
      penilaian: ''
    })),
    
    // Step 6: Rencana Tugas (14 tugas, 1 per minggu materi)
    rencanaTugas: Array.from({ length: 14 }, (_, i) => ({
      tugasKe: i + 1,
      subCpmk: '',
      indikator: '',
      judulTugas: '',
      batasWaktu: '',
      petunjukPengerjaan: '',
      luaranTugas: '',
      kriteriaPenilaian: '',
      teknikPenilaian: '',
      bobotPersen: ''
    })),
    
    // Step 7: Referensi
    referensi: ['', '', '']
  });

  // Reset loading flag saat component mount
  useEffect(() => {
    isLoadingRPS.current = false;
    console.log('🔄 Component mounted, reset isLoadingRPS flag');
  }, []); // Run once on mount

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

  // Load selected course - SKIP jika course sudah di-set (dari RPS data di edit mode)
  useEffect(() => {
    // Hanya load jika bukan edit mode DAN course belum ter-set
    if (!editRpsId && !course && selectedCourseId && Array.isArray(courses) && courses.length > 0) {
      console.log('🔍 Finding course in list:', selectedCourseId);
      const foundCourse = courses.find(c => c.id.toString() === selectedCourseId.toString());
      console.log('🔍 Found course:', foundCourse);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [selectedCourseId, courses, editRpsId, course]);

  // Debug logging untuk track state
  useEffect(() => {
    console.log('🔍 State Update:', { 
      editRpsId, 
      course, 
      selectedCourseId, 
      coursesCount: courses.length,
      isLoadingRPSRef: isLoadingRPS.current 
    });
  }, [editRpsId, course, selectedCourseId, courses]);

  // Load existing RPS if editing - load HANYA SEKALI pakai useRef
  useEffect(() => {
    if (editRpsId && courses.length > 0 && !isLoadingRPS.current) {
      console.log('🚀 STARTING RPS LOAD - editRpsId:', editRpsId);
      console.log('🚀 Courses available:', courses.length);
      isLoadingRPS.current = true; // Set flag SEGERA untuk prevent re-entry
      
      const loadRPS = async () => {
        try {
          console.log('🔄 Loading RPS ID:', editRpsId);
          const res = await generatedRPSAPI.getById(editRpsId);
          console.log('📡 Full API Response:', res);
          console.log('📡 Response data:', res.data);
          
          // Handle different response structures
          let rpsData = null;
          if (res.data?.data?.data) {
            // Structure: res.data.data.data
            rpsData = res.data.data.data;
          } else if (res.data?.data) {
            // Structure: res.data.data
            rpsData = res.data.data;
          } else if (res.data) {
            // Structure: res.data
            rpsData = res.data;
          }
          
          console.log('📦 RPS Data:', rpsData);
          
          if (rpsData && rpsData.result) {
            const result = rpsData.result;
            console.log('📦 RPS Result:', result);
            console.log('📦 Available fields in result:', Object.keys(result));
            console.log('📦 Deskripsi value:', result.deskripsi);
            console.log('📦 Description value:', result.description);
            
            // Auto-select course dari RPS data - langsung dari result tanpa cari di courses array
            if (result.course) {
              const courseData = {
                id: result.course.id,
                code: result.course.code,
                title: result.course.title,
                credits: result.course.credits,
                semester: result.course.semester
              };
              
              // Set course dan selectedCourseId bersamaan dalam satu batch
              setCourse(courseData);
              setSelectedCourseId(result.course.id);
              console.log('✅ Course set from RPS:', courseData);
            } else {
              console.warn('⚠️ No course data in result');
            }
            
            // Load semua data RPS ke form - gunakan initial values, bukan formData
            const newFormData = {
              description: result.deskripsi || result.description || '',
              cpmk: result.cpmk && result.cpmk.length > 0 ? result.cpmk.map(c => ({
                code: c.code || '',
                description: c.description || '',
                selected_cpls: c.selected_cpls || []
              })) : [
                { code: 'CPMK-1', description: '', selected_cpls: [] },
                { code: 'CPMK-2', description: '', selected_cpls: [] },
                { code: 'CPMK-3', description: '', selected_cpls: [] },
              ],
              // Support both subCpmk and sub_cpmk formats, and handle both relatedCpmk and cpmk_id
              subCpmk: (result.subCpmk || result.sub_cpmk) && (result.subCpmk || result.sub_cpmk).length > 0 
                ? (result.subCpmk || result.sub_cpmk).map(s => {
                    // Parse cpmk_id from various possible sources
                    const cpmkId = s.cpmk_id || s.relatedCpmk || s.related_cpmk || '';
                    // Extract cpmkNumber and subNumber from code if not present
                    let cpmkNumber = s.cpmkNumber;
                    let subNumber = s.subNumber;
                    if (!cpmkNumber && cpmkId) {
                      // cpmkId could be "CPMK-1", "CPMK 1", etc.
                      const match = cpmkId.match(/(\d+)/);
                      cpmkNumber = match ? parseInt(match[1]) : null;
                    }
                    if (!subNumber && s.code) {
                      // code could be "Sub-CPMK-1.2" or "Sub-CPMK-1"
                      const subMatch = s.code.match(/\.(\d+)$/) || s.code.match(/(\d+)$/);
                      subNumber = subMatch ? parseInt(subMatch[1]) : null;
                    }
                    return {
                      code: s.code || '',
                      description: s.description || '',
                      relatedCpmk: cpmkId,
                      cpmk_id: cpmkId,
                      cpmkNumber: cpmkNumber,
                      subNumber: subNumber,
                      fromDB: s.fromDB || false
                    };
                  }) 
                : Array.from({ length: 14 }, (_, i) => ({
                    code: `Sub-CPMK-${i + 1}`,
                    description: '',
                    relatedCpmk: '',
                    cpmk_id: ''
                  })),
              // Support both bahanKajian and bahan_kajian formats
              bahanKajian: (result.bahanKajian || result.bahan_kajian) 
                ? (Array.isArray(result.bahanKajian || result.bahan_kajian) 
                    ? (result.bahanKajian || result.bahan_kajian) 
                    : (result.bahanKajian || result.bahan_kajian).split('\n').filter(b => b.trim()))
                : ['', '', ''],
              rencanaMingguan: result.rencanaMingguan && result.rencanaMingguan.length > 0 
                ? result.rencanaMingguan.map(m => ({
                    minggu: m.minggu,
                    subCpmk: m.subCpmk || '',
                    materi: m.materi || '',
                    metode: m.metode || '',
                    penilaian: m.penilaian || ''
                  }))
                : Array.from({ length: 16 }, (_, i) => {
                    if (i === 7) {
                      return { minggu: 8, subCpmk: 'UTS', materi: 'Ujian Tengah Semester', metode: 'Ujian Tertulis/Online', penilaian: 'Ujian' };
                    } else if (i === 15) {
                      return { minggu: 16, subCpmk: 'UAS', materi: 'Ujian Akhir Semester', metode: 'Ujian Tertulis/Online', penilaian: 'Ujian' };
                    }
                    return { minggu: i + 1, subCpmk: '', materi: '', metode: '', penilaian: '' };
                  }),
              rencanaTugas: result.rencanaTugas && result.rencanaTugas.length > 0
                ? result.rencanaTugas.map(t => {
                    console.log('📦 Loading tugas:', t);
                    return {
                      tugasKe: t.tugasKe || t.tugas_ke,
                      subCpmk: t.subCpmk || t.sub_cpmk || '',
                      indikator: t.indikator || '',
                      judulTugas: t.judulTugas || t.judul_tugas || '',
                      batasWaktu: t.batasWaktu || t.batas_waktu || '',
                      petunjukPengerjaan: t.petunjukPengerjaan || t.petunjuk_pengerjaan || '',
                      luaranTugas: t.luaranTugas || t.luaran_tugas || '',
                      kriteriaPenilaian: t.kriteriaPenilaian || t.kriteria_penilaian || '',
                      teknikPenilaian: t.teknikPenilaian || t.teknik_penilaian || '',
                      bobotPersen: t.bobotPersen || t.bobot_persen || ''
                    };
                  })
                : Array.from({ length: 14 }, (_, i) => ({
                    tugasKe: i + 1,
                    subCpmk: '',
                    indikator: '',
                    judulTugas: '',
                    batasWaktu: '',
                    petunjukPengerjaan: '',
                    luaranTugas: '',
                    kriteriaPenilaian: '',
                    teknikPenilaian: '',
                    bobotPersen: ''
                  })),
              referensi: result.referensi && result.referensi.length > 0 ? result.referensi : ['', '', '']
            };
            
            console.log('📝 Setting formData with:', newFormData);
            console.log('📝 Description field:', newFormData.description);
            setFormData(newFormData);
            
            setLoading(false);
            console.log('✅ RPS data loaded successfully');
          } else {
            console.error('❌ RPS data or result not found');
            console.error('❌ rpsData:', rpsData);
            alert('Data RPS tidak ditemukan atau format tidak valid');
            setLoading(false);
          }
        } catch (error) {
          console.error('❌ Failed to load existing RPS:', error);
          console.error('Error details:', error.response?.data);
          alert('Gagal memuat data RPS: ' + (error.response?.data?.error || error.message));
          setLoading(false);
        }
      };
      
      loadRPS();
    } else if (!editRpsId) {
      // Jika bukan edit mode, set loading false setelah courses loaded
      if (courses.length > 0) {
        setLoading(false);
      }
    }
  }, [editRpsId, courses]);

  // 🆕 Fungsi untuk sync CPL Matching ke database CPMK
  const syncCPLMatchingToDatabase = async (courseId, cpmkList) => {
    try {
      console.log('🔗 Starting CPL matching sync for course:', courseId);
      console.log('🔗 CPMK with CPL:', cpmkList);
      
      // Step 1: Load existing CPMK from database
      const existingCpmkRes = await cpmkAPI.getByCourseId(courseId);
      let existingCpmk = existingCpmkRes.data?.data || [];
      
      // Step 2: Jika belum ada CPMK, create dulu
      if (existingCpmk.length === 0) {
        console.log('🆕 No CPMK in database, creating new CPMK...');
        
        const cpmkPayload = {
          course_id: courseId,
          cpmks: cpmkList.map((c, idx) => ({
            cpmk_number: idx + 1,
            description: c.description,
            matched_cpl: c.selected_cpls ? c.selected_cpls.join(',') : ''
          }))
        };
        
        await cpmkAPI.batchCreateOrUpdate(cpmkPayload);
        
        // Reload CPMK dari database
        const reloadRes = await cpmkAPI.getByCourseId(courseId);
        existingCpmk = reloadRes.data?.data || [];
        console.log(`✅ ${existingCpmk.length} CPMK created with CPL matching`);
        
        return existingCpmk.length;
      }
      
      // Step 3: Update matched_cpl untuk setiap CPMK yang sudah ada
      let updatedCount = 0;
      for (const cpmk of cpmkList) {
        // Skip jika tidak ada CPL yang dipilih
        if (!cpmk.selected_cpls || cpmk.selected_cpls.length === 0) {
          console.log(`⏭️ Skipping ${cpmk.code} - no CPL selected`);
          continue;
        }
        
        // Find matching CPMK in database by number
        const cpmkNumber = parseInt(cpmk.code.match(/\d+/)?.[0] || '0');
        const dbCpmk = existingCpmk.find(c => c.cpmk_number === cpmkNumber);
        
        if (!dbCpmk) {
          console.warn(`⚠️ CPMK ${cpmk.code} not found in database`);
          continue;
        }
        
        // Format matched_cpl as comma-separated string
        const matchedCplString = cpmk.selected_cpls.join(',');
        
        try {
          await cpmkAPI.update(dbCpmk.id, {
            description: cpmk.description,
            matched_cpl: matchedCplString
          });
          
          updatedCount++;
          console.log(`✅ CPL matching saved for ${cpmk.code}: ${matchedCplString}`);
        } catch (updateError) {
          console.error(`❌ Failed to update ${cpmk.code}:`, updateError);
        }
      }
      
      console.log(`✅ CPL matching sync completed: ${updatedCount}/${cpmkList.length} CPMK updated`);
      return updatedCount;
    } catch (error) {
      console.error('❌ CPL matching sync failed:', error);
      throw error;
    }
  };

  // Fungsi untuk sync Sub-CPMK ke tabel database
  const syncSubCPMKToDatabase = async (courseId, cpmkList, subCpmkList) => {
    try {
      console.log('📊 Starting Sub-CPMK sync for course:', courseId);
      console.log('📊 CPMK List:', cpmkList);
      console.log('📊 Sub-CPMK List:', subCpmkList);
      
      // Step 1: Load existing CPMK from database
      const existingCpmkRes = await cpmkAPI.getByCourseId(courseId);
      let existingCpmk = existingCpmkRes.data?.data || [];
      
      console.log('📊 Existing CPMK in DB:', existingCpmk);
      
      // Step 2: Use existing CPMK if available, otherwise create new ones
      let savedCpmk = [];
      
      if (existingCpmk.length > 0) {
        // CPMK already exists, use them
        console.log('✅ Using existing CPMK from database');
        savedCpmk = existingCpmk;
      } else {
        // Create new CPMK using batch endpoint
        const cpmkPayload = {
          course_id: courseId,
          cpmks: cpmkList.map((c, idx) => ({
            cpmk_number: idx + 1,
            description: c.description
          }))
        };
        
        console.log('📤 Creating new CPMK batch:', cpmkPayload);
        const cpmkRes = await cpmkAPI.batchCreateOrUpdate(cpmkPayload);
        savedCpmk = cpmkRes.data?.data || [];
        console.log('✅ CPMK created:', savedCpmk.length);
      }
      
      // Step 3: Build map of CPMK number to CPMK ID
      const cpmkNumberToId = {};
      savedCpmk.forEach(cpmk => {
        cpmkNumberToId[cpmk.cpmk_number] = cpmk.id;
      });
      
      console.log('🗺️ CPMK number to ID map:', cpmkNumberToId);
      
      // Step 4: Check existing Sub-CPMK to avoid duplicates
      const existingSubCpmk = new Set();
      savedCpmk.forEach(cpmk => {
        const subs = cpmk.sub_cpmks || cpmk.SubCPMKs || [];
        subs.forEach(sub => {
          existingSubCpmk.add(`${cpmk.id}-${sub.sub_cpmk_number}`);
        });
      });
      
      console.log('🗺️ Existing Sub-CPMK:', existingSubCpmk);
      
      // Bobot Sub-CPMK: 100% / 14 (presisi penuh tanpa pembulatan)
      const subCpmkBobot = 100 / 14; // 7.142857142857143...
      console.log(`💯 Sub-CPMK Bobot: ${subCpmkBobot}% (standar 14 Sub-CPMK)`);
      
      // Step 5: Add Sub-CPMK for each CPMK
      let subCpmkSaved = 0;
      let subCpmkSkipped = 0;
      
      for (const subCpmk of subCpmkList) {
        // Skip empty descriptions
        if (!subCpmk.description || subCpmk.description.trim() === '') {
          console.log('⏭️ Skipping empty Sub-CPMK');
          continue;
        }
        
        // relatedCpmk could be "CPMK 1" or "CPMK-1" or just "1"
        const relatedCpmkField = subCpmk.relatedCpmk || subCpmk.related_cpmk || '';
        const cpmkNumber = parseInt(relatedCpmkField.match(/\d+/)?.[0] || '0');
        
        if (cpmkNumber === 0) {
          console.warn('⚠️ Invalid CPMK number for:', subCpmk);
          continue;
        }
        
        const cpmkId = cpmkNumberToId[cpmkNumber];
        if (!cpmkId) {
          console.warn('⚠️ CPMK ID not found for number:', cpmkNumber);
          continue;
        }
        
        // Extract sub-cpmk number from code (e.g., "Sub-CPMK-1" -> 1)
        const subCpmkNumber = parseInt(subCpmk.code.match(/\d+/)?.[0] || (subCpmkSaved + 1));
        
        // Check if already exists
        const subCpmkKey = `${cpmkId}-${subCpmkNumber}`;
        if (existingSubCpmk.has(subCpmkKey)) {
          console.log(`⏭️ Sub-CPMK ${subCpmkNumber} already exists for CPMK ${cpmkNumber}, skipping`);
          subCpmkSkipped++;
          continue;
        }
        
        try {
          const payload = {
            cpmk_id: cpmkId,
            sub_cpmk_number: subCpmkNumber,
            description: subCpmk.description,
            bobot: subCpmkBobot
          };
          
          console.log('📤 Creating Sub-CPMK:', payload);
          await cpmkAPI.createSubCpmk(payload);
          
          subCpmkSaved++;
          console.log(`✅ Sub-CPMK ${subCpmkNumber} saved for CPMK ${cpmkNumber}`);
        } catch (error) {
          console.error('❌ Failed to save Sub-CPMK:', error);
          if (error.response?.status === 409) {
            subCpmkSkipped++;
          }
        }
      }
      
      console.log(`✅ Total Sub-CPMK synced: ${subCpmkSaved}/${subCpmkList.length} (${subCpmkSkipped} skipped)`);
      
      if (subCpmkSaved > 0) {
        showToast(`Berhasil menyimpan ${subCpmkSaved} Sub-CPMK ke database!`, 'success');
      } else if (subCpmkSkipped > 0) {
        showToast(`Semua Sub-CPMK (${subCpmkSkipped}) sudah ada di database`, 'info');
      } else {
        showToast('Tidak ada Sub-CPMK yang tersimpan', 'warning');
      }
      
    } catch (error) {
      console.error('❌ Failed to sync Sub-CPMK to database:', error);
      // Don't throw - allow RPS save to succeed even if sync fails
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
      // Format data untuk disimpan dengan metadata lengkap
      const rpsContent = {
        course: {
          id: course.id,
          code: course.code,
          title: course.title,
          credits: course.credits,
          semester: course.semester
        },
        deskripsi: formData.description,
        cpmk: formData.cpmk.filter(c => c.description && c.description.trim()).map((c, idx) => ({
          code: c.code,
          description: c.description,
          selected_cpls: c.selected_cpls || [],
          order: idx + 1
        })),
        subCpmk: formData.subCpmk.filter(s => s.description && s.description.trim()).map((s, idx) => ({
          code: s.code,
          description: s.description,
          cpmk_id: s.cpmk_id || s.relatedCpmk || '',
          related_cpmk: s.cpmk_id || s.relatedCpmk || '',
          cpmkNumber: s.cpmkNumber || null,
          subNumber: s.subNumber || null,
          order: idx + 1
        })),
        bahanKajian: formData.bahanKajian.filter(b => b && b.trim()),
        rencanaMingguan: formData.rencanaMingguan.filter(m => m.materi && m.materi.trim()).map(m => ({
          minggu: m.minggu,
          subCpmk: m.subCpmk,
          materi: m.materi,
          metode: m.metode,
          penilaian: m.penilaian
        })),
        rencanaTugas: formData.rencanaTugas.filter(t => t.judulTugas && t.judulTugas.trim()).map((t, idx) => ({
          tugasKe: t.tugasKe,
          subCpmk: t.subCpmk,
          indikator: t.indikator,
          judulTugas: t.judulTugas,
          batasWaktu: t.batasWaktu,
          petunjukPengerjaan: t.petunjukPengerjaan,
          luaranTugas: t.luaranTugas,
          kriteriaPenilaian: t.kriteriaPenilaian,
          teknikPenilaian: t.teknikPenilaian,
          bobotPersen: t.bobotPersen,
          order: idx + 1
        })),
        referensi: formData.referensi.filter(r => r && r.trim())
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
        
        // � SYNC CPL MATCHING KE DATABASE CPMK
        console.log('🔗 Syncing CPL matching to database after RPS save...');
        try {
          const cplUpdateCount = await syncCPLMatchingToDatabase(course.id, rpsContent.cpmk);
          console.log(`✅ CPL matching sync completed: ${cplUpdateCount} CPMK updated`);
        } catch (cplSyncError) {
          console.error('⚠️ CPL matching sync failed (non-critical):', cplSyncError);
          // Don't block RPS save if CPL sync fails
        }
        
        // 🔄 SYNC SUB-CPMK KE DATABASE
        console.log('🔄 Syncing Sub-CPMK to database after RPS save...');
        try {
          await syncSubCPMKToDatabase(course.id, rpsContent.cpmk, rpsContent.subCpmk);
          console.log('✅ Sub-CPMK sync completed successfully');
        } catch (syncError) {
          console.error('⚠️ Sub-CPMK sync failed (non-critical):', syncError);
          // Don't block RPS save if Sub-CPMK sync fails
        }
        
        alert('✅ RPS, CPL Matching, dan Sub-CPMK berhasil disimpan!');
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

  // Skip validasi courses saat edit mode (course sudah di-set dari RPS data)
  if (courses.length === 0 && !loading && !editRpsId) {
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
    { id: 2, title: 'CPMK & Sub-CPMK', icon: List },
    { id: 3, title: 'Bahan Kajian', icon: Book },
    { id: 4, title: 'Rencana 14 Minggu', icon: Calendar },
    { id: 5, title: 'Rencana Tugas', icon: PenLine },
    { id: 6, title: 'Referensi', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {viewMode ? 'Lihat RPS' : (editRpsId ? 'Edit RPS' : 'Buat RPS Lengkap')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          {viewMode 
            ? 'Tampilan RPS yang telah dibuat (Read-only)' 
            : 'Sistem pembuatan RPS komprehensif dengan 6 tahapan lengkap'
          }
        </p>

        {/* Course Selector */}
        {!viewMode && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                const newCourseId = e.target.value;
                setSelectedCourseId(newCourseId);
                
                // Update course object
                const foundCourse = courses.find(c => c.id === newCourseId);
                if (foundCourse) {
                  setCourse(foundCourse);
                  console.log('✅ Course changed to:', foundCourse);
                }
              }}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={viewMode}
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {Array.isArray(courses) && courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
            
            {course && (
              <div className="mt-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm font-semibold text-blue-900 break-words">{course.code} - {course.title}</p>
                <p className="text-xs text-blue-600 mt-1">{course.credits} SKS • Semester {course.semester}</p>
              </div>
            )}
          </div>
        )}
        
        {/* View mode - show course info only */}
        {viewMode && course && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">{course.code} - {course.title}</p>
            <p className="text-xs text-blue-600 mt-1">{course.credits} SKS • Semester {course.semester}</p>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-4 sm:mb-6 lg:mb-8 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max sm:min-w-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center px-1 sm:px-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className={`hidden sm:block text-xs mt-2 font-medium text-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                  <span className={`sm:hidden text-[10px] mt-1 font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.id}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-all ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {!course && !editRpsId ? (
        <div className="bg-gray-50 rounded-lg shadow p-12 mb-6 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pilih Mata Kuliah Terlebih Dahulu</h3>
          <p className="text-gray-500">
            Silakan pilih mata kuliah dari dropdown di atas untuk mulai membuat RPS
          </p>
        </div>
      ) : loading && editRpsId ? (
        <div className="bg-white rounded-lg shadow p-12 mb-6 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data RPS...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            {currentStep === 1 && <DeskripsiStep formData={formData} setFormData={setFormData} course={course} viewMode={viewMode} />}
            {currentStep === 2 && <CPMKStep 
              formData={formData} 
              setFormData={setFormData} 
              course={course} 
              viewMode={viewMode} 
              useIntegratedView={useIntegratedView} 
              setUseIntegratedView={setUseIntegratedView}
              autoCompleting={autoCompleting}
              setAutoCompleting={setAutoCompleting}
              autoCompleteProgress={autoCompleteProgress}
              setAutoCompleteProgress={setAutoCompleteProgress}
            />}
            {currentStep === 3 && <BahanKajianStep formData={formData} setFormData={setFormData} course={course} viewMode={viewMode} />}
            {currentStep === 4 && <RencanaMingguanStep formData={formData} setFormData={setFormData} course={course} viewMode={viewMode} />}
            {currentStep === 5 && <RencanaTugasStep formData={formData} setFormData={setFormData} course={course} viewMode={viewMode} />}
            {currentStep === 6 && <ReferensiStep formData={formData} setFormData={setFormData} course={course} viewMode={viewMode} />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
            >
              ← Kembali
            </button>
            
            <div className="text-center order-first sm:order-none">
              <p className="text-xs sm:text-sm text-gray-500">
                Langkah {currentStep} dari {steps.length}
              </p>
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={async () => {
                  // � Validasi Step 2: CPMK & Sub-CPMK harus lengkap
                  if (currentStep === 2 && useIntegratedView) {
                    // Check if all CPMK are complete
                    const incompleteCpmk = formData.cpmk.filter(c => {
                      const hasDeskripsi = c.description && c.description.trim();
                      const hasCpl = c.selected_cpls && c.selected_cpls.length > 0;
                      const cpmkCode = c.code;
                      const subCpmks = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
                      const filledSubs = subCpmks.filter(s => s.description && s.description.trim()).length;
                      const isComplete = hasDeskripsi && hasCpl && subCpmks.length > 0 && filledSubs === subCpmks.length;
                      return !isComplete;
                    });

                    if (incompleteCpmk.length > 0) {
                      const incompleteList = incompleteCpmk.map(c => c.code).join(', ');
                      alert(`⚠️ Tidak bisa lanjut!\n\nCPMK yang belum lengkap:\n${incompleteList}\n\nPastikan setiap CPMK memiliki:\n✓ Deskripsi CPMK\n✓ Mapping CPL\n✓ Sub-CPMK ditambahkan\n✓ Semua Sub-CPMK terisi`);
                      return;
                    }
                  }

                  // 🔗 Jika di step CPMK (step 2), save CPL matching dulu
                  if (currentStep === 2 && course?.id) {
                    console.log('🔗 Saving CPL matching before next step...');
                    try {
                      const validCpmk = formData.cpmk.filter(c => c.description && c.description.trim());
                      if (validCpmk.length > 0) {
                        const cplUpdateCount = await syncCPLMatchingToDatabase(course.id, validCpmk);
                        console.log(`✅ CPL matching saved: ${cplUpdateCount} CPMK updated`);
                      }
                    } catch (error) {
                      console.error('⚠️ Failed to save CPL matching:', error);
                      // Don't block navigation, just log error
                    }
                  }
                  
                  setCurrentStep(currentStep + 1);
                }}
                disabled={!selectedCourseId || (() => {
                  // Disable button jika step 2 dan ada CPMK yang belum lengkap
                  if (currentStep === 2 && useIntegratedView) {
                    const incompleteCpmk = formData.cpmk.filter(c => {
                      const hasDeskripsi = c.description && c.description.trim();
                      const hasCpl = c.selected_cpls && c.selected_cpls.length > 0;
                      const cpmkCode = c.code;
                      const subCpmks = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
                      const filledSubs = subCpmks.filter(s => s.description && s.description.trim()).length;
                      return !(hasDeskripsi && hasCpl && subCpmks.length > 0 && filledSubs === subCpmks.length);
                    });
                    return incompleteCpmk.length > 0;
                  }
                  return false;
                })()}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
              >
                {(() => {
                  // Tampilkan label berbeda jika step 2 belum lengkap
                  if (currentStep === 2 && useIntegratedView) {
                    const incompleteCpmk = formData.cpmk.filter(c => {
                      const hasDeskripsi = c.description && c.description.trim();
                      const hasCpl = c.selected_cpls && c.selected_cpls.length > 0;
                      const cpmkCode = c.code;
                      const subCpmks = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
                      const filledSubs = subCpmks.filter(s => s.description && s.description.trim()).length;
                      return !(hasDeskripsi && hasCpl && subCpmks.length > 0 && filledSubs === subCpmks.length);
                    });
                    if (incompleteCpmk.length > 0) {
                      return `⚠️ ${incompleteCpmk.length} CPMK Belum Lengkap`;
                    }
                  }
                  return 'Lanjut →';
                })()}
              </button>
            ) : viewMode ? (
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-all shadow-lg"
              >
                Tutup
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !selectedCourseId}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
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
function DeskripsiStep({ formData, setFormData, course, viewMode = false }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!course || viewMode) return;
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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">📋 Deskripsi Mata Kuliah</h2>
          <p className="text-sm sm:text-base text-gray-600">
            {viewMode ? 'Deskripsi mata kuliah' : 'Tuliskan deskripsi lengkap tentang mata kuliah ini, termasuk tujuan dan gambaran umum pembelajaran.'}
          </p>
        </div>
        {!viewMode && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
        )}
      </div>

      <textarea
        value={formData.description}
        onChange={(e) => !viewMode && setFormData({ ...formData, description: e.target.value })}
        placeholder="Masukkan deskripsi mata kuliah secara lengkap..."
        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg resize-none ${
          viewMode 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        }`}
        rows={10}
        disabled={viewMode}
        readOnly={viewMode}
      />
      
      <p className="text-xs sm:text-sm text-gray-500 mt-2">
        {formData.description.length} karakter
      </p>
    </div>
  );
}

// Step 2: CPMK
function CPMKStep({ 
  formData, 
  setFormData, 
  course, 
  useIntegratedView, 
  setUseIntegratedView,
  autoCompleting,
  setAutoCompleting,
  autoCompleteProgress,
  setAutoCompleteProgress
}) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [cpmkVersion, setCpmkVersion] = useState(null); // 'generated' or 'matched'
  const [showCPLMapping, setShowCPLMapping] = useState(false);
  const [hasCpmkInDB, setHasCpmkInDB] = useState(false);
  const [loadingFromDB, setLoadingFromDB] = useState(false);
  const [matchingAllCPL, setMatchingAllCPL] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState({ current: 0, total: 0 });
  const [cpmkFromDB, setCpmkFromDB] = useState([]); // Data CPMK dari database (dengan bobot)

  // KONSTANTA: Bobot Sub-CPMK = 100/14 (presisi penuh, tanpa pembulatan)
  const SUB_CPMK_BOBOT = 100 / 14; // 7.142857142857143...

  // Helper: Format bobot untuk tampilan (gunakan koma sebagai desimal)
  const formatBobotDisplay = (value) => {
    // Handle floating point precision untuk total 100%
    if (Math.abs(value - 100) < 0.0001) {
      return '100';
    }
    // Bulatkan ke 2 desimal untuk tampilan yang bersih
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString().replace('.', ',');
  };

  // Helper: Get Sub-CPMK count per CPMK
  const getSubCpmkCount = (cpmkCode) => {
    const cpmkNumber = parseInt(cpmkCode.match(/\d+/)?.[0] || '0');
    return formData.subCpmk?.filter(s => s.cpmk_id === `CPMK-${cpmkNumber}`)?.length || 0;
  };

  // Helper: Get total Sub-CPMK count
  const getTotalSubCpmkCount = () => {
    return formData.subCpmk?.length || 0;
  };

  // Helper: Get CPMK bobot = jumlah Sub-CPMK × (100/14)
  const getCpmkBobot = (cpmkCode) => {
    const subCount = getSubCpmkCount(cpmkCode);
    return subCount * SUB_CPMK_BOBOT;
  };

  // Handler untuk update Sub-CPMK dari komponen terintegrasi
  const handleSubCpmkChange = (newSubCpmks) => {
    setFormData({ ...formData, subCpmk: newSubCpmks });
  };

  // Auto-initialize Sub-CPMK saat mode terintegrasi aktif dan belum ada Sub-CPMK
  useEffect(() => {
    if (useIntegratedView && formData.cpmk.length > 0 && (!formData.subCpmk || formData.subCpmk.length === 0)) {
      console.log('[RPSCreate] Auto-init Sub-CPMK untuk mode terintegrasi');
      
      const totalCpmk = formData.cpmk.length;
      const totalSubCpmks = 14;
      const subPerCpmk = Math.floor(totalSubCpmks / totalCpmk);
      const remainder = totalSubCpmks % totalCpmk;
      
      const newSubCpmks = [];
      
      for (let cpmkIdx = 0; cpmkIdx < totalCpmk; cpmkIdx++) {
        const cpmkNumber = cpmkIdx + 1;
        const cpmkCode = `CPMK-${cpmkNumber}`;
        const subCountForThisCpmk = subPerCpmk + (cpmkIdx < remainder ? 1 : 0);
        
        for (let subIdx = 0; subIdx < subCountForThisCpmk; subIdx++) {
          newSubCpmks.push({
            code: `Sub-CPMK-${cpmkNumber}.${subIdx + 1}`,
            description: '',
            cpmk_id: cpmkCode,
            cpmkNumber: cpmkNumber,
            subNumber: subIdx + 1,
            fromDB: false
          });
        }
      }
      
      console.log(`[RPSCreate] Created ${newSubCpmks.length} Sub-CPMK for ${totalCpmk} CPMK`, newSubCpmks);
      setFormData(prev => ({ ...prev, subCpmk: newSubCpmks }));
    }
  }, [useIntegratedView, formData.cpmk.length]);

  // Check if course has CPMK in database
  useEffect(() => {
    if (course?.id) {
      checkCpmkExists();
    }
  }, [course?.id]);

  const checkCpmkExists = async () => {
    try {
      const res = await cpmkAPI.getByCourseId(course.id);
      const cpmkData = res.data?.data || [];
      setHasCpmkInDB(cpmkData.length > 0);
      setCpmkFromDB(cpmkData); // Simpan data CPMK lengkap dengan bobot
    } catch (error) {
      setHasCpmkInDB(false);
      setCpmkFromDB([]);
    }
  };

  // =====================================================
  // AUTO COMPLETE ALL - Load dari DB & Generate dengan AI
  // =====================================================
  const handleAutoCompleteAll = async () => {
    if (!course?.id) {
      alert('⚠️ Pilih mata kuliah terlebih dahulu!');
      return;
    }

    setAutoCompleting(true);
    const results = {
      cpmk: { loaded: 0, generated: 0 },
      subCpmk: { loaded: 0, generated: 0 },
      cpl: { loaded: 0, matched: 0 }
    };

    try {
      // ==== STEP 1: Load CPMK dari Database ====
      setAutoCompleteProgress({ step: 'Memuat CPMK dari database...', current: 1, total: 5 });
      
      const cpmkRes = await cpmkAPI.getByCourseId(course.id);
      const cpmkFromDatabase = cpmkRes.data?.data || [];
      
      let currentCpmk = [...formData.cpmk];
      let currentSubCpmk = [...(formData.subCpmk || [])];
      
      if (cpmkFromDatabase.length > 0) {
        // Ada CPMK di database - load semua
        currentCpmk = cpmkFromDatabase.map((item, idx) => {
          // Parse MatchedCPL dari database (format: "CPL-01, CPL-02" atau "CPL-01")
          const matchedCplArray = item.matched_cpl 
            ? item.matched_cpl.split(',').map(s => s.trim()).filter(s => s)
            : [];
          
          return {
            code: `CPMK-${item.cpmk_number || idx + 1}`,
            description: item.description || '',
            selected_cpls: matchedCplArray,
            matched_cpl: item.matched_cpl || null,
            bobot: item.bobot || 0,
            db_id: item.id // simpan ID database untuk referensi
          };
        });
        results.cpmk.loaded = cpmkFromDatabase.length;
        
        // Load Sub-CPMK dari database (sudah di-preload di backend)
        // Buat map untuk menyimpan Sub-CPMK dari DB berdasarkan cpmk_id
        const subCpmkFromDB = new Map();
        cpmkFromDatabase.forEach((cpmk, idx) => {
          const cpmkCode = `CPMK-${cpmk.cpmk_number || idx + 1}`;
          const subCpmks = cpmk.sub_cpmks || cpmk.SubCPMKs || [];
          if (subCpmks.length > 0) {
            subCpmkFromDB.set(cpmkCode, subCpmks.map(sub => ({
              code: `Sub-CPMK-${sub.sub_cpmk_number || sub.SubCPMKNumber}`,
              description: sub.description || '',
              cpmk_id: cpmkCode,
              db_id: sub.id
            })));
            results.subCpmk.loaded += subCpmks.length;
          }
        });
        
        console.log('[AutoComplete] Sub-CPMK dari DB:', subCpmkFromDB);
        
        // Count loaded CPL mappings
        results.cpl.loaded = currentCpmk.filter(c => c.selected_cpls && c.selected_cpls.length > 0).length;
      }
      
      // ==== STEP 2: Generate CPMK dengan AI jika belum ada ====
      setAutoCompleteProgress({ step: 'Generate CPMK dengan AI...', current: 2, total: 5 });
      
      // Cek apakah ada CPMK yang kosong (belum ada deskripsi)
      const emptyCpmk = currentCpmk.filter(c => !c.description || c.description.trim() === '');
      
      if (currentCpmk.length === 0 || emptyCpmk.length === currentCpmk.length) {
        // Tidak ada CPMK sama sekali atau semua kosong - generate dengan AI
        const prodiId = localStorage.getItem('prodi_id');
        
        try {
          const aiRes = await aiHelperAPI.generateCPMK({
            course_id: course.id,
            course_code: course.code,
            course_title: course.title,
            credits: course.credits,
            prodi_id: prodiId,
          });
          
          if (aiRes.data.data?.items && aiRes.data.data.items.length > 0) {
            currentCpmk = aiRes.data.data.items.map((item, idx) => ({
              code: item.code || `CPMK-${idx + 1}`,
              description: item.description,
              matched_cpl: item.matched_cpl || null,
              selected_cpls: item.matched_cpl ? [item.matched_cpl] : [],
              reason: item.reason || null
            }));
            results.cpmk.generated = currentCpmk.length;
          }
        } catch (aiError) {
          console.error('AI CPMK generation failed:', aiError);
        }
      }
      
      // ==== STEP 3: Match CPL dengan AI untuk CPMK yang belum punya CPL ====
      setAutoCompleteProgress({ step: 'Matching CPL dengan AI...', current: 3, total: 5 });
      
      const prodiId = localStorage.getItem('prodi_id');
      const cpmkWithoutCpl = currentCpmk.filter(c => 
        c.description && c.description.trim() !== '' && 
        (!c.selected_cpls || c.selected_cpls.length === 0)
      );
      
      if (cpmkWithoutCpl.length > 0) {
        for (let i = 0; i < currentCpmk.length; i++) {
          const cpmk = currentCpmk[i];
          
          // Skip jika sudah punya CPL atau tidak ada deskripsi
          if ((cpmk.selected_cpls && cpmk.selected_cpls.length > 0) || !cpmk.description?.trim()) {
            continue;
          }
          
          setAutoCompleteProgress({ 
            step: `Matching CPL untuk ${cpmk.code}...`, 
            current: 3, 
            total: 5 
          });
          
          try {
            const matchRes = await aiHelperAPI.matchCPMKWithCPL({
              prodi_id: prodiId,
              cpmk_code: cpmk.code,
              cpmk_description: cpmk.description,
            });
            
            if (matchRes.data.success && matchRes.data.matches) {
              const autoSelected = matchRes.data.matches
                .filter(m => m.recommended)
                .map(m => m.kode_cpl);
              
              currentCpmk[i] = {
                ...cpmk,
                selected_cpls: autoSelected,
                ai_matches: matchRes.data.matches,
                matched_cpl: matchRes.data.matched_cpl,
                recommendation: matchRes.data.recommendation,
              };
              results.cpl.matched++;
            }
          } catch (matchError) {
            console.error(`CPL matching failed for ${cpmk.code}:`, matchError);
          }
          
          // Small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // ==== STEP 4: Initialize/Generate Sub-CPMK ====
      setAutoCompleteProgress({ step: 'Menyiapkan Sub-CPMK...', current: 4, total: 5 });
      
      // SELALU buat 14 Sub-CPMK dan distribusikan ke semua CPMK
      const totalCpmk = currentCpmk.length;
      const totalSubCpmks = 14;
      
      if (totalCpmk > 0) {
        const subPerCpmk = Math.floor(totalSubCpmks / totalCpmk);
        const remainder = totalSubCpmks % totalCpmk;
        
        // Reset currentSubCpmk dan buat ulang dengan distribusi yang benar
        currentSubCpmk = [];
        let subCounter = 1;
        
        currentCpmk.forEach((cpmk, idx) => {
          const count = subPerCpmk + (idx < remainder ? 1 : 0);
          for (let j = 0; j < count; j++) {
            currentSubCpmk.push({
              code: `Sub-CPMK-${subCounter}`,
              description: '', // Akan diisi AI nanti
              cpmk_id: cpmk.code
            });
            subCounter++;
          }
        });
        
        console.log(`[AutoComplete] Distribusi Sub-CPMK: ${totalSubCpmks} total ke ${totalCpmk} CPMK`);
        console.log('[AutoComplete] Sub-CPMK created:', currentSubCpmk);
      }
      
      // Generate Sub-CPMK dengan AI untuk yang kosong
      const emptySubCpmk = currentSubCpmk.filter(s => !s.description || s.description.trim() === '');
      
      if (emptySubCpmk.length > 0 && currentCpmk.some(c => c.description?.trim())) {
        setAutoCompleteProgress({ step: 'Generate Sub-CPMK dengan AI...', current: 4, total: 5 });
        
        // Group empty Sub-CPMK by CPMK
        const subCpmkByCpmk = {};
        emptySubCpmk.forEach(sub => {
          if (!subCpmkByCpmk[sub.cpmk_id]) {
            subCpmkByCpmk[sub.cpmk_id] = [];
          }
          subCpmkByCpmk[sub.cpmk_id].push(sub);
        });
        
        console.log('[AutoComplete] Sub-CPMK grouped by CPMK:', subCpmkByCpmk);
        
        // Generate for each CPMK that has empty Sub-CPMKs
        for (const [cpmkId, emptySubs] of Object.entries(subCpmkByCpmk)) {
          const cpmk = currentCpmk.find(c => c.code === cpmkId);
          if (!cpmk || !cpmk.description?.trim()) continue;
          
          setAutoCompleteProgress({ 
            step: `Generate Sub-CPMK untuk ${cpmkId}...`, 
            current: 4, 
            total: 5 
          });
          
          try {
            // Backend expects: cpmk (string), course_title (string), course_id (optional)
            const subRes = await aiHelperAPI.generateSubCPMK({
              cpmk: `${cpmk.code}: ${cpmk.description}`,
              course_title: course.title,
              course_id: course.id
            });
            
            console.log(`[AutoComplete] AI response for ${cpmkId}:`, subRes.data);
            
            if (subRes.data.data?.items && subRes.data.data.items.length > 0) {
              // Update the empty Sub-CPMKs with AI-generated descriptions
              let aiIndex = 0;
              for (let i = 0; i < currentSubCpmk.length && aiIndex < subRes.data.data.items.length; i++) {
                if (currentSubCpmk[i].cpmk_id === cpmkId && (!currentSubCpmk[i].description || currentSubCpmk[i].description.trim() === '')) {
                  currentSubCpmk[i] = {
                    ...currentSubCpmk[i],
                    description: subRes.data.data.items[aiIndex].description || subRes.data.data.items[aiIndex].sub_cpmk || ''
                  };
                  results.subCpmk.generated++;
                  aiIndex++;
                }
              }
              console.log(`[AutoComplete] Updated ${aiIndex} Sub-CPMK for ${cpmkId}`);
            }
          } catch (subError) {
            console.error(`Sub-CPMK generation failed for ${cpmkId}:`, subError);
            // Jika AI gagal, biarkan deskripsi kosong - user bisa isi manual
          }
          
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // ==== STEP 5: Update State ====
      setAutoCompleteProgress({ step: 'Menyimpan hasil...', current: 5, total: 5 });
      
      console.log('[AutoComplete] Final CPMK:', currentCpmk);
      console.log('[AutoComplete] Final Sub-CPMK:', currentSubCpmk);
      
      setFormData({
        ...formData,
        cpmk: currentCpmk,
        subCpmk: currentSubCpmk
      });
      
      setCpmkFromDB(cpmkFromDatabase);
      setHasCpmkInDB(cpmkFromDatabase.length > 0);
      
      // Show summary alert
      const summaryLines = [];
      summaryLines.push('═══════════════════════════════════');
      summaryLines.push('       AUTO COMPLETE SELESAI!      ');
      summaryLines.push('═══════════════════════════════════');
      summaryLines.push('');
      
      // CPMK summary
      summaryLines.push('📋 CPMK:');
      if (results.cpmk.loaded > 0) {
        summaryLines.push(`   ✅ ${results.cpmk.loaded} dimuat dari database`);
      }
      if (results.cpmk.generated > 0) {
        summaryLines.push(`   🤖 ${results.cpmk.generated} di-generate AI`);
      }
      if (results.cpmk.loaded === 0 && results.cpmk.generated === 0) {
        summaryLines.push('   ⚠️ Tidak ada CPMK');
      }
      summaryLines.push('');
      
      // CPL Mapping summary
      summaryLines.push('🔗 CPL Mapping:');
      if (results.cpl.loaded > 0) {
        summaryLines.push(`   ✅ ${results.cpl.loaded} dimuat dari database`);
      }
      if (results.cpl.matched > 0) {
        summaryLines.push(`   🤖 ${results.cpl.matched} di-match AI`);
      }
      if (results.cpl.loaded === 0 && results.cpl.matched === 0) {
        summaryLines.push('   ⚠️ Belum ada mapping');
      }
      summaryLines.push('');
      
      // Sub-CPMK summary
      summaryLines.push('📝 Sub-CPMK:');
      const totalSub = currentSubCpmk.length;
      const filledSub = currentSubCpmk.filter(s => s.description?.trim()).length;
      summaryLines.push(`   📊 Total: ${totalSub} Sub-CPMK didistribusikan`);
      
      // Show distribution per CPMK
      currentCpmk.forEach(cpmk => {
        const subsForCpmk = currentSubCpmk.filter(s => s.cpmk_id === cpmk.code);
        const filledCount = subsForCpmk.filter(s => s.description?.trim()).length;
        summaryLines.push(`   • ${cpmk.code}: ${filledCount}/${subsForCpmk.length} terisi`);
      });
      
      if (results.subCpmk.generated > 0) {
        summaryLines.push(`   🤖 ${results.subCpmk.generated} deskripsi di-generate AI`);
      }
      
      summaryLines.push('');
      summaryLines.push('═══════════════════════════════════');
      
      alert(summaryLines.join('\n'));
      
    } catch (error) {
      console.error('Auto complete failed:', error);
      alert('❌ Auto complete gagal: ' + (error.response?.data?.error || error.message));
    } finally {
      setAutoCompleting(false);
      setAutoCompleteProgress({ step: '', current: 0, total: 0 });
    }
  };

  const handleMatchAllCPL = async () => {
    // Check if there are any CPMK with descriptions
    const cpmkWithDesc = formData.cpmk.filter(c => c.description && c.description.trim() !== '');
    
    if (cpmkWithDesc.length === 0) {
      alert('⚠️ Tidak ada CPMK dengan deskripsi yang bisa di-match.\n\nGenerate atau isi CPMK terlebih dahulu!');
      return;
    }

    setMatchingAllCPL(true);
    setMatchingProgress({ current: 0, total: cpmkWithDesc.length });

    try {
      const prodiId = localStorage.getItem('prodi_id');
      const updatedCpmk = [...formData.cpmk];
      let successCount = 0;

      for (let i = 0; i < formData.cpmk.length; i++) {
        const cpmk = formData.cpmk[i];
        
        // Skip empty CPMK
        if (!cpmk.description || cpmk.description.trim() === '') {
          continue;
        }

        setMatchingProgress({ current: successCount + 1, total: cpmkWithDesc.length });

        try {
          const matchRes = await aiHelperAPI.matchCPMKWithCPL({
            prodi_id: prodiId,
            cpmk_code: cpmk.code,
            cpmk_description: cpmk.description,
          });

          if (matchRes.data.success && matchRes.data.matches) {
            // Auto-select CPL dengan recommended = true
            const autoSelected = matchRes.data.matches
              .filter(m => m.recommended)
              .map(m => m.kode_cpl);
            
            updatedCpmk[i] = {
              ...cpmk,
              selected_cpls: autoSelected,
              ai_matches: matchRes.data.matches,
              matched_cpl: matchRes.data.matched_cpl,
              recommendation: matchRes.data.recommendation,
            };
            successCount++;
          }
        } catch (matchError) {
          console.error(`Failed to match CPL for ${cpmk.code}:`, matchError);
          // Continue with next CPMK even if one fails
        }

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setFormData({ ...formData, cpmk: updatedCpmk });
      alert(`✅ Berhasil matching ${successCount} dari ${cpmkWithDesc.length} CPMK dengan CPL!\n\nCek detail mapping di bawah setiap CPMK.`);
    } catch (error) {
      console.error('Failed to match all CPL:', error);
      alert('❌ Gagal melakukan batch matching: ' + (error.response?.data?.error || error.message));
    } finally {
      setMatchingAllCPL(false);
      setMatchingProgress({ current: 0, total: 0 });
    }
  };

  const handleLoadFromDatabase = async () => {
    if (!course?.id) return;
    
    setLoadingFromDB(true);
    try {
      const res = await cpmkAPI.getByCourseId(course.id);
      const cpmkData = res.data?.data || [];
      
      if (cpmkData.length === 0) {
        alert('⚠️ Tidak ada CPMK di database untuk mata kuliah ini.');
        return;
      }

      console.log('[handleLoadFromDatabase] Raw CPMK data:', cpmkData);

      // Transform database CPMK to form format
      const loadedCpmk = cpmkData.map((item, idx) => {
        // Parse MatchedCPL dari database (format: "CPL-01, CPL-02" atau "CPL-01")
        const matchedCplArray = item.matched_cpl 
          ? item.matched_cpl.split(',').map(s => s.trim()).filter(s => s)
          : [];
        
        return {
          code: `CPMK-${item.cpmk_number || idx + 1}`,
          description: item.description || '',
          selected_cpls: matchedCplArray,
          matched_cpl: item.matched_cpl || null,
          bobot: item.bobot || 0,
          db_id: item.id
        };
      });

      // Load Sub-CPMK dari database (sudah di-preload)
      const loadedSubCpmk = [];
      cpmkData.forEach((cpmk, idx) => {
        const subCpmks = cpmk.sub_cpmks || cpmk.SubCPMKs || [];
        const cpmkNumber = cpmk.cpmk_number || idx + 1;
        
        console.log(`[handleLoadFromDatabase] CPMK-${cpmkNumber} has ${subCpmks.length} Sub-CPMK`);
        
        subCpmks.forEach((sub, subIdx) => {
          loadedSubCpmk.push({
            code: `Sub-CPMK-${cpmkNumber}.${sub.sub_cpmk_number || subIdx + 1}`,
            description: sub.description || '',
            cpmk_id: `CPMK-${cpmkNumber}`,
            cpmkNumber: cpmkNumber,
            subNumber: sub.sub_cpmk_number || subIdx + 1,
            db_id: sub.id,
            fromDB: true
          });
        });
      });

      console.log('[handleLoadFromDatabase] Loaded CPMK:', loadedCpmk);
      console.log('[handleLoadFromDatabase] Loaded Sub-CPMK:', loadedSubCpmk);

      // Update formData dengan CPMK dan Sub-CPMK yang dimuat
      // Jika tidak ada Sub-CPMK di database, buat distribusi default
      let finalSubCpmk = loadedSubCpmk;
      
      if (loadedSubCpmk.length === 0 && loadedCpmk.length > 0) {
        console.log('[handleLoadFromDatabase] No Sub-CPMK in DB, creating default distribution');
        
        const totalCpmk = loadedCpmk.length;
        const totalSubCpmks = 14;
        const subPerCpmk = Math.floor(totalSubCpmks / totalCpmk);
        const remainder = totalSubCpmks % totalCpmk;
        
        let subCounter = 1;
        loadedCpmk.forEach((cpmk, idx) => {
          const count = subPerCpmk + (idx < remainder ? 1 : 0);
          const cpmkNumber = idx + 1;
          
          for (let j = 0; j < count; j++) {
            finalSubCpmk.push({
              code: `Sub-CPMK-${cpmkNumber}.${j + 1}`,
              description: '',
              cpmk_id: cpmk.code,
              cpmkNumber: cpmkNumber,
              subNumber: j + 1,
              fromDB: false
            });
            subCounter++;
          }
        });
        
        console.log('[handleLoadFromDatabase] Created default Sub-CPMK:', finalSubCpmk);
      }

      setFormData({ 
        ...formData, 
        cpmk: loadedCpmk,
        subCpmk: finalSubCpmk
      });
      setCpmkFromDB(cpmkData);
      setCpmkVersion('database');
      
      const subCpmkMsg = finalSubCpmk.length > 0 
        ? `\n📝 ${loadedSubCpmk.length > 0 ? 'Dimuat' : 'Dibuat'} ${finalSubCpmk.length} Sub-CPMK`
        : '';
      alert(`✅ Berhasil memuat ${loadedCpmk.length} CPMK dari database!${subCpmkMsg}`);
    } catch (error) {
      console.error('Failed to load CPMK from database:', error);
      alert('❌ Gagal memuat CPMK dari database: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoadingFromDB(false);
    }
  };

  const handleGenerateOne = async (index) => {
    if (!course) return;
    
    // Check if this CPMK already has a description - don't overwrite
    const currentCpmk = formData.cpmk[index];
    if (currentCpmk && currentCpmk.description && currentCpmk.description.trim() !== '') {
      alert('⚠️ CPMK ini sudah memiliki deskripsi. Hapus deskripsi terlebih dahulu jika ingin generate ulang.');
      return;
    }
    
    setGenerating(true);
    setGeneratingIndex(index);
    try {
      const prodiId = localStorage.getItem('prodi_id');
      const res = await aiHelperAPI.generateCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        prodi_id: prodiId,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const version = res.data.version || 'generated';
        setCpmkVersion(version);
        
        // Update CPMK dengan data dari response
        const newCpmk = res.data.data.items.map((item, idx) => ({
          code: item.code || `CPMK-${idx + 1}`,
          description: item.description,
          matched_cpl: item.matched_cpl || null,
          reason: item.reason || null,
          selected_cpls: []
        }));
        
        setFormData({ ...formData, cpmk: newCpmk });
        
        // Show CPL mapping info if version is matched
        if (version === 'matched') {
          setShowCPLMapping(true);
          alert('✅ CPMK berhasil dicocokkan dengan CPL!\n\nCek detail mapping di bawah setiap CPMK.');
        }
      }
    } catch (error) {
      console.error('Failed to generate CPMK:', error);
      alert('Gagal generate CPMK: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const handleGenerateAll = async () => {
    if (!course) return;
    
    // Check if there are any empty CPMKs that need generating
    const emptyCpmkIndices = formData.cpmk
      .map((cpmk, idx) => ({ cpmk, idx }))
      .filter(({ cpmk }) => !cpmk.description || cpmk.description.trim() === '')
      .map(({ idx }) => idx);
    
    if (emptyCpmkIndices.length === 0) {
      alert('⚠️ Semua CPMK sudah memiliki deskripsi. Tidak ada yang perlu di-generate.\n\nTambahkan CPMK baru yang kosong jika ingin menggunakan AI.');
      return;
    }
    
    setGenerating(true);
    try {
      const prodiId = localStorage.getItem('prodi_id');
      const res = await aiHelperAPI.generateCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        prodi_id: prodiId,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const version = res.data.version || 'generated';
        setCpmkVersion(version);
        
        // Generate new CPMK data
        const generatedCpmk = res.data.data.items.map((item, idx) => ({
          code: item.code || `CPMK-${idx + 1}`,
          description: item.description,
          matched_cpl: item.matched_cpl || null,
          reason: item.reason || null,
          selected_cpls: []
        }));
        
        // Merge: only update empty CPMKs, keep existing ones
        const mergedCpmk = [...formData.cpmk];
        let generatedIdx = 0;
        
        for (let i = 0; i < mergedCpmk.length && generatedIdx < generatedCpmk.length; i++) {
          // Only replace if empty
          if (!mergedCpmk[i].description || mergedCpmk[i].description.trim() === '') {
            mergedCpmk[i] = generatedCpmk[generatedIdx];
            generatedIdx++;
          }
        }
        
        // Auto-match CPL only for newly generated CPMKs
        const cpmkWithCPL = [];
        for (let i = 0; i < mergedCpmk.length; i++) {
          const cpmk = mergedCpmk[i];
          
          // Skip CPL matching if this CPMK wasn't just generated
          if (!emptyCpmkIndices.includes(i)) {
            cpmkWithCPL.push(cpmk);
            continue;
          }
          
          try {
            const matchRes = await aiHelperAPI.matchCPMKWithCPL({
              prodi_id: prodiId,
              cpmk_code: cpmk.code,
              cpmk_description: cpmk.description,
            });

            if (matchRes.data.success && matchRes.data.matches) {
              // Auto-select CPL dengan recommended = true
              const autoSelected = matchRes.data.matches
                .filter(m => m.recommended)
                .map(m => m.kode_cpl);
              
              cpmkWithCPL.push({
                ...cpmk,
                selected_cpls: autoSelected,
                ai_matches: matchRes.data.matches,
              });
            } else {
              cpmkWithCPL.push(cpmk);
            }
          } catch (matchError) {
            console.error(`Failed to match CPL for ${cpmk.code}:`, matchError);
            cpmkWithCPL.push(cpmk);
          }
        }
        
        setFormData({ ...formData, cpmk: cpmkWithCPL });
        
        // Show CPL mapping info if version is matched
        if (version === 'matched') {
          setShowCPLMapping(true);
          alert(`✅ ${emptyCpmkIndices.length} CPMK kosong berhasil di-generate dan dicocokkan dengan CPL!\n\nCek detail mapping di bawah setiap CPMK.`);
        } else {
          alert(`✅ ${emptyCpmkIndices.length} CPMK kosong berhasil di-generate dan otomatis dicocokkan dengan CPL!`);
        }
      }
    } catch (error) {
      console.error('Failed to generate CPMK:', error);
      alert('Gagal generate CPMK: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = () => {
    const newNumber = formData.cpmk.length + 1;
    setFormData({
      ...formData,
      cpmk: [...formData.cpmk, { code: `CPMK-${newNumber}`, description: '', selected_cpls: [] }]
    });
  };

  const handleRemove = (index) => {
    const newCpmk = formData.cpmk.filter((_, i) => i !== index);
    setFormData({ ...formData, cpmk: newCpmk });
  };

  return (
    <div className="relative">
      {/* Auto Complete Loading Overlay */}
      {autoCompleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-pulse">
            <div className="flex flex-col items-center gap-4">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center animate-spin-slow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Progress Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  🚀 Auto Lengkapi Semua
                </h3>
                <p className="text-gray-600 mb-3">
                  {autoCompleteProgress?.step || 'Memproses...'}
                </p>
                
                {/* Progress Bar */}
                {autoCompleteProgress?.total > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(autoCompleteProgress.current / autoCompleteProgress.total) * 100}%` }}
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  Step {autoCompleteProgress?.current || 0} / {autoCompleteProgress?.total || 5}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        
        {/* Version indicator */}
        {cpmkVersion && (
          <div className={`mt-3 p-3 rounded-lg border ${
            cpmkVersion === 'matched' 
              ? 'bg-green-50 border-green-200' 
              : cpmkVersion === 'database'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-purple-50 border-purple-200'
          }`}>
            <p className={`text-sm font-semibold ${
              cpmkVersion === 'matched' 
                ? 'text-green-700' 
                : cpmkVersion === 'database'
                ? 'text-blue-700'
                : 'text-purple-700'
            }`}>
              {cpmkVersion === 'matched' 
                ? '✅ VERSI 2: CPMK dari database sudah dicocokkan dengan CPL Prodi' 
                : cpmkVersion === 'database'
                ? '📚 CPMK dimuat dari database'
                : '🤖 VERSI 1: CPMK baru dibuat oleh AI'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 space-y-3">
          {/* ⚡ AUTO LENGKAPI SEMUA - Tombol Utama */}
          <button
            onClick={handleAutoCompleteAll}
            disabled={autoCompleting || !course}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border-2 border-emerald-400/30"
          >
            {autoCompleting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Sedang Memproses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>⚡ Auto Lengkapi Semua</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">CPMK + CPL + Sub-CPMK</span>
              </>
            )}
          </button>

          {/* Info tentang Auto Lengkapi */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-700 text-center">
              <strong>💡 Auto Lengkapi:</strong> Load dari database jika ada, generate dengan AI jika belum ada (CPMK, CPL Mapping, Sub-CPMK)
            </p>
          </div>

          {/* Top row: Load DB and Generate AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Load from Database Button */}
            <button
              onClick={handleLoadFromDatabase}
              disabled={loadingFromDB || !course || !hasCpmkInDB || autoCompleting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title={!hasCpmkInDB ? 'Mata kuliah ini belum memiliki CPMK di database' : 'Load CPMK dari database'}
            >
              {loadingFromDB ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  <span>Load dari Database</span>
                </>
              )}
            </button>

            {/* Generate All Button */}
            <button
              onClick={handleGenerateAll}
              disabled={generating || !course || autoCompleting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  <span>Generate Semua CPMK dengan AI</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom row: Auto Match All CPL */}
          <button
            onClick={handleMatchAllCPL}
            disabled={matchingAllCPL || !course}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-semibold shadow-md"
          >
            {matchingAllCPL ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Matching CPL... ({matchingProgress.current}/{matchingProgress.total})</span>
              </>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                <span>🎯 Auto Match Semua CPL dengan AI</span>
              </>
            )}
          </button>
        </div>

        {/* Toggle View Mode - Enhanced UI */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl border">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Mode:</span>
            <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <button
                onClick={() => setUseIntegratedView(true)}
                className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 ${
                  useIntegratedView 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-inner' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>✨</span>
                <span>Terintegrasi</span>
              </button>
              <button
                onClick={() => setUseIntegratedView(false)}
                className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 ${
                  !useIntegratedView 
                    ? 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-inner' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>📝</span>
                <span>Klasik</span>
              </button>
            </div>
          </div>
          
          {/* Sub-CPMK Counter with Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border shadow-sm">
              <span className="text-sm text-gray-600">Total Sub-CPMK:</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getTotalSubCpmkCount() === 14 ? 'text-green-600' : 'text-orange-600'}`}>
                  {getTotalSubCpmkCount()}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-lg font-bold text-gray-400">14</span>
              </div>
              {getTotalSubCpmkCount() === 14 && (
                <span className="text-green-500 ml-1">✓</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Summary Bar */}
        {useIntegratedView && (
          <div className="p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                📊 Progress Keseluruhan
              </h4>
              <div className="flex items-center gap-2">
                {(() => {
                  const completedCpmk = formData.cpmk.filter(c => {
                    const hasDeskripsi = c.description && c.description.trim();
                    const hasCpl = c.selected_cpls && c.selected_cpls.length > 0;
                    const cpmkCode = c.code;
                    const subCpmks = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
                    const filledSubs = subCpmks.filter(s => s.description && s.description.trim()).length;
                    return hasDeskripsi && hasCpl && subCpmks.length > 0 && filledSubs === subCpmks.length;
                  }).length;
                  const isAllComplete = completedCpmk === formData.cpmk.length;
                  
                  return (
                    <>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                        isAllComplete 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {completedCpmk}/{formData.cpmk.length} CPMK Lengkap
                      </span>
                      {isAllComplete && (
                        <span className="text-2xl">🎉</span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* CPMK Status Chips */}
            <div className="flex flex-wrap gap-2">
              {formData.cpmk.map((c, idx) => {
                const hasDeskripsi = c.description && c.description.trim();
                const hasCpl = c.selected_cpls && c.selected_cpls.length > 0;
                const cpmkCode = c.code;
                const subCpmks = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
                const filledSubs = subCpmks.filter(s => s.description && s.description.trim()).length;
                const isComplete = hasDeskripsi && hasCpl && subCpmks.length > 0 && filledSubs === subCpmks.length;
                
                return (
                  <div 
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                      isComplete 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-orange-100 text-orange-700 border border-orange-300'
                    }`}
                    title={isComplete ? 'Lengkap' : `Belum lengkap: ${!hasDeskripsi ? 'Deskripsi, ' : ''}${!hasCpl ? 'CPL, ' : ''}${subCpmks.length === 0 ? 'Sub-CPMK belum ditambah, ' : filledSubs < subCpmks.length ? 'Sub-CPMK belum terisi semua' : ''}`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {c.code}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CPMK List - Integrated or Classic View */}
      <div className="space-y-6">
        {useIntegratedView ? (
          // Mode Terintegrasi: CPMK + CPL Mapping + Sub-CPMK dalam satu card
          <>
            {Array.isArray(formData.cpmk) && formData.cpmk.map((item, index) => (
              <div key={index} className="relative">
                <CPMKIntegrated
                  cpmk={item}
                  cpmkIndex={index}
                  course={course}
                  formData={formData}
                  totalCpmk={formData.cpmk.length}
                  onChange={(updatedCpmk) => {
                    const newCpmk = [...formData.cpmk];
                    newCpmk[index] = updatedCpmk;
                    setFormData({ ...formData, cpmk: newCpmk });
                  }}
                  onSubCpmkChange={handleSubCpmkChange}
                />
                {formData.cpmk.length > 1 && (
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md z-20"
                    title="Hapus CPMK"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </>
        ) : (
          // Mode Klasik: CPMK saja dengan CPL Mapping
          <>
            {Array.isArray(formData.cpmk) && formData.cpmk.map((item, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                {/* Header dengan kode CPMK dan action buttons */}
                <div className="p-4 bg-gray-50 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg">
                      {item.code}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Capaian Pembelajaran Mata Kuliah {index + 1}</p>
                  </div>
                  <button
                    onClick={() => handleGenerateOne(index)}
                    disabled={generating && generatingIndex === index}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                title="Generate individual CPMK"
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
            
            {/* CPL Mapping Component */}
            <div className="p-4">
              <CPMKWithCPLMapping
                cpmk={item}
                cpmkIndex={index}
                course={course}
                cpmkBobot={getCpmkBobot(item.code)}
                subCpmkCount={getSubCpmkCount(item.code)}
                onChange={(updatedCpmk) => {
                  const newCpmk = [...formData.cpmk];
                  newCpmk[index] = updatedCpmk;
                  setFormData({ ...formData, cpmk: newCpmk });
                }}
              />
            </div>
          </div>
            ))}
          </>
        )}
        
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
function SubCPMKStep({ formData, setFormData, course, viewMode = false }) {
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [savingToDb, setSavingToDb] = useState(false);
  const [cpmkFromDB, setCpmkFromDB] = useState([]); // Data CPMK dari database (dengan bobot)

  // KONSTANTA: Bobot Sub-CPMK = 100/14 (presisi penuh, tanpa pembulatan)
  const SUB_CPMK_BOBOT = 100 / 14; // 7.142857142857143...

  // Helper: Format bobot untuk tampilan (gunakan koma sebagai desimal)
  const formatBobotDisplay = (value) => {
    // Handle floating point precision untuk total 100%
    if (Math.abs(value - 100) < 0.0001) {
      return '100';
    }
    // Bulatkan ke 2 desimal untuk tampilan yang bersih
    const rounded = Math.round(value * 100) / 100;
    return rounded.toString().replace('.', ',');
  };

  // Load CPMK from database when course changes
  useEffect(() => {
    if (course?.id) {
      loadCpmkData();
    }
  }, [course?.id]);

  const loadCpmkData = async () => {
    try {
      const res = await cpmkAPI.getByCourseId(course.id);
      const cpmkData = res.data?.data || [];
      setCpmkFromDB(cpmkData);
    } catch (error) {
      console.error('Failed to load CPMK:', error);
      setCpmkFromDB([]);
    }
  };

  // Helper: Calculate Sub-CPMK bobot
  // Standar RPS = 14 Sub-CPMK, bobot = 100/14 (presisi penuh tanpa pembulatan)
  const calculateSubCpmkBobot = () => {
    return SUB_CPMK_BOBOT; // 7.142857142857143%
  };

  // Simple change handler without auto-save (will be saved when RPS is saved)
  const handleSubCPMKChange = (newSubCpmk) => {
    setFormData({ ...formData, subCpmk: newSubCpmk });
  };

  // Fungsi untuk simpan Sub-CPMK ke database
  const handleSaveToDatabase = async () => {
    if (!course || !course.id) {
      alert('❌ Mata kuliah belum dipilih!');
      return;
    }

    // Validasi CPMK
    const validCpmk = formData.cpmk.filter(c => c.description && c.description.trim());
    if (validCpmk.length === 0) {
      alert('❌ Harap isi CPMK terlebih dahulu!');
      return;
    }

    // Validasi Sub-CPMK
    const validSubCpmk = formData.subCpmk.filter(s => s.description && s.description.trim());
    if (validSubCpmk.length === 0) {
      alert('❌ Harap isi Sub-CPMK terlebih dahulu!');
      return;
    }

    setSavingToDb(true);
    try {
      console.log('💾 Saving Sub-CPMK to database...');
      
      // Step 1: Batch create/update CPMK
      const cpmkPayload = {
        course_id: course.id,
        cpmks: validCpmk.map((c, idx) => ({
          code: c.code,
          description: c.description,
          sub_cpmks: [] // Sub-CPMK akan disimpan terpisah
        }))
      };
      
      console.log('📤 Saving CPMK batch:', cpmkPayload);
      const cpmkRes = await cpmkAPI.batchCreateOrUpdate(cpmkPayload);
      console.log('📥 CPMK batch response:', cpmkRes);
      console.log('📥 CPMK batch response.data:', cpmkRes.data);
      
      // Backend tidak return data CPMK, jadi kita load ulang
      console.log('📥 Loading CPMK from database...');
      const loadCpmkRes = await cpmkAPI.getByCourseId(course.id);
      let savedCpmk = loadCpmkRes.data?.data || [];
      
      console.log('✅ CPMK loaded from DB:', savedCpmk.length);
      console.log('✅ CPMK data:', savedCpmk);
      
      // Step 2: Build map of CPMK code to CPMK ID
      const cpmkCodeToId = {};
      savedCpmk.forEach(cpmk => {
        // Support berbagai format: "CPMK-1", "CPMK 1", dll
        cpmkCodeToId[`CPMK-${cpmk.cpmk_number}`] = cpmk.id;
        cpmkCodeToId[`CPMK ${cpmk.cpmk_number}`] = cpmk.id;
        cpmkCodeToId[`CPMK${cpmk.cpmk_number}`] = cpmk.id;
      });
      
      console.log('🗺️ CPMK code to ID map:', cpmkCodeToId);
      console.log('🗺️ SubCpmk list:', validSubCpmk);
      
      // Bobot Sub-CPMK: 100% / 14 (presisi penuh tanpa pembulatan)
      const subCpmkBobot = 100 / 14; // 7.142857142857143...
      console.log(`💯 Sub-CPMK Bobot: ${subCpmkBobot}% (standar 14 Sub-CPMK)`);
      
      // Step 3: Save Sub-CPMK
      let subCpmkSaved = 0;
      for (const subCpmk of validSubCpmk) {
        // Support both cpmk_id and relatedCpmk fields
        const relatedCpmkValue = subCpmk.cpmk_id || subCpmk.relatedCpmk || '';
        console.log('🔍 Processing Sub-CPMK:', subCpmk.code, 'Related to:', relatedCpmkValue);
        
        // Try to find CPMK ID
        const cpmkId = cpmkCodeToId[relatedCpmkValue];
        if (!cpmkId) {
          console.warn('⚠️ CPMK not found for:', relatedCpmkValue);
          console.warn('⚠️ Available keys:', Object.keys(cpmkCodeToId));
          continue;
        }
        
        try {
          // Extract sub-cpmk number from code (e.g., "Sub-CPMK-1" -> 1)
          const subCpmkNumber = parseInt(subCpmk.code.match(/\d+/)?.[0] || (subCpmkSaved + 1));
          
          await cpmkAPI.addSubCPMK(cpmkId, {
            sub_cpmk_number: subCpmkNumber,
            description: subCpmk.description,
            bobot: subCpmkBobot
          });
          
          subCpmkSaved++;
          console.log(`✅ Sub-CPMK ${subCpmkNumber} saved for ${relatedCpmkValue}`);
        } catch (error) {
          if (error.response?.status === 409) {
            console.log(`ℹ️ Sub-CPMK already exists, skipping`);
            subCpmkSaved++;
          } else {
            console.error('❌ Failed to save Sub-CPMK:', error);
          }
        }
      }
      
      alert(`✅ Berhasil menyimpan ${subCpmkSaved} Sub-CPMK ke database!`);
      console.log(`✅ Total Sub-CPMK synced: ${subCpmkSaved}/${validSubCpmk.length}`);
      
    } catch (error) {
      console.error('❌ Failed to save Sub-CPMK to database:', error);
      alert('❌ Gagal menyimpan Sub-CPMK: ' + (error.response?.data?.error || error.message));
    } finally {
      setSavingToDb(false);
    }
  };

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
    <div className="px-2 sm:px-0">
      {/* Progress Modal Overlay */}
      {generating && generatingIndex === null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-8 max-w-md w-full">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-3 sm:mb-4">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Generating Sub-CPMK</h3>
              <p className="text-xs sm:text-sm text-gray-600">{progressText}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-bold text-purple-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end px-1 sm:px-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="text-xs text-white font-bold">{progress}%</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin inline mr-2" />
              Mohon tunggu, AI sedang bekerja...
            </div>
          </div>
        </div>
      )}

      {/* Header Section - Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">📝 Sub-Capaian Pembelajaran (Sub-CPMK)</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Total 14 Sub-CPMK untuk 14 minggu pembelajaran (minggu 8 UTS, minggu 16 UAS).
          </p>
          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700">
              <strong>Catatan:</strong> Urutkan Sub-CPMK dari dasar ke lanjut. Setiap Sub-CPMK harus terkait dengan salah satu CPMK di atas.
            </p>
          </div>
        </div>
        
        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 lg:flex-shrink-0">
          <button
            onClick={handleSaveToDatabase}
            disabled={savingToDb || viewMode}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors w-full sm:w-auto"
            title="Simpan Sub-CPMK ke database untuk digunakan di halaman CPMK Management"
          >
            {savingToDb ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Menyimpan...</span>
                <span className="sm:hidden">Menyimpan...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Simpan ke Database</span>
                <span className="sm:hidden">Simpan DB</span>
              </>
            )}
          </button>
          <button
            onClick={handleGenerateAll}
            disabled={generating || viewMode}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 text-white text-sm sm:text-base rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors w-full sm:w-auto"
          >
            {generating && generatingIndex === null ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Generating All...</span>
                <span className="sm:hidden">Generating...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Generate All</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-CPMK Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {Array.isArray(formData.subCpmk) && formData.subCpmk.map((item, index) => (
          <div key={index} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors bg-white">
            {/* Header Row - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="inline-block px-3 py-1 bg-purple-600 text-white font-semibold rounded-lg text-xs sm:text-sm whitespace-nowrap self-start">
                {item.code}
              </span>
              <select
                value={item.relatedCpmk}
                onChange={(e) => {
                  const newSubCpmk = [...formData.subCpmk];
                  newSubCpmk[index].relatedCpmk = e.target.value;
                  handleSubCPMKChange(newSubCpmk);
                }}
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
                disabled={viewMode}
              >
                <option value="">- Pilih CPMK -</option>
                {Array.isArray(formData.cpmk) && formData.cpmk.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded whitespace-nowrap self-start">
                Bobot: {formatBobotDisplay(calculateSubCpmkBobot())}%
              </span>
              {!viewMode && (
                <button
                  onClick={() => handleGenerateOne(index)}
                  disabled={generating && generatingIndex === index}
                  className="flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors self-start sm:self-auto"
                  title="Generate dengan AI"
                >
                  {generating && generatingIndex === index ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </button>
              )}
            </div>
            
            {/* Textarea - Responsive */}
            <textarea
              value={item.description}
              onChange={(e) => {
                const newSubCpmk = [...formData.subCpmk];
                newSubCpmk[index].description = e.target.value;
                handleSubCPMKChange(newSubCpmk);
              }}
              placeholder="Deskripsi Sub-CPMK..."
              className={`w-full px-2 sm:px-3 py-2 border rounded-lg resize-none text-xs sm:text-sm ${
                viewMode 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              }`}
              rows={3}
              disabled={viewMode}
              readOnly={viewMode}
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
        cpmk_list: formData.cpmk.filter(c => c.description && c.description.trim()),
        sub_cpmk_list: formData.subCpmk.filter(s => s.description && s.description.trim()),
        bahan_kajian: formData.bahanKajian.filter(b => b && b.trim())
      });
      
      if (res.data.data && res.data.data.weeks) {
        const newRencana = [...formData.rencanaMingguan];
        
        // Map berdasarkan nomor minggu dari AI response
        res.data.data.weeks.forEach((week) => {
          const mingguNumber = week.minggu;
          const arrayIndex = mingguNumber - 1; // Convert to 0-based index
          
          // Pastikan index valid (0-13 untuk 14 minggu)
          if (arrayIndex >= 0 && arrayIndex < 14) {
            newRencana[arrayIndex] = { 
              minggu: mingguNumber,
              subCpmk: week.subCpmk || week.sub_cpmk || '',
              materi: week.materi || '',
              metode: week.metode || '',
              penilaian: week.penilaian || ''
            };
          }
        });
        
        setFormData({ ...formData, rencanaMingguan: newRencana });
        alert(`✅ Berhasil generate ${res.data.data.weeks.length} minggu pembelajaran!`);
      }
    } catch (error) {
      console.error('Failed to generate rencana:', error);
      alert('Gagal generate rencana pembelajaran: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Rencana Pembelajaran 14 Minggu</h2>
          <p className="text-gray-600">
            Rencana detail untuk setiap minggu pembelajaran. (UTS dan UAS diatur terpisah dalam sistem penilaian)
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
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <h3 className="font-bold text-lg mb-3 text-blue-600">
              Minggu {minggu.minggu}
            </h3>
            
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
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 6: Rencana Tugas
function RencanaTugasStep({ formData, setFormData, course, viewMode = false }) {
  const [activeTab, setActiveTab] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);

  const handleTugasChange = (index, field, value) => {
    const newTugas = [...formData.rencanaTugas];
    newTugas[index][field] = value;
    setFormData({ ...formData, rencanaTugas: newTugas });
  };

  const availableSubCpmk = formData.subCpmk.filter(s => s.description && s.description.trim());

  // Generate AI untuk satu tugas
  const handleGenerateOne = async (tugasIndex) => {
    if (!course || viewMode) return;
    
    const tugas = formData.rencanaTugas[tugasIndex];
    if (!tugas.subCpmk) {
      alert('Pilih Sub-CPMK terlebih dahulu!');
      return;
    }

    const selectedSubCpmk = availableSubCpmk.find(s => s.code === tugas.subCpmk);
    if (!selectedSubCpmk) {
      alert('Sub-CPMK tidak ditemukan!');
      return;
    }

    setGenerating(true);
    setGeneratingIndex(tugasIndex);
    
    try {
      // Generate dengan template yang sederhana
      const newTugas = [...formData.rencanaTugas];
      
      // Set default values berdasarkan Sub-CPMK
      newTugas[tugasIndex] = {
        ...newTugas[tugasIndex],
        judulTugas: `Tugas ${tugasIndex + 1}: ${selectedSubCpmk.description.substring(0, 50)}...`,
        indikator: `Mahasiswa mampu ${selectedSubCpmk.description.toLowerCase()}`,
        batasWaktu: `Minggu ke-${(tugasIndex + 1) * 4}`,
        petunjukPengerjaan: `1. Pelajari materi terkait ${selectedSubCpmk.code}\n2. Kerjakan tugas sesuai Sub-CPMK\n3. Dokumentasikan hasil pekerjaan\n4. Submit tepat waktu`,
        luaranTugas: `Laporan/dokumen terkait ${selectedSubCpmk.code}`,
        kriteriaPenilaian: `- Kesesuaian dengan ${selectedSubCpmk.code}\n- Kelengkapan isi\n- Kerapihan dan sistematika\n- Ketepatan waktu pengumpulan`,
        teknikPenilaian: 'Penilaian hasil kerja/laporan',
        bobotPersen: `${20 + (tugasIndex * 5)}%`
      };
      
      setFormData({ ...formData, rencanaTugas: newTugas });
      
      // Optional: Generate description lebih detail dengan AI jika tersedia
      try {
        const res = await aiHelperAPI.generateCourseDescription({
          course_code: course.code,
          course_title: `Tugas ${tugasIndex + 1} - ${selectedSubCpmk.description}`,
          credits: 0
        });
        
        if (res.data.data && res.data.data.description) {
          // Update petunjuk pengerjaan dengan hasil AI
          newTugas[tugasIndex].petunjukPengerjaan = res.data.data.description.substring(0, 500);
          setFormData({ ...formData, rencanaTugas: newTugas });
        }
      } catch (aiError) {
        console.log('AI enhancement skipped:', aiError);
        // Continue dengan data default yang sudah di-set
      }
      
    } catch (error) {
      console.error('Failed to generate tugas:', error);
      alert('Gagal generate tugas');
    } finally {
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  // Generate semua tugas sekaligus dengan auto-assign Sub-CPMK
  const handleGenerateAll = async () => {
    if (viewMode) return;
    
    // Validasi Sub-CPMK tersedia
    if (availableSubCpmk.length === 0) {
      alert('❌ Harap isi Sub-CPMK terlebih dahulu di Step 3!');
      return;
    }

    if (availableSubCpmk.length < 14) {
      alert(`⚠️ Sub-CPMK yang terisi hanya ${availableSubCpmk.length}. Minimal 14 Sub-CPMK diperlukan untuk 14 tugas.`);
      return;
    }

    setGenerating(true);
    
    try {
      const newTugas = [...formData.rencanaTugas];
      
      // Loop untuk 14 tugas
      for (let i = 0; i < 14; i++) {
        setGeneratingIndex(i);
        
        // Auto-assign Sub-CPMK (1 tugas = 1 Sub-CPMK)
        const selectedSubCpmk = availableSubCpmk[i];
        
        // Generate tugas berdasarkan Sub-CPMK
        newTugas[i] = {
          tugasKe: i + 1,
          subCpmk: selectedSubCpmk.code,
          indikator: `Mahasiswa mampu ${selectedSubCpmk.description.toLowerCase()}`,
          judulTugas: `Tugas ${i + 1}: ${selectedSubCpmk.description.substring(0, 60)}${selectedSubCpmk.description.length > 60 ? '...' : ''}`,
          batasWaktu: `Minggu ke-${i + 1}`,
          petunjukPengerjaan: `1. Pelajari materi terkait ${selectedSubCpmk.code}\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: "${selectedSubCpmk.description}"\n3. Dokumentasikan hasil pekerjaan dengan rapi\n4. Submit tepat waktu sebelum deadline`,
          luaranTugas: `Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap ${selectedSubCpmk.code}`,
          kriteriaPenilaian: `- Kesesuaian dengan ${selectedSubCpmk.code} (40%)\n- Kelengkapan dan kedalaman isi (30%)\n- Kerapihan dan sistematika penulisan (20%)\n- Ketepatan waktu pengumpulan (10%)`,
          teknikPenilaian: 'Penilaian hasil kerja/laporan',
          bobotPersen: `${Math.round(100 / 14)}%`
        };
        
        // Delay untuk UX
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setFormData({ ...formData, rencanaTugas: newTugas });
      
      setGenerating(false);
      setGeneratingIndex(null);
      alert('✅ Semua 14 tugas berhasil di-generate dengan Sub-CPMK otomatis!');
      
    } catch (error) {
      console.error('Failed to generate all tugas:', error);
      alert('❌ Gagal generate tugas: ' + error.message);
      setGenerating(false);
      setGeneratingIndex(null);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">📝 Rencana Tugas</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Rencanakan 14 tugas terstruktur untuk mahasiswa (1 tugas per minggu materi)
            </p>
          </div>
          {!viewMode && (
            <button
              onClick={handleGenerateAll}
              disabled={generating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Generate All AI</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-xs sm:text-sm text-orange-700">
            <strong>Tips:</strong> Setiap tugas harus terkait dengan Sub-CPMK dan memiliki kriteria penilaian yang jelas
          </p>
        </div>
      </div>

      {/* Layout: Sidebar (Desktop) + Dropdown (Mobile) */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar Selector untuk Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-2 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 mb-2">Pilih Tugas</h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {formData.rencanaTugas.map((tugas, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    activeTab === idx
                      ? 'bg-orange-600 text-white font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Tugas {idx + 1}</div>
                      {tugas.subCpmk && (
                        <div className={`text-xs mt-0.5 truncate ${
                          activeTab === idx ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {tugas.subCpmk}
                        </div>
                      )}
                    </div>
                    {generating && generatingIndex === idx && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdown Selector untuk Mobile/Tablet */}
        <div className="lg:hidden mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Tugas
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(parseInt(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {formData.rencanaTugas.map((tugas, idx) => (
              <option key={idx} value={idx}>
                Tugas {idx + 1} {tugas.subCpmk ? `- ${tugas.subCpmk}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
      {/* Form untuk tugas aktif */}
      <div className="space-y-4 sm:space-y-6">{/* Tombol Generate per Tugas */}
        {!viewMode && (
          <div className="flex justify-end">
            <button
              onClick={() => handleGenerateOne(activeTab)}
              disabled={generating || !formData.rencanaTugas[activeTab].subCpmk}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              title="Generate detail tugas ini dengan AI"
            >
              {generating && generatingIndex === activeTab ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Generate Tugas {activeTab + 1}</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sub-CPMK */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sub-CPMK Terkait <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.rencanaTugas[activeTab].subCpmk}
              onChange={(e) => handleTugasChange(activeTab, 'subCpmk', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={viewMode}
            >
              <option value="">-- Pilih Sub-CPMK --</option>
              {availableSubCpmk.map((sub, idx) => (
                <option key={idx} value={sub.code}>
                  {sub.code}: {sub.description.substring(0, 60)}...
                </option>
              ))}
            </select>
          </div>

          {/* Batas Waktu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Batas Waktu Pengumpulan
            </label>
            <input
              type="text"
              value={formData.rencanaTugas[activeTab].batasWaktu}
              onChange={(e) => handleTugasChange(activeTab, 'batasWaktu', e.target.value)}
              placeholder="Contoh: Minggu ke-7, Akhir Semester"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Indikator */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Indikator Pencapaian
          </label>
          <textarea
            value={formData.rencanaTugas[activeTab].indikator}
            onChange={(e) => handleTugasChange(activeTab, 'indikator', e.target.value)}
            placeholder="Mahasiswa mampu..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Judul Tugas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul Tugas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.rencanaTugas[activeTab].judulTugas}
            onChange={(e) => handleTugasChange(activeTab, 'judulTugas', e.target.value)}
            placeholder="Contoh: Analisis Kasus Pemrograman Berbasis Objek"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Petunjuk Pengerjaan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Petunjuk Pengerjaan Tugas
          </label>
          <textarea
            value={formData.rencanaTugas[activeTab].petunjukPengerjaan}
            onChange={(e) => handleTugasChange(activeTab, 'petunjukPengerjaan', e.target.value)}
            placeholder="1. Bentuk kelompok 3-4 orang&#10;2. Pilih studi kasus yang relevan&#10;3. Analisis menggunakan konsep yang telah dipelajari..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Luaran Tugas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Luaran Tugas (Output)
          </label>
          <input
            type="text"
            value={formData.rencanaTugas[activeTab].luaranTugas}
            onChange={(e) => handleTugasChange(activeTab, 'luaranTugas', e.target.value)}
            placeholder="Contoh: Laporan tertulis (PDF), Presentasi PPT, Source Code"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kriteria Penilaian */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kriteria Penilaian
            </label>
            <textarea
              value={formData.rencanaTugas[activeTab].kriteriaPenilaian}
              onChange={(e) => handleTugasChange(activeTab, 'kriteriaPenilaian', e.target.value)}
              placeholder="- Keakuratan analisis (40%)&#10;- Kelengkapan laporan (30%)&#10;- Presentasi (30%)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Teknik Penilaian */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teknik Penilaian
            </label>
            <textarea
              value={formData.rencanaTugas[activeTab].teknikPenilaian}
              onChange={(e) => handleTugasChange(activeTab, 'teknikPenilaian', e.target.value)}
              placeholder="Rubrik penilaian, Peer review, Observasi presentasi"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
            />
          </div>
        </div>

        {/* Bobot Penilaian */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bobot Penilaian (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.rencanaTugas[activeTab].bobotPersen}
            onChange={(e) => handleTugasChange(activeTab, 'bobotPersen', e.target.value)}
            placeholder="Contoh: 20"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total bobot ketiga tugas sebaiknya seimbang dengan komponen penilaian lain
          </p>
        </div>

        {/* Info Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">📊 Ringkasan Tugas {activeTab + 1}:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Judul: <span className="font-medium">{formData.rencanaTugas[activeTab].judulTugas || '-'}</span></li>
            <li>• Sub-CPMK: <span className="font-medium">{formData.rencanaTugas[activeTab].subCpmk || '-'}</span></li>
            <li>• Deadline: <span className="font-medium">{formData.rencanaTugas[activeTab].batasWaktu || '-'}</span></li>
            <li>• Bobot: <span className="font-medium">{formData.rencanaTugas[activeTab].bobotPersen || '0'}%</span></li>
          </ul>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

// Step 7: Referensi
function ReferensiStep({ formData, setFormData, course }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!course) return;
    setGenerating(true);
    try {
      // Kirim context lengkap untuk referensi yang relevan
      const res = await aiHelperAPI.generateReferensi({
        course_code: course.code,
        course_title: course.title,
        description: formData.description,
        cpmk_list: formData.cpmk.filter(c => c.description && c.description.trim()).map(c => c.description),
        bahan_kajian: formData.bahanKajian.filter(b => b && b.trim())
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
        alert(`✅ Berhasil generate ${items.length} referensi!`);
      }
    } catch (error) {
      console.error('Failed to generate referensi:', error);
      alert('❌ Gagal generate referensi: ' + (error.response?.data?.error || error.message));
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
