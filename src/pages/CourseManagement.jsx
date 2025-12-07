import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Plus, Search, Loader2, CheckCircle, AlertCircle, FileText, BookOpen, CheckCircle2, Trash2, Edit, Settings } from 'lucide-react';
import { courseAPI, programAPI, prodiAPI, generatedRPSAPI } from '../services/api';

export default function CourseManagement() {
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
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: '',
    semester: '',
    category: '',
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
      // Get all RPS
      const rpsRes = await generatedRPSAPI.getAll();
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

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    if (selectedProgram) {
      loadCourses();
    }
  }, [selectedProgram, loadCourses]);

  const filteredCourses = Array.isArray(courses) ? courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    const category = course.description?.replace('Kategori: ', '').trim() || '';
    
    return (
      course.title?.toLowerCase().includes(searchLower) ||
      course.code?.toLowerCase().includes(searchLower) ||
      category.toLowerCase().includes(searchLower)
    );
  }) : [];

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
      setFormData({ code: '', title: '', credits: '', semester: '', category: '' });
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
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setEditingCourse(null);
    setFormData({ code: '', title: '', credits: '', semester: '', category: '' });
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditMode(false);
              setEditingCourse(null);
              setFormData({ code: '', title: '', credits: '', semester: '', category: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
        </div>
      </div>

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

      {/* Filters */}
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata kuliah..."
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Hanya tampilkan dropdown program jika admin atau jika ada lebih dari 1 program */}
        {(userRole === 'admin' || programs.length > 1) && (
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.kode_prodi || program.code} - {program.nama_prodi || program.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Courses Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
            <p>Belum ada mata kuliah</p>
            <p className="text-sm">Upload CSV atau tambah manual</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">SKS</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Semester</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => {
                const hasRPS = coursesWithRPS.has(course.id);
                const rpsId = coursesWithRPS.get(course.id);
                
                return (
                  <tr key={course.id} className={`hover:bg-gray-50 transition-colors ${hasRPS ? 'bg-green-50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {hasRPS && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                        <span>{course.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">{course.credits || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">{course.semester || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {hasRPS ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-green-700 bg-green-100 rounded font-medium whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              RPS Tersedia
                            </span>
                            <Link
                              to={(userRole === 'prodi' || userRole === 'kaprodi') 
                                ? `/prodi/rps/create/${course.id}?edit=${rpsId}`
                                : `/rps/create/${course.id}?edit=${rpsId}`
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors whitespace-nowrap"
                              title="Lihat/Edit RPS"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Lihat
                            </Link>
                          </>
                        ) : (
                          <Link
                            to={(userRole === 'prodi' || userRole === 'kaprodi') ? `/prodi/rps/create?courseId=${course.id}` : `/rps/create/${course.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors whitespace-nowrap"
                            title="Buat RPS"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Buat RPS
                          </Link>
                        )}
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                          ? `/prodi/rps/create/${course.id}?edit=${rpsId}`
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
                      to={(userRole === 'prodi' || userRole === 'kaprodi') ? `/prodi/rps/create?courseId=${course.id}` : `/rps/create/${course.id}`}
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
