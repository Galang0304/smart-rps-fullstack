import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Calendar, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function DosenMataKuliah() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDosenId, setCurrentDosenId] = useState(null);
  const [filterSKS, setFilterSKS] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Get dosen info from current user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        console.error('User ID not found');
        return;
      }

      // Get all dosens and find the one matching current user
      const dosenListResponse = await api.get('/dosens');
      console.log('[Dosen MataKuliah] Dosens response:', dosenListResponse.data);
      const dosenList = Array.isArray(dosenListResponse.data?.data?.data) 
        ? dosenListResponse.data.data.data 
        : (Array.isArray(dosenListResponse.data?.data) ? dosenListResponse.data.data : []);
      console.log('[Dosen MataKuliah] Dosen list:', dosenList);
      const currentDosen = dosenList.find(d => d.user_id === user.id);
      
      if (!currentDosen) {
        console.error('[Dosen MataKuliah] Dosen record not found for user');
        setLoading(false);
        return;
      }

      setCurrentDosenId(currentDosen.id);
      console.log('[Dosen MataKuliah] Current dosen ID:', currentDosen.id);

      // Get courses assigned to this dosen
      const coursesResponse = await api.get(`/dosens/${currentDosen.id}/courses`);
      console.log('[Dosen MataKuliah] Courses response:', coursesResponse.data);
      const coursesData = Array.isArray(coursesResponse.data?.data) 
        ? coursesResponse.data.data 
        : [];
      console.log('[Dosen MataKuliah] Courses data:', coursesData);

      // Get ALL RPS data (same as CourseManagement)
      const rpsResponse = await api.get('/generated');
      console.log('[Dosen MataKuliah] All RPS response:', rpsResponse.data);
      
      // Handle nested response structure
      let rpsData = [];
      if (rpsResponse.data?.data?.data && Array.isArray(rpsResponse.data.data.data)) {
        rpsData = rpsResponse.data.data.data;
      } else if (rpsResponse.data?.data && Array.isArray(rpsResponse.data.data)) {
        rpsData = rpsResponse.data.data;
      } else if (Array.isArray(rpsResponse.data)) {
        rpsData = rpsResponse.data;
      }

      console.log('[Dosen MataKuliah] All RPS data:', rpsData);
      console.log('Total RPS found:', rpsData.length);
      if (rpsData.length > 0) {
        console.log('Sample RPS structure:', rpsData[0]);
      }

      // Create Set of course IDs that have RPS (same as CourseManagement)
      const rpsSet = new Set(rpsData.map(rps => rps.course_id).filter(Boolean));
      console.log('Courses with RPS (Set):', Array.from(rpsSet));

      // Enrich courses with RPS status
      const enrichedCourses = coursesData.map(course => {
        const hasRPS = rpsSet.has(course.id);
        const rps = rpsData.find(r => r.course_id === course.id);

        // Normalisasi status agar 'completed' juga dianggap selesai
        const rawStatus = rps ? (rps.status || 'draft') : 'belum';
        const normalizedStatus = rawStatus.toLowerCase();

        console.log(`Course ${course.code} (${course.id}):`, {
          hasRPS,
          rpsFound: !!rps,
          status: rawStatus
        });
        
        return {
          ...course,
          rpsStatus: normalizedStatus,
          rpsId: rps?.id || null,
          hasRPS: hasRPS,
        };
      });

      console.log('Enriched courses:', enrichedCourses);
      setCourses(enrichedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sksOptions = Array.from(
    new Set(
      courses
        .map((c) => c.credits)
        .filter((v) => v !== null && v !== undefined && v !== '')
    )
  ).sort((a, b) => Number(a) - Number(b));

  const semesterOptions = Array.from(
    new Set(
      courses
        .map((c) => c.semester)
        .filter((v) => v !== null && v !== undefined && v !== '')
    )
  ).sort((a, b) => Number(a) - Number(b));

  const filteredCourses = courses.filter((course) => {
    if (filterSKS && String(course.credits) !== String(filterSKS)) return false;
    if (filterSemester && String(course.semester) !== String(filterSemester)) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
          <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
          Mata Kuliah Saya
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Daftar mata kuliah yang telah ditugaskan kepada Anda oleh Kaprodi
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-blue-100 text-xs md:text-sm font-medium">Total Mata Kuliah</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{courses.length}</p>
            </div>
            <BookOpen className="w-7 h-7 md:w-12 md:h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Total SKS</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {courses.reduce((sum, c) => sum + (parseInt(c.credits) || 0), 0)}
              </p>
            </div>
            <Calendar className="w-7 h-7 md:w-12 md:h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Status</p>
              <p className="text-sm md:text-lg font-bold text-green-600 mt-1 md:mt-2">Aktif</p>
            </div>
            <Clock className="w-7 h-7 md:w-12 md:h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Daftar Mata Kuliah</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-3 w-full md:w-auto">
              <select
                value={filterSKS}
                onChange={(e) => setFilterSKS(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua SKS</option>
                {sksOptions.map((sks) => (
                  <option key={sks} value={sks}>
                    {sks} SKS
                  </option>
                ))}
              </select>
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Semester</option>
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-gray-50">
            <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg font-medium">Belum ada mata kuliah yang ditugaskan</p>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              Hubungi Kaprodi untuk mendapatkan penugasan mata kuliah
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-gray-50">
            <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg font-medium">Tidak ada mata kuliah yang sesuai dengan filter</p>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              Coba ubah pilihan filter SKS atau Semester
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode MK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Mata Kuliah
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKS
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status RPS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course, index) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {course.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {course.title}
                            </div>
                            {course.program && (
                              <div className="text-xs text-gray-500">
                                {course.program.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {course.credits}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {course.semester}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {['selesai', 'published', 'completed'].includes(course.rpsStatus) ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Selesai
                          </span>
                        ) : course.rpsStatus === 'draft' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            <Clock className="w-4 h-4" />
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                            <BookOpen className="w-4 h-4" />
                            Belum Dibuat
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {course.credits} SKS
                        </span>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          Smt {course.semester}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                        {index + 1}. {course.title}
                      </h3>
                      {course.program && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {course.program.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    {['selesai', 'published', 'completed'].includes(course.rpsStatus) ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Selesai
                      </span>
                    ) : course.rpsStatus === 'draft' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                        <BookOpen className="w-3 h-3" />
                        Belum Dibuat
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Informasi
        </h3>
        <p className="text-sm text-blue-800">
          Daftar mata kuliah di atas adalah mata kuliah yang telah ditugaskan kepada Anda oleh Kaprodi. 
          Anda dapat mengakses dan mengelola RPS untuk mata kuliah tersebut melalui menu "RPS Saya".
        </p>
      </div>
    </div>
  );
}
