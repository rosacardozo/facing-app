import React, { useState } from 'react';
import { X, BookOpen, Search, CheckCircle, ExternalLink } from 'lucide-react';

export default function CatalogModal({ isOpen, onClose, catalog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('all');

  if (!isOpen) return null;

  const sheets = Array.from(new Set(catalog.map(c => c.sheet))).filter(Boolean);

  const filteredCatalog = catalog.filter(item => {
    if (selectedSheet !== 'all' && item.sheet !== selectedSheet) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        item.descripcion.toLowerCase().includes(q) ||
        item.codigo.toLowerCase().includes(q) ||
        item.marca.toLowerCase().includes(q) ||
        item.subcategoria.toLowerCase().includes(q) ||
        item.competidores.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Catálogo Maestro Oficial & Competencia</h3>
            <p className="text-xs text-slate-400">
              Mapeo de las 6 categorías extraído del archivo Portafolio y Competencia (1).xlsx ({catalog.length} SKUs oficiales)
            </p>
          </div>
        </div>

        {/* Filter controls inside modal */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por código, producto, marca o competidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedSheet('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSheet === 'all' 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({catalog.length})
            </button>
            {sheets.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSheet(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSheet === s 
                    ? 'bg-emerald-600 text-white font-semibold' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Categoría / Subcategoría</th>
                <th className="py-2.5 px-3">Marca Oficial</th>
                <th className="py-2.5 px-3">Descripción Producto</th>
                <th className="py-2.5 px-3">Principales Competidores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No se encontraron productos en el catálogo.
                  </td>
                </tr>
              ) : (
                filteredCatalog.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-mono text-emerald-400 font-bold">
                      {item.codigo || '—'}
                    </td>
                    <td className="py-2 px-3">
                      <div className="text-white">{item.categoria}</div>
                      <div className="text-[10px] text-slate-500">{item.subcategoria}</div>
                    </td>
                    <td className="py-2 px-3 text-slate-200">
                      {item.marca}
                    </td>
                    <td className="py-2 px-3 text-white font-medium">
                      {item.descripcion}
                    </td>
                    <td className="py-2 px-3 text-sky-400">
                      {item.competidores || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>Mostrando {filteredCatalog.length} de {catalog.length} SKUs oficiales</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
