import React, { useState, useEffect } from 'react';
import { Bot, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Plus, Minus, Save, Database, Sparkles, Zap, Target, ListChecks, CheckCircle2, XCircle, Circle, Flame, Award } from 'lucide-react';
import { aiHelperAPI, cplAPI, cpmkAPI } from '../services/api';

/**
 * Komponen Terintegrasi CPMK + CPL Mapping + Sub-CPMK
 * Alur: Load/Buat CPMK → Match CPL → Kelola Sub-CPMK → Tampilkan Bobot
 */
export default function CPMKIntegrated({ cpmk, cpmkIndex, course, formData, onChange, onSubCpmkChange, totalCpmk }) {
  const [allCPLs, setAllCPLs] = useState([]);
  const [loadingCPLs, setLoadingCPLs] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedCPLs, setSelectedCPLs] = useState(cpmk.selected_cpls || []);
  const [showCPLPanel, setShowCPLPanel] = useState(false);
  const [showSubCpmkPanel, setShowSubCpmkPanel] = useState(true); // Default terbuka
  const [recommendation, setRecommendation] = useState('');
  const [generatingSubCpmk, setGeneratingSubCpmk] = useState(false);
  const [generatingSubIndex, setGeneratingSubIndex] = useState(null);
  const [generatingAllSubs, setGeneratingAllSubs] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const prodiId = localStorage.getItem('prodi_id');
  const userRole = localStorage.getItem('role');
  const cpmkNumber = cpmkIndex + 1;
  const cpmkCode = `CPMK-${cpmkNumber}`;

  // KONSTANTA: Bobot Sub-CPMK = 100/14 (presisi penuh, tanpa pembulatan)
  const SUB_CPMK_BOBOT = 100 / 14; // 7.142857142857143...

  // Helper: Format bobot untuk tampilan PENDEK (2 desimal untuk UI)
  const formatBobotShort = (value) => {
    return value.toFixed(2).replace('.', ',');
  };

  // Helper: Format bobot untuk tampilan PENUH (tanpa pembulatan, untuk perhitungan)
  const formatBobotFull = (value) => {
    return value.toString().replace('.', ',');
  };

  // Get Sub-CPMK untuk CPMK ini
  const subCpmksForThisCpmk = formData.subCpmk?.filter(s => s.cpmk_id === cpmkCode) || [];
  const subCpmkCount = subCpmksForThisCpmk.length;
  const filledSubCpmkCount = subCpmksForThisCpmk.filter(s => s.description && s.description.trim()).length;

  // Calculate Bobot CPMK = jumlah Sub-CPMK × bobot Sub-CPMK
  const cpmkBobot = subCpmkCount * SUB_CPMK_BOBOT;

  // Progress percentage
  const progressPercent = subCpmkCount > 0 ? Math.round((filledSubCpmkCount / subCpmkCount) * 100) : 0;

  // CHECKLIST ITEMS - untuk tracking progress
  const checklistItems = [
    { 
      id: 'deskripsi', 
      label: 'Deskripsi CPMK', 
      completed: cpmk.description && cpmk.description.trim().length > 0,
      required: true 
    },
    { 
      id: 'cpl', 
      label: 'Mapping CPL', 
      completed: selectedCPLs.length > 0,
      required: true 
    },
    { 
      id: 'subcpmk_count', 
      label: 'Sub-CPMK ditambahkan', 
      completed: subCpmkCount > 0,
      required: true 
    },
    { 
      id: 'subcpmk_filled', 
      label: 'Semua Sub-CPMK terisi', 
      completed: filledSubCpmkCount === subCpmkCount && subCpmkCount > 0,
      required: true 
    },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalRequired = checklistItems.filter(item => item.required).length;
  const isAllComplete = completedCount === totalRequired;

  // Fallback: Auto-initialize Sub-CPMK untuk CPMK ini jika belum ada
  // Parent (RPSCreate) sudah melakukan init global, ini hanya backup
  useEffect(() => {
    // Cek apakah CPMK ini sudah punya Sub-CPMK
    const currentSubsForThisCpmk = (formData.subCpmk || []).filter(s => s.cpmk_id === cpmkCode);
    const totalSubs = formData.subCpmk?.length || 0;
    
    // Jika belum ada Sub-CPMK sama sekali (termasuk global belum init)
    // dan totalCpmk sudah ada, buat Sub-CPMK untuk CPMK ini
    if (currentSubsForThisCpmk.length === 0 && totalSubs === 0 && totalCpmk > 0) {
      console.log(`[CPMKIntegrated FALLBACK] Auto-init Sub-CPMK untuk ${cpmkCode}, totalCpmk: ${totalCpmk}`);
      
      // Hitung distribusi Sub-CPMK per CPMK (total 14)
      const totalSubCpmks = 14;
      const subPerCpmk = Math.floor(totalSubCpmks / totalCpmk);
      const remainder = totalSubCpmks % totalCpmk;
      
      // CPMK awal dapat extra jika ada sisa
      const subCountForThisCpmk = subPerCpmk + (cpmkIndex < remainder ? 1 : 0);
      
      console.log(`[CPMKIntegrated FALLBACK] ${cpmkCode} akan dapat ${subCountForThisCpmk} Sub-CPMK`);
      
      // Buat Sub-CPMK untuk CPMK ini
      const newSubCpmks = [];
      for (let i = 0; i < subCountForThisCpmk; i++) {
        newSubCpmks.push({
          code: `Sub-CPMK-${cpmkNumber}.${i + 1}`,
          description: '',
          cpmk_id: cpmkCode,
          cpmkNumber: cpmkNumber,
          subNumber: i + 1,
          fromDB: false
        });
      }
      
      // Gabungkan dengan Sub-CPMK yang sudah ada (dari CPMK lain)
      const existingOtherSubs = (formData.subCpmk || []).filter(s => s.cpmk_id !== cpmkCode);
      const updatedSubCpmks = [...existingOtherSubs, ...newSubCpmks];
      
      // Sort berdasarkan cpmkNumber dan subNumber
      updatedSubCpmks.sort((a, b) => {
        if (a.cpmkNumber !== b.cpmkNumber) return a.cpmkNumber - b.cpmkNumber;
        return a.subNumber - b.subNumber;
      });
      
      console.log(`[CPMKIntegrated] Total Sub-CPMK setelah init: ${updatedSubCpmks.length}`, updatedSubCpmks);
      
      // Panggil callback untuk update parent
      if (onSubCpmkChange) {
        onSubCpmkChange(updatedSubCpmks);
      }
    }
  }, [cpmkCode, totalCpmk, onSubCpmkChange]);

  // Sync selectedCPLs when cpmk.selected_cpls changes from parent
  useEffect(() => {
    if (cpmk.selected_cpls) {
      setSelectedCPLs(cpmk.selected_cpls);
      if (cpmk.selected_cpls.length > 0 && cpmk.ai_matches) {
        setMatches(cpmk.ai_matches);
        if (cpmk.recommendation) {
          setRecommendation(cpmk.recommendation);
        }
      }
    }
  }, [cpmk.selected_cpls, cpmk.ai_matches, cpmk.recommendation]);

  // Load all CPLs for this prodi
  useEffect(() => {
    loadCPLs();
  }, [prodiId]);

  const loadCPLs = async () => {
    if (!prodiId) return;
    setLoadingCPLs(true);
    try {
      const res = await cplAPI.getAll({ prodi_id: prodiId });
      setAllCPLs(res.data.data || []);
    } catch (error) {
      console.error('Failed to load CPLs:', error);
    } finally {
      setLoadingCPLs(false);
    }
  };

  // AI Auto-Match CPMK dengan CPL
  const handleAIMatch = async () => {
    if (!cpmk.description || !cpmk.description.trim()) {
      alert('Isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    setMatching(true);
    try {
      const res = await aiHelperAPI.matchCPMKWithCPL({
        prodi_id: prodiId,
        cpmk_code: cpmk.code,
        cpmk_description: cpmk.description,
      });

      if (res.data.success) {
        setMatches(res.data.matches || []);
        setRecommendation(res.data.recommendation || '');
        setShowCPLPanel(true);

        const autoSelected = res.data.matches
          .filter(m => m.recommended)
          .map(m => m.kode_cpl);
        
        if (autoSelected.length > 0) {
          setSelectedCPLs(autoSelected);
          onChange({
            ...cpmk,
            selected_cpls: autoSelected,
            ai_matches: res.data.matches,
            recommendation: res.data.recommendation,
          });
        }

        alert(`✅ AI menemukan ${res.data.matched_cpl} CPL yang selaras!`);
      }
    } catch (error) {
      console.error('Failed to match CPMK with CPL:', error);
      alert('Gagal melakukan AI matching: ' + (error.response?.data?.error || error.message));
    } finally {
      setMatching(false);
    }
  };

  // Toggle CPL selection
  const toggleCPLSelection = (kodeCPL) => {
    let newSelected;
    if (selectedCPLs.includes(kodeCPL)) {
      newSelected = selectedCPLs.filter(c => c !== kodeCPL);
    } else {
      newSelected = [...selectedCPLs, kodeCPL];
    }
    
    setSelectedCPLs(newSelected);
    onChange({
      ...cpmk,
      selected_cpls: newSelected,
    });
  };

  // Add Sub-CPMK untuk CPMK ini
  const handleAddSubCpmk = () => {
    const totalCurrentSub = formData.subCpmk?.length || 0;
    if (totalCurrentSub >= 14) {
      alert('Total Sub-CPMK sudah mencapai 14 (maksimum)');
      return;
    }

    const newSubNumber = subCpmkCount + 1;
    const newSubCpmk = {
      code: `Sub-CPMK-${cpmkNumber}.${newSubNumber}`,
      description: '',
      cpmk_id: cpmkCode,
      cpmkNumber: cpmkNumber,
      subNumber: newSubNumber,
      fromDB: false
    };

    const updatedSubCpmks = [...(formData.subCpmk || []), newSubCpmk];
    onSubCpmkChange(updatedSubCpmks);
  };

  // Remove Sub-CPMK terakhir dari CPMK ini
  const handleRemoveSubCpmk = () => {
    if (subCpmkCount <= 0) return;
    
    // Hapus Sub-CPMK terakhir dari CPMK ini
    const lastSubIndex = formData.subCpmk.findLastIndex(s => s.cpmk_id === cpmkCode);
    if (lastSubIndex === -1) return;

    const updatedSubCpmks = formData.subCpmk.filter((_, idx) => idx !== lastSubIndex);
    onSubCpmkChange(updatedSubCpmks);
  };

  // Update Sub-CPMK description
  const updateSubCpmkDescription = (subCode, newDescription) => {
    const updatedSubCpmks = formData.subCpmk.map(sub => {
      if (sub.code === subCode) {
        return { ...sub, description: newDescription, fromDB: false };
      }
      return sub;
    });
    onSubCpmkChange(updatedSubCpmks);
  };

  // Generate Sub-CPMK dengan AI
  const handleGenerateSubCpmk = async (subIndex) => {
    if (!cpmk.description || !cpmk.description.trim()) {
      alert('Isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    setGeneratingSubCpmk(true);
    setGeneratingSubIndex(subIndex);
    
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: cpmk.description,
      });

      if (res.data.success && res.data.data.items.length > 0) {
        const generatedItem = res.data.data.items[subIndex % res.data.data.items.length];
        const subCpmk = subCpmksForThisCpmk[subIndex];
        if (subCpmk) {
          updateSubCpmkDescription(subCpmk.code, generatedItem.description);
        }
      }
    } catch (error) {
      console.error('Failed to generate Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK');
    } finally {
      setGeneratingSubCpmk(false);
      setGeneratingSubIndex(null);
    }
  };

  // Generate ALL Sub-CPMK untuk CPMK ini dengan AI
  const handleGenerateAllSubCpmk = async () => {
    if (!cpmk.description || !cpmk.description.trim()) {
      alert('Isi deskripsi CPMK terlebih dahulu!');
      return;
    }

    if (subCpmkCount === 0) {
      alert('Tambahkan Sub-CPMK terlebih dahulu!');
      return;
    }

    setGeneratingAllSubs(true);
    
    try {
      const res = await aiHelperAPI.generateSubCPMK({
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        cpmk: cpmk.description,
        count: subCpmkCount, // Request sejumlah Sub-CPMK yang ada
      });

      if (res.data.success && res.data.data.items.length > 0) {
        const generatedItems = res.data.data.items;
        
        // Update semua Sub-CPMK dengan hasil AI
        const updatedSubCpmks = formData.subCpmk.map(sub => {
          if (sub.cpmk_id === cpmkCode) {
            const subIdx = sub.subNumber - 1;
            const generatedItem = generatedItems[subIdx % generatedItems.length];
            return {
              ...sub,
              description: generatedItem?.description || sub.description,
              fromDB: false
            };
          }
          return sub;
        });
        
        onSubCpmkChange(updatedSubCpmks);
        alert(`✅ Berhasil generate ${Math.min(subCpmkCount, generatedItems.length)} Sub-CPMK!`);
      }
    } catch (error) {
      console.error('Failed to generate all Sub-CPMK:', error);
      alert('Gagal generate Sub-CPMK: ' + (error.response?.data?.error || error.message));
    } finally {
      setGeneratingAllSubs(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Get status color based on completion
  const getStatusColor = () => {
    if (filledSubCpmkCount === subCpmkCount && subCpmkCount > 0 && selectedCPLs.length > 0) {
      return 'border-green-400 bg-green-50';
    }
    if (filledSubCpmkCount > 0 || selectedCPLs.length > 0) {
      return 'border-yellow-400 bg-yellow-50';
    }
    return 'border-gray-200 bg-white';
  };

  // Loading overlay component
  const LoadingOverlay = ({ message }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="relative">
          <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <span className="text-gray-700 font-medium text-sm animate-pulse">{message}</span>
      </div>
    </div>
  );

  return (
    <div className={`relative border-2 rounded-xl overflow-hidden transition-all shadow-sm hover:shadow-md ${getStatusColor()} ${isAllComplete ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}>
      
      {/* Loading Overlays */}
      {matching && <LoadingOverlay message="🎯 Matching CPL dengan AI..." />}
      {generatingAllSubs && <LoadingOverlay message="✨ Generating semua Sub-CPMK..." />}
      
      {/* Completion Badge - Floating */}
      {isAllComplete && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold">LENGKAP!</span>
          </div>
        </div>
      )}

      {/* Header CPMK - Compact & Informative */}
      <div className={`p-3 sm:p-4 text-white ${isAllComplete ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-slate-800 to-slate-700'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* CPMK Badge & Bobot */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-lg text-sm shadow">
              {cpmk.code}
            </span>
            
            {/* Bobot CPMK - Format Pendek */}
            <span className={`px-3 py-1.5 font-semibold rounded-lg text-sm ${
              subCpmkCount > 0 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-gray-500 text-gray-200'
            }`} title={subCpmkCount > 0 ? `Bobot presisi: ${formatBobotFull(cpmkBobot)}%` : 'Tambahkan Sub-CPMK'}>
              {subCpmkCount > 0 ? `${formatBobotShort(cpmkBobot)}%` : '0%'}
            </span>

            {/* Checklist Toggle Button */}
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                isAllComplete 
                  ? 'bg-green-400/30 text-green-100 hover:bg-green-400/40'
                  : 'bg-orange-400/30 text-orange-100 hover:bg-orange-400/40'
              }`}
            >
              {isAllComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              {completedCount}/{totalRequired}
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* CPL Status */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
              selectedCPLs.length > 0 
                ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                : 'bg-red-400/20 text-red-300 border border-red-400/30'
            }`}>
              {selectedCPLs.length > 0 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {selectedCPLs.length > 0 ? `${selectedCPLs.length} CPL` : 'Belum ada CPL'}
            </span>

            {/* Sub-CPMK Progress */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
              filledSubCpmkCount === subCpmkCount && subCpmkCount > 0
                ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                : 'bg-orange-400/20 text-orange-300 border border-orange-400/30'
            }`}>
              {filledSubCpmkCount === subCpmkCount && subCpmkCount > 0 ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
              {filledSubCpmkCount}/{subCpmkCount} Sub
            </span>
          </div>

          {/* Progress Bar (Mobile) */}
          <div className="sm:hidden w-full">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isAllComplete ? 'bg-green-300' : 'bg-gradient-to-r from-green-400 to-emerald-400'}`}
                style={{ width: `${(completedCount / totalRequired) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Dropdown */}
        {showChecklist && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-xs font-semibold mb-2 flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Checklist {cpmk.code}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklistItems.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                    item.completed 
                      ? 'bg-green-500/20 text-green-200' 
                      : 'bg-red-500/20 text-red-200'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{item.label}</span>
                  {item.required && !item.completed && (
                    <span className="ml-auto text-[10px] bg-red-500/30 px-1.5 py-0.5 rounded">Wajib</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deskripsi CPMK - Clean Input */}
      <div className="p-4 border-b bg-white">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">1</span>
          Deskripsi CPMK
        </label>
        <textarea
          value={cpmk.description}
          onChange={(e) => onChange({ ...cpmk, description: e.target.value })}
          placeholder="Masukkan deskripsi CPMK atau gunakan AI untuk generate..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows={2}
        />
      </div>

      {/* CPL Mapping Section - Collapsible */}
      <div className="border-b">
        <button
          onClick={() => setShowCPLPanel(!showCPLPanel)}
          className={`w-full p-3 flex items-center justify-between transition-colors ${
            selectedCPLs.length > 0 
              ? 'bg-green-50 hover:bg-green-100' 
              : 'bg-red-50 hover:bg-red-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">2</span>
            <span className={`font-semibold ${selectedCPLs.length > 0 ? 'text-green-800' : 'text-red-800'}`}>
              Mapping CPL
            </span>
            {selectedCPLs.length === 0 ? (
              <span className="text-xs px-2 py-0.5 bg-red-200 text-red-700 rounded-full animate-pulse">⚠ Wajib</span>
            ) : (
              <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">{selectedCPLs.join(', ')}</span>
            )}
          </div>
          {showCPLPanel ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}
        </button>

        {showCPLPanel && (
          <div className="p-4 bg-green-50/50 space-y-3">
            {/* AI Match Button */}
            <button
              onClick={handleAIMatch}
              disabled={matching || !cpmk.description}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {matching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>🎯 Auto Match CPL dengan AI</span>
                </>
              )}
            </button>

            {/* CPL Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {allCPLs.map((cpl) => {
                const isSelected = selectedCPLs.includes(cpl.kode_cpl);
                const match = matches.find(m => m.kode_cpl === cpl.kode_cpl);
                
                return (
                  <button
                    key={cpl.kode_cpl}
                    onClick={() => toggleCPLSelection(cpl.kode_cpl)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      isSelected 
                        ? 'border-green-500 bg-green-100 ring-2 ring-green-300' 
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{cpl.kode_cpl}</span>
                      {match && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getScoreColor(match.score)}`}>
                          {match.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{cpl.deskripsi}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sub-CPMK Section - Enhanced UI */}
      <div>
        <button
          onClick={() => setShowSubCpmkPanel(!showSubCpmkPanel)}
          className={`w-full p-3 flex items-center justify-between transition-colors ${
            filledSubCpmkCount === subCpmkCount && subCpmkCount > 0
              ? 'bg-purple-50 hover:bg-purple-100'
              : 'bg-orange-50 hover:bg-orange-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">3</span>
            <span className={`font-semibold ${filledSubCpmkCount === subCpmkCount && subCpmkCount > 0 ? 'text-purple-800' : 'text-orange-800'}`}>
              Sub-CPMK
            </span>
            {/* Progress Badge */}
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
              filledSubCpmkCount === subCpmkCount && subCpmkCount > 0
                ? 'bg-green-200 text-green-800'
                : filledSubCpmkCount > 0
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-red-200 text-red-800'
            }`}>
              {filledSubCpmkCount === subCpmkCount && subCpmkCount > 0 ? '✓' : '○'} {filledSubCpmkCount}/{subCpmkCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini Progress Bar */}
            <div className="hidden sm:block w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {showSubCpmkPanel ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-purple-600" />}
          </div>
        </button>

        {showSubCpmkPanel && (
          <div className="p-4 bg-gradient-to-b from-purple-50/50 to-white space-y-4">
            {/* Control Bar - Add/Remove & Generate All */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border-2 border-purple-100 shadow-sm">
              {/* Quantity Control */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={handleRemoveSubCpmk}
                    disabled={subCpmkCount <= 0}
                    className="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-white transition-colors shadow-sm"
                    title="Kurangi Sub-CPMK"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-purple-700">{subCpmkCount}</span>
                  <button
                    onClick={handleAddSubCpmk}
                    disabled={(formData.subCpmk?.length || 0) >= 14}
                    className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-30 disabled:hover:bg-white transition-colors shadow-sm"
                    title="Tambah Sub-CPMK"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  (maks 14)
                </span>
              </div>

              {/* Generate All Button */}
              {userRole !== 'dosen' && subCpmkCount > 0 && (
                <button
                  onClick={handleGenerateAllSubCpmk}
                  disabled={generatingAllSubs || !cpmk.description}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-pink-600 transition-all font-semibold shadow-md hover:shadow-lg"
                  title="Generate semua Sub-CPMK dengan AI"
                >
                  {generatingAllSubs ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>✨ Generate Semua AI</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Sub-CPMK List - Enhanced Cards */}
            {subCpmksForThisCpmk.length > 0 ? (
              <div className="space-y-3">
                {subCpmksForThisCpmk.map((subCpmk, subIndex) => {
                  const isGenerating = generatingSubCpmk && generatingSubIndex === subIndex;
                  const isFilled = subCpmk.description && subCpmk.description.trim();
                  
                  return (
                    <div 
                      key={subCpmk.code}
                      className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        isGenerating
                          ? 'border-purple-400 bg-purple-50 animate-pulse'
                          : isFilled
                            ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50'
                            : subCpmk.fromDB
                              ? 'border-blue-200 bg-blue-50/30'
                              : 'border-gray-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      {/* Loading Indicator */}
                      {isGenerating && (
                        <div className="absolute inset-0 bg-purple-500/10 rounded-xl flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
                            <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
                            <span className="text-sm font-medium text-purple-700">Generating...</span>
                          </div>
                        </div>
                      )}

                      {/* Success Checkmark - Top Right */}
                      {isFilled && !isGenerating && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-start gap-3">
                        {/* Sub-CPMK Info Badge */}
                        <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 sm:min-w-[110px]">
                          <span className={`font-bold text-sm px-2 py-1 rounded-lg ${
                            isFilled 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {subCpmk.code}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium" title={`Bobot presisi: ${formatBobotFull(SUB_CPMK_BOBOT)}%`}>
                            {formatBobotShort(SUB_CPMK_BOBOT)}%
                          </span>
                          {subCpmk.fromDB && (
                            <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              Saved
                            </span>
                          )}
                        </div>
                        
                        {/* Textarea */}
                        <div className="flex-1 w-full relative">
                          <textarea
                            value={subCpmk.description}
                            onChange={(e) => updateSubCpmkDescription(subCpmk.code, e.target.value)}
                            placeholder={`Deskripsi ${subCpmk.code}... (kemampuan spesifik yang harus dicapai)`}
                            className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all ${
                              isFilled ? 'border-green-300 bg-white' : 'border-gray-200'
                            }`}
                            rows={2}
                            disabled={isGenerating}
                          />
                          {isFilled && (
                            <div className="absolute bottom-2 right-2 text-green-500">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        
                        {/* AI Generate Button */}
                        {userRole !== 'dosen' && (
                          <button
                            onClick={() => handleGenerateSubCpmk(subIndex)}
                            disabled={generatingSubCpmk || !cpmk.description}
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all shadow-md ${
                              isGenerating 
                                ? 'bg-purple-400 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50'
                            }`}
                            title="Generate dengan AI"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-purple-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ListChecks className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-600 font-medium">Belum ada Sub-CPMK</p>
                <p className="text-sm text-gray-500 mt-1">Klik tombol + untuk menambah Sub-CPMK</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Footer - Clean & Informative */}
      <div className="p-4 bg-gradient-to-r from-slate-100 to-gray-100 border-t">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <ListChecks className="w-3.5 h-3.5 text-purple-700" />
              </span>
              <span className="text-gray-700">
                <span className="font-semibold">{filledSubCpmkCount}/{subCpmkCount}</span> Sub-CPMK
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-green-700" />
              </span>
              <span className="text-gray-700">
                {selectedCPLs.length > 0 ? (
                  <span className="font-semibold">{selectedCPLs.join(', ')}</span>
                ) : (
                  <span className="text-red-500 font-medium">Belum pilih CPL</span>
                )}
              </span>
            </div>
          </div>
          
          {/* Right: Status Badge */}
          <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-md ${
            isAllComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse'
          }`}>
            {isAllComplete ? (
              <>
                <Award className="w-5 h-5" />
                <span>✓ Selesai!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Belum Lengkap</span>
              </>
            )}
          </div>
        </div>

        {/* Alert untuk item yang belum selesai */}
        {!isAllComplete && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800 mb-1">⚠️ Langkah yang belum diselesaikan:</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  {checklistItems.filter(item => !item.completed).map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span>{item.label}</span>
                      {item.required && <span className="text-red-600 font-medium">(Wajib)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isAllComplete && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">🎉 {cpmk.code} Sudah Lengkap!</p>
                <p className="text-xs text-green-600">Semua langkah telah diselesaikan dengan baik.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
