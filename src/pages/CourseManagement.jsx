import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Upload, Plus, Search, Loader2, CheckCircle, AlertCircle, FileText, BookOpen, CheckCircle2, Trash2, Edit, Settings, Filter, X, Sparkles, Flame, XCircle, Clock, Zap } from 'lucide-react';
import { courseAPI, programAPI, prodiAPI, generatedRPSAPI, cpmkAPI, aiHelperAPI } from '../services/api';

export default function CourseManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin/');
  
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [loading, setLoading] = useState(true); // Start with true
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [coursesWithRPS, setCoursesWithRPS] = useState(new Map());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [filterSKS, setFilterSKS] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRPSStatus, setFilterRPSStatus] = useState('all');
  
  // === BATCH RPS GENERATION STATES ===
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({
    current: 0,
    total: 0,
    currentCourse: '',
    currentStep: '',
    results: [], // { courseId, courseTitle, status: 'success'|'error'|'skipped', message }
  });
  const [batchMode, setBatchMode] = useState('all'); // 'all' | 'without-rps'
  const [selectedCourses, setSelectedCourses] = useState(new Set()); // Set of course IDs for batch selection
  const [selectionMode, setSelectionMode] = useState(false); // Toggle selection mode
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: '',
    semester: '',
    category: '',
    tahun: `${new Date().getFullYear()}1`, // Format: 20251 (tahun + semester)
  });
  
  const userRole = localStorage.getItem('role');
  const prodiId = localStorage.getItem('prodi_id');

  // Load categories dari localStorage berdasarkan program yang dipilih
  useEffect(() => {
    if (selectedProgram) {
      const storageKey = `categories_${selectedProgram}`;
      const savedCategories = localStorage.getItem(storageKey);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        // Default categories untuk program baru
        const defaultCategories = [
          'MKDU',
          'BASIC SCIENCE',
          'COMPUTER SCIENCE',
        ];
        setCategories(defaultCategories);
        localStorage.setItem(storageKey, JSON.stringify(defaultCategories));
      }
    }
  }, [selectedProgram]);

  // Save categories ke localStorage setiap kali berubah
  useEffect(() => {
    if (selectedProgram && categories.length > 0) {
      const storageKey = `categories_${selectedProgram}`;
      localStorage.setItem(storageKey, JSON.stringify(categories));
    }
  }, [categories, selectedProgram]);

  console.log('CourseManagement rendered', { programs, selectedProgram, courses });

  const loadPrograms = useCallback(async () => {
    try {
      console.log('Loading prodis as programs...');
      console.log('User role:', userRole, 'Prodi ID:', prodiId);
      
      // Load prodis (bukan programs lagi)
      const res = await prodiAPI.getActive();
      console.log('Prodis response:', res);
      console.log('Prodis response data:', res.data);
      
      // Handle nested response structure: res.data.data.data or res.data.data
      let prodiList = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        prodiList = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        prodiList = res.data.data;
      } else if (Array.isArray(res.data)) {
        prodiList = res.data;
      }
      console.log('All prodis before filter:', prodiList);
      
      // Jika user adalah kaprodi, filter hanya prodi miliknya
      if ((userRole === 'prodi' || userRole === 'kaprodi') && prodiId) {
        console.log('Filtering for kaprodi. User prodi_id:', prodiId, 'Type:', typeof prodiId);
        const originalLength = prodiList.length;
        prodiList = prodiList.filter(p => {
          console.log(`Comparing prodi id "${p.id}" (type: ${typeof p.id}) with user prodi_id "${prodiId}" (type: ${typeof prodiId})`);
          // Handle both string and direct comparison
          return p.id === prodiId || p.id.toString() === prodiId.toString();
        });
        console.log(`Filtered prodis for kaprodi: ${originalLength} -> ${prodiList.length}`, prodiList);
        
        // If no match found after filter, don't filter and show all
        if (prodiList.length === 0 && originalLength > 0) {
          console.warn('No matching prodi found after filter. Showing first available prodi.');
          prodiList = [res.data?.data?.data?.[0] || res.data?.data?.[0] || res.data?.[0]].filter(Boolean);
        }
      }
      
      console.log('Final prodi list:', prodiList);
      setPrograms(prodiList);
      if (prodiList.length > 0) {
        setSelectedProgram(prodiList[0].id);
      } else {
        console.warn('No prodi found');
        setLoading(false); // Stop loading if no prodi
      }
    } catch (error) {
      console.error('Failed to load prodis:', error);
      setLoading(false); // Stop loading on error
      alert('Error loading program studi: ' + (error.response?.data?.message || error.message));
    }
  }, [userRole, prodiId]);

  const loadCourses = useCallback(async () => {
    console.log('loadCourses called with selectedProgram:', selectedProgram);
    setLoading(true);
    try {
      // Load courses - selectedProgram is prodi_id, backend will convert to program_id
      let courseList = [];
      
      if (selectedProgram) {
        console.log('Fetching courses for prodi_id:', selectedProgram);
        const res = await courseAPI.getByProgramId(selectedProgram);
        console.log('Courses API response:', res);
        
        // Handle nested response structure
        if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
          courseList = res.data.data.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          courseList = res.data.data;
        } else if (Array.isArray(res.data)) {
          courseList = res.data;
        }
        
        console.log('Parsed courseList:', courseList);
      }
      
      // Ensure courseList is an array
      if (!Array.isArray(courseList)) {
        console.error('courseList is not an array:', courseList);
        courseList = [];
      }
      
      setCourses(courseList);
      
      // Load RPS untuk setiap course
      await loadRPSStatus(courseList);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProgram, userRole, prodiId, programs]);

  const loadRPSStatus = async (courseList) => {
    try {
      // Get all RPS - set large page_size to get all
      const rpsRes = await generatedRPSAPI.getAll({ page: 1, page_size: 1000 });
      console.log('RPS response:', rpsRes);
      
      // Handle nested response structure
      let rpsList = [];
      if (rpsRes.data?.data?.data && Array.isArray(rpsRes.data.data.data)) {
        rpsList = rpsRes.data.data.data;
      } else if (rpsRes.data?.data && Array.isArray(rpsRes.data.data)) {
        rpsList = rpsRes.data.data;
      } else if (Array.isArray(rpsRes.data)) {
        rpsList = rpsRes.data;
      }
      
      console.log('RPS list:', rpsList);
      
      // Ensure rpsList is an array before mapping
      if (!Array.isArray(rpsList)) {
        console.error('rpsList is not an array:', rpsList);
        rpsList = [];
      }
      
      // Create Map of course IDs to RPS IDs
      const rpsMap = new Map(rpsList.map(rps => [rps.course_id, rps.id]));
      setCoursesWithRPS(rpsMap);
    } catch (error) {
      console.error('Failed to load RPS status:', error);
      setCoursesWithRPS(new Map());
    }
  };

  // =====================================================
  // BATCH RPS GENERATION
  // =====================================================
  
  // Toggle course selection
  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };
  
  // Select all filtered courses
  const selectAllCourses = () => {
    const coursesWithoutRPS = filteredCourses.filter(c => !coursesWithRPS.has(c.id));
    setSelectedCourses(new Set(coursesWithoutRPS.map(c => c.id)));
  };
  
  // Deselect all
  const deselectAllCourses = () => {
    setSelectedCourses(new Set());
  };
  
  // Toggle all selection
  const toggleSelectAll = () => {
    const coursesWithoutRPS = filteredCourses.filter(c => !coursesWithRPS.has(c.id));
    if (selectedCourses.size === coursesWithoutRPS.length) {
      deselectAllCourses();
    } else {
      selectAllCourses();
    }
  };
  
  const handleBatchGenerateRPS = async () => {
    // Determine which courses to process based on selection
    let coursesToProcess = [];
    
    if (selectionMode && selectedCourses.size > 0) {
      // Use selected courses
      coursesToProcess = filteredCourses.filter(c => selectedCourses.has(c.id));
    } else if (batchMode === 'all') {
      coursesToProcess = [...filteredCourses];
    } else if (batchMode === 'without-rps') {
      coursesToProcess = filteredCourses.filter(c => !coursesWithRPS.has(c.id));
    }
    
    if (coursesToProcess.length === 0) {
      alert('⚠️ Tidak ada mata kuliah yang perlu di-generate RPS-nya!');
      return;
    }
    
    const confirmMsg = `🚀 Generate RPS untuk ${coursesToProcess.length} mata kuliah?\n\nProses ini akan:\n1. Load CPMK dari database (atau generate AI jika belum ada)\n2. Load CPL mapping (atau match AI jika belum ada)\n3. Load Sub-CPMK dari database (atau generate AI jika belum ada)\n4. Generate Bahan Kajian dengan AI\n5. Generate Rencana Pembelajaran dengan AI\n6. Generate Referensi dengan AI\n\nData yang sudah ada di database akan digunakan langsung.\n\nLanjutkan?`;
    
    if (!confirm(confirmMsg)) return;
    
    setBatchGenerating(true);
    setBatchProgress({
      current: 0,
      total: coursesToProcess.length,
      currentCourse: '',
      currentStep: 'Memulai...',
      results: [],
    });
    
    const results = [];
    
    for (let i = 0; i < coursesToProcess.length; i++) {
      const course = coursesToProcess[i];
      
      setBatchProgress(prev => ({
        ...prev,
        current: i + 1,
        currentCourse: course.title,
        currentStep: 'Mempersiapkan data...',
      }));
      
      try {
        // Check if RPS already exists
        if (coursesWithRPS.has(course.id)) {
          results.push({
            courseId: course.id,
            courseCode: course.code,
            courseTitle: course.title,
            status: 'skipped',
            message: 'RPS sudah ada',
          });
          setBatchProgress(prev => ({ ...prev, results: [...results] }));
          continue;
        }
        
        // === STEP 0: Generate Deskripsi Mata Kuliah (jika belum ada) ===
        let courseDescription = course.description || '';
        if (!courseDescription || courseDescription.trim() === '') {
          setBatchProgress(prev => ({ ...prev, currentStep: '📝 Generate Deskripsi Mata Kuliah...' }));
          try {
            const descRes = await aiHelperAPI.generateCourseDescription({
              course_code: course.code,
              course_title: course.title,
              credits: course.credits,
              semester: course.semester,
            });
            if (descRes.data?.data?.description) {
              courseDescription = descRes.data.data.description;
              console.log(`[Batch] Generated description for ${course.code}`);
            }
          } catch (descError) {
            console.error('Description generation failed:', descError);
            courseDescription = `Mata kuliah ${course.title} dengan bobot ${course.credits} SKS.`;
          }
        }
        
        // === STEP 1: Load or Generate CPMK ===
        setBatchProgress(prev => ({ ...prev, currentStep: '📋 Menyiapkan CPMK...' }));
        
        let cpmkData = [];
        let cpmkFromDB = false;
        
        try {
          // Try to load from database first
          const cpmkRes = await cpmkAPI.getByCourseId(course.id);
          const dbCpmk = cpmkRes.data?.data || [];
          
          if (dbCpmk.length > 0) {
            cpmkFromDB = true;
            cpmkData = dbCpmk.map((item, idx) => ({
              id: item.id, // UUID dari database - penting untuk save Sub-CPMK
              cpmk_number: item.cpmk_number || idx + 1,
              code: `CPMK-${item.cpmk_number || idx + 1}`,
              description: item.description || '',
              matched_cpl: item.matched_cpl || null,
              selected_cpls: item.matched_cpl ? item.matched_cpl.split(',').map(s => s.trim()) : [],
              // Keep sub_cpmks for later use
              sub_cpmks: item.sub_cpmks || item.SubCPMKs || [],
            }));
            console.log(`[Batch] Loaded ${cpmkData.length} CPMK from DB for ${course.code}`);
          }
        } catch (e) {
          console.log('No CPMK in DB for', course.code);
        }
        
        // If no CPMK, generate with AI
        if (cpmkData.length === 0) {
          setBatchProgress(prev => ({ ...prev, currentStep: '🤖 Generate CPMK dengan AI...' }));
          try {
            const aiRes = await aiHelperAPI.generateCPMK({
              course_id: course.id,
              course_code: course.code,
              course_title: course.title,
              credits: course.credits,
              prodi_id: prodiId,
            });
            if (aiRes.data?.data?.items) {
              cpmkData = aiRes.data.data.items.map((item, idx) => ({
                cpmk_number: idx + 1,
                code: item.code || `CPMK-${idx + 1}`,
                description: item.description,
                matched_cpl: item.matched_cpl || null,
                sub_cpmks: [],
              }));
              console.log(`[Batch] Generated ${cpmkData.length} CPMK with AI for ${course.code}`);
            }
          } catch (aiError) {
            console.error('AI CPMK generation failed:', aiError);
          }
        }
        
        // === STEP 2: Match CPL (only for CPMK without CPL) ===
        const cpmkNeedCPL = cpmkData.filter(c => !c.matched_cpl && c.description);
        
        if (cpmkNeedCPL.length > 0) {
          setBatchProgress(prev => ({ ...prev, currentStep: `🔗 Matching CPL (${cpmkNeedCPL.length} CPMK)...` }));
          
          for (let j = 0; j < cpmkData.length; j++) {
            const cpmk = cpmkData[j];
            if (!cpmk.matched_cpl && cpmk.description) {
              try {
                const matchRes = await aiHelperAPI.matchCPMKWithCPL({
                  prodi_id: prodiId,
                  cpmk_code: cpmk.code,
                  cpmk_description: cpmk.description,
                });
                if (matchRes.data?.matches) {
                  const recommended = matchRes.data.matches.filter(m => m.recommended);
                  if (recommended.length > 0) {
                    cpmkData[j].matched_cpl = recommended.map(m => m.kode_cpl).join(', ');
                    cpmkData[j].selected_cpls = recommended.map(m => m.kode_cpl);
                  }
                }
              } catch (matchError) {
                console.error('CPL matching failed:', matchError);
              }
              await new Promise(r => setTimeout(r, 200)); // Rate limiting
            }
          }
        } else {
          console.log(`[Batch] All CPMK already have CPL mapping for ${course.code}`);
        }
        
        // === STEP 3: Load or Generate Sub-CPMK ===
        setBatchProgress(prev => ({ ...prev, currentStep: '📝 Menyiapkan Sub-CPMK...' }));
        
        const MAX_SUB_CPMK = 14; // Maksimal 14 Sub-CPMK
        let subCpmkData = [];
        let subCpmkFromDB = false;
        
        // Try to load Sub-CPMK from database (already preloaded with CPMK)
        // PENTING: Batasi maksimal 14 Sub-CPMK total
        if (cpmkData.length > 0) {
          let subCounter = 1;
          cpmkData.forEach((cpmk, idx) => {
            const subs = cpmk.sub_cpmks || cpmk.SubCPMKs || [];
            if (subs.length > 0) {
              subs.forEach(sub => {
                // Hanya ambil sampai maksimal 14 Sub-CPMK
                if (subCpmkData.length < MAX_SUB_CPMK) {
                  subCpmkData.push({
                    code: `Sub-CPMK-${subCounter}`,
                    description: sub.description || '',
                    cpmk_id: cpmk.code || `CPMK-${idx + 1}`,
                  });
                  subCounter++;
                }
              });
              subCpmkFromDB = true;
            }
          });
        }
        
        console.log(`[Batch] Sub-CPMK loaded from DB: ${subCpmkData.length} (max ${MAX_SUB_CPMK})`);
        
        // If no Sub-CPMK from database OR less than 14, generate with AI
        if (subCpmkData.length === 0) {
          setBatchProgress(prev => ({ ...prev, currentStep: '🤖 Generate Sub-CPMK dengan AI...' }));
          
          const totalSubCpmk = MAX_SUB_CPMK;
          const subPerCpmk = Math.floor(totalSubCpmk / cpmkData.length);
          const remainder = totalSubCpmk % cpmkData.length;
          
          let subCounter = 1;
          for (let j = 0; j < cpmkData.length; j++) {
            const cpmk = cpmkData[j];
            const count = subPerCpmk + (j < remainder ? 1 : 0);
            
            // STOP jika sudah mencapai 14 Sub-CPMK
            if (subCpmkData.length >= MAX_SUB_CPMK) {
              console.log(`[Batch] Reached max ${MAX_SUB_CPMK} Sub-CPMK, stopping generation`);
              break;
            }
            
            // Hitung berapa yang masih bisa ditambahkan
            const remainingSlots = MAX_SUB_CPMK - subCpmkData.length;
            const actualCount = Math.min(count, remainingSlots);
            
            if (actualCount <= 0) break;
            
            try {
              const subRes = await aiHelperAPI.generateSubCPMK({
                cpmk: cpmk.description,
                course_title: course.title,
                count: actualCount,
              });
              
              if (subRes.data?.data?.items) {
                // PENTING: Batasi jumlah yang diambil dari response AI
                const itemsToTake = subRes.data.data.items.slice(0, actualCount);
                itemsToTake.forEach((item) => {
                  if (subCpmkData.length < MAX_SUB_CPMK) {
                    subCpmkData.push({
                      code: `Sub-CPMK-${subCounter}`,
                      description: item.description,
                      cpmk_id: cpmk.code,
                    });
                    subCounter++;
                  }
                });
              } else {
                // Create empty placeholders (tetap batasi)
                for (let k = 0; k < actualCount && subCpmkData.length < MAX_SUB_CPMK; k++) {
                  subCpmkData.push({
                    code: `Sub-CPMK-${subCounter}`,
                    description: '',
                    cpmk_id: cpmk.code,
                  });
                  subCounter++;
                }
              }
            } catch (subError) {
              console.error('Sub-CPMK generation failed:', subError);
              for (let k = 0; k < actualCount && subCpmkData.length < MAX_SUB_CPMK; k++) {
                subCpmkData.push({
                  code: `Sub-CPMK-${subCounter}`,
                  description: '',
                  cpmk_id: cpmk.code,
                });
                subCounter++;
              }
            }
            await new Promise(r => setTimeout(r, 200));
          }
        }
        
        // FINAL CHECK: Pastikan tidak lebih dari 14 Sub-CPMK
        if (subCpmkData.length > MAX_SUB_CPMK) {
          console.warn(`[Batch] WARNING: Sub-CPMK count (${subCpmkData.length}) exceeded max (${MAX_SUB_CPMK}), trimming...`);
          subCpmkData = subCpmkData.slice(0, MAX_SUB_CPMK);
          // Re-number codes
          subCpmkData.forEach((sub, idx) => {
            sub.code = `Sub-CPMK-${idx + 1}`;
          });
        }
        
        console.log(`[Batch] Final Sub-CPMK count: ${subCpmkData.length}`);
        
        // === STEP 4: Generate Bahan Kajian ===
        setBatchProgress(prev => ({ ...prev, currentStep: '📚 Generate Bahan Kajian...' }));
        
        let bahanKajian = [];
        try {
          const bkRes = await aiHelperAPI.generateBahanKajian({
            course_code: course.code,
            course_title: course.title,
            cpmk_list: cpmkData.map(c => ({ description: c.description })),
          });
          // Response: { data: { items: ["Topik 1", "Topik 2", ...] } }
          const bkItems = bkRes.data?.data?.items || bkRes.data?.items || [];
          bahanKajian = Array.isArray(bkItems) ? bkItems : [];
          console.log(`[Batch] Generated ${bahanKajian.length} bahan kajian for ${course.code}`);
        } catch (bkError) {
          console.error('Bahan kajian generation failed:', bkError);
          bahanKajian = [];
        }
        
        // === STEP 5: Generate Rencana Pembelajaran ===
        setBatchProgress(prev => ({ ...prev, currentStep: '📅 Generate Rencana Pembelajaran...' }));
        
        let rencana = [];
        try {
          const rpRes = await aiHelperAPI.generateRencanaPembelajaran({
            course_code: course.code,
            course_title: course.title,
            cpmk_list: cpmkData.map(c => ({ code: c.code, description: c.description })),
            sub_cpmk_list: subCpmkData.map(s => ({ code: s.code, description: s.description })),
            bahan_kajian: bahanKajian,
          });
          // Response: { data: { weeks: [{minggu, subCpmk, materi, metode, penilaian}, ...] } }
          rencana = rpRes.data?.data?.weeks || rpRes.data?.weeks || [];
          console.log(`[Batch] Generated ${rencana.length} weeks rencana for ${course.code}`);
        } catch (rpError) {
          console.error('Rencana pembelajaran generation failed:', rpError);
          rencana = [];
        }
        
        // === STEP 6: Generate Referensi ===
        setBatchProgress(prev => ({ ...prev, currentStep: '📖 Generate Referensi...' }));
        
        let referensi = { utama: [], pendukung: [] };
        try {
          const refRes = await aiHelperAPI.generateReferensi({
            course_code: course.code,
            course_title: course.title,
            description: courseDescription || '',
            cpmk_list: cpmkData.map(c => c.description).filter(Boolean), // Array of strings
            bahan_kajian: bahanKajian, // Array of strings
          });
          
          // Response: { data: { items: [{title, author, year, publisher, type}, ...] } }
          const refItems = refRes.data?.data?.items || refRes.data?.items || [];
          if (Array.isArray(refItems) && refItems.length > 0) {
            // Pisahkan book dan journal
            referensi.utama = refItems.filter(r => r.type === 'book').map(r => 
              `${r.author} (${r.year}). ${r.title}. ${r.publisher}.`
            );
            referensi.pendukung = refItems.filter(r => r.type === 'journal').map(r => 
              `${r.author} (${r.year}). ${r.title}. ${r.publisher}.`
            );
            console.log(`[Batch] Generated ${refItems.length} referensi for ${course.code}`);
          } else if (refRes.data?.data?.utama || refRes.data?.data?.pendukung) {
            referensi = refRes.data.data;
          }
        } catch (refError) {
          console.error('Referensi generation failed:', refError);
        }
        
        // === STEP 7: Save RPS ===
        setBatchProgress(prev => ({ ...prev, currentStep: '💾 Menyimpan RPS...' }));
        
        // Format data sesuai struktur yang diharapkan RPSCreate (camelCase)
        // Transform subCpmkData ke format dengan relatedCpmk (bukan cpmk_id)
        const formattedSubCpmk = subCpmkData.map(s => ({
          code: s.code,
          description: s.description,
          relatedCpmk: s.cpmk_id || '', // RPSCreate expects 'relatedCpmk'
          cpmk_id: s.cpmk_id // Keep cpmk_id for compatibility
        }));
        
        // Transform rencana pembelajaran ke format rencanaMingguan (16 minggu dengan UTS/UAS)
        const buildRencanaMingguan = () => {
          // Default template 16 minggu
          const template = Array.from({ length: 16 }, (_, i) => {
            const week = i + 1;
            if (week === 8) {
              return { minggu: 8, subCpmk: 'UTS', materi: 'Ujian Tengah Semester', metode: 'Ujian Tertulis/Online', penilaian: 'Ujian' };
            } else if (week === 16) {
              return { minggu: 16, subCpmk: 'UAS', materi: 'Ujian Akhir Semester', metode: 'Ujian Tertulis/Online', penilaian: 'Ujian' };
            }
            // Map sub-cpmk: minggu 1-7 -> Sub-CPMK-1 to 7, minggu 9-15 -> Sub-CPMK-8 to 14
            const subCpmkIdx = week <= 7 ? week - 1 : week - 2; // Skip minggu 8
            const subCpmkForWeek = formattedSubCpmk[subCpmkIdx] ? formattedSubCpmk[subCpmkIdx].code : `Sub-CPMK-${subCpmkIdx + 1}`;
            return { minggu: week, subCpmk: subCpmkForWeek, materi: '', metode: '', penilaian: '' };
          });
          
          // Merge dengan hasil AI jika ada
          if (Array.isArray(rencana) && rencana.length > 0) {
            rencana.forEach(r => {
              const weekNum = r.minggu || 0;
              if (weekNum >= 1 && weekNum <= 16 && weekNum !== 8 && weekNum !== 16) {
                const idx = weekNum - 1;
                template[idx] = {
                  minggu: weekNum,
                  subCpmk: r.subCpmk || r.sub_cpmk || template[idx].subCpmk,
                  materi: r.materi || r.topic || '',
                  metode: r.metode || r.method || '',
                  penilaian: r.penilaian || r.assessment || ''
                };
              }
            });
          }
          
          return template;
        };
        
        const formattedRencana = buildRencanaMingguan();
        console.log(`[Batch] Formatted ${formattedRencana.length} weeks rencana mingguan`);
        
        // Transform bahan kajian ke array (sudah array dari AI)
        const formattedBahanKajian = Array.isArray(bahanKajian) && bahanKajian.length > 0 
          ? bahanKajian 
          : ['', '', ''];
        
        // Transform referensi ke format gabungan
        const formattedReferensi = [
          ...(Array.isArray(referensi.utama) ? referensi.utama : []),
          ...(Array.isArray(referensi.pendukung) ? referensi.pendukung : [])
        ];
        
        // Generate tugas placeholder
        const formattedTugas = Array.from({ length: 14 }, (_, i) => ({
          tugasKe: i + 1,
          subCpmk: formattedSubCpmk[i] ? formattedSubCpmk[i].code : '',
          indikator: '',
          judulTugas: '',
          batasWaktu: '',
          petunjukPengerjaan: '',
          luaranTugas: '',
          kriteriaPenilaian: '',
          teknikPenilaian: '',
          bobotPersen: ''
        }));
        
        const rpsResult = {
          // Course info for reference
          course: {
            id: course.id,
            code: course.code,
            title: course.title,
            credits: course.credits,
            semester: course.semester
          },
          semester: course.semester?.toString() || '1',
          tahun_akademik: course.tahun || `${new Date().getFullYear()}1`,
          // Deskripsi mata kuliah (gunakan yang di-generate atau dari database)
          deskripsi: courseDescription,
          description: courseDescription,
          // CPMK dengan format yang benar
          cpmk: cpmkData.map(c => ({
            code: c.code,
            description: c.description,
            selected_cpls: c.selected_cpls || (c.matched_cpl ? c.matched_cpl.split(',').map(s => s.trim()) : []),
          })),
          // Sub-CPMK dengan format camelCase
          subCpmk: formattedSubCpmk,
          sub_cpmk: formattedSubCpmk, // Keep snake_case for compatibility
          // Bahan Kajian
          bahanKajian: formattedBahanKajian,
          bahan_kajian: bahanKajian,
          // Rencana Mingguan (camelCase)
          rencanaMingguan: formattedRencana,
          rencana_pembelajaran: rencana,
          // Rencana Tugas
          rencanaTugas: formattedTugas,
          // Referensi
          referensi: formattedReferensi,
          referensi_utama: Array.isArray(referensi.utama) ? referensi.utama : [],
          referensi_pendukung: Array.isArray(referensi.pendukung) ? referensi.pendukung : [],
        };
        
        const rpsData = {
          course_id: course.id,
          result: rpsResult,
          status: 'draft',
        };
        
        // === STEP 7.5: Save CPMK & Sub-CPMK to Database ===
        setBatchProgress(prev => ({ ...prev, currentStep: '💾 Menyimpan CPMK & Sub-CPMK ke Database...' }));
        
        // Save CPMK yang belum ada di database
        if (!cpmkFromDB && cpmkData.length > 0) {
          for (const cpmk of cpmkData) {
            try {
              // Get Sub-CPMK untuk CPMK ini (hanya yang punya description)
              const subCpmksForThis = subCpmkData.filter(s => s.cpmk_id === cpmk.code && s.description && s.description.trim());
              
              // Create CPMK dengan Sub-CPMK
              await cpmkAPI.create({
                course_id: course.id,
                cpmk_number: cpmk.cpmk_number,
                description: cpmk.description,
                bobot: subCpmksForThis.length * (100 / 14), // Bobot = jumlah sub × 7.14%
                matched_cpl: cpmk.matched_cpl || '',
                sub_cpmks: subCpmksForThis.map((sub, idx) => ({
                  sub_cpmk_number: parseInt(sub.code.match(/\d+/)?.[0] || idx + 1),
                  description: sub.description,
                })),
              });
              console.log(`[Batch] Saved CPMK ${cpmk.code} with ${subCpmksForThis.length} Sub-CPMK to DB`);
            } catch (saveError) {
              // Mungkin sudah ada, skip
              console.log(`[Batch] CPMK ${cpmk.code} mungkin sudah ada:`, saveError.message);
            }
          }
        } else if (cpmkFromDB) {
          // CPMK sudah ada, cek apakah Sub-CPMK perlu ditambahkan
          for (const cpmk of cpmkData) {
            const existingSubCount = (cpmk.sub_cpmks || []).length;
            
            // Jika belum ada Sub-CPMK di DB tapi kita punya yang baru (dengan description), tambahkan
            if (existingSubCount === 0 && cpmk.id) {
              // Filter hanya Sub-CPMK yang punya description
              const newSubCpmks = subCpmkData.filter(s => s.cpmk_id === cpmk.code && s.description && s.description.trim());
              
              if (newSubCpmks.length > 0) {
                console.log(`[Batch] Adding ${newSubCpmks.length} Sub-CPMK to CPMK ${cpmk.code} (${cpmk.id})`);
                
                for (const sub of newSubCpmks) {
                  try {
                    // Create Sub-CPMK dengan API
                    await cpmkAPI.createSubCpmk({
                      cpmk_id: cpmk.id, // UUID dari database
                      sub_cpmk_number: parseInt(sub.code.match(/\d+/)?.[0] || 1),
                      description: sub.description,
                    });
                    console.log(`[Batch] Saved Sub-CPMK ${sub.code} to CPMK ${cpmk.code}`);
                  } catch (subError) {
                    console.log(`[Batch] Failed to save Sub-CPMK ${sub.code}:`, subError.message);
                  }
                }
              }
            }
          }
        }
        
        // === STEP 8: Save RPS ===
        setBatchProgress(prev => ({ ...prev, currentStep: '💾 Menyimpan RPS...' }));
        
        console.log(`[Batch] Saving RPS for ${course.code}:`, rpsData);
        
        // Use create instead of createDraft
        const rpsResponse = await generatedRPSAPI.create(rpsData);
        console.log(`[Batch] RPS saved response:`, rpsResponse);
        
        results.push({
          courseId: course.id,
          courseCode: course.code,
          courseTitle: course.title,
          status: 'success',
          message: 'RPS berhasil dibuat',
        });
        
      } catch (error) {
        console.error(`Failed to generate RPS for ${course.code}:`, error);
        results.push({
          courseId: course.id,
          courseCode: course.code,
          courseTitle: course.title,
          status: 'error',
          message: error.response?.data?.error || error.message,
        });
      }
      
      setBatchProgress(prev => ({ ...prev, results: [...results] }));
      
      // Delay between courses
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Finished
    setBatchProgress(prev => ({
      ...prev,
      currentStep: '✅ Selesai!',
      currentCourse: '',
    }));
    setBatchGenerating(false);
    
    // Reload RPS status
    await loadRPSStatus(courses);
    
    // Show summary
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;
    
    alert(`🎉 Batch Generate Selesai!\n\n✅ Berhasil: ${successCount}\n⏭️ Dilewati: ${skippedCount}\n❌ Gagal: ${errorCount}`);
  };

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    if (selectedProgram) {
      loadCourses();
    }
  }, [selectedProgram, loadCourses]);

  // Get unique values for filters
  const availableYears = useMemo(() => 
    Array.isArray(courses) 
      ? [...new Set(courses.map(c => c.tahun || '2025'))].sort((a, b) => b.localeCompare(a))
      : []
  , [courses]);

  const availableCategories = useMemo(() => 
    Array.isArray(courses)
      ? [...new Set(courses.map(c => c.description?.replace('Kategori: ', '').trim()).filter(Boolean))].sort()
      : []
  , [courses]);

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    
    return courses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      const category = course.description?.replace('Kategori: ', '').trim() || '';
      const hasRPS = coursesWithRPS.has(course.id);
      
      // Filter by search query
      const matchesSearch = (
        course.title?.toLowerCase().includes(searchLower) ||
        course.code?.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower)
      );
      
      // Filter by year
      const matchesYear = selectedYear === 'all' || (course.tahun || '2025') === selectedYear;
      
      // Filter by SKS
      const matchesSKS = filterSKS === 'all' || String(course.credits) === filterSKS;
      
      // Filter by semester
      const matchesSemester = filterSemester === 'all' || String(course.semester) === filterSemester;
      
      // Filter by category
      const matchesCategory = filterCategory === 'all' || category === filterCategory;
      
      // Filter by RPS status
      const matchesRPS = filterRPSStatus === 'all' ||
        (filterRPSStatus === 'with-rps' && hasRPS) ||
        (filterRPSStatus === 'without-rps' && !hasRPS);
      
      return matchesSearch && matchesYear && matchesSKS && matchesSemester && matchesCategory && matchesRPS;
    });
  }, [courses, searchQuery, selectedYear, filterSKS, filterSemester, filterCategory, filterRPSStatus, coursesWithRPS]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== '' || selectedYear !== 'all' || filterSKS !== 'all' || 
    filterSemester !== 'all' || filterCategory !== 'all' || filterRPSStatus !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setFilterSKS('all');
    setFilterSemester('all');
    setFilterCategory('all');
    setFilterRPSStatus('all');
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    
    if (!selectedProgram) {
      alert('Pilih program studi terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      const courseData = {
        program_id: selectedProgram,
        code: formData.code,
        title: formData.title,
        credits: parseInt(formData.credits),
        semester: parseInt(formData.semester),
        tahun: formData.tahun,
        description: formData.category ? `Kategori: ${formData.category}` : '',
      };

      if (editMode && editingCourse) {
        // Update existing course
        await courseAPI.update(editingCourse.id, courseData);
        setUploadStatus({
          success: true,
          message: 'Mata kuliah berhasil diupdate!',
        });
      } else {
        // Create new course
        await courseAPI.create(courseData);
        setUploadStatus({
          success: true,
          message: 'Mata kuliah berhasil ditambahkan!',
        });
      }

      setShowAddModal(false);
      setEditMode(false);
      setEditingCourse(null);
      setFormData({ code: '', title: '', credits: '', semester: '', category: '', tahun: `${new Date().getFullYear()}1` });
      loadCourses();
      
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error('Failed to save course:', error);
      alert('Gagal menyimpan mata kuliah: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    const category = course.description?.replace('Kategori: ', '').trim() || '';
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      credits: course.credits?.toString() || '',
      semester: course.semester?.toString() || '',
      category: category,
      tahun: course.tahun || `${new Date().getFullYear()}1`,
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setEditingCourse(null);
    setFormData({ code: '', title: '', credits: '', semester: '', category: '', tahun: `${new Date().getFullYear()}1` });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category) => {
    if (confirm(`Hapus kategori "${category}"?`)) {
      setCategories(categories.filter(c => c !== category));
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await courseAPI.downloadTemplate();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Template_Mata_Kuliah_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download template:', error);
      alert('Gagal download template: ' + error.message);
    }
  };

  const handleExportExcel = async () => {
    if (!selectedProgram) {
      alert('Pilih program studi terlebih dahulu');
      return;
    }

    try {
      const response = await courseAPI.exportExcel(selectedProgram);
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mata_Kuliah_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setUploadStatus({
        success: true,
        message: 'Berhasil export mata kuliah ke Excel!',
      });
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Gagal export: ' + error.message);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile || !selectedProgram) {
      alert('Pilih file Excel dan program studi terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', excelFile);
      formData.append('program_id', selectedProgram);

      const response = await courseAPI.importExcel(formData);
      
      setUploadStatus({
        success: true,
        message: response.data.message || `Berhasil import ${response.data.imported_count} mata kuliah`,
        details: response.data.failed_count > 0 ? `${response.data.failed_count} gagal, ${response.data.errors?.slice(0, 3).join(', ')}` : null,
      });
      
      setExcelFile(null);
      setShowExcelUpload(false);
      loadCourses();
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (error) {
      console.error('Failed to import Excel:', error);
      setUploadStatus({
        success: false,
        message: 'Import gagal',
        details: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!confirm(`Yakin ingin menghapus mata kuliah "${courseTitle}"?\n\nPeringatan: RPS yang terkait dengan mata kuliah ini mungkin akan terpengaruh.`)) {
      return;
    }

    try {
      setLoading(true);
      await courseAPI.delete(courseId);
      loadCourses();
      setUploadStatus({
        success: true,
        message: 'Mata kuliah berhasil dihapus!',
      });
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Gagal menghapus mata kuliah: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  console.log('CourseManagement render:', { 
    programs: programs.length, 
    selectedProgram, 
    courses: courses.length,
    filteredCourses: filteredCourses.length,
    loading,
    showUpload
  });

  // Show loading on initial load
  if (loading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
          <p className="text-xs text-gray-400 mt-2">Debug: loading={loading.toString()}, programs={programs.length}</p>
        </div>
      </div>
    );
  }

  // Show error if no programs loaded
  if (!loading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold">Tidak ada program studi</p>
          <p className="text-gray-600 mt-2">Silakan hubungi administrator</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manajemen Mata Kuliah</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Kelola data mata kuliah program studi</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isAdminRoute && (
            <button
              onClick={() => {
                setEditMode(false);
                setEditingCourse(null);
                setFormData({ code: '', title: '', credits: '', semester: '', category: '', tahun: `${new Date().getFullYear()}1` });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          )}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
            title="Download Template Excel"
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Template</span>
          </button>
          {!isAdminRoute && (
            <button
              onClick={() => setShowExcelUpload(!showExcelUpload)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Import Excel</span>
            </button>
          )}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm md:text-base"
            disabled={!selectedProgram}
            title="Export ke Excel"
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
          >
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          
          {/* BATCH GENERATE RPS BUTTON */}
          {!isAdminRoute && (
            <div className="flex items-center gap-2">
              {/* Toggle Selection Mode */}
              <button
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  if (selectionMode) {
                    setSelectedCourses(new Set());
                  }
                }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all text-sm md:text-base ${
                  selectionMode 
                    ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Mode pilih mata kuliah"
              >
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{selectionMode ? 'Batal Pilih' : 'Pilih MK'}</span>
              </button>
              
              {/* Batch Generate Button */}
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm md:text-base"
                title="Generate RPS untuk mata kuliah yang dipilih"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">
                  {selectionMode && selectedCourses.size > 0 
                    ? `Generate ${selectedCourses.size} RPS` 
                    : 'Batch Generate RPS'}
                </span>
                <span className="sm:hidden">
                  {selectionMode && selectedCourses.size > 0 
                    ? `${selectedCourses.size} RPS` 
                    : 'Batch'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BATCH GENERATE RPS MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Batch Generate RPS</h2>
                    <p className="text-purple-100 text-sm">Generate RPS otomatis dengan AI</p>
                  </div>
                </div>
                {!batchGenerating && (
                  <button
                    onClick={() => {
                      setShowBatchModal(false);
                      setBatchProgress({ current: 0, total: 0, currentCourse: '', currentStep: '', results: [] });
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {!batchGenerating && batchProgress.results.length === 0 ? (
                <>
                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{filteredCourses.length}</p>
                      <p className="text-sm text-blue-600">Total MK</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {filteredCourses.filter(c => coursesWithRPS.has(c.id)).length}
                      </p>
                      <p className="text-sm text-green-600">Sudah RPS</p>
                    </div>
                    <div className={`rounded-xl p-4 text-center ${selectionMode && selectedCourses.size > 0 ? 'bg-purple-50' : 'bg-orange-50'}`}>
                      <p className={`text-3xl font-bold ${selectionMode && selectedCourses.size > 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {selectionMode && selectedCourses.size > 0 
                          ? selectedCourses.size 
                          : filteredCourses.filter(c => !coursesWithRPS.has(c.id)).length}
                      </p>
                      <p className={`text-sm ${selectionMode && selectedCourses.size > 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {selectionMode && selectedCourses.size > 0 ? 'Dipilih' : 'Belum RPS'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Selected Courses Info */}
                  {selectionMode && selectedCourses.size > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-purple-800">
                          ✨ {selectedCourses.size} Mata Kuliah Dipilih
                        </p>
                        <button
                          onClick={() => {
                            setSelectedCourses(new Set());
                            setSelectionMode(false);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-800"
                        >
                          Hapus Pilihan
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {filteredCourses.filter(c => selectedCourses.has(c.id)).map(course => (
                          <div key={course.id} className="text-sm text-purple-700 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{course.code} - {course.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Mode Selection - Only show if no courses selected */}
                  {(!selectionMode || selectedCourses.size === 0) && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Pilih mata kuliah yang akan di-generate:
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="batchMode"
                            value="without-rps"
                            checked={batchMode === 'without-rps'}
                            onChange={(e) => setBatchMode(e.target.value)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Hanya yang belum punya RPS ({filteredCourses.filter(c => !coursesWithRPS.has(c.id)).length} MK)
                            </p>
                            <p className="text-sm text-gray-500">Rekomendasi - Skip mata kuliah yang sudah ada RPS</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="batchMode"
                            value="all"
                            checked={batchMode === 'all'}
                            onChange={(e) => setBatchMode(e.target.value)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Semua mata kuliah ({filteredCourses.length} MK)
                            </p>
                            <p className="text-sm text-gray-500">Generate untuk semua, skip yang sudah ada</p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Hint to use selection mode */}
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                          Atau klik tombol <strong>"Pilih MK"</strong> di atas untuk memilih mata kuliah tertentu
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Flame className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Proses AI akan memakan waktu</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Setiap mata kuliah membutuhkan ~30-60 detik untuk generate CPMK, Sub-CPMK, Bahan Kajian, Rencana Pembelajaran, dan Referensi.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress: {batchProgress.current} / {batchProgress.total}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Current Status */}
                  {batchGenerating && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                        <div>
                          <p className="font-medium text-purple-900">{batchProgress.currentCourse}</p>
                          <p className="text-sm text-purple-700">{batchProgress.currentStep}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Results List */}
                  {batchProgress.results.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <p className="text-sm font-medium text-gray-700 mb-2">Hasil:</p>
                      {batchProgress.results.map((result, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                            result.status === 'success' ? 'bg-green-50 text-green-800' :
                            result.status === 'skipped' ? 'bg-gray-50 text-gray-600' :
                            'bg-red-50 text-red-800'
                          }`}
                        >
                          {result.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : result.status === 'skipped' ? (
                            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.courseCode} - {result.courseTitle}</p>
                            <p className="text-xs opacity-75">{result.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
              {!batchGenerating && batchProgress.results.length === 0 ? (
                <>
                  <button
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBatchGenerateRPS}
                    disabled={
                      (selectionMode && selectedCourses.size === 0) ||
                      (!selectionMode && batchMode === 'without-rps' && filteredCourses.filter(c => !coursesWithRPS.has(c.id)).length === 0) ||
                      filteredCourses.length === 0
                    }
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    {selectionMode && selectedCourses.size > 0 
                      ? `Generate ${selectedCourses.size} RPS`
                      : batchMode === 'without-rps'
                        ? `Generate ${filteredCourses.filter(c => !coursesWithRPS.has(c.id)).length} RPS`
                        : `Generate ${filteredCourses.length} RPS`
                    }
                  </button>
                </>
              ) : batchGenerating ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg flex items-center gap-2 cursor-not-allowed"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sedang Generate...
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowBatchModal(false);
                    setBatchProgress({ current: 0, total: 0, currentCourse: '', currentStep: '', results: [] });
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Section */}
      {showUpload && (
        <CSVUploadCard
          programs={programs}
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          onUploadSuccess={() => {
            loadCourses();
            setShowUpload(false);
          }}
          setUploadStatus={setUploadStatus}
        />
      )}

      {/* Excel Upload Section */}
      {showExcelUpload && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Mata Kuliah dari Excel</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📋 <strong>Petunjuk:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 ml-4 list-decimal space-y-1">
                <li>Download template Excel terlebih dahulu dengan klik tombol "Template"</li>
                <li>Isi data mata kuliah sesuai format template (jangan ubah header)</li>
                <li>Pastikan kolom Tahun diisi (contoh: 2025, 2024, 2026)</li>
                <li>Upload file Excel yang sudah diisi</li>
              </ol>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Format: No, Kode MK, Mata Kuliah, SKS, Semester, Tahun
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExcelUpload}
                disabled={!excelFile || loading}
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
                    <span>Import Excel</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowExcelUpload(false);
                  setExcelFile(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Status */}
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

      {/* Program Selector (if needed) */}
      {(userRole === 'admin' || programs.length > 1) && (
        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Program Studi</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.kode_prodi || program.code} - {program.nama_prodi || program.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Mata Kuliah</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Cari Mata Kuliah
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nama atau kode..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Tahun Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Kurikulum
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* SKS Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKS
            </label>
            <select
              value={filterSKS}
              onChange={(e) => setFilterSKS(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Semua SKS</option>
              <option value="1">1 SKS</option>
              <option value="2">2 SKS</option>
              <option value="3">3 SKS</option>
              <option value="4">4 SKS</option>
              <option value="6">6 SKS</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Semua Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Semua Kategori</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* RPS Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status RPS
            </label>
            <select
              value={filterRPSStatus}
              onChange={(e) => setFilterRPSStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Semua</option>
              <option value="with-rps">Sudah Ada RPS</option>
              <option value="without-rps">Belum Ada RPS</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredCourses.length}</span> dari <span className="font-semibold text-gray-900">{courses.length}</span> mata kuliah
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-blue-600">
              <Filter className="w-4 h-4" />
              <span>Filter aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Courses Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
            <p>Belum ada mata kuliah</p>
            <p className="text-sm">{hasActiveFilters ? 'Tidak ada mata kuliah yang sesuai filter' : 'Upload CSV atau tambah manual'}</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Checkbox column for selection mode */}
                  {selectionMode && (
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCourses.size > 0 && selectedCourses.size === filteredCourses.filter(c => !coursesWithRPS.has(c.id)).length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        title="Pilih Semua"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mata Kuliah</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">SKS</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Semester</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tahun</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CPMK</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => {
                const hasRPS = coursesWithRPS.has(course.id);
                const rpsId = coursesWithRPS.get(course.id);
                const isSelected = selectedCourses.has(course.id);
                
                return (
                  <tr 
                    key={course.id} 
                    className={`hover:bg-gray-50 transition-colors ${hasRPS ? 'bg-green-50' : ''} ${isSelected ? 'bg-purple-50 ring-1 ring-purple-200' : ''}`}
                    onClick={selectionMode && !hasRPS ? () => toggleCourseSelection(course.id) : undefined}
                    style={selectionMode && !hasRPS ? { cursor: 'pointer' } : {}}
                  >
                    {/* Checkbox for selection mode */}
                    {selectionMode && (
                      <td className="px-3 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {hasRPS ? (
                          <span className="text-xs text-green-600">✓ RPS</span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourseSelection(course.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {hasRPS && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                        <span>{course.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">{course.credits || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">{course.semester || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded">
                        {course.tahun || '2025'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                        (course.cpmk_count || 0) > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {course.cpmk_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {hasRPS ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-green-700 bg-green-100 rounded font-medium whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              RPS Tersedia
                            </span>
                            {!isAdminRoute && (
                              <Link
                                to={(userRole === 'prodi' || userRole === 'kaprodi') 
                                  ? `/kaprodi/rps/create/${course.id}?edit=${rpsId}&view=true`
                                  : `/rps/create/${course.id}?edit=${rpsId}&view=true`
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors whitespace-nowrap"
                                title="Lihat RPS (Read-only)"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                Lihat
                              </Link>
                            )}
                          </>
                        ) : (
                          !isAdminRoute && (
                            <Link
                              to={(userRole === 'prodi' || userRole === 'kaprodi') ? `/kaprodi/rps/create?courseId=${course.id}` : `/rps/create/${course.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors whitespace-nowrap"
                              title="Buat RPS"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Buat RPS</span>
                            </Link>
                          )
                        )}
                        {!isAdminRoute && (
                          <>
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 rounded transition-colors whitespace-nowrap"
                              title="Edit mata kuliah"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id, course.title)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors whitespace-nowrap"
                              title="Hapus mata kuliah"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Courses Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
            <p>Belum ada mata kuliah</p>
            <p className="text-sm">Upload CSV atau tambah manual</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const hasRPS = coursesWithRPS.has(course.id);
            const rpsId = coursesWithRPS.get(course.id);
            
            return (
              <div key={course.id} className={`bg-white rounded-xl shadow p-4 ${hasRPS ? 'border-l-4 border-green-500' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {hasRPS && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{course.code}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{course.title}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">SKS:</span> {course.credits || '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Semester:</span> {course.semester || '-'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded">
                    📅 {course.tahun || '2025'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {hasRPS ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-700 bg-green-100 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        RPS Ada
                      </span>
                      <Link
                        to={(userRole === 'prodi' || userRole === 'kaprodi') 
                          ? `/kaprodi/rps/create/${course.id}?edit=${rpsId}`
                          : `/rps/create/${course.id}?edit=${rpsId}`
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
                      >
                        <BookOpen className="w-3 h-3" />
                        Lihat
                      </Link>
                    </>
                  ) : (
                    <Link
                      to={(userRole === 'prodi' || userRole === 'kaprodi') ? `/kaprodi/rps/create?courseId=${course.id}` : `/rps/create/${course.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
                    >
                      <FileText className="w-3 h-3" />
                      Buat RPS
                    </Link>
                  )}
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-orange-600 bg-orange-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Course Modal */}
      <AddCourseModal
        show={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleAddCourse}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        editMode={editMode}
        categories={categories}
      />

      {/* Category Management Modal */}
      <CategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        programName={programs.find(p => p.id === selectedProgram)?.name || 'Program'}
      />
    </div>
  );
}

function CSVUploadCard({ programs, selectedProgram, setSelectedProgram, onUploadSuccess, setUploadStatus }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedProgram) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const res = await courseAPI.importCSV(selectedProgram, file);
      const data = res.data;
      
      setUploadStatus({
        success: true,
        message: `Berhasil import ${data.imported_count || 0} mata kuliah`,
        details: data.failed_count > 0 ? `${data.failed_count} gagal import` : null,
      });
      
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Upload gagal',
        details: error.response?.data?.error || error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV Mata Kuliah</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program Studi
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.kode_prodi || program.code} - {program.nama_prodi || program.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: No, Kode MK, Mata Kuliah, SKS, Semester
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Modal untuk tambah/edit mata kuliah
function AddCourseModal({ show, onClose, onSubmit, formData, setFormData, loading, editMode, categories }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editMode ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Mata Kuliah
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: IF101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: Pemrograman Web"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKS
            </label>
            <input
              type="number"
              required
              min="1"
              max="6"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="number"
              required
              min="1"
              max="8"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Akademik & Semester
            </label>
            <select
              required
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Pilih Tahun & Semester</option>
              {(() => {
                const currentYear = new Date().getFullYear();
                const years = [];
                for (let y = currentYear + 1; y >= currentYear - 5; y--) {
                  years.push(
                    <option key={`${y}-1`} value={`${y}1`}>{y}/{y + 1} - Semester 1</option>,
                    <option key={`${y}-2`} value={`${y}2`}>{y}/{y + 1} - Semester 2</option>
                  );
                }
                return years;
              })()}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Contoh: 20251 = Tahun 2025/2026 Semester 1
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editMode ? 'Update' : 'Simpan'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal untuk kelola kategori
function CategoryModal({ show, onClose, categories, newCategory, setNewCategory, onAddCategory, onDeleteCategory, programName }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Kelola Kategori Mata Kuliah</h2>
        <p className="text-sm text-gray-600 mb-4">
          Program: <span className="font-semibold text-purple-600">{programName}</span>
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            💡 Kategori ini hanya untuk program studi <strong>{programName}</strong>. 
            Setiap prodi memiliki kategori yang berbeda.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Add new category */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddCategory()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nama kategori baru..."
            />
            <button
              onClick={onAddCategory}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Category list */}
          <div className="border border-gray-200 rounded-lg divide-y max-h-96 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Belum ada kategori
              </div>
            ) : (
              categories.map((category) => (
                <div key={category} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <span className="text-gray-900">{category}</span>
                  <button
                    onClick={() => onDeleteCategory(category)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Hapus kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
