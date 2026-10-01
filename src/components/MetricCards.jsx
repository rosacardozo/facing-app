import React from 'react';
import { 
  BarChart2, 
  Store, 
  Route, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export default function MetricCards({ metrics }) {
  const {
    tunalCount,
    compCount,
    totalCount,
    totalSucursales,
    totalRutas,
    prodsTunal,
    prodsComp,
    ratio,
    shareTunal,
    shareComp
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Muestras El Tunal */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Muestras El Tunal
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {shareTunal}% del total
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {tunalCount.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">registros</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${shareTunal}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Portafolio propio:</span>
          <span className="font-semibold text-slate-200">{prodsTunal} SKUs auditados</span>
        </div>
      </div>

      {/* 2. Muestras Competencia */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm group hover:border-sky-500/50 transition-all">
        <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Muestras Competencia
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
            {shareComp}% del total
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {compCount.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">registros</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${shareComp}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Marcas competidoras:</span>
          <span className="font-semibold text-slate-200">{prodsComp} SKUs comparados</span>
        </div>
      </div>

      {/* 3. Universo Total de Muestras */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            Universo Muestral Activo
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Ratio {ratio}:1
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">muestras</span>
        </div>

        {/* Dual Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 flex overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${shareTunal}%` }} 
            title={`El Tunal: ${shareTunal}%`}
          />
          <div 
            className="bg-sky-500 h-full transition-all duration-500" 
            style={{ width: `${shareComp}%` }} 
            title={`Competencia: ${shareComp}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">● Tunal {shareTunal}%</span>
          <span className="flex items-center gap-1 text-sky-400 font-medium">● Comp {shareComp}%</span>
        </div>
      </div>

      {/* 4. Cobertura Geográfica y Comercial */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-purple-400" />
            Puntos de Venta Auditados
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Auditadas
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {totalSucursales.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">sucursales</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: '100%' }} 
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>{totalRutas.toLocaleString()} rutas activas registradas.</span>
        </div>
      </div>

    </div>
  );
}
