import React from 'react';
import { Filter, Search, RotateCcw, Building2, MapPin, Tag, CheckSquare, Square } from 'lucide-react';
import { CATEGORY_STRUCTURE } from '../data/categoryStructure';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  sucursalesOptions,
  rutasOptions,
  competitorBrandOptions,
  onlyComparable,
  onToggleComparable
}) {
  const categories = Object.keys(CATEGORY_STRUCTURE);
  
  // Subcategorías disponibles según la categoría seleccionada
  let availableSubcategories = [];
  if (filters.category && filters.category !== 'all' && CATEGORY_STRUCTURE[filters.category]) {
    availableSubcategories = CATEGORY_STRUCTURE[filters.category].subcategories;
  } else {
    // Si están todas seleccionadas, combinar todas las subcategorías oficiales
    const allSubs = new Set();
    Object.values(CATEGORY_STRUCTURE).forEach(cat => {
      cat.subcategories.forEach(sub => allSubs.add(sub));
    });
    availableSubcategories = Array.from(allSubs).sort();
  }

  // Contar cuántos filtros están activos (distintos de 'all' o vacíos)
  const activeFiltersCount = [
    filters.category !== 'all' ? 1 : 0,
    filters.subcategory !== 'all' ? 1 : 0,
    filters.sucCliente !== 'all' ? 1 : 0,
    filters.ruta !== 'all' ? 1 : 0,
    filters.competitorBrand !== 'all' ? 1 : 0,
    onlyComparable ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col gap-3.5">
        
        {/* Header row of filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Filtros de Análisis Multidimensional
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Only Comparable */}
            <button
              id="btn-toggle-comparable"
              onClick={onToggleComparable}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                onlyComparable 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-300'
              }`}
              title="Filtrar solo productos que tienen precio registrado tanto en El Tunal como en Competencia"
            >
              {onlyComparable ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
              <span>Solo Pares Homólogos</span>
            </button>

            {/* Reset Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                id="btn-reset-filters"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Categoría */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-400" />
              Categoría Oficial
            </label>
            <select
              id="select-categoria"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">Todas las Categorías (6)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 2. Subcategoría */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Subcategoría
            </label>
            <select
              id="select-subcategoria"
              value={filters.subcategory}
              onChange={(e) => onFilterChange('subcategory', e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">Todas las Subcategorías</option>
              {availableSubcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* 3. Sucursal (SucCliente) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-sky-400" />
              Sucursal (SucCliente)
            </label>
            <select
              id="select-sucursal"
              value={filters.sucCliente}
              onChange={(e) => onFilterChange('sucCliente', e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer truncate"
            >
              <option value="all">Todas las Sucursales ({sucursalesOptions.length})</option>
              {sucursalesOptions.map(suc => (
                <option key={suc} value={suc}>{suc}</option>
              ))}
            </select>
          </div>

          {/* 4. Ruta */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              Ruta
            </label>
            <select
              id="select-ruta"
              value={filters.ruta}
              onChange={(e) => onFilterChange('ruta', e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer truncate"
            >
              <option value="all">Todas las Rutas ({rutasOptions.length})</option>
              {rutasOptions.map(ruta => (
                <option key={ruta} value={ruta}>{ruta}</option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}
