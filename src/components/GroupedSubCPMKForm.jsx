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
        // First CPMKs get extra Sub-CPMK if there's remainder
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
          
          if (allSubCpmks.length >= 14) {
            // Use database data if we have enough
            setFormData({ ...formData, subCPMK: allSubCpmks });
          } else {
            // Initialize empty ones if DB data is incomplete
            initializeSubCpmks();
          }
        } else {
          // No data in DB, initialize empty
          initializeSubCpmks();
        }
      } catch (error) {
        console.error('Failed to load Sub-CPMK from DB:', error);
        initializeSubCpmks();
      } finally {
        setLoading(false);
      }
    };
    
    // Always re-initialize when CPMK count changes
    if (formData.subCPMK.length === 0) {
      loadFromDB();
    }
  }, [formData.cpmk.length]);

  const handleGenerateAll = async () => {
    // Check if all CPMKs have descriptions
    const filledCpmks = formData.cpmk.filter(c => c.description && c.description.trim());
    if (filledCpmks.length === 0) {
      alert('Minimal 1 CPMK harus terisi terlebih dahulu');
      return;
    }

    setGenerating(true);
    try {
      let currentSubCpmks = [...formData.subCPMK];
      
      // Generate AI content for all 14 Sub-CPMKs using first CPMK as context
      const firstCpmk = formData.cpmk[0];
      
      try {
        const res = await aiHelperAPI.generateSubCPMK({
          course_id: course.id,
          course_code: course.code,
          course_title: course.title,
          cpmk: firstCpmk.description,
        });

        const generatedItems = res.data.data.items;
        
        // Fill all 14 Sub-CPMKs with generated content
        currentSubCpmks = currentSubCpmks.map((sub, index) => {
          // Only fill if empty
          if (!sub.description || !sub.description.trim()) {
            if (index < generatedItems.length) {
              return {
                ...sub,
                description: generatedItems[index].description,
                fromDB: false
              };
            }
          }
          return sub;
        });
        
        setFormData({ ...formData, subCPMK: currentSubCpmks });
        
        const totalFilled = currentSubCpmks.filter(sub => sub.description && sub.description.trim()).length;
        alert(`✨ Generate selesai! Total Sub-CPMK terisi: ${totalFilled}/14`);
      } catch (error) {
        console.error('Failed to generate Sub-CPMK:', error);
        alert('Gagal generate Sub-CPMK');
      }
    } catch (error) {
      console.error('Failed to generate all Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!course?.id) {
      alert('Course ID tidak ditemukan');
      return;
    }

    // Validate all Sub-CPMKs are filled
    const totalSubs = formData.subCPMK.length;
    const emptySubCpmks = formData.subCPMK.filter(sub => !sub.description || !sub.description.trim());
    if (emptySubCpmks.length > 0) {
      alert(`❌ Semua ${totalSubs} Sub-CPMK harus terisi! Masih ada ${emptySubCpmks.length} Sub-CPMK kosong.`);
      return;
    }

    // Group Sub-CPMKs by CPMK
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
    const cpmks = formData.cpmk.map((cpmk) => {
      const subCpmks = (cpmkGroups[cpmk.code] || []).map(sub => ({
        code: sub.code,
        description: sub.description
      }));
      
      return {
        code: cpmk.code,
        description: cpmk.description,
        sub_cpmks: subCpmks
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
        alert(`✅ Berhasil menyimpan ${totalSubs} Sub-CPMK ke database!`);
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
      
      const cpmkNumber = cpmkIndex + 1;
      const cpmkCode = `CPMK-${cpmkNumber}`;
      const generatedItems = res.data.data.items;
      
      // Only fill empty Sub-CPMKs for this CPMK
      const updatedSubCPMK = formData.subCPMK.map(sub => {
        if (sub.cpmk_id === cpmkCode && (!sub.description || !sub.description.trim())) {
          const subCpmksForThisCpmk = formData.subCPMK.filter(s => s.cpmk_id === cpmkCode);
          const emptySubCpmks = subCpmksForThisCpmk.filter(s => !s.description || !s.description.trim());
          const emptyIndex = emptySubCpmks.findIndex(e => e.code === sub.code);
          if (emptyIndex !== -1 && emptyIndex < generatedItems.length) {
            return {
              ...sub,
              description: generatedItems[emptyIndex].description,
              fromDB: false
            };
          }
        }
        return sub;
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

  const updateSubCpmkDescription = (subCode, newDescription) => {
    const newSubCPMK = formData.subCPMK.map(sub => {
      if (sub.code === subCode) {
        return { ...sub, description: newDescription, fromDB: false };
      }
      return sub;
    });
    setFormData({ ...formData, subCPMK: newSubCPMK });
  };

  // Calculate Sub-CPMKs per CPMK for display
  const totalCpmks = formData.cpmk.length;
  const totalSubs = formData.subCPMK.length;

  return (
    <div className="space-y-6">
      {/* Header with Generate All and Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sub-CPMK (Dikelompokkan per CPMK)</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Sub-CPMK: <span className="font-semibold text-blue-600">{formData.subCPMK.filter(s => s.description && s.description.trim()).length}/{totalSubs}</span>
            <span className="text-gray-500 ml-2">({totalSubs} Sub-CPMK untuk {totalCpmks} CPMK)</span>
            <span className="text-red-500 ml-2">* Wajib terisi semua</span>
          </p>
        </div>
        {userRole !== 'dosen' && (
          <div className="flex gap-2">
            <button
              onClick={handleGenerateAll}
              disabled={generating || formData.cpmk.every(c => !c.description || !c.description.trim()) || loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              title="Generate semua Sub-CPMK kosong dengan AI"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <span>Generate All AI</span>
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
          </div>
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
                      title={`Generate Sub-CPMK untuk ${cpmk.code}`}
                    >
                      {generating && generatingCpmkIndex === cpmkIndex ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm">Generate AI</span>
                    </button>
                  )}
                </div>

                {/* Sub-CPMKs List */}
                <div className="space-y-3">
                  {subCpmksForThisCpmk.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Belum ada Sub-CPMK. Sistem akan generate otomatis berdasarkan jumlah CPMK.
                    </div>
                  ) : (
                    subCpmksForThisCpmk.map((subCpmk, subIndex) => (
                      <div 
                        key={subCpmk.code} 
                        className={`p-3 border rounded-lg ${subCpmk.fromDB ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-start gap-1 min-w-[110px]">
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
                            placeholder="Masukkan Sub-CPMK atau klik 'AI' *"
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
                        </div>
                      </div>
                    ))
                  )}
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
              <span className="font-semibold">Terisi:</span> {formData.subCPMK.filter(s => s.description && s.description.trim()).length}/{totalSubs}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Dari Database:</span> {formData.subCPMK.filter(s => s.fromDB).length}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Manual/Baru:</span> {formData.subCPMK.filter(s => !s.fromDB && s.description).length}
            </span>
          </div>
          <span className={`font-medium ${formData.subCPMK.filter(s => s.description && s.description.trim()).length === totalSubs ? 'text-green-700' : 'text-red-700'}`}>
            {formData.subCPMK.filter(s => s.description && s.description.trim()).length === totalSubs ? '✓ Semua terisi!' : '⚠ Harus terisi semua'}
          </span>
        </div>
      </div>
    </div>
  );
}
