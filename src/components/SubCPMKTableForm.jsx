import React, { useState } from 'react';
import { Bot, Loader2, Save, Database, AlertCircle } from 'lucide-react';

export default function SubCPMKTableForm({ 
  subCpmks = [], 
  onUpdate, 
  onGenerateAI,
  onSaveToDB,
  generating = false,
  saving = false,
  hasDBCpmk = false 
}) {
  const [editMode, setEditMode] = useState({});
  
  // Pastikan array berisi 16 item
  const rows = Array.from({ length: 16 }, (_, i) => {
    const existing = subCpmks.find(s => s.sub_cpmk_number === i + 1);
    return existing || {
      sub_cpmk_number: i + 1,
      description: '',
      fromDB: false
    };
  });

  const handleDescriptionChange = (index, value) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      description: value,
      fromDB: false // Mark as modified if from DB
    };
    onUpdate(updated);
  };

  const handleGenerateRow = (index) => {
    if (onGenerateAI) {
      onGenerateAI(index);
    }
  };

  const isUTSorUAS = (number) => number === 8 || number === 16;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Form Sub-CPMK (16 Pertemuan)</h3>
            <p className="text-sm text-gray-600">Isi deskripsi Sub-CPMK untuk 16 minggu pembelajaran</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGenerateAI}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Generate AI</span>
              </>
            )}
          </button>
          {onSaveToDB && (
            <button
              onClick={onSaveToDB}
              disabled={saving || rows.every(r => r.fromDB)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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
      </div>

      {/* Info Alert */}
      {hasDBCpmk && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Database className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium">Sub-CPMK dari Database</p>
            <p className="text-green-700">Data Sub-CPMK sudah tersedia di database. Anda dapat mengedit atau menggunakan AI untuk regenerasi.</p>
          </div>
        </div>
      )}

      {/* Table Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                  Minggu
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                  Sub-CPMK
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Deskripsi Kemampuan Akhir
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                  AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row, index) => {
                const weekNumber = row.sub_cpmk_number;
                const isExam = isUTSorUAS(weekNumber);
                const examLabel = weekNumber === 8 ? 'UTS' : weekNumber === 16 ? 'UAS' : '';
                
                return (
                  <tr 
                    key={index} 
                    className={`
                      ${isExam ? 'bg-yellow-50' : 'hover:bg-gray-50'} 
                      ${row.fromDB ? 'bg-green-50/30' : ''}
                      transition-colors
                    `}
                  >
                    {/* Week Number */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center">
                        <span className={`
                          text-sm font-bold
                          ${isExam ? 'text-orange-600' : 'text-gray-700'}
                        `}>
                          {weekNumber}
                        </span>
                        {examLabel && (
                          <span className="text-xs font-semibold text-orange-600 mt-1">
                            {examLabel}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Sub-CPMK Code */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-purple-600">
                          Sub-CPMK-{weekNumber}
                        </span>
                        {isExam && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full inline-block w-fit">
                            Evaluasi
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Description */}
                    <td className="px-4 py-3">
                      {isExam ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-yellow-100 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">
                            {weekNumber === 8 ? 'Ujian Tengah Semester' : 'Ujian Akhir Semester'}
                          </span>
                        </div>
                      ) : (
                        <textarea
                          value={row.description}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          placeholder={`Masukkan kemampuan akhir yang diharapkan untuk pertemuan ${weekNumber}...`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          rows={3}
                        />
                      )}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-4 py-3 text-center">
                      {row.fromDB && !isExam && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Database className="w-3 h-3" />
                          Database
                        </span>
                      )}
                      {!row.fromDB && row.description && !isExam && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          ✏️ Manual
                        </span>
                      )}
                      {isExam && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          📝 Ujian
                        </span>
                      )}
                    </td>
                    
                    {/* AI Button */}
                    <td className="px-4 py-3 text-center">
                      {!isExam && (
                        <button
                          onClick={() => handleGenerateRow(index)}
                          disabled={generating}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
                          title="Generate dengan AI"
                        >
                          {generating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-700">
              Database: <strong>{rows.filter(r => r.fromDB).length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700">
              Manual: <strong>{rows.filter(r => !r.fromDB && r.description && !isUTSorUAS(r.sub_cpmk_number)).length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-gray-700">
              Ujian: <strong>2</strong> (UTS & UAS)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="text-gray-700">
              Kosong: <strong>{rows.filter(r => !r.description && !isUTSorUAS(r.sub_cpmk_number)).length}</strong>
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Total: <strong className="text-gray-900">16 Pertemuan</strong> (14 materi + 2 ujian)
        </div>
      </div>
    </div>
  );
}
