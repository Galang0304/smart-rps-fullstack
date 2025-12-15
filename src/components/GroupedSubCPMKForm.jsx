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

  // Initialize exactly 14 Sub-CPMKs when component mounts or CPMK changes
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
                  code: `Sub-CPMK-${subCpmk.sub_cpmk_number}`,
                  description: subCpmk.description,
                  id: subCpmk.id,
                  fromDB: true
                });
              });
            }
          });
          
          // If database has data, use it but ensure we have exactly 14
          if (allSubCpmks.length > 0) {
            const fixedSubCpmks = [];
            for (let i = 1; i <= 14; i++) {
              const existing = allSubCpmks.find(s => s.code === `Sub-CPMK-${i}`);
              fixedSubCpmks.push(existing || {
                code: `Sub-CPMK-${i}`,
                description: '',
                fromDB: false
              });
            }
            setFormData({ ...formData, subCPMK: fixedSubCpmks });
          }
        }
      } catch (error) {
        console.error('Failed to load Sub-CPMK from DB:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // If no Sub-CPMK exists, create exactly 14 empty ones
    if (formData.subCPMK.length === 0) {
      if (course?.id) {
        loadSubCpmk();
      } else {
        // Initialize 14 empty Sub-CPMKs
        const newSubCpmks = [];
        for (let i = 1; i <= 14; i++) {
          newSubCpmks.push({
            code: `Sub-CPMK-${i}`,
            description: '',
            fromDB: false
          });
        }
        setFormData({ ...formData, subCPMK: newSubCpmks });
      }
    }
  }, [course?.id]);

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

    // Validate all 14 Sub-CPMKs are filled
    const emptySubCpmks = formData.subCPMK.filter(sub => !sub.description || !sub.description.trim());
    if (emptySubCpmks.length > 0) {
      alert(`❌ Semua 14 Sub-CPMK harus terisi! Masih ada ${emptySubCpmks.length} Sub-CPMK kosong.`);
      return;
    }

    // Prepare payload - all 14 Sub-CPMKs under first CPMK
    const cpmks = formData.cpmk.map((cpmk, index) => {
      // Only first CPMK gets all 14 Sub-CPMKs
      const subCpmks = index === 0 ? formData.subCPMK.map(sub => ({
        code: sub.code,
        description: sub.description
      })) : [];
      
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
        alert(`✅ Berhasil menyimpan 14 Sub-CPMK ke database!`);
      }
    } catch (error) {
      console.error('Failed to save Sub-CPMK to DB:', error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`❌ Gagal menyimpan Sub-CPMK: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateOne = async (index) => {
    const firstCpmk = formData.cpmk[0];
    if (!firstCpmk || !firstCpmk.description.trim()) {
      alert('CPMK pertama harus terisi terlebih dahulu');
      return;
    }
    
    setGenerating(true);
    setGeneratingSubIndex(index);
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: firstCpmk.description,
      });
      
      if (res.data.data.items && res.data.data.items.length > 0) {
        const generatedDescription = res.data.data.items[0].description;
        
        const newSubCPMK = [...formData.subCPMK];
        newSubCPMK[index] = {
          ...newSubCPMK[index],
          description: generatedDescription,
          fromDB: false
        };
        setFormData({ ...formData, subCPMK: newSubCPMK });
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGenerating(false);
      setGeneratingSubIndex(null);
    }
  };

  const updateSubCpmkDescription = (index, newDescription) => {
    const newSubCPMK = [...formData.subCPMK];
    newSubCPMK[index] = {
      ...newSubCPMK[index],
      description: newDescription,
      fromDB: false
    };
    setFormData({ ...formData, subCPMK: newSubCPMK });
  };

  return (
    <div className="space-y-6">
      {/* Header with Generate All and Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sub-CPMK (14 Sub-CPMK Wajib)</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Sub-CPMK terisi: <span className="font-semibold text-blue-600">{formData.subCPMK.filter(s => s.description && s.description.trim()).length}/14</span>
            <span className="text-red-500 ml-2">* Semua harus terisi</span>
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
        <div className="space-y-3">
          {formData.subCPMK.map((subCpmk, index) => (
            <div 
              key={index} 
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
                  onChange={(e) => updateSubCpmkDescription(index, e.target.value)}
                  placeholder="Masukkan Sub-CPMK atau klik 'AI' *"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                
                {userRole !== 'dosen' && (
                  <button
                    onClick={() => handleGenerateOne(index)}
                    disabled={generating || formData.cpmk.length === 0 || !formData.cpmk[0]?.description?.trim()}
                    className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex-shrink-0"
                    title="Generate 1 Sub-CPMK dengan AI"
                  >
                    {generating && generatingSubIndex === index ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span className="text-sm">AI</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              <span className="font-semibold">Terisi:</span> {formData.subCPMK.filter(s => s.description && s.description.trim()).length}/14
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Dari Database:</span> {formData.subCPMK.filter(s => s.fromDB).length}
            </span>
            <span className="text-gray-700">
              <span className="font-semibold">Manual/Baru:</span> {formData.subCPMK.filter(s => !s.fromDB && s.description).length}
            </span>
          </div>
          <span className={`font-medium ${formData.subCPMK.filter(s => s.description && s.description.trim()).length === 14 ? 'text-green-700' : 'text-red-700'}`}>
            {formData.subCPMK.filter(s => s.description && s.description.trim()).length === 14 ? '✓ Semua terisi!' : '⚠ Harus terisi semua'}
          </span>
        </div>
      </div>
    </div>
  );
}
