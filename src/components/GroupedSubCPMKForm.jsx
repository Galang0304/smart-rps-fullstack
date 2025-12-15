import React, { useState, useEffect } from 'react';
import { Bot, Save, Loader2, Plus, X, Database } from 'lucide-react';
import { aiHelperAPI } from '../services/api';
import apiClient from '../services/api';

export default function GroupedSubCPMKForm({ course, formData, setFormData }) {
  const [generating, setGenerating] = useState(false);
  const [generatingCpmkIndex, setGeneratingCpmkIndex] = useState(null);
  const [generatingSubIndex, setGeneratingSubIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem('role');

  // Load Sub-CPMK from database when component mounts
  useEffect(() => {
    const loadSubCpmk = async () => {
      if (!course?.id) return;
      setLoading(true);
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

  const handleGenerateForCPMK = async (cpmkIndex) => {
    if (!formData.cpmk[cpmkIndex] || !formData.cpmk[cpmkIndex].description.trim()) {
      alert('CPMK harus terisi terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    setGeneratingCpmkIndex(cpmkIndex);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: formData.cpmk[cpmkIndex].description,
      });
      
      const source = res.data.source;
      if (source === 'database') {
        alert('✅ Sub-CPMK berhasil dimuat dari database!');
      } else if (source === 'ai') {
        alert('✨ Sub-CPMK berhasil di-generate dengan AI');
      }
      
      // Calculate how many Sub-CPMKs this CPMK should have
      const totalCpmks = formData.cpmk.length;
      const subCpmksPerCpmk = Math.ceil(14 / totalCpmks);
      
      // Get CPMK number
      const cpmkNumber = cpmkIndex + 1;
      const cpmkCode = `CPMK-${cpmkNumber}`;
      
      // Generate Sub-CPMKs
      const generatedItems = res.data.data.items.slice(0, subCpmksPerCpmk);
      const newSubCpmks = generatedItems.map((item, idx) => ({
        code: `Sub-CPMK-${cpmkNumber}.${idx + 1}`,
        description: item.description,
        cpmk_id: cpmkCode,
        cpmkNumber: cpmkNumber,
        subNumber: idx + 1,
        fromDB: source === 'database'
      }));
      
      // Remove existing Sub-CPMKs for this CPMK and add new ones
      const otherSubCpmks = formData.subCPMK.filter(sub => sub.cpmk_id !== cpmkCode);
      const updatedSubCPMK = [...otherSubCpmks, ...newSubCpmks].sort((a, b) => {
        if (a.cpmkNumber !== b.cpmkNumber) return a.cpmkNumber - b.cpmkNumber;
        return a.subNumber - b.subNumber;
      });
      
      setFormData({ ...formData, subCPMK: updatedSubCPMK });
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
      setGeneratingCpmkIndex(null);
    }
  };

  const handleGenerateOne = async (cpmkIndex, subIndex) => {
    if (!formData.cpmk[cpmkIndex] || !formData.cpmk[cpmkIndex].description.trim()) {
      alert('CPMK harus terisi terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    setGeneratingSubIndex(`${cpmkIndex}-${subIndex}`);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: formData.cpmk[cpmkIndex].description,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const generatedDescription = res.data.data.items[0].description;
        
        const cpmkCode = formData.cpmk[cpmkIndex].code;
        const subCpmksForThisCpmk = formData.subCPMK.filter(sub => sub.cpmk_id === cpmkCode);
        const targetSub = subCpmksForThisCpmk[subIndex];
        
        if (targetSub) {
          const newSubCPMK = formData.subCPMK.map(sub => {
            if (sub.code === targetSub.code) {
              return { ...sub, description: generatedDescription, fromDB: false };
            }
            return sub;
          });
          setFormData({ ...formData, subCPMK: newSubCPMK });
        }
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
      setGeneratingSubIndex(null);
    }
  };

  const addSubCpmk = (cpmkIndex) => {
    const cpmkNumber = cpmkIndex + 1;
    const cpmkCode = `CPMK-${cpmkNumber}`;
    
    // Find existing Sub-CPMKs for this CPMK
    const existingSubCpmks = formData.subCPMK.filter(sub => sub.cpmk_id === cpmkCode);
    const nextSubNumber = existingSubCpmks.length + 1;
    
    const newSubCpmk = {
      code: `Sub-CPMK-${cpmkNumber}.${nextSubNumber}`,
      description: '',
      cpmk_id: cpmkCode,
      cpmkNumber: cpmkNumber,
      subNumber: nextSubNumber,
      fromDB: false
    };
    
    const updatedSubCPMK = [...formData.subCPMK, newSubCpmk].sort((a, b) => {
      if (a.cpmkNumber !== b.cpmkNumber) return a.cpmkNumber - b.cpmkNumber;
      return a.subNumber - b.subNumber;
    });
    
    setFormData({ ...formData, subCPMK: updatedSubCPMK });
  };

  const removeSubCpmk = (subCpmk) => {
    if (subCpmk.fromDB) {
      if (!confirm('Sub-CPMK ini dari database. Yakin ingin menghapus? (Tidak akan terhapus dari database, hanya dari form ini)')) {
        return;
      }
    }
    
    const newSubCPMK = formData.subCPMK.filter(sub => sub.code !== subCpmk.code);
    setFormData({ ...formData, subCPMK: newSubCPMK });
  };

  const updateSubCpmkDescription = (subCode, newDescription) => {
    const newSubCPMK = formData.subCPMK.map(sub => {
      if (sub.code === subCode) {
        return { ...sub, description: newDescription, fromDB: false };
      }
      return sub;
    });
    setFormData({ ...formData, subCPMK: newSubCPMK });
  };

  // Calculate Sub-CPMKs per CPMK
  const totalCpmks = formData.cpmk.length;
  const subCpmksPerCpmk = Math.ceil(14 / totalCpmks);

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sub-CPMK (Dikelompokkan per CPMK)</h2>
          <p className="text-sm text-gray-600 mt-1">
            Jumlah Sub-CPMK per CPMK: <span className="font-semibold text-blue-600">~{subCpmksPerCpmk}</span> 
            <span className="text-gray-500"> (14 Sub-CPMK dibagi {totalCpmks} CPMK)</span>
          </p>
        </div>
        {userRole !== 'dosen' && (
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
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {formData.cpmk.map((cpmk, cpmkIndex) => {
            const cpmkNumber = cpmkIndex + 1;
            const cpmkCode = `CPMK-${cpmkNumber}`;
            const subCpmksForThisCpmk = formData.subCPMK.filter(sub => sub.cpmk_id === cpmkCode);
            
            return (
              <div key={cpmkIndex} className="border-2 border-gray-300 rounded-lg p-5 bg-white shadow-sm">
                {/* CPMK Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-blue-700 text-lg">{cpmk.code}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {subCpmksForThisCpmk.length} Sub-CPMK
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{cpmk.description || 'CPMK belum terisi'}</p>
                  </div>
                  {userRole !== 'dosen' && (
                    <button
                      onClick={() => handleGenerateForCPMK(cpmkIndex)}
                      disabled={generating || !cpmk.description.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 ml-4 flex-shrink-0"
                      title={`Generate ${subCpmksPerCpmk} Sub-CPMK untuk ${cpmk.code}`}
                    >
                      {generating && generatingCpmkIndex === cpmkIndex ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm">Generate AI ({subCpmksPerCpmk})</span>
                    </button>
                  )}
                </div>

                {/* Sub-CPMKs List */}
                <div className="space-y-3">
                  {subCpmksForThisCpmk.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Belum ada Sub-CPMK. Klik "Generate AI" atau "Tambah Sub-CPMK" untuk menambahkan.
                    </div>
                  ) : (
                    subCpmksForThisCpmk.map((subCpmk, subIndex) => (
                      <div 
                        key={subCpmk.code} 
                        className={`p-3 border rounded-lg ${subCpmk.fromDB ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-start gap-1 min-w-[100px]">
                            <span className="font-semibold text-purple-700 text-sm">{subCpmk.code}</span>
                            {subCpmk.fromDB && (
                              <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                Database
                              </span>
                            )}
                            {!subCpmk.fromDB && subCpmk.description && (
                              <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">
                                Manual
                              </span>
                            )}
                          </div>
                          
                          <textarea
                            value={subCpmk.description}
                            onChange={(e) => updateSubCpmkDescription(subCpmk.code, e.target.value)}
                            placeholder="Masukkan Sub-CPMK atau klik 'AI'"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                          
                          {userRole !== 'dosen' && (
                            <button
                              onClick={() => handleGenerateOne(cpmkIndex, subIndex)}
                              disabled={generating || !cpmk.description.trim()}
                              className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex-shrink-0"
                              title="Generate 1 Sub-CPMK dengan AI"
                            >
                              {generating && generatingSubIndex === `${cpmkIndex}-${subIndex}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                              <span className="text-sm">AI</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => removeSubCpmk(subCpmk)}
                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                            title="Hapus Sub-CPMK"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Add Sub-CPMK Button */}
                  <button
                    onClick={() => addSubCpmk(cpmkIndex)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 inline-block mr-1" />
                    Tambah Sub-CPMK untuk {cpmk.code}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              <span className="font-semibold">Total Sub-CPMK:</span> {formData.subCPMK.length}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Dari Database:</span> {formData.subCPMK.filter(s => s.fromDB).length}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Manual/Baru:</span> {formData.subCPMK.filter(s => !s.fromDB).length}
            </span>
          </div>
          <span className="text-blue-700 font-medium">
            Rekomendasi: {14} Sub-CPMK (+ 2 untuk UTS & UAS)
          </span>
        </div>
      </div>
    </div>
  );
}
