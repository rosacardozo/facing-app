import React from 'react';
import { 
  Beef, 
  Coffee, 
  Milk, 
  Package, 
  Utensils, 
  Egg, 
  Layers 
} from 'lucide-react';
import { CATEGORY_STRUCTURE } from '../data/categoryStructure';

const ICON_MAP = {
  Beef: Beef,
  Coffee: Coffee,
  Milk: Milk,
  Package: Package,
  Utensils: Utensils,
  Egg: Egg,
  Layers: Layers
};

export default function CategoryNav({ 
  selectedCategory, 
  onSelectCategory,
  categoryCounts 
}) {
  const categories = Object.keys(CATEGORY_STRUCTURE);

  const totalAllTunal = Object.values(categoryCounts).reduce((acc, curr) => acc + (curr.tunal || 0), 0);
  const totalAllComp = Object.values(categoryCounts).reduce((acc, curr) => acc + (curr.comp || 0), 0);
  const totalAll = totalAllTunal + totalAllComp;

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        
        {/* All Categories Pill */}
        <button
          id="btn-cat-all"
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white border-emerald-500/50 shadow-md shadow-emerald-500/10'
              : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className={`p-1 rounded-lg ${selectedCategory === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="leading-tight">Todas las Categorías</span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">{totalAllTunal.toLocaleString()}</span>
              <span>vs</span>
              <span className="text-sky-400 font-bold">{totalAllComp.toLocaleString()}</span>
            </div>
          </div>
        </button>

        {/* 6 Official Categories */}
        {categories.map(catKey => {
          const catInfo = CATEGORY_STRUCTURE[catKey];
          const IconComp = ICON_MAP[catInfo.icon] || Layers;
          const counts = categoryCounts[catKey] || { tunal: 0, comp: 0, total: 0 };
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              id={`btn-cat-${catKey.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(catKey)}
              className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-slate-800 text-white border-emerald-500/60 shadow-md shadow-emerald-500/15'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div 
                className="p-1 rounded-lg transition-transform group-hover:scale-105"
                style={{ 
                  backgroundColor: isSelected ? `${catInfo.color}25` : 'rgba(30, 41, 59, 0.8)',
                  color: isSelected ? catInfo.color : '#94a3b8' 
                }}
              >
                <IconComp className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="leading-tight font-medium">{catInfo.name}</span>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold" title="Muestras El Tunal">{counts.tunal.toLocaleString()} ET</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-sky-400 font-bold" title="Muestras Competencia">{counts.comp.toLocaleString()} Comp</span>
                </div>
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
}
