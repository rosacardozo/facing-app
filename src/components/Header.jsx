import React from 'react';
import { Database, RefreshCw } from 'lucide-react';

export default function Header({ 
  totalRecords, 
  filteredRecords, 
  onResetFilters 
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <span className="text-white font-extrabold text-xl tracking-wider">ET</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  EL TUNAL <span className="text-emerald-400 font-medium">| Facing & Presencia en Anaquel</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v2.0 Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitoreo de Facing en 6 Categorías Oficiales respaldado por muestras de campo
              </p>
            </div>
          </div>

          {/* Action Tools & Stats Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Record count badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Muestras activas:</span>
              <span className="font-bold text-white tracking-wide">
                {filteredRecords.toLocaleString()} 
                <span className="text-slate-500 font-normal"> / {totalRecords.toLocaleString()}</span>
              </span>
            </div>

            {/* Reset button */}
            <button
              id="btn-reset-header"
              onClick={onResetFilters}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-all"
              title="Restablecer todos los filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
