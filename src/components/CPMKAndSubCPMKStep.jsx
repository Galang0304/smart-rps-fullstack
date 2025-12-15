import React, { useState, useEffect } from 'react';
import { Bot, Save, Loader2, PenLine, Database, X } from 'lucide-react';
import { aiHelperAPI } from '../services/api';
import apiClient from '../services/api';

export default function CPMKAndSubCPMKStep({ course, formData, setFormData, hasDBCpmk, setHasDBCpmk }) {
  // CPMK State
  const [generatingCPMK, setGeneratingCPMK] = useState(false);
  const [generatingCPMKIndex, setGeneratingCPMKIndex] = useState(null);
  const [loadingDBCPMK, setLoadingDBCPMK] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [checkingDB, setCheckingDB] = useState(true);
  const [savingCPMK, setSavingCPMK] = useState(false);

  // Sub-CPMK State
  const [generatingSubCPMK, setGeneratingSubCPMK] = useState(false);
  const [generatingSubCpmkIndex, setGeneratingSubCpmkIndex] = useState(null);
  const [generatingSubIndex, setGeneratingSubIndex] = useState(null);
  const [savingSubCPMK, setSavingSubCPMK] = useState(false);
  const [loadingSubCPMK, setLoadingSubCPMK] = useState(false);

  const userRole = localStorage.getItem('role');

  // Load CPMK from database on mount
  useEffect(() => {
    const loadDBCpmk = async () => {
      if (!course?.id) return;
      setCheckingDB(true);
      try {
        const res = await apiClient.get(`/cpmk/course/${course.id}`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const dbCpmks = res.data.data.map((cpmk) => ({
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

  // Initialize Sub-CPMKs based on CPMK count (always total 14)
  useEffect(() => {
    if (formData.cpmk.length === 0) return;
    
    const initializeSubCpmks = () => {
      const totalCpmks = formData.cpmk.length;
      const totalSubCpmks = 14;
      const subCpmksPerCpmk = Math.floor(totalSubCpmks / totalCpmks);
      const remainder = totalSubCpmks % totalCpmks;
      
      const newSubCpmks = [];
      formData.cpmk.forEach((cpmk, cpmkIndex) => {
        const cpmkNumber = cpmkIndex + 1;
        const cpmkCode = `CPMK-${cpmkNumber}`;
        const subCount = subCpmksPerCpmk + (cpmkIndex < remainder ? 1 : 0);
        
        for (let i = 0; i < subCount; i++) {
          newSubCpmks.push({
            code: `Sub-CPMK-${cpmkNumber}.${i + 1}`,
            description: '',
            cpmk_id: cpmkCode,
            cpmkNumber: cpmkNumber,
            subNumber: i + 1,
            fromDB: false
          });
        }
      });
      
      setFormData({ ...formData, subCPMK: newSubCpmks });
    };
    
    // Try to load from database first
    const loadFromDB = async () => {
      if (!course?.id) {
        initializeSubCpmks();
        return;
      }
      
      setLoadingSubCPMK(true);
      try {
        const res = await apiClient.get(`/cpmk/course/${course.id}`);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const allSubCpmks = [];
          res.data.data.forEach((cpmk) => {
            if (cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0) {
              cpmk.sub_cpmks.forEach(subCpmk => {
                allSubCpmks.push({
                  code: `Sub-CPMK-${cpmk.cpmk_number}.${subCpmk.sub_cpmk_number}`,
                  description: subCpmk.description,
                  cpmk_id: `CPMK-${cpmk.cpmk_number}`,
                  cpmkNumber: cpmk.cpmk_number,
                  subNumber: subCpmk.sub_cpmk_number,
                  id: subCpmk.id,
                  fromDB: true
                });
              });
            }
          });
          
          if (allSubCpmks.length >= 14) {
            setFormData({ ...formData, subCPMK: allSubCpmks });
          } else {
            initializeSubCpmks();
          }
        } else {
          initializeSubCpmks();
        }
      } catch (error) {
        console.error('Failed to load Sub-CPMK from DB:', error);
        initializeSubCpmks();
      } finally {
        setLoadingSubCPMK(false);
      }
    };
    
    if (formData.subCPMK.length === 0) {
      loadFromDB();
    }
  }, [formData.cpmk.length]);

  // ===== CPMK HANDLERS =====

  const handleLoadFromDB = async () => {
    setLoadingDBCPMK(true);
    setInputMode('database');
    try {
      const res = await apiClient.get(`/cpmk/course/${course.id}`);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        const dbCpmks = res.data.data.map((cpmk) => ({
          code: `CPMK-${cpmk.cpmk_number}`,
          description: cpmk.description,
          id: cpmk.id,
          fromDB: true
        }));
        
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
      setLoadingDBCPMK(false);
    }
  };

  const handleGenerateAIForCPMK = async (index) => {
    setGeneratingCPMK(true);
    setGeneratingCPMKIndex(index);
    try {
      const res = await aiHelperAPI.generateCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits,
        existing_cpl: [],
      });
      
      const source = res.data.source || 'ai';
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const generatedDescription = res.data.data.items[0].description;
        
        const newCPMK = [...formData.cpmk];
        newCPMK[index].description = generatedDescription;
        newCPMK[index].fromDB = false;
        setFormData({ ...formData, cpmk: newCPMK });
        
        if (!inputMode) setInputMode('manual');
        
        if (source === 'database') {
          console.log('⚠️ Note: Data came from database instead of AI generation');
        }
      }
    } catch (error) {
      console.error('Failed to generate CPMK:', error);
      alert('Gagal generate CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGeneratingCPMK(false);
      setGeneratingCPMKIndex(null);
    }
  };

  const handleManualMode = () => {
    setInputMode('manual');
  };

  const handleSaveCPMKToDB = async () => {
    if (!course?.id) {
      alert('Course ID tidak ditemukan');
      return;
    }

    const validCpmks = formData.cpmk.filter(c => c.description && c.description.trim());
    if (validCpmks.length === 0) {
      alert('Tidak ada CPMK yang valid untuk disimpan');
      return;
    }

    setSavingCPMK(true);
    try {
      const payload = {
        course_id: course.id,
        cpmks: validCpmks.map(cpmk => ({
          code: cpmk.code,
          description: cpmk.description,
          sub_cpmks: []
        }))
      };

      const res = await apiClient.post('/cpmk/batch', payload);
      
      if (res.data.success) {
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
      setSavingCPMK(false);
    }
  };

  // ===== SUB-CPMK HANDLERS =====

  const handleGenerateAllSubCPMK = async () => {
    const missingCpmks = formData.cpmk.filter(c => !c.description || !c.description.trim());
    if (missingCpmks.length > 0) {
      alert('Harap isi semua deskripsi CPMK terlebih dahulu!');
      return;
    }

    setGeneratingSubCPMK(true);
    try {
      const updatedSubCpmks = [...formData.subCPMK];
      let generatedCount = 0;

      for (let i = 0; i < updatedSubCpmks.length; i++) {
        const subCpmk = updatedSubCpmks[i];
        
        if (subCpmk.fromDB) {
          continue;
        }

        if (subCpmk.description && subCpmk.description.trim()) {
          continue;
        }

        try {
          const cpmkObj = formData.cpmk.find(c => c.code === subCpmk.cpmk_id);
          if (!cpmkObj) continue;

          const res = await aiHelperAPI.generateSubCPMK({
            course_id: course.id,
            course_code: course.code,
            course_title: course.title,
            cpmk_code: cpmkObj.code,
            cpmk_description: cpmkObj.description,
            existing_sub_cpmk: [],
          });

          if (res.data.data.items && res.data.data.items.length > 0) {
            updatedSubCpmks[i].description = res.data.data.items[0].description;
            updatedSubCpmks[i].fromDB = false;
            generatedCount++;
          }
        } catch (error) {
          console.error(`Failed to generate Sub-CPMK ${subCpmk.code}:`, error);
        }
      }

      setFormData({ ...formData, subCPMK: updatedSubCpmks });
      alert(`✅ Berhasil generate ${generatedCount} Sub-CPMK!`);
    } catch (error) {
      console.error('Failed to generate all Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGeneratingSubCPMK(false);
    }
  };

  const handleGenerateForCPMK = async (cpmkNumber) => {
    const cpmkObj = formData.cpmk.find(c => c.code === `CPMK-${cpmkNumber}`);
    if (!cpmkObj || !cpmkObj.description) {
      alert('Harap isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    setGeneratingSubCPMK(true);
    setGeneratingSubCpmkIndex(cpmkNumber);
    try {
      const updatedSubCpmks = [...formData.subCPMK];
      const targetSubCpmks = updatedSubCpmks.filter(s => s.cpmkNumber === cpmkNumber);
      let generatedCount = 0;

      for (const subCpmk of targetSubCpmks) {
        if (subCpmk.fromDB) continue;
        if (subCpmk.description && subCpmk.description.trim()) continue;

        try {
          const res = await aiHelperAPI.generateSubCPMK({
            course_id: course.id,
            course_code: course.code,
            course_title: course.title,
            cpmk_code: cpmkObj.code,
            cpmk_description: cpmkObj.description,
            existing_sub_cpmk: [],
          });

          if (res.data.data.items && res.data.data.items.length > 0) {
            const index = updatedSubCpmks.findIndex(s => s.code === subCpmk.code);
            if (index !== -1) {
              updatedSubCpmks[index].description = res.data.data.items[0].description;
              updatedSubCpmks[index].fromDB = false;
              generatedCount++;
            }
          }
        } catch (error) {
          console.error(`Failed to generate ${subCpmk.code}:`, error);
        }
      }

      setFormData({ ...formData, subCPMK: updatedSubCpmks });
      alert(`✅ Berhasil generate ${generatedCount} Sub-CPMK untuk CPMK-${cpmkNumber}!`);
    } catch (error) {
      console.error('Failed to generate Sub-CPMK for CPMK:', error);
      alert('Gagal generate Sub-CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGeneratingSubCPMK(false);
      setGeneratingSubCpmkIndex(null);
    }
  };

  const handleGenerateOneSubCPMK = async (index) => {
    const subCpmk = formData.subCPMK[index];
    const cpmkObj = formData.cpmk.find(c => c.code === subCpmk.cpmk_id);
    
    if (!cpmkObj || !cpmkObj.description) {
      alert('Harap isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    setGeneratingSubCPMK(true);
    setGeneratingSubIndex(index);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk_code: cpmkObj.code,
        cpmk_description: cpmkObj.description,
        existing_sub_cpmk: [],
      });

      if (res.data.data.items && res.data.data.items.length > 0) {
        const updatedSubCpmks = [...formData.subCPMK];
        updatedSubCpmks[index].description = res.data.data.items[0].description;
        updatedSubCpmks[index].fromDB = false;
        setFormData({ ...formData, subCPMK: updatedSubCpmks });
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK. Pastikan Gemini API key sudah diset.');
    } finally {
      setGeneratingSubCPMK(false);
      setGeneratingSubIndex(null);
    }
  };

  const updateSubCpmkDescription = (index, value) => {
    const updatedSubCpmks = [...formData.subCPMK];
    updatedSubCpmks[index].description = value;
    updatedSubCpmks[index].fromDB = false;
    setFormData({ ...formData, subCPMK: updatedSubCpmks });
  };

  const handleSaveSubCPMKToDB = async () => {
    if (!course?.id) {
      alert('Course ID tidak ditemukan');
      return;
    }

    const emptySubCpmks = formData.subCPMK.filter(s => !s.description || !s.description.trim());
    if (emptySubCpmks.length > 0) {
      alert(`❌ Semua 14 Sub-CPMK harus diisi! Masih ada ${emptySubCpmks.length} yang kosong.`);
      return;
    }

    setSavingSubCPMK(true);
    try {
      const cpmkGroups = {};
      formData.subCPMK.forEach(subCpmk => {
        const cpmkCode = subCpmk.cpmk_id;
        if (!cpmkGroups[cpmkCode]) {
          cpmkGroups[cpmkCode] = [];
        }
        cpmkGroups[cpmkCode].push({
          code: subCpmk.code,
          description: subCpmk.description,
          sub_cpmk_number: subCpmk.subNumber
        });
      });

      const payload = {
        course_id: course.id,
        cpmks: formData.cpmk.map(cpmk => ({
          code: cpmk.code,
          description: cpmk.description,
          sub_cpmks: cpmkGroups[cpmk.code] || []
        }))
      };

      const res = await apiClient.post('/cpmk/batch', payload);
      
      if (res.data.success) {
        const updatedSubCpmks = formData.subCPMK.map(s => ({ ...s, fromDB: true }));
        setFormData({ ...formData, subCPMK: updatedSubCpmks });
        alert('✅ Berhasil menyimpan semua Sub-CPMK ke database!');
      }
    } catch (error) {
      console.error('Failed to save Sub-CPMK to DB:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`❌ Gagal menyimpan Sub-CPMK: ${errorMsg}`);
    } finally {
      setSavingSubCPMK(false);
    }
  };

  // Group Sub-CPMKs by CPMK
  const groupedSubCpmks = formData.subCPMK.reduce((acc, subCpmk) => {
    const cpmkNumber = subCpmk.cpmkNumber;
    if (!acc[cpmkNumber]) {
      acc[cpmkNumber] = [];
    }
    acc[cpmkNumber].push(subCpmk);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* ===== CPMK SECTION ===== */}
      <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              📋 Capaian Pembelajaran Mata Kuliah (CPMK)
            </h2>
            <p className="text-sm text-gray-600">
              Pilih metode untuk mengisi CPMK: input manual, ambil dari database, atau generate dengan AI.
            </p>
          </div>
          <button
            onClick={handleSaveCPMKToDB}
            disabled={savingCPMK || formData.cpmk.every(c => c.fromDB)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {savingCPMK ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan CPMK</span>
              </>
            )}
          </button>
        </div>

        {/* Input Mode Selector */}
        {userRole !== 'dosen' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Pilih Metode Input:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

              <button
                onClick={handleLoadFromDB}
                disabled={loadingDBCPMK || checkingDB}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  inputMode === 'database' 
                    ? 'border-green-500 bg-green-50' 
                    : hasDBCpmk 
                      ? 'border-gray-200 bg-white hover:border-green-300' 
                      : 'border-gray-200 bg-gray-100 opacity-60'
                } ${(loadingDBCPMK || checkingDB) ? 'cursor-wait' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {loadingDBCPMK ? (
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
                  disabled={generatingCPMK && generatingCPMKIndex === index}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Generate dengan AI"
                >
                  {generatingCPMK && generatingCPMKIndex === index ? (
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
              const cpmkNumbers = formData.cpmk.map(c => {
                const match = c.code.match(/CPMK-(\d+)/);
                return match ? parseInt(match[1]) : 0;
              });
              const nextNumber = Math.max(...cpmkNumbers, 0) + 1;
              const newCPMK = [...formData.cpmk, { code: `CPMK-${nextNumber}`, description: '', fromDB: false }];
              setFormData({ ...formData, cpmk: newCPMK });
              if (!inputMode) setInputMode('manual');
            }}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Tambah CPMK
          </button>
        </div>
      </div>

      {/* ===== SUB-CPMK SECTION ===== */}
      {formData.cpmk.length > 0 && (
        <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                📝 Sub-Capaian Pembelajaran (Sub-CPMK)
              </h2>
              <p className="text-sm text-gray-600">
                Total 14 Sub-CPMK terbagi dalam {formData.cpmk.length} CPMK.
                {formData.subCPMK.filter(s => s.fromDB).length > 0 && (
                  <span className="ml-2 text-green-600 font-medium">
                    ({formData.subCPMK.filter(s => s.fromDB).length} dari database)
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerateAllSubCPMK}
                disabled={generatingSubCPMK || formData.cpmk.some(c => !c.description)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {generatingSubCPMK && generatingSubCpmkIndex === null ? (
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
              <button
                onClick={handleSaveSubCPMKToDB}
                disabled={savingSubCPMK || formData.subCPMK.some(s => !s.description)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {savingSubCPMK ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Sub-CPMK</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {loadingSubCPMK ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading Sub-CPMK...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedSubCpmks).sort((a, b) => parseInt(a) - parseInt(b)).map(cpmkNumber => {
                const cpmkObj = formData.cpmk.find(c => c.code === `CPMK-${cpmkNumber}`);
                const subCpmks = groupedSubCpmks[cpmkNumber];
                
                return (
                  <div key={cpmkNumber} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-600">CPMK-{cpmkNumber}</h3>
                      <button
                        onClick={() => handleGenerateForCPMK(parseInt(cpmkNumber))}
                        disabled={generatingSubCPMK || !cpmkObj?.description}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingSubCPMK && generatingSubCpmkIndex === parseInt(cpmkNumber) ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3" />
                            <span>Generate CPMK ini</span>
                          </>
                        )}
                      </button>
                    </div>
                    {cpmkObj?.description && (
                      <p className="text-sm text-gray-600 mb-3 italic">{cpmkObj.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      {subCpmks.map((subCpmk, subIndex) => {
                        const globalIndex = formData.subCPMK.findIndex(s => s.code === subCpmk.code);
                        return (
                          <div key={subCpmk.code} className={`p-3 border-2 rounded-lg bg-white ${subCpmk.fromDB ? 'border-green-300' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-medium text-purple-600 text-sm min-w-[90px]">
                                  {subCpmk.code}
                                </span>
                                {subCpmk.fromDB && (
                                  <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
                                    DB
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={subCpmk.description}
                                  onChange={(e) => updateSubCpmkDescription(globalIndex, e.target.value)}
                                  placeholder="Masukkan deskripsi Sub-CPMK..."
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  rows={2}
                                />
                              </div>
                              <button
                                onClick={() => handleGenerateOneSubCPMK(globalIndex)}
                                disabled={generatingSubCPMK || !cpmkObj?.description}
                                className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                title="Generate Sub-CPMK ini"
                              >
                                {generatingSubCPMK && generatingSubIndex === globalIndex ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Bot className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
