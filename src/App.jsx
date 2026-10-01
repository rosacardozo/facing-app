import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FilterBar from './components/FilterBar';
import MetricCards from './components/MetricCards';
import ComparativeCharts from './components/ComparativeCharts';
import FacingTable from './components/FacingTable';
import CatalogModal from './components/CatalogModal';
import { CATEGORY_STRUCTURE, canonicalCategory } from './data/categoryStructure';
import { 
  filterRecords, 
  calculateSampleMetrics, 
  getSampleDistributionBySubcategory,
  getProductFacingComparison,
  getCompetitorBrandSampleDistribution,
  getTopSucursalesBySamples
} from './utils/dataProcessor';

// Carga inicial del conjunto de datos procesado
import initialData from './data/pricingData.json';
import { BookOpen, ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [tunalRecords, setTunalRecords] = useState(initialData.tunalRecords || []);
  const [compRecords, setCompRecords] = useState(initialData.compRecords || []);
  const [catalog, setCatalog] = useState(initialData.catalog || []);

  // Estado de los filtros
  const [filters, setFilters] = useState({
    category: 'all',
    subcategory: 'all',
    sucCliente: 'all',
    ruta: 'all',
    competitorBrand: 'all'
  });

  const [onlyComparable, setOnlyComparable] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Opciones de sucursales y marcas dinámicas según el dataset

  const sucursalesOptions = useMemo(() => {
    const set = new Set();
    tunalRecords.forEach(r => { if (r.sucCliente && r.sucCliente !== 'Sin Sucursal') set.add(r.sucCliente); });
    compRecords.forEach(r => { if (r.sucCliente && r.sucCliente !== 'Sin Sucursal') set.add(r.sucCliente); });
    return Array.from(set).sort();
  }, [tunalRecords, compRecords]);

  const rutasOptions = useMemo(() => {
    const set = new Set();
    tunalRecords.forEach(r => { if (r.ruta && r.ruta !== 'Sin Ruta') set.add(r.ruta); });
    compRecords.forEach(r => { if (r.ruta && r.ruta !== 'Sin Ruta') set.add(r.ruta); });
    return Array.from(set).sort();
  }, [tunalRecords, compRecords]);

  const competitorBrandOptions = useMemo(() => {
    const set = new Set();
    compRecords.forEach(r => { if (r.marca) set.add(r.marca); });
    return Array.from(set).sort();
  }, [compRecords]);

  // Conteo de registros por categoría oficial para los badges de navegación
  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.keys(CATEGORY_STRUCTURE).forEach(cat => {
      counts[cat] = { tunal: 0, comp: 0, total: 0 };
    });

    tunalRecords.forEach(r => {
      const cat = canonicalCategory(r.categoria);
      if (counts[cat]) {
        counts[cat].tunal += 1;
        counts[cat].total += 1;
      }
    });

    compRecords.forEach(r => {
      const cat = canonicalCategory(r.categoria);
      if (counts[cat]) {
        counts[cat].comp += 1;
        counts[cat].total += 1;
      }
    });

    return counts;
  }, [tunalRecords, compRecords]);

  // Registros filtrados
  const filteredTunal = useMemo(() => {
    return filterRecords(tunalRecords, filters);
  }, [tunalRecords, filters]);

  const filteredComp = useMemo(() => {
    return filterRecords(compRecords, filters);
  }, [compRecords, filters]);

  // Métricas de resumen (excluyendo estrictamente cualquier precio promedio global)
  const metrics = useMemo(() => {
    return calculateSampleMetrics(filteredTunal, filteredComp);
  }, [filteredTunal, filteredComp]);

  // Comparativa por producto / presentación homóloga
  const productComparisons = useMemo(() => {
    const comparisons = getProductFacingComparison(filteredTunal, filteredComp);
    if (onlyComparable) {
      return comparisons.filter(c => c.tunalCaras > 0 && c.compCaras > 0);
    }
    return comparisons;
  }, [filteredTunal, filteredComp, onlyComparable]);

  // Distribución de muestras para gráficos
  const sampleDistribution = useMemo(() => {
    return getSampleDistributionBySubcategory(
      filteredTunal, 
      filteredComp, 
      filters.category, 
      CATEGORY_STRUCTURE
    );
  }, [filteredTunal, filteredComp, filters.category]);

  const competitorBrandSamples = useMemo(() => {
    return getCompetitorBrandSampleDistribution(filteredComp);
  }, [filteredComp]);

  const topSucursalesSamples = useMemo(() => {
    return getTopSucursalesBySamples(filteredTunal, filteredComp, 10);
  }, [filteredTunal, filteredComp]);

  // Handlers para filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // Si cambia de categoría, reiniciar la subcategoría a 'all'
      if (key === 'category') {
        updated.subcategory = 'all';
      }
      return updated;
    });
  };

  const handleSelectCategory = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: cat,
      subcategory: 'all'
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      subcategory: 'all',
      sucCliente: 'all',
      ruta: 'all',
      competitorBrand: 'all'
    });
    setOnlyComparable(false);
  };

  const handleToggleComparable = () => {
    setOnlyComparable(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        totalRecords={tunalRecords.length + compRecords.length}
        filteredRecords={metrics.totalCount}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Category Navigation Bar with 6 Official Categories */}
        <section aria-label="Navegación por Categorías Oficiales">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              6 Categorías Oficiales El Tunal
            </span>
            <button
              onClick={() => setIsCatalogOpen(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Catálogo Maestro ({catalog.length} SKUs)</span>
            </button>
          </div>
          <CategoryNav
            selectedCategory={filters.category}
            onSelectCategory={handleSelectCategory}
            categoryCounts={categoryCounts}
          />
        </section>

        {/* Top Interactive Filter Bar */}
        <section aria-label="Filtros Interactivos">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            sucursalesOptions={sucursalesOptions}
            rutasOptions={rutasOptions}
            competitorBrandOptions={competitorBrandOptions}
            onlyComparable={onlyComparable}
            onToggleComparable={handleToggleComparable}
          />
        </section>

        {/* Prominent Sample Size / Summary Metrics Cards */}
        <section aria-label="Métricas de Respaldo Muestral">
          <MetricCards metrics={metrics} />
        </section>

        {/* Comparative Visualizations (Recharts) */}
        <section aria-label="Gráficos Comparativos">
          <ComparativeCharts
            sampleDistribution={sampleDistribution}
            productComparisons={productComparisons}
            competitorBrandSamples={competitorBrandSamples}
            topSucursalesSamples={topSucursalesSamples}
            activeCategory={filters.category}
          />
        </section>

        {/* Detailed and Filterable Table */}
        <section aria-label="Tabla de Caras en Anaquel (Facing)">
          <FacingTable
            productComparisons={productComparisons}
            rawTunalRecords={filteredTunal}
            rawCompRecords={filteredComp}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Alimentos El Tunal C.A.</span>
            <span>•</span>
            <span>Inteligencia de Facing y Presencia en Anaquel</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>6 Categorías Oficiales</span>
            <span>•</span>
            <span>8,949 Muestras de Campo</span>
            <span>•</span>
            <span>Listo para Vercel</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        catalog={catalog}
      />

    </div>
  );
}
