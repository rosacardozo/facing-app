import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Tag, 
  Building2, 
  Award, 
  Info,
  Layers
} from 'lucide-react';

export default function ComparativeCharts({
  sampleDistribution,
  productComparisons,
  competitorBrandSamples,
  topSucursalesSamples,
  activeCategory
}) {
  const [activeTab, setActiveTab] = useState('muestras'); // 'muestras' | 'precios' | 'marcas' | 'sucursales'

  // Precios comparables (solo aquellos que tienen precio tanto en Tunal como en Competencia)
  const comparableProducts = productComparisons
    .filter(p => p.tunalCaras > 0 && p.compCaras > 0)
    .slice(0, 10);

  // Custom Tooltip para el gráfico de muestras
  const SampleTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const tData = payload.find(p => p.dataKey === 'tunalMuestras');
      const cData = payload.find(p => p.dataKey === 'compMuestras');
      const tunalVal = tData ? tData.value : 0;
      const compVal = cData ? cData.value : 0;
      const total = tunalVal + compVal;

      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs">
          <div className="font-bold text-white mb-2 pb-1 border-b border-slate-800">
            {label}
          </div>
          <div className="space-y-1.5 font-medium">
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                El Tunal (Muestras):
              </span>
              <span className="font-bold">{tunalVal.toLocaleString()} reg</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                Competencia (Muestras):
              </span>
              <span className="font-bold">{compVal.toLocaleString()} reg</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300 pt-1 border-t border-slate-800">
              <span>Total Muestras:</span>
              <span className="font-bold text-white">{total.toLocaleString()} reg</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip para el gráfico de caras en anaquel
  const FacingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl text-xs max-w-xs">
          <div className="font-bold text-white mb-1">
            {item.subcategoria} - {item.presentacion}
          </div>
          <div className="text-[11px] text-slate-400 mb-2.5 pb-1 border-b border-slate-800">
            {item.categoria}
          </div>

          <div className="space-y-2">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2">
              <div className="flex justify-between items-center text-emerald-300 font-bold mb-0.5">
                <span>Caras Tunal:</span>
                <span>{item.tunalCaras} caras</span>
              </div>
              <div className="text-[10px] text-emerald-400/80">
                Respaldo: <span className="font-semibold text-white">{item.tunalMuestras} muestras</span> auditadas
              </div>
            </div>

            <div className="bg-sky-950/40 border border-sky-500/30 rounded-lg p-2">
              <div className="flex justify-between items-center text-sky-300 font-bold mb-0.5">
                <span>Prom. Caras Competencia:</span>
                <span>{item.compCaras} caras</span>
              </div>
              <div className="text-[10px] text-sky-400/80">
                Respaldo: <span className="font-semibold text-white">{item.compMuestras} muestras</span> auditadas
              </div>
              {item.compMarcas && (
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Marcas: {item.compMarcas}
                </div>
              )}
            </div>

            {item.diffCaras !== null && (
              <div className="pt-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Diferencia:</span>
                <span className={item.diffCaras < 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {item.diffCaras > 0 ? `+${item.diffCaras}` : `${item.diffCaras}`} caras
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip para marcas de competencia
  const BrandTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs">
          <div className="font-bold text-white mb-1.5">{item.marca}</div>
          <div className="text-sky-400 font-semibold">
            Muestras auditadas: <span className="text-white font-bold">{item.muestras.toLocaleString()}</span>
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Participación muestral: {item.porcentaje}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      
      {/* Chart Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Análisis Gráfico Comparativo con Respaldo de Muestras
          </h2>
          <p className="text-xs text-slate-400">
            {activeCategory === 'all' 
              ? 'Visualización integral de todas las subcategorías y marcas' 
              : `Categoría activa: ${activeCategory}`}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            id="tab-chart-muestras"
            onClick={() => setActiveTab('muestras')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'muestras'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Muestras por Subcategoría
          </button>
          <button
            id="tab-chart-precios"
            onClick={() => setActiveTab('precios')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'precios'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparativa de Caras en Anaquel
          </button>
          <button
            id="tab-chart-marcas"
            onClick={() => setActiveTab('marcas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'marcas'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Marcas Competidoras
          </button>
          <button
            id="tab-chart-sucursales"
            onClick={() => setActiveTab('sucursales')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'sucursales'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Sucursales
          </button>
        </div>
      </div>

      {/* 1. MUESTRAS POR SUBCATEGORÍA */}
      {activeTab === 'muestras' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Conteo de registros por subcategoría (El Tunal vs Competencia)</span>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded bg-emerald-500" /> El Tunal
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 rounded bg-sky-500" /> Competencia
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sampleDistribution}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="subcategoria" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip content={<SampleTooltip />} />
                <Bar 
                  dataKey="tunalMuestras" 
                  name="Muestras El Tunal" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="compMuestras" 
                  name="Muestras Competencia" 
                  fill="#0ea5e9" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2. COMPARATIVA DE PRECIOS AL DETAL CON RESPALDO DE MUESTRAS */}
      {activeTab === 'precios' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>
              Número de caras (facing) por producto/presentación homóloga con muestras auditadas
            </span>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded bg-emerald-500" /> El Tunal (Caras)
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 rounded bg-sky-500" /> Competencia (Caras)
              </span>
            </div>
          </div>

          {comparableProducts.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Info className="w-8 h-8 text-amber-400 mb-2" />
              <p className="font-semibold text-slate-200">No hay pares homólogos en este filtro</p>
              <p className="text-xs max-w-sm mt-1">
                Ajuste los filtros de categoría o sucursal para visualizar productos con muestras tanto en El Tunal como en Competencia.
              </p>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparableProducts}
                  margin={{ top: 10, right: 10, left: -10, bottom: 35 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="subcategoria" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val, idx) => {
                      const item = comparableProducts[idx];
                      return item ? `${item.subcategoria} (${item.presentacion})` : val;
                    }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => val.toLocaleString()}
                  />
                  <Tooltip content={<FacingTooltip />} />
                  <Bar 
                    dataKey="tunalCaras" 
                    name="Caras El Tunal" 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={36}
                  />
                  <Bar 
                    dataKey="compCaras" 
                    name="Caras Competencia" 
                    fill="#0ea5e9" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* 3. MARCAS COMPETIDORAS */}
      {activeTab === 'marcas' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Volumen de muestras auditadas por Marca de la Competencia</span>
            <span className="text-sky-400 font-medium">Top 12 Marcas</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={competitorBrandSamples.slice(0, 12)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <YAxis 
                  dataKey="marca" 
                  type="category" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={100}
                />
                <Tooltip content={<BrandTooltip />} />
                <Bar 
                  dataKey="muestras" 
                  name="Muestras" 
                  fill="#38bdf8" 
                  radius={[0, 6, 6, 0]} 
                  maxBarSize={22}
                >
                  {competitorBrandSamples.slice(0, 12).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#38bdf8' : index < 3 ? '#0284c7' : '#0369a1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. TOP SUCURSALES AUDITADAS */}
      {activeTab === 'sucursales' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Top 10 Sucursales con mayor densidad de auditorías de facing</span>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded bg-emerald-500" /> El Tunal
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 rounded bg-sky-500" /> Competencia
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSucursalesSamples}
                margin={{ top: 10, right: 10, left: -10, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="sucursal" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip content={<SampleTooltip />} />
                <Bar 
                  dataKey="tunalMuestras" 
                  name="El Tunal" 
                  fill="#10b981" 
                  stackId="a"
                  maxBarSize={36}
                />
                <Bar 
                  dataKey="compMuestras" 
                  name="Competencia" 
                  fill="#0ea5e9" 
                  stackId="a"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
