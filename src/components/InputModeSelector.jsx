import React, { useState } from 'react';
import { Bot, Database, PenLine, Loader2, CheckCircle } from 'lucide-react';

/**
 * InputModeSelector - Komponen untuk memilih mode input data
 * Options: Manual, Database, AI
 */
export default function InputModeSelector({ 
  onModeSelect, 
  onGenerate, 
  onLoadFromDB,
  loading = false, 
  hasDBData = false,
  currentMode = null,
  label = "Pilih Metode Input"
}) {
  const modes = [
    {
      id: 'manual',
      label: 'Input Manual',
      description: 'Isi data secara manual',
      icon: PenLine,
      color: 'blue',
      action: () => onModeSelect?.('manual'),
    },
    {
      id: 'database',
      label: 'Dari Database',
      description: hasDBData ? 'Data tersedia' : 'Tidak ada data',
      icon: Database,
      color: hasDBData ? 'green' : 'gray',
      disabled: !hasDBData,
      action: () => onLoadFromDB?.(),
    },
    {
      id: 'ai',
      label: 'Generate AI',
      description: 'Buat dengan Gemini AI',
      icon: Bot,
      color: 'purple',
      action: () => onGenerate?.(),
    },
  ];

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          const isDisabled = mode.disabled || loading;
          
          const colorClasses = {
            blue: 'border-blue-500 bg-blue-50 text-blue-700',
            green: 'border-green-500 bg-green-50 text-green-700',
            purple: 'border-purple-500 bg-purple-50 text-purple-700',
            gray: 'border-gray-300 bg-gray-50 text-gray-400',
          };
          
          const hoverClasses = {
            blue: 'hover:border-blue-400 hover:bg-blue-50',
            green: 'hover:border-green-400 hover:bg-green-50',
            purple: 'hover:border-purple-400 hover:bg-purple-50',
            gray: '',
          };

          return (
            <button
              key={mode.id}
              onClick={mode.action}
              disabled={isDisabled}
              className={`
                relative p-4 border-2 rounded-lg text-left transition-all
                ${isActive ? colorClasses[mode.color] : 'border-gray-200 bg-white'}
                ${!isDisabled && !isActive ? hoverClasses[mode.color] : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isActive && (
                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-500" />
              )}
              <div className="flex items-center gap-3">
                {loading && currentMode === mode.id ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? '' : 'text-gray-500'}`} />
                )}
                <div>
                  <p className="font-medium">{mode.label}</p>
                  <p className="text-xs text-gray-500">{mode.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
