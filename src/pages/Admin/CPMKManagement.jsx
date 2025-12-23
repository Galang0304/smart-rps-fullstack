import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  ListChecks,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Download,
  Upload,
  Lock
} from 'lucide-react';
import { courseAPI, cpmkAPI, cplAPI, commonCourseAPI } from '../../services/api';
import Toast from '../../components/Toast';

export default function CPMKManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAdminRoute = location.pathname.includes('/admin/');
  const courseIdFromUrl = searchParams.get('course_id');

  // States
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cpmkList, setCpmkList] = useState([]);
  const [expandedCpmk, setExpandedCpmk] = useState(null);
  const [isCommonCourse, setIsCommonCourse] = useState(false); // Track if selected course is common
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCpmk, setEditingCpmk] = useState(null);
  const [editingSubCpmk, setEditingSubCpmk] = useState(null);
  
  // Form states
  const [newCpmkForm, setNewCpmkForm] = useState({ description: '', bobot: '', matched_cpl: '' });
  const [newSubCpmkForm, setNewSubCpmkForm] = useState({ description: '' });
  const [showAddCpmk, setShowAddCpmk] = useState(false);
  
  // CPL states
  const [cplList, setCplList] = useState([]);
  const [showAddSubCpmk, setShowAddSubCpmk] = useState(null);
  const [importing, setImporting] = useState(false);
  
  // Import progress states
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, currentCourse: '' });
  const [importResult, setImportResult] = useState(null); // { success: [], failed: [], total: 0 }
  const [showImportResult, setShowImportResult] = useState(false);
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Calculate total bobot CPMK
  const calculateTotalBobot = () => {
    return cpmkList.reduce((sum, cpmk) => sum + (parseFloat(cpmk.bobot) || 0), 0);
  };

  // Calculate bobot per Sub-CPMK
  const calculateSubCpmkBobot = (cpmkBobot, subCpmkCount) => {
    if (!subCpmkCount || subCpmkCount === 0) return 0;
    return (parseFloat(cpmkBobot) || 0) / subCpmkCount;
  };
  // Auto-redistribute bobot equally to all CPMK (100% / count)
  const autoRedistributeBobot = async (courseId) => {
    try {
      const res = await cpmkAPI.getByCourseId(courseId);
      const cpmks = res.data?.data || [];
      
      if (cpmks.length === 0) return;
      
      // Calculate base bobot for each CPMK
      const baseBobot = Math.floor((100 / cpmks.length) * 100) / 100; // Round down to 2 decimals
      const totalBase = baseBobot * (cpmks.length - 1);
      const lastBobot = 100 - totalBase; // Give remainder to last CPMK
      
      // Update all CPMK with calculated bobot
      const updatePromises = cpmks.map((cpmk, index) => {
        const bobot = index === cpmks.length - 1 ? lastBobot : baseBobot;
        return cpmkAPI.update(cpmk.id, {
          description: cpmk.description,
          bobot: bobot
        });
      });
      
      await Promise.all(updatePromises);
      showToast(`Bobot otomatis dibagi rata: ${baseBobot.toFixed(2)}% per CPMK`, 'success');
    } catch (error) {
      console.error('Failed to redistribute bobot:', error);
      showToast('Gagal mendistribusikan bobot', 'error');
    }
  };
  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  // Auto-select course from URL param
  useEffect(() => {
    if (courseIdFromUrl && courses.length > 0 && !selectedCourse) {
      const course = courses.find(c => c.id === courseIdFromUrl);
      if (course) {
        handleSelectCourse(course);
      }
    }
  }, [courseIdFromUrl, courses]);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = courses.filter(course => 
        course.title?.toLowerCase().includes(term) || 
        course.code?.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      let courseList = [];
      
      // Check if kaprodi route - filter by prodi
      if (!isAdminRoute) {
        // Get prodi_id from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const prodiId = user.prodi_id || localStorage.getItem('prodi_id');
        
        console.log('📚 Loading courses for prodi_id:', prodiId);
        
        if (prodiId) {
          const response = await courseAPI.getByProgramId(prodiId);
          if (response.data.success) {
            let data = response.data.data;
            if (data && data.data && Array.isArray(data.data)) {
              data = data.data;
            }
            courseList = Array.isArray(data) ? data : [];
          }
        } else {
          console.warn('⚠️ No prodi_id found for kaprodi user');
          setCourses([]);
          setFilteredCourses([]);
          setLoading(false);
          return;
        }
      } else {
        // Admin: get all courses + common courses
        const [allCoursesRes, commonCoursesRes] = await Promise.all([
          courseAPI.getAll(),
          commonCourseAPI.getAll()
        ]);
        
        // Parse regular courses
        if (allCoursesRes.data.success) {
          let data = allCoursesRes.data.data;
          if (data && data.data && Array.isArray(data.data)) {
            data = data.data;
          }
          // Filter out common courses from regular list (they'll be added from commonCourses)
          courseList = Array.isArray(data) ? data.filter(c => !c.is_common) : [];
        }
        
        // Add common courses
        if (commonCoursesRes.data.success) {
          const commonCourses = commonCoursesRes.data.data || [];
          courseList = [...courseList, ...commonCourses];
        }
      }
      
      console.log('📦 Course List:', courseList);
        
        // Calculate CPMK & Sub-CPMK counts for each course
        const coursesWithCounts = await Promise.all(
          courseList.map(async (course) => {
            try {
              const cpmkRes = await cpmkAPI.getByCourseId(course.id);
              const cpmks = cpmkRes.data.success ? cpmkRes.data.data || [] : [];
              
              // Count Sub-CPMK across all CPMK
              const subCpmkCount = cpmks.reduce((total, cpmk) => {
                const subCpmks = cpmk.sub_cpmks || cpmk.SubCPMKs || cpmk.subCpmks || [];
                return total + subCpmks.length;
              }, 0);
              
              return {
                ...course,
                cpmkCount: cpmks.length,
                subCpmkCount: subCpmkCount
              };
            } catch (error) {
              return { ...course, cpmkCount: 0, subCpmkCount: 0 };
            }
          })
        );
        
        setCourses(coursesWithCounts);
        setFilteredCourses(coursesWithCounts);
    } catch (error) {
      console.error('Failed to load courses:', error);
      showToast('Gagal memuat data mata kuliah', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCpmkForCourse = async (courseId) => {
    try {
      const response = await cpmkAPI.getByCourseId(courseId);
      if (response.data.success) {
        const cpmks = response.data.data || [];
        
        // Normalize Sub-CPMK field names
        const normalizedCpmks = cpmks.map(cpmk => ({
          ...cpmk,
          sub_cpmks: cpmk.sub_cpmks || cpmk.SubCPMKs || cpmk.subCpmks || []
        }));
        
        setCpmkList(normalizedCpmks);
        return normalizedCpmks;
      }
      return [];
    } catch (error) {
      console.error('Failed to load CPMK:', error);
      showToast('Gagal memuat CPMK', 'error');
      return [];
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setIsCommonCourse(course.is_common === true);
    setExpandedCpmk(null);
    setEditingCpmk(null);
    setEditingSubCpmk(null);
    setShowAddCpmk(false);
    setShowAddSubCpmk(null);
    
    // Load CPL for this course's prodi
    await loadCplForCourse(course);
    
    const cpmks = await loadCpmkForCourse(course.id);
    
    // ALWAYS force-update bobot to ensure consistency
    if (cpmks.length > 0) {
      console.log('🔄 Force-updating bobot to standard values...');
      await autoRedistributeBobot(course.id);
      await autoRedistributeSubCpmkBobot(course.id);
      await loadCpmkForCourse(course.id); // Reload untuk update UI
    }
  };

  // Load CPL based on course's prodi or user's prodi
  const loadCplForCourse = async (course) => {
    try {
      let prodiId = null;
      
      // Try to get prodi_id from course's program
      if (course.program && course.program.prodi_id) {
        prodiId = course.program.prodi_id;
      } else {
        // Fallback: get prodi_id from logged in user or localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.prodi_id) {
          prodiId = user.prodi_id;
        } else {
          // Try direct localStorage prodi_id
          prodiId = localStorage.getItem('prodi_id');
        }
      }
      
      console.log('📚 Loading CPL for prodi_id:', prodiId);
      
      if (prodiId) {
        const response = await cplAPI.getByProdiId(prodiId);
        console.log('📋 CPL Response:', response.data);
        if (response.data.success) {
          const cplData = response.data.data || [];
          console.log('✅ CPL Data loaded:', cplData.length, 'items');
          setCplList(cplData);
        } else {
          console.warn('CPL API response not success:', response.data);
          setCplList([]);
        }
      } else {
        // Try to get all CPL if prodi_id is not available
        console.log('⚠️ No prodi_id found, trying to load all CPL');
        const response = await cplAPI.getAll();
        console.log('📋 All CPL Response:', response.data);
        if (response.data.success) {
          setCplList(response.data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load CPL:', error);
      setCplList([]);
    }
  };

  const handleAddCpmk = async () => {
    if (!newCpmkForm.description.trim()) {
      showToast('Deskripsi CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const nextNumber = cpmkList.length + 1;
      // Create with temporary bobot (will be recalculated)
      const response = await cpmkAPI.create({
        course_id: selectedCourse.id,
        cpmk_number: nextNumber,
        description: newCpmkForm.description,
        bobot: 0, // Temporary, will be auto-distributed
        matched_cpl: newCpmkForm.matched_cpl || '' // CPL yang dipilih
      });

      if (response.data.success) {
        // Auto-redistribute bobot to all CPMK
        await autoRedistributeBobot(selectedCourse.id);
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
        setNewCpmkForm({ description: '', bobot: '', matched_cpl: '' });
        setShowAddCpmk(false);
        showToast('CPMK berhasil ditambahkan', 'success');
      }
    } catch (error) {
      console.error('Failed to add CPMK:', error);
      showToast('Gagal menambahkan CPMK', 'error');
    }
  };

  const handleUpdateCpmk = async (cpmkId) => {
    if (!editingCpmk?.description?.trim()) {
      showToast('Deskripsi CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const response = await cpmkAPI.update(cpmkId, {
        description: editingCpmk.description,
        matched_cpl: editingCpmk.matched_cpl || ''
        // Bobot tidak perlu diupdate karena auto-managed
      });

      if (response.data.success) {
        // Update local state immediately
        setCpmkList(prevList => 
          prevList.map(c => 
            c.id === cpmkId 
              ? { ...c, description: editingCpmk.description, matched_cpl: editingCpmk.matched_cpl }
              : c
          )
        );
        
        showToast('CPMK berhasil diperbarui', 'success');
        setEditingCpmk(null);
      }
    } catch (error) {
      console.error('Failed to update CPMK:', error);
      showToast('Gagal memperbarui CPMK', 'error');
    }
  };

  const handleDeleteCpmk = async (cpmkId, description) => {
    if (!confirm(`Hapus CPMK "${description}"?\n\nSemua Sub-CPMK di dalamnya juga akan terhapus.\nBobot akan otomatis dibagi rata ke CPMK yang tersisa.`)) {
      return;
    }

    try {
      const response = await cpmkAPI.delete(cpmkId);
      if (response.data.success) {
        // Auto-redistribute bobot to remaining CPMK
        await autoRedistributeBobot(selectedCourse.id);
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
      }
    } catch (error) {
      console.error('Failed to delete CPMK:', error);
      showToast('Gagal menghapus CPMK', 'error');
    }
  };

  // Auto-redistribute bobot to ALL Sub-CPMK in the course
  // FIXED: RPS standar = 14 Sub-CPMK, bobot selalu 100/14 = 7.142857%
  const autoRedistributeSubCpmkBobot = async (courseId) => {
    try {
      const res = await cpmkAPI.getByCourseId(courseId);
      const cpmks = res.data?.data || [];
      
      // Collect ALL Sub-CPMK from all CPMK
      const allSubCpmks = [];
      cpmks.forEach(cpmk => {
        const subs = cpmk.sub_cpmks || cpmk.SubCPMKs || [];
        subs.forEach(sub => {
          allSubCpmks.push(sub);
        });
      });
      
      if (allSubCpmks.length === 0) return;
      
      // FIXED bobot: 100% / 14 (standar RPS)
      const fixedBobot = 100 / 14; // 7.142857142857143%
      
      // Update ALL Sub-CPMK with fixed bobot
      const updatePromises = allSubCpmks.map(sub => 
        cpmkAPI.updateSubCpmk(sub.id, {
          description: sub.description,
          bobot: fixedBobot
        })
      );
      
      await Promise.all(updatePromises);
      showToast(`Bobot Sub-CPMK: ${fixedBobot.toFixed(6)}% (standar 14 Sub-CPMK)`, 'success');
    } catch (error) {
      console.error('Failed to redistribute Sub-CPMK bobot:', error);
      showToast('Gagal mendistribusikan bobot Sub-CPMK', 'error');
    }
  };

  const handleAddSubCpmk = async (cpmkId) => {
    if (!newSubCpmkForm.description.trim()) {
      showToast('Deskripsi Sub-CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const cpmk = cpmkList.find(c => c.id === cpmkId);
      const nextNumber = (cpmk?.sub_cpmks?.length || 0) + 1;
      
      const response = await cpmkAPI.createSubCpmk({
        cpmk_id: cpmkId,
        sub_cpmk_number: nextNumber,
        description: newSubCpmkForm.description
      });

      if (response.data.success) {
        // Auto-redistribute bobot to ALL Sub-CPMK in the course
        await autoRedistributeSubCpmkBobot(selectedCourse.id);
        
        // Reload data to get updated bobot
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
        
        showToast('Sub-CPMK berhasil ditambahkan', 'success');
        setNewSubCpmkForm({ description: '' });
        setShowAddSubCpmk(null);
      }
    } catch (error) {
      console.error('Failed to add Sub-CPMK:', error);
      showToast('Gagal menambahkan Sub-CPMK', 'error');
    }
  };

  const handleUpdateSubCpmk = async (cpmkId, subCpmkId) => {
    if (!editingSubCpmk?.description?.trim()) {
      showToast('Deskripsi Sub-CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const response = await cpmkAPI.updateSubCpmk(subCpmkId, {
        description: editingSubCpmk.description
      });

      if (response.data.success) {
        // Update local state immediately
        setCpmkList(prevList => 
          prevList.map(c => ({
            ...c,
            sub_cpmks: (c.sub_cpmks || []).map(sub => 
              sub.id === subCpmkId 
                ? { ...sub, description: editingSubCpmk.description }
                : sub
            )
          }))
        );
        
        showToast('Sub-CPMK berhasil diperbarui', 'success');
        setEditingSubCpmk(null);
      }
    } catch (error) {
      console.error('Failed to update Sub-CPMK:', error);
      showToast('Gagal memperbarui Sub-CPMK', 'error');
    }
  };

  const handleDeleteSubCpmk = async (subCpmkId, description) => {
    if (!confirm(`Hapus Sub-CPMK "${description}"?`)) {
      return;
    }

    try {
      // Find which CPMK owns this Sub-CPMK
      const parentCpmk = cpmkList.find(c => 
        (c.sub_cpmks || []).some(sub => sub.id === subCpmkId)
      );
      
      const response = await cpmkAPI.deleteSubCpmk(subCpmkId);
      if (response.data.success) {
        // Auto-redistribute bobot to ALL remaining Sub-CPMK in the course
        await autoRedistributeSubCpmkBobot(selectedCourse.id);
        
        // Reload data to get updated bobot
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
        
        showToast('Sub-CPMK berhasil dihapus', 'success');
      }
    } catch (error) {
      console.error('Failed to delete Sub-CPMK:', error);
      showToast('Gagal menghapus Sub-CPMK', 'error');
    }
  };

  const toggleExpand = (cpmkId) => {
    setExpandedCpmk(expandedCpmk === cpmkId ? null : cpmkId);
  };

  // Export ALL CPMK from ALL courses to Excel with colors
  const handleExportAll = async () => {
    try {
      showToast('Mengekspor semua data CPMK ke Excel...', 'info');
      
      // Get all courses with CPMK
      const allCourses = courses.filter(c => c.cpmkCount > 0);
      
      if (allCourses.length === 0) {
        showToast('Tidak ada data CPMK untuk diekspor', 'warning');
        return;
      }
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Create Table of Contents (Menu) data
      const tocData = [];
      tocData.push(['DAFTAR MATA KULIAH', '', '']);
      tocData.push(['No', 'Kode MK', 'Nama Mata Kuliah']);
      
      allCourses.forEach((course, idx) => {
        tocData.push([idx + 1, course.code, course.title]);
      });
      
      // Create TOC worksheet
      const tocWs = XLSX.utils.aoa_to_sheet(tocData);
      
      // Style TOC
      tocWs['!cols'] = [
        { wch: 5 },   // No
        { wch: 20 },  // Kode
        { wch: 50 }   // Nama
      ];
      
      // Header TOC styling
      tocWs['A1'].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 },
        fill: { fgColor: { rgb: "203764" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
      if (!tocWs['!merges']) tocWs['!merges'] = [];
      tocWs['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
      
      // Column headers
      ['A2', 'B2', 'C2'].forEach(cell => {
        if (tocWs[cell]) {
          tocWs[cell].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      });
      
      // Data rows TOC
      for (let row = 2; row < tocData.length; row++) {
        ['A', 'B', 'C'].forEach((col, idx) => {
          const cell = `${col}${row + 1}`;
          if (!tocWs[cell]) tocWs[cell] = { t: 's', v: '' };
          
          tocWs[cell].s = {
            fill: { fgColor: { rgb: row % 2 === 0 ? "E7E6E6" : "FFFFFF" } },
            alignment: { 
              horizontal: idx === 0 ? "center" : "left",
              vertical: "center" 
            },
            border: {
              top: { style: "thin", color: { rgb: "D0D0D0" } },
              bottom: { style: "thin", color: { rgb: "D0D0D0" } },
              left: { style: "thin", color: { rgb: "D0D0D0" } },
              right: { style: "thin", color: { rgb: "D0D0D0" } }
            }
          };
        });
      }
      
      XLSX.utils.book_append_sheet(wb, tocWs, 'Daftar Mata Kuliah');
      
      // Process each course
      for (const course of allCourses) {
        try {
          const res = await cpmkAPI.getByCourseId(course.id);
          const cpmks = res.data?.data || [];
          
          if (cpmks.length === 0) continue;
          
          // Prepare data for this course
          const data = [];
          
          // Course title
          data.push([course.code + ' - ' + course.title, '', '', '', '', '']);
          
          // Header row
          data.push([
            'CPMK No',
            'CPMK Description', 
            'CPMK Bobot %',
            'Sub-CPMK No',
            'Sub-CPMK Description',
            'Sub-CPMK Bobot %'
          ]);
          
          // Add CPMK and Sub-CPMK data - only existing Sub-CPMK
          cpmks.forEach(cpmk => {
            const cpmkBobot = parseFloat(cpmk.bobot || 0).toFixed(2);
            const subCpmks = cpmk.sub_cpmks || [];
            
            if (subCpmks.length === 0) {
              // If no Sub-CPMK, show CPMK only
              data.push([
                cpmk.cpmk_number,
                cpmk.description,
                cpmkBobot,
                '',
                '',
                ''
              ]);
            } else {
              // Show only existing Sub-CPMK
              subCpmks.forEach((sub, idx) => {
                const subBobot = parseFloat(sub.bobot || (100/14)).toFixed(2);
                data.push([
                  idx === 0 ? cpmk.cpmk_number : '',
                  idx === 0 ? cpmk.description : '',
                  idx === 0 ? cpmkBobot : '',
                  sub.sub_cpmk_number,
                  sub.description,
                  subBobot
                ]);
              });
            }
          });
          
          // Create worksheet
          const ws = XLSX.utils.aoa_to_sheet(data);
          
          // Set column widths
          ws['!cols'] = [
            { wch: 10 },  // CPMK No
            { wch: 50 },  // CPMK Desc
            { wch: 12 },  // CPMK Bobot
            { wch: 12 },  // Sub No
            { wch: 50 },  // Sub Desc
            { wch: 15 }   // Sub Bobot
          ];
          
          // Merge title row
          if (!ws['!merges']) ws['!merges'] = [];
          ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
          
          // Style title row
          ws['A1'].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
            fill: { fgColor: { rgb: "203764" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
          
          // Apply styles to header row (row 2)
          const headerRange = XLSX.utils.decode_range(ws['!ref']);
          for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
            if (!ws[cellAddress]) continue;
            
            ws[cellAddress].s = {
              font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
              fill: { fgColor: { rgb: "4472C4" } },
              alignment: { horizontal: "center", vertical: "center", wrapText: true },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
          }
          
          // Apply styles to data rows (starting from row 3)
          for (let row = 2; row <= headerRange.e.r; row++) {
            for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
              
              // Alternating colors per CPMK group (every 14 rows)
              const cpmkGroup = Math.floor((row - 2) / 14);
              const fillColor = cpmkGroup % 2 === 0 ? "FFFFFF" : "F2F2F2";
              
              ws[cellAddress].s = {
                fill: { fgColor: { rgb: fillColor } },
                alignment: { 
                  horizontal: col === 1 || col === 4 ? "left" : "center",
                  vertical: "top",
                  wrapText: true 
                },
                border: {
                  top: { style: "thin", color: { rgb: "D0D0D0" } },
                  bottom: { style: "thin", color: { rgb: "D0D0D0" } },
                  left: { style: "thin", color: { rgb: "D0D0D0" } },
                  right: { style: "thin", color: { rgb: "D0D0D0" } }
                }
              };
              
              // Bold for CPMK columns (first row of each group)
              const rowInGroup = (row - 2) % 14;
              if (rowInGroup === 0 && col <= 2 && ws[cellAddress].v) {
                ws[cellAddress].s.font = { bold: true, sz: 11 };
                ws[cellAddress].s.fill = { fgColor: { rgb: "D9E1F2" } };
              }
            }
          }
          
          // Sanitize sheet name (max 31 chars, no special chars)
          let sheetName = `${course.code}`.substring(0, 31).replace(/[:\\/?*\[\]]/g, '_');
          
          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          
        } catch (error) {
          console.error(`Failed to process ${course.code}:`, error);
        }
      }
      
      // Generate Excel file
      XLSX.writeFile(wb, `ALL_CPMK_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      showToast(`${allCourses.length} mata kuliah berhasil diekspor ke Excel`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Gagal mengekspor data', 'error');
    }
  };

  // Download Import Template (tanpa bobot)
  const handleDownloadTemplate = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Single sheet horizontal format
      const data = [];
      
      // Header row - NO, NAMA MATA KULIAH, SKS, CPMK 1 ... CPMK 11
      const headers = ['NO', 'NAMA MATA KULIAH', 'SKS'];
      for (let i = 1; i <= 11; i++) {
        headers.push(`CPMK ${i}`);
      }
      data.push(headers);
      
      // Example data rows
      data.push([
        1,
        'Bahasa Indonesia',
        2,
        'Menjelaskan kedudukan, fungsi, dan ragam Bahasa Indonesia',
        'Menggunakan Bahasa Indonesia dalam situasi formal',
        'Menulis karya ilmiah dengan baik dan benar',
        '', '', '', '', '', '', '', ''
      ]);
      
      data.push([
        2,
        'Algoritma & Pemrograman',
        3,
        'Memahami konsep algoritma',
        'Mengimplementasikan struktur data',
        'Membuat program dengan fungsi',
        '', '', '', '', '', '', '', ''
      ]);
      
      data.push([
        3,
        'Basis Data',
        3,
        'Memahami konsep database relasional',
        'Merancang skema database',
        'Mengimplementasikan query SQL',
        'Mengoptimalkan performa database',
        '', '', '', '', '', '', ''
      ]);
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 5 },   // NO
        { wch: 35 },  // NAMA MATA KULIAH
        { wch: 5 }    // SKS
      ];
      // CPMK columns (11 columns)
      for (let i = 0; i < 11; i++) {
        ws['!cols'].push({ wch: 40 });
      }
      
      // Style header row
      const headerRange = XLSX.utils.decode_range(ws['!ref']);
      for (let col = 0; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
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
          
          const fillColor = row % 2 === 1 ? "F2F2F2" : "FFFFFF";
          
          ws[cellAddress].s = {
            fill: { fgColor: { rgb: fillColor } },
            alignment: { 
              horizontal: col === 0 || col === 2 ? "center" : "left",
              vertical: "top",
              wrapText: true 
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
      instrData.push(['PETUNJUK PENGGUNAAN TEMPLATE CPMK']);
      instrData.push(['']);
      instrData.push(['1. Isi data mata kuliah pada kolom NO, NAMA MATA KULIAH, dan SKS']);
      instrData.push(['2. Isi deskripsi CPMK pada kolom CPMK 1, CPMK 2, dst']);
      instrData.push(['3. Jika CPMK lebih dari 11, tambahkan kolom baru dengan header "CPMK 12", "CPMK 13", dst']);
      instrData.push(['4. Kosongkan kolom CPMK yang tidak digunakan']);
      instrData.push(['5. Bobot CPMK akan otomatis dihitung sistem (100% / jumlah CPMK)']);
      instrData.push(['6. Sub-CPMK akan menggunakan bobot tetap 7.14% (100/14)']);
      instrData.push(['']);
      instrData.push(['Setelah selesai, kembali ke sheet "CPMK Template" untuk import']);
      
      const instrWs = XLSX.utils.aoa_to_sheet(instrData);
      instrWs['!cols'] = [{ wch: 80 }];
      
      // Style instruction title
      instrWs['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: "203764" } },
        alignment: { horizontal: "left", vertical: "center" }
      };
      
      // Add sheets
      XLSX.utils.book_append_sheet(wb, ws, 'CPMK Template');
      XLSX.utils.book_append_sheet(wb, instrWs, 'Instruksi');
      
      // Generate file
      XLSX.writeFile(wb, 'Template_Import_CPMK.xlsx');
      showToast('Template Excel berhasil diunduh', 'success');
    } catch (error) {
      console.error('Template download error:', error);
      showToast('Gagal mengunduh template', 'error');
    }
  };

  // Import CPMK from Excel (horizontal format)
  const handleImportAll = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress({ current: 0, total: 0, currentCourse: 'Memproses file...' });
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Try to find the right sheet - flexible approach
      let worksheet = null;
      let sheetName = null;
      
      // Priority 1: Look for "CPMK Template"
      if (workbook.Sheets['CPMK Template']) {
        worksheet = workbook.Sheets['CPMK Template'];
        sheetName = 'CPMK Template';
      }
      // Priority 2: Look for any sheet with "CPMK" in name
      else {
        const cpmkSheet = workbook.SheetNames.find(name => 
          name.toUpperCase().includes('CPMK')
        );
        if (cpmkSheet) {
          worksheet = workbook.Sheets[cpmkSheet];
          sheetName = cpmkSheet;
        }
      }
      // Priority 3: Use first sheet
      if (!worksheet) {
        sheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[sheetName];
      }
      
      if (!worksheet) {
        throw new Error('Tidak ada sheet yang valid ditemukan');
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      if (jsonData.length < 2) {
        throw new Error('Data tidak valid atau kosong');
      }
      
      const headers = jsonData[0]; // Row 1: Headers
      const successList = [];
      const failedList = [];
      
      // Find CPMK column indexes (columns starting with "CPMK")
      const cpmkColumns = [];
      headers.forEach((header, idx) => {
        if (header && header.toString().toUpperCase().includes('CPMK')) {
          cpmkColumns.push({ index: idx, label: header });
        }
      });
      
      if (cpmkColumns.length === 0) {
        throw new Error('Tidak ada kolom CPMK ditemukan. Pastikan header kolom mengandung kata "CPMK"');
      }
      
      // Find column index for course name (look for "NAMA" or use column 1)
      let courseNameColIdx = 1; // Default to column B
      headers.forEach((header, idx) => {
        if (header && header.toString().toUpperCase().includes('NAMA')) {
          courseNameColIdx = idx;
        }
      });
      
      // Count valid rows first
      const validRows = jsonData.slice(1).filter(row => row && row[courseNameColIdx]?.toString().trim());
      const totalRows = validRows.length;
      setImportProgress({ current: 0, total: totalRows, currentCourse: 'Memulai import...' });
      
      // Process each row (skip header)
      let processedCount = 0;
      for (let row = 1; row < jsonData.length; row++) {
        const rowData = jsonData[row];
        if (!rowData || rowData.length < 2) continue;
        
        const courseName = rowData[courseNameColIdx]?.toString().trim(); // NAMA MATA KULIAH
        if (!courseName) continue;
        
        processedCount++;
        setImportProgress({ current: processedCount, total: totalRows, currentCourse: courseName });
        
        // Find course by name
        const course = courses.find(c => 
          c.title.toLowerCase() === courseName.toLowerCase()
        );
        
        if (!course) {
          failedList.push({ course: courseName, reason: 'Mata kuliah tidak ditemukan di database' });
          continue;
        }
        
        // Collect CPMK descriptions from columns
        const cpmkDescriptions = [];
        cpmkColumns.forEach(col => {
          const desc = rowData[col.index]?.toString().trim();
          if (desc) {
            cpmkDescriptions.push(desc);
          }
        });
        
        if (cpmkDescriptions.length === 0) {
          failedList.push({ course: courseName, reason: 'Tidak memiliki data CPMK' });
          continue;
        }
        
        // Calculate CPMK bobot with proper rounding
        const baseBobot = Math.floor((100 / cpmkDescriptions.length) * 100) / 100;
        const totalBase = baseBobot * (cpmkDescriptions.length - 1);
        const lastBobot = 100 - totalBase;
        
        // Create each CPMK
        let courseSuccess = 0;
        let courseFailed = 0;
        for (let i = 0; i < cpmkDescriptions.length; i++) {
          try {
            const cpmkBobot = i === cpmkDescriptions.length - 1 ? lastBobot : baseBobot;
            
            const cpmkPayload = {
              course_id: course.id,
              cpmk_number: i + 1, // Number, not string
              description: cpmkDescriptions[i],
              bobot: cpmkBobot
            };
            
            const response = await cpmkAPI.create(cpmkPayload);
            if (response.data?.success) {
              courseSuccess++;
            }
          } catch (error) {
            console.error('Error saving CPMK:', error);
            courseFailed++;
          }
        }
        
        if (courseSuccess > 0) {
          successList.push({ course: courseName, count: courseSuccess });
        }
        if (courseFailed > 0) {
          failedList.push({ course: courseName, reason: `${courseFailed} CPMK gagal disimpan` });
        }
      }
      
      // Reload data
      await loadCourses();
      if (selectedCourse) {
        await loadCpmkForCourse(selectedCourse.id);
      }
      
      // Show result modal
      const totalSuccess = successList.reduce((sum, item) => sum + item.count, 0);
      setImportResult({
        success: successList,
        failed: failedList,
        totalCpmk: totalSuccess,
        totalCourses: successList.length
      });
      setShowImportResult(true);
      
    } catch (error) {
      console.error('Import error:', error);
      showToast('Gagal mengimpor data: ' + error.message, 'error');
    } finally {
      setImporting(false);
      setImportProgress({ current: 0, total: 0, currentCourse: '' });
      event.target.value = '';
    }
  };

  // Determine if user can edit CPMK
  // Admin can edit all, Kaprodi can only edit non-common courses
  const canEdit = isAdminRoute || (selectedCourse && !selectedCourse.is_common);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen CPMK</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola Capaian Pembelajaran Mata Kuliah</p>
            </div>
            <button
              onClick={() => navigate(isAdminRoute ? '/admin/courses' : '/kaprodi/courses')}
              className="self-start sm:self-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Global Action Buttons */}
        {canEdit && (
          <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Import & Export CPMK</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Kelola data CPMK untuk semua mata kuliah</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                  title="Export SEMUA CPMK dari semua mata kuliah"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Export</span> All
                </button>
                
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm"
                  title="Download template Excel untuk import"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Template
                </button>
                
                <label className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-xs sm:text-sm">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {importing ? 'Importing...' : <><span className="hidden xs:inline">Import</span> All</>}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImportAll}
                    disabled={importing}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Course List - Left Sidebar */}
          <div className="lg:col-span-1 order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-24">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Mata Kuliah</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari mata kuliah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="max-h-[250px] sm:max-h-[300px] lg:max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredCourses.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
                    <p className="text-sm sm:text-base">Tidak ada mata kuliah</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`w-full text-left p-3 sm:p-4 hover:bg-blue-50 transition-colors ${
                          selectedCourse?.id === course.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{course.code}</p>
                              {course.is_common && (
                                <span className="inline-flex items-center px-1 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded">
                                  Umum
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-0.5 sm:mt-1">{course.title}</p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 sm:gap-1 flex-shrink-0">
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 rounded">
                              {course.cpmkCount || 0} CPMK
                            </span>
                            {course.subCpmkCount > 0 && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                {course.subCpmkCount} Sub
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CPMK Detail - Main Content */}
          <div className="lg:col-span-2 order-2">
            {!selectedCourse ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
                <div className="text-center text-gray-500">
                  <ListChecks className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Pilih Mata Kuliah</h3>
                  <p className="text-sm sm:text-base">Pilih mata kuliah dari daftar untuk melihat dan mengelola CPMK</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCourse.code}</h2>
                        {selectedCourse.is_common && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            Matkul Umum
                          </span>
                        )}
                        {!canEdit && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            <Lock className="w-3 h-3" />
                            Hanya Lihat
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">{selectedCourse.title}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                        <span className="text-xs sm:text-sm text-gray-500">
                          <span className="font-medium">{selectedCourse.credits}</span> SKS
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          Semester <span className="font-medium">{selectedCourse.semester}</span>
                        </span>
                        <span className={`text-xs sm:text-sm font-medium ${calculateTotalBobot() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                          Total Bobot: {calculateTotalBobot().toFixed(2)}%
                          {calculateTotalBobot() === 100 ? ' ✓' : ` (harus 100%)`}
                        </span>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex flex-col gap-2">
                        {/* Add CPMK button */}
                        <button
                          onClick={() => setShowAddCpmk(true)}
                          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Tambah CPMK
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add CPMK Form */}
                  {showAddCpmk && canEdit && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                CPMK {cpmkList.length + 1}
                              </label>
                              <textarea
                                value={newCpmkForm.description}
                                onChange={(e) => setNewCpmkForm({ ...newCpmkForm, description: e.target.value })}
                                placeholder="Deskripsi CPMK..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                              />
                            </div>
                            
                            {/* CPL Selection */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Terhubung dengan CPL
                              </label>
                              <select
                                value={newCpmkForm.matched_cpl || ''}
                                onChange={(e) => setNewCpmkForm({ ...newCpmkForm, matched_cpl: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">-- Pilih CPL --</option>
                                {cplList.map((cpl) => (
                                  <option key={cpl.id} value={cpl.kode_cpl}>
                                    {cpl.kode_cpl} - {cpl.cpl?.substring(0, 60)}{cpl.cpl?.length > 60 ? '...' : ''}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-500 mt-1">
                                Pilih CPL yang relevan dengan CPMK ini
                              </p>
                            </div>
                            
                            <p className="text-xs text-blue-600">
                              💡 Bobot akan otomatis dibagi rata ke semua CPMK
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2 mt-3 sm:mt-0">
                          <button
                            onClick={handleAddCpmk}
                            className="flex-1 sm:flex-none p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                            title="Simpan"
                          >
                            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="sm:hidden text-sm">Simpan</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowAddCpmk(false);
                              setNewCpmkForm({ description: '', bobot: '', matched_cpl: '' });
                            }}
                            className="flex-1 sm:flex-none p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                            title="Batal"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="sm:hidden text-sm">Batal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CPMK List */}
                {cpmkList.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
                    <div className="text-center text-gray-500">
                      <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
                      <p className="text-sm sm:text-base">Belum ada CPMK untuk mata kuliah ini</p>
                      {canEdit && (
                        <button
                          onClick={() => setShowAddCpmk(true)}
                          className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                        >
                          Tambah CPMK Pertama
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {cpmkList.map((cpmk, index) => (
                      <div
                        key={cpmk.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* CPMK Header */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3">
                            {/* CPMK Number Badge */}
                            <div className="flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-base sm:text-lg font-bold text-blue-700">{cpmk.cpmk_number}</span>
                            </div>

                            {/* CPMK Content */}
                            <div className="flex-1 min-w-0">
                              {editingCpmk?.id === cpmk.id ? (
                                // Edit Mode
                                <div className="space-y-2 sm:space-y-3">
                                  <textarea
                                    value={editingCpmk.description}
                                    onChange={(e) => setEditingCpmk({ ...editingCpmk, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                  />
                                  
                                  {/* CPL Selection in Edit Mode */}
                                  <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                      Terhubung dengan CPL
                                    </label>
                                    <select
                                      value={editingCpmk.matched_cpl || ''}
                                      onChange={(e) => setEditingCpmk({ ...editingCpmk, matched_cpl: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                      <option value="">-- Pilih CPL --</option>
                                      {cplList.map((cpl) => (
                                        <option key={cpl.id} value={cpl.kode_cpl}>
                                          {cpl.kode_cpl} - {cpl.cpl?.substring(0, 50)}{cpl.cpl?.length > 50 ? '...' : ''}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateCpmk(cpmk.id)}
                                      className="px-2.5 sm:px-3 py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      Simpan
                                    </button>
                                    <button
                                      onClick={() => setEditingCpmk(null)}
                                      className="px-2.5 sm:px-3 py-1.5 bg-gray-400 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-1"
                                    >
                                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      Batal
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{cpmk.description}</p>
                                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                                        <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                          Bobot: {parseFloat(cpmk.bobot || 0).toFixed(2)}%
                                        </span>
                                        {cpmk.matched_cpl && cpmk.matched_cpl !== '' && (
                                          <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 rounded">
                                            CPL: {cpmk.matched_cpl}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {canEdit && (
                                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                                        <button
                                          onClick={() => setEditingCpmk({ id: cpmk.id, description: cpmk.description, matched_cpl: cpmk.matched_cpl || '' })}
                                          className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                          title="Edit CPMK"
                                        >
                                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCpmk(cpmk.id, cpmk.description)}
                                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Hapus CPMK"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Sub-CPMK Toggle */}
                                  {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 && (
                                    <button
                                      onClick={() => toggleExpand(cpmk.id)}
                                      className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      {expandedCpmk === cpmk.id ? (
                                        <>
                                          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                          Sembunyikan Sub-CPMK ({cpmk.sub_cpmks.length})
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                          Lihat Sub-CPMK ({cpmk.sub_cpmks.length})
                                        </>
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sub-CPMK Section */}
                        {expandedCpmk === cpmk.id && (
                          <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-700">Sub-CPMK</h4>
                              {canEdit && (
                                <button
                                  onClick={() => setShowAddSubCpmk(cpmk.id)}
                                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  Tambah Sub
                                </button>
                              )}
                            </div>

                            {/* Add Sub-CPMK Form */}
                            {showAddSubCpmk === cpmk.id && canEdit && (
                              <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Sub-CPMK {(cpmk.sub_cpmks?.length || 0) + 1}
                                    </label>
                                    <textarea
                                      value={newSubCpmkForm.description}
                                      onChange={(e) => setNewSubCpmkForm({ description: e.target.value })}
                                      placeholder="Deskripsi Sub-CPMK..."
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                      rows="2"
                                    />
                                  </div>
                                  <div className="flex sm:flex-col gap-1 mt-2 sm:mt-0">
                                    <button
                                      onClick={() => handleAddSubCpmk(cpmk.id)}
                                      className="flex-1 sm:flex-none p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                                      title="Simpan"
                                    >
                                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      <span className="sm:hidden text-xs">Simpan</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowAddSubCpmk(null);
                                        setNewSubCpmkForm({ description: '' });
                                      }}
                                      className="flex-1 sm:flex-none p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                                      title="Batal"
                                    >
                                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      <span className="sm:hidden text-xs">Batal</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sub-CPMK List */}
                            {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 ? (
                              <div className="space-y-2">
                                {cpmk.sub_cpmks.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="bg-white rounded-lg p-2.5 sm:p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    {editingSubCpmk?.id === sub.id ? (
                                      // Edit Mode
                                      <div className="space-y-2">
                                        <textarea
                                          value={editingSubCpmk.description}
                                          onChange={(e) => setEditingSubCpmk({ ...editingSubCpmk, description: e.target.value })}
                                          className="w-full px-2 py-1.5 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          rows="2"
                                        />
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleUpdateSubCpmk(cpmk.id, sub.id)}
                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                                          >
                                            <CheckCircle className="w-3 h-3" />
                                            Simpan
                                          </button>
                                          <button
                                            onClick={() => setEditingSubCpmk(null)}
                                            className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors flex items-center gap-1"
                                          >
                                            <X className="w-3 h-3" />
                                            Batal
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      // View Mode
                                      <div className="flex items-start gap-2 sm:gap-3">
                                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                                          {sub.sub_cpmk_number}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{sub.description}</p>
                                          <span className="inline-block mt-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 rounded">
                                            Bobot: {(sub.bobot || (100/14)).toFixed(2)}%
                                          </span>
                                        </div>
                                        {canEdit && (
                                          <div className="flex items-center gap-0.5 flex-shrink-0">
                                            <button
                                              onClick={() => setEditingSubCpmk({ id: sub.id, description: sub.description })}
                                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                              title="Edit Sub-CPMK"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteSubCpmk(sub.id, sub.description)}
                                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                              title="Hapus Sub-CPMK"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-400 text-sm">
                                Belum ada Sub-CPMK
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Progress Modal */}
      {importing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="text-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Mengimpor CPMK...</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 truncate px-2">{importProgress.currentCourse}</p>
              
              {importProgress.total > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 sm:h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {importProgress.current} dari {importProgress.total} mata kuliah
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Result Modal */}
      {showImportResult && importResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className={`px-4 sm:px-6 py-3 sm:py-4 ${importResult.failed.length === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {importResult.failed.length === 0 ? (
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  ) : (
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  )}
                  <h3 className="text-lg sm:text-xl font-bold text-white">Hasil Import CPMK</h3>
                </div>
                <button
                  onClick={() => setShowImportResult(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{importResult.totalCpmk}</p>
                  <p className="text-xs sm:text-sm text-green-700">CPMK Berhasil</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{importResult.totalCourses}</p>
                  <p className="text-xs sm:text-sm text-blue-700">Mata Kuliah</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="overflow-y-auto max-h-48 sm:max-h-60">
              {/* Success List */}
              {importResult.success.length > 0 && (
                <div className="p-3 sm:p-4 border-b border-gray-100">
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Berhasil ({importResult.success.length})
                  </h4>
                  <div className="space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                    {importResult.success.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs sm:text-sm py-1 px-2 bg-green-50 rounded">
                        <span className="text-gray-700 truncate">{item.course}</span>
                        <span className="text-green-600 font-medium flex-shrink-0 ml-2">{item.count} CPMK</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed List */}
              {importResult.failed.length > 0 && (
                <div className="p-3 sm:p-4">
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Gagal ({importResult.failed.length})
                  </h4>
                  <div className="space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                    {importResult.failed.map((item, idx) => (
                      <div key={idx} className="text-xs sm:text-sm py-1 px-2 bg-red-50 rounded">
                        <span className="font-medium text-gray-700">{item.course}</span>
                        <span className="text-red-600 block text-[10px] sm:text-xs">{item.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowImportResult(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Tutup
              </button>
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
