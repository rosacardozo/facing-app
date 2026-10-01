import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertTriangle, Database, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import { classifyProduct, extractPresentation, extractCompetitorBrand, extractTunalBrand } from '../data/categoryStructure';

export default function DataUploaderModal({ isOpen, onClose, onDataUpdated }) {
  const [tunalFile, setTunalFile] = useState(null);
  const [compFile, setCompFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  // Parser helper para CSV o Excel
  const parseFileRows = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const isCsv = file.name.endsWith('.csv');

      if (isCsv) {
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
            if (lines.length < 2) return resolve([]);

            // Detectar delimitador (';' o ',')
            const delimiter = lines[0].includes(';') ? ';' : ',';
            const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

            const rows = [];
            for (let i = 1; i < lines.length; i++) {
              const currentline = lines[i].split(delimiter);
              if (currentline.length >= headers.length - 1) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                  obj[headers[j]] = (currentline[j] || '').trim().replace(/^"|"$/g, '');
                }
                rows.push(obj);
              }
            }
            resolve(rows);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsText(file, 'ISO-8859-1');
      } else {
        // Excel (.xlsx, .xls)
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleProcessUploads = async () => {
    if (!tunalFile && !compFile) {
      setMessage({ type: 'error', text: 'Por favor seleccione al menos un archivo para actualizar.' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      let newTunalRecords = null;
      let newCompRecords = null;

      if (tunalFile) {
        const rows = await parseFileRows(tunalFile);
        newTunalRecords = rows.map((row, idx) => {
          const prod = row['Productos'] || row['PRODUCTO'] || row['Descripcion'] || '';
          const seg = row['Segmento'] || '';
          const { category, subcategory } = classifyProduct(prod, seg);
          const rawPrice = (row['Precio_Venta_Detal'] || row['Precio'] || '0').replace(',', '.');
          const precio = parseFloat(rawPrice) || 0.0;

          return {
            id: `T-UP-${idx + 1}`,
            idDC: row['idDC'] || `${idx + 1}`,
            origen: 'El Tunal',
            fecha: row['Fecha_DC'] || row['Fecha'] || '',
            ruta: row['Ruta'] || 'Sin Ruta',
            sucCliente: row['SucCliente'] || row['Sucursal'] || 'Sin Sucursal',
            producto: prod,
            marca: extractTunalBrand(prod),
            categoria: category,
            subcategoria: subcategory,
            presentacion: extractPresentation(prod),
            precio: Number(precio.toFixed(2))
          };
        });
      }

      if (compFile) {
        const rows = await parseFileRows(compFile);
        newCompRecords = rows.map((row, idx) => {
          const prod = row['Productos'] || row['PRODUCTO'] || row['Descripcion'] || '';
          const { category, subcategory } = classifyProduct(prod);
          const rawPrice = (row['Precio_Venta_Detal'] || row['Precio'] || '0').replace(',', '.');
          const precio = parseFloat(rawPrice) || 0.0;

          return {
            id: `C-UP-${idx + 1}`,
            idDC: row['idDC'] || `${idx + 1}`,
            origen: 'Competencia',
            fecha: row['Fecha_DC'] || row['Fecha'] || '',
            ruta: row['Ruta'] || 'Sin Ruta',
            sucCliente: row['SucCliente'] || row['Sucursal'] || 'Sin Sucursal',
            producto: prod,
            marca: extractCompetitorBrand(prod),
            categoria: category,
            subcategoria: subcategory,
            presentacion: extractPresentation(prod),
            precio: Number(precio.toFixed(2))
          };
        });
      }

      onDataUpdated({ newTunalRecords, newCompRecords });
      setMessage({
        type: 'success',
        text: `¡Archivos procesados correctamente! Muestras Tunal: ${newTunalRecords ? newTunalRecords.length : 'Sin cambios'}, Muestras Competencia: ${newCompRecords ? newCompRecords.length : 'Sin cambios'}.`
      });

      setTimeout(() => {
        onClose();
      }, 1800);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: `Error al procesar los archivos: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Importar Archivos de Precios</h3>
            <p className="text-xs text-slate-400">Actualice la base de datos cargando los CSVs de campo</p>
          </div>
        </div>

        {/* Upload Areas */}
        <div className="space-y-4 mb-5">
          
          {/* File 1: Tunal */}
          <div className="border border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-3.5 bg-slate-800/40 transition-colors">
            <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5 cursor-pointer">
              <FileText className="w-4 h-4 text-emerald-400" />
              Precios mas recientes TUNAL.csv
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Archivo con columnas: idDC, Fecha_DC, Ruta, SucCliente, Segmento, Productos, Precio_Venta_Detal
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setTunalFile(e.target.files[0] || null)}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
            />
            {tunalFile && (
              <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Seleccionado: {tunalFile.name} ({(tunalFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* File 2: Competencia */}
          <div className="border border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl p-3.5 bg-slate-800/40 transition-colors">
            <label className="block text-xs font-semibold text-sky-400 mb-1 flex items-center gap-1.5 cursor-pointer">
              <FileText className="w-4 h-4 text-sky-400" />
              Precios mas recientes Competencia.csv
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Archivo con columnas: idDC, Fecha_DC, Ruta, SucCliente, Productos, Precio_Venta_Detal
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setCompFile(e.target.files[0] || null)}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
            />
            {compFile && (
              <div className="mt-1.5 text-[11px] text-sky-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Seleccionado: {compFile.name} ({(compFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={(!tunalFile && !compFile) || isProcessing}
            onClick={handleProcessUploads}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando muestras...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Actualizar Dashboard</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
