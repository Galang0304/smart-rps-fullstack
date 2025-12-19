import React, { useState, useEffect } from 'react';
import { Bot, Loader2, CheckCircle, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { aiHelperAPI, cplAPI } from '../services/api';

export default function CPMKWithCPLMapping({ cpmk, cpmkIndex, course, onChange, cpmkBobot = 0, totalCpmk = 0 }) {
  const [allCPLs, setAllCPLs] = useState([]);
  const [loadingCPLs, setLoadingCPLs] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedCPLs, setSelectedCPLs] = useState(cpmk.selected_cpls || []);
  const [showCPLPanel, setShowCPLPanel] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const prodiId = localStorage.getItem('prodi_id');

  // Sync selectedCPLs when cpmk.selected_cpls changes from parent
  useEffect(() => {
    if (cpmk.selected_cpls) {
      setSelectedCPLs(cpmk.selected_cpls);
      // If there are selected CPLs and matches, show the panel
      if (cpmk.selected_cpls.length > 0 && cpmk.ai_matches) {
        setMatches(cpmk.ai_matches);
        setShowCPLPanel(true);
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

        // Auto-select CPL dengan score >= 80
        const autoSelected = res.data.matches
          .filter(m => m.recommended)
          .map(m => m.kode_cpl);
        
        if (autoSelected.length > 0) {
          setSelectedCPLs(autoSelected);
          onChange({
            ...cpmk,
            selected_cpls: autoSelected,
            ai_matches: res.data.matches,
          });
        }

        alert(`✅ AI menemukan ${res.data.matched_cpl} CPL yang selaras!\n\n${res.data.recommendation}`);
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-3">
      {/* CPMK Description */}
      <div className="flex items-start gap-2">
        <span className="inline-block px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg text-sm flex-shrink-0">
          {cpmk.code}
        </span>
        {/* Show bobot from database OR calculate from total CPMK for RPS */}
        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded whitespace-nowrap">
          Bobot: {cpmkBobot > 0 
            ? parseFloat(cpmkBobot).toFixed(2) 
            : totalCpmk > 0 
              ? (100 / totalCpmk).toFixed(2) 
              : '0.00'}%
        </span>
        <textarea
          value={cpmk.description}
          onChange={(e) => onChange({ ...cpmk, description: e.target.value })}
          placeholder="Masukkan deskripsi CPMK..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* AI Match Button & Selected CPLs Info */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          {selectedCPLs.length === 0 ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Wajib pilih minimal 1 CPL</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedCPLs.length} CPL dipilih:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCPLs.map((kodeCPL) => {
                  const cplData = allCPLs.find(c => c.kode_cpl === kodeCPL);
                  const matchData = matches.find(m => m.kode_cpl === kodeCPL);
                  return (
                    <span
                      key={kodeCPL}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        matchData?.recommended 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}
                      title={cplData?.deskripsi || kodeCPL}
                    >
                      {kodeCPL}
                      {matchData?.score && (
                        <span className="opacity-75">({matchData.score})</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Show/Hide Results Button */}
          {(matches.length > 0 || selectedCPLs.length > 0) && (
            <button
              onClick={() => setShowCPLPanel(!showCPLPanel)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
            >
              {showCPLPanel ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Sembunyikan</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Lihat Detail</span>
                </>
              )}
            </button>
          )}
          
          {/* AI Match Button */}
          <button
            onClick={handleAIMatch}
            disabled={matching || !cpmk.description || loadingCPLs}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
            title="AI akan menganalisis CPMK dan mencari CPL yang selaras"
          >
            {matching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Matching...</span>
              </>
            ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>AI Match CPL</span>
            </>
          )}
        </button>
        </div>
      </div>

      {/* CPL Selection Panel - Always available to show/hide */}
      {showCPLPanel && (
        <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900">
                Pilih CPL yang Selaras ({selectedCPLs.length} dipilih)
              </span>
              {matches.length > 0 && (
                <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded-full">
                  {matches.length} AI Suggestions
                </span>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto bg-white">
              {/* AI Recommendation */}
              {recommendation && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <strong className="font-semibold">💡 Rekomendasi AI:</strong> {recommendation}
                  </p>
                </div>
              )}

              {loadingCPLs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : allCPLs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada data CPL untuk prodi ini.</p>
                  <p className="text-sm mt-2">Hubungi admin untuk menambahkan CPL.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Show AI matches first */}
                  {matches.length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-gray-700 mb-2">🤖 Rekomendasi AI (Score Tinggi):</p>
                      {matches.map((match) => (
                        <div
                          key={match.kode_cpl}
                          onClick={() => toggleCPLSelection(match.kode_cpl)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedCPLs.includes(match.kode_cpl)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-blue-700">{match.kode_cpl}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getScoreColor(match.score)}`}>
                                  Score: {match.score}
                                </span>
                                {match.recommended && (
                                  <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full font-semibold">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{match.komponen}</p>
                              <p className="text-sm text-gray-800 mb-2">{match.cpl}</p>
                              <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-200">
                                <strong>Alasan:</strong> {match.reason}
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedCPLs.includes(match.kode_cpl)}
                              onChange={() => {}}
                              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1"
                            />
                          </div>
                        </div>
                      ))}
                      
                      <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">📋 Semua CPL Lainnya:</p>
                    </>
                  )}

                  {/* Show all CPLs */}
                  {allCPLs
                    .filter(cpl => !matches.some(m => m.kode_cpl === cpl.kode_cpl))
                    .map((cpl) => (
                      <div
                        key={cpl.id}
                        onClick={() => toggleCPLSelection(cpl.kode_cpl)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedCPLs.includes(cpl.kode_cpl)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-blue-700">{cpl.kode_cpl}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{cpl.komponen}</p>
                            <p className="text-sm text-gray-800">{cpl.cpl}</p>
                            {cpl.indikators && cpl.indikators.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 font-semibold">Indikator Kerja:</p>
                                <ul className="text-xs text-gray-600 list-disc list-inside">
                                  {cpl.indikators.slice(0, 2).map((ind, idx) => (
                                    <li key={idx}>{ind.indikator_kerja}</li>
                                  ))}
                                  {cpl.indikators.length > 2 && (
                                    <li className="text-gray-400">+{cpl.indikators.length - 2} lainnya...</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedCPLs.includes(cpl.kode_cpl)}
                            onChange={() => {}}
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
        </div>
      )}

      {/* Warning if no CPL selected */}
      {selectedCPLs.length === 0 && cpmk.description && !showCPLPanel && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">CPMK harus selaras dengan minimal 1 CPL</p>
            <p className="mt-1">Klik "AI Match CPL" untuk mendapatkan rekomendasi otomatis, atau pilih manual dari daftar CPL.</p>
          </div>
        </div>
      )}
    </div>
  );
}
