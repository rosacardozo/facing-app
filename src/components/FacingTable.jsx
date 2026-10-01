import React, { useState, useMemo } from 'react';
import { 
  Table, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Download, 
  Layers, 
  Store, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { exportToCSV } from '../utils/dataProcessor';

export default function FacingTable({
  productComparisons,
  rawTunalRecords,
  rawCompRecords
}) {
  const [activeTab, setActiveTab] = useState('comparative'); // 'comparative' | 'detailed' | 'sucursales'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('totalMuestras');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Manejo de ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 1. Datos para Tab Comparativa
  const filteredComparativeData = useMemo(() => {
    let result = [...productComparisons];
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.categoria.toLowerCase().includes(q) ||
        item.subcategoria.toLowerCase().includes(q) ||
        item.presentacion.toLowerCase().includes(q) ||
        item.tunalProductos.toLowerCase().includes(q) ||
        item.compProductos.toLowerCase().includes(q) ||
        item.compMarcas.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal === null || aVal === undefined) aVal = -999999;
      if (bVal === null || bVal === undefined) bVal = -999999;
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [productComparisons, searchTerm, sortField, sortDirection]);

  // 2. Datos para Tab Detallado Registro a Registro (combinando Tunal y Competencia)
  const combinedRawRecords = useMemo(() => {
    const combined = [
      ...rawTunalRecords.map(r => ({ ...r, origenBadge: 'El Tunal' })),
      ...rawCompRecords.map(r => ({ ...r, origenBadge: 'Competencia' }))
    ];

    let result = combined;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => 
        (r.producto || '').toLowerCase().includes(q) ||
        (r.marca || '').toLowerCase().includes(q) ||
        (r.sucCliente || '').toLowerCase().includes(q) ||
        (r.ruta || '').toLowerCase().includes(q) ||
        (r.subcategoria || '').toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal === undefined) aVal = '';
      if (bVal === undefined) bVal = '';
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [rawTunalRecords, rawCompRecords, searchTerm, sortField, sortDirection]);

  // 3. Datos para Tab Sucursales Auditadas
  const sucursalesBreakdown = useMemo(() => {
    const map = {};

    rawTunalRecords.forEach(r => {
      const suc = r.sucCliente || 'Sin Sucursal';
      if (!map[suc]) {
        map[suc] = { sucursal: suc, ruta: r.ruta, tunalMuestras: 0, compMuestras: 0, totalMuestras: 0 };
      }
      map[suc].tunalMuestras += 1;
    });

    rawCompRecords.forEach(r => {
      const suc = r.sucCliente || 'Sin Sucursal';
      if (!map[suc]) {
        map[suc] = { sucursal: suc, ruta: r.ruta, tunalMuestras: 0, compMuestras: 0, totalMuestras: 0 };
      }
      map[suc].compMuestras += 1;
    });

    let list = Object.values(map).map(item => ({
      ...item,
      totalMuestras: item.tunalMuestras + item.compMuestras,
      shareTunal: ((item.tunalMuestras / (item.tunalMuestras + item.compMuestras)) * 100).toFixed(0)
    }));

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.sucursal.toLowerCase().includes(q) ||
        item.ruta.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let aVal = a[sortField] ?? a.totalMuestras;
      let bVal = b[sortField] ?? b.totalMuestras;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [rawTunalRecords, rawCompRecords, searchTerm, sortField, sortDirection]);

  // Paginación activa
  const activeDataset = activeTab === 'comparative' 
    ? filteredComparativeData 
    : activeTab === 'detailed' 
    ? combinedRawRecords 
    : sucursalesBreakdown;

  const totalPages = Math.ceil(activeDataset.length / pageSize) || 1;
  const paginatedData = activeDataset.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Exportar la vista actual
  const handleExportTable = () => {
    if (activeTab === 'comparative') {
      const exportData = filteredComparativeData.map(item => ({
        'Categoría': item.categoria,
        'Subcategoría': item.subcategoria,
        'Presentación': item.presentacion,
        'Productos El Tunal': item.tunalProductos,
        'Muestras El Tunal': item.tunalMuestras,
        'Caras Tunal': item.tunalCaras,
        'Productos Competencia': item.compProductos,
        'Marcas Competencia': item.compMarcas,
        'Muestras Competencia': item.compMuestras,
        'Caras Comp': item.compCaras,
        'Diferencia Caras': item.diffCaras !== null ? item.diffCaras : 'N/A',
        'Estado Competitivo': item.status,
        'Total Muestras': item.totalMuestras
      }));
      exportToCSV(exportData, 'benchmark_facing_el_tunal.csv');
    } else if (activeTab === 'detailed') {
      const exportData = combinedRawRecords.map(r => ({
        'Origen': r.origenBadge,
        'ID': r.idDC,
        'Fecha': r.fecha,
        'Ruta': r.ruta,
        'Sucursal': r.sucCliente,
        'Categoría': r.categoria,
        'Subcategoría': r.subcategoria,
        'Producto': r.producto,
        'Marca': r.marca,
        'Presentación': r.presentacion,
        'Caras (Facing)': r.caras
      }));
      exportToCSV(exportData, 'registros_detallados_facing.csv');
    } else {
      const exportData = sucursalesBreakdown.map(s => ({
        'Sucursal (SucCliente)': s.sucursal,
        'Ruta': s.ruta,
        'Muestras El Tunal': s.tunalMuestras,
        'Muestras Competencia': s.compMuestras,
        'Total Muestras': s.totalMuestras,
        '% Muestras El Tunal': `${s.shareTunal}%`
      }));
      exportToCSV(exportData, 'auditoria_por_sucursal.csv');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-500 inline ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-emerald-400 inline ml-1" /> 
      : <ArrowDown className="w-3 h-3 text-emerald-400 inline ml-1" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      
      {/* Header and Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            Tabla Detallada y Filtrable de Caras en Anaquel
          </h2>
          <p className="text-xs text-slate-400">
            Desglose analítico con número exacto de registros y muestras por producto, marca y sucursal
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              id="tab-table-comparative"
              onClick={() => { setActiveTab('comparative'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'comparative' 
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Benchmark Homólogo ({filteredComparativeData.length})
            </button>
            <button
              id="tab-table-detailed"
              onClick={() => { setActiveTab('detailed'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'detailed' 
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Registros de Facing ({combinedRawRecords.length})
            </button>
            <button
              id="tab-table-sucursales"
              onClick={() => { setActiveTab('sucursales'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'sucursales' 
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Por Sucursal ({sucursalesBreakdown.length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Toolbar (Search & Page size) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Filtrar en esta tabla..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span>Mostrando {paginatedData.length} de {activeDataset.length} registros</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
          >
            <option value={10}>10 / pág</option>
            <option value={15}>15 / pág</option>
            <option value={25}>25 / pág</option>
            <option value={50}>50 / pág</option>
          </select>
        </div>
      </div>

      {/* TABLE 1: BENCHMARK COMPARATIVO HOMÓLOGO */}
      {activeTab === 'comparative' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('categoria')}>
                  Categoría / Subcategoría <SortIcon field="categoria" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('presentacion')}>
                  Presentación <SortIcon field="presentacion" />
                </th>
                <th className="py-3 px-3 text-emerald-400 font-bold cursor-pointer hover:text-emerald-300" onClick={() => handleSort('tunalMuestras')}>
                  Muestras Tunal <SortIcon field="tunalMuestras" />
                </th>
                <th className="py-3 px-3 text-emerald-400 font-bold cursor-pointer hover:text-emerald-300" onClick={() => handleSort('tunalCaras')}>
                  Prom. Caras Tunal <SortIcon field="tunalCaras" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('compMarcas')}>
                  Competencia (Marcas) <SortIcon field="compMarcas" />
                </th>
                <th className="py-3 px-3 text-sky-400 font-bold cursor-pointer hover:text-sky-300" onClick={() => handleSort('compMuestras')}>
                  Muestras Comp <SortIcon field="compMuestras" />
                </th>
                <th className="py-3 px-3 text-sky-400 font-bold cursor-pointer hover:text-sky-300" onClick={() => handleSort('compCaras')}>
                  Prom. Caras Comp <SortIcon field="compCaras" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('diffCaras')}>
                  Brecha Caras <SortIcon field="diffCaras" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('totalMuestras')}>
                  Total Muestras <SortIcon field="totalMuestras" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.key} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Categoría / Subcategoría */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{row.subcategoria}</div>
                      <div className="text-[10px] text-slate-500">{row.categoria}</div>
                    </td>

                    {/* Presentación */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60">
                        {row.presentacion}
                      </span>
                    </td>

                    {/* Muestras Tunal */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="font-bold text-emerald-400">{row.tunalMuestras.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">muestras</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={row.tunalProductos}>
                        {row.tunalProductos}
                      </div>
                    </td>

                    {/* Caras Tunal */}
                    <td className="py-3 px-3">
                      <div className="text-sm font-extrabold text-white">
                        {row.tunalCaras.toLocaleString()} caras
                      </div>
                    </td>

                    {/* Competencia (Marcas) */}
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium truncate max-w-[130px]" title={row.compMarcas}>
                        {row.compMarcas}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]" title={row.compProductos}>
                        {row.compProductos}
                      </div>
                    </td>

                    {/* Muestras Competencia */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <span className="font-bold text-sky-400">{row.compMuestras.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">muestras</span>
                      </div>
                    </td>

                    {/* Caras Competencia */}
                    <td className="py-3 px-3">
                      <div className="text-sm font-extrabold text-white">
                        {row.compCaras.toLocaleString()} caras
                      </div>
                    </td>

                    {/* Brecha Caras */}
                    <td className="py-3 px-3">
                      {row.diffCaras !== null ? (
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.diffCaras > 0
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : row.diffCaras < 0
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {row.diffCaras > 0 ? `+${row.diffCaras}` : `${row.diffCaras}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Total Muestras */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white tracking-wide">
                        {row.totalMuestras.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ET: {row.tunalMuestras} | CP: {row.compMuestras}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE 2: DETALLE REGISTRO A REGISTRO */}
      {activeTab === 'detailed' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('origen')}>
                  Origen <SortIcon field="origen" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('producto')}>
                  Producto al Detal <SortIcon field="producto" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('marca')}>
                  Marca <SortIcon field="marca" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('categoria')}>
                  Categoría Oficial <SortIcon field="categoria" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('subcategoria')}>
                  Subcategoría <SortIcon field="subcategoria" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('sucCliente')}>
                  Sucursal (SucCliente) <SortIcon field="sucCliente" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('ruta')}>
                  Ruta <SortIcon field="ruta" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('caras')}>
                  Caras (Facing) <SortIcon field="caras" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No se encontraron registros individuales.
                  </td>
                </tr>
              ) : (
                paginatedData.map((r, idx) => (
                  <tr key={`${r.id || idx}`} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Origen */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.origen === 'El Tunal' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      }`}>
                        {r.origen}
                      </span>
                    </td>

                    {/* Producto */}
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {r.producto}
                    </td>

                    {/* Marca */}
                    <td className="py-2.5 px-3">
                      <span className="text-slate-300 font-medium">
                        {r.marca || 'N/A'}
                      </span>
                    </td>

                    {/* Categoría */}
                    <td className="py-2.5 px-3 text-slate-400">
                      {r.categoria}
                    </td>

                    {/* Subcategoría */}
                    <td className="py-2.5 px-3 text-slate-300">
                      {r.subcategoria}
                    </td>

                    {/* Sucursal */}
                    <td className="py-2.5 px-3 text-slate-300 truncate max-w-[180px]" title={r.sucCliente}>
                      {r.sucCliente}
                    </td>

                    {/* Ruta */}
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {r.ruta}
                    </td>

                    {/* Caras */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {r.caras}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE 3: RESUMEN DE AUDITORÍA POR SUCURSAL */}
      {activeTab === 'sucursales' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('sucursal')}>
                  Sucursal (SucCliente) <SortIcon field="sucursal" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('ruta')}>
                  Ruta <SortIcon field="ruta" />
                </th>
                <th className="py-3 px-3 text-emerald-400 font-bold cursor-pointer hover:text-emerald-300" onClick={() => handleSort('tunalMuestras')}>
                  Muestras El Tunal <SortIcon field="tunalMuestras" />
                </th>
                <th className="py-3 px-3 text-sky-400 font-bold cursor-pointer hover:text-sky-300" onClick={() => handleSort('compMuestras')}>
                  Muestras Competencia <SortIcon field="compMuestras" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white font-bold" onClick={() => handleSort('totalMuestras')}>
                  Total Muestras Auditadas <SortIcon field="totalMuestras" />
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('shareTunal')}>
                  Distribución % <SortIcon field="shareTunal" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron sucursales.
                  </td>
                </tr>
              ) : (
                paginatedData.map((s) => (
                  <tr key={s.sucursal} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Sucursal */}
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{s.sucursal}</span>
                      </div>
                    </td>

                    {/* Ruta */}
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {s.ruta}
                    </td>

                    {/* Muestras Tunal */}
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      {s.tunalMuestras.toLocaleString()}
                    </td>

                    {/* Muestras Competencia */}
                    <td className="py-3 px-3 font-bold text-sky-400">
                      {s.compMuestras.toLocaleString()}
                    </td>

                    {/* Total Muestras */}
                    <td className="py-3 px-3 font-extrabold text-white">
                      {s.totalMuestras.toLocaleString()}
                    </td>

                    {/* Distribución */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 rounded-full h-2 flex overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full" 
                            style={{ width: `${s.shareTunal}%` }} 
                          />
                          <div 
                            className="bg-sky-500 h-full" 
                            style={{ width: `${100 - s.shareTunal}%` }} 
                          />
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {s.shareTunal}% ET
                        </span>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div>
          Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
          <span className="font-semibold text-white">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
          >
            ««
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
          >
            Siguiente
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
          >
            »»
          </button>
        </div>
      </div>

    </div>
  );
}
