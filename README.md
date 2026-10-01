# El Tunal - Pricing Benchmark & Competitive Intelligence Dashboard

Dashboard interactivo y analítico para el monitoreo de precios al detal de **Alimentos El Tunal C.A.** frente a las principales marcas competidoras líderes en el mercado venezolano.

Construido con **React**, **Tailwind CSS**, **Recharts** y **Lucide Icons**. Totalmente preparado para despliegue inmediato en **Vercel** o ejecución local.

---

## 🚀 Características Principales

1. **6 Categorías Oficiales y Subcategorías Estructuradas:**
   - **Embutidos**: Jamones, Ahumados, Chorizos, Mortadelas, Salchichas.
   - **Bebidas**: Jugos y Néctares, Light, Té.
   - **Leche Líquida**: Líquida UHT.
   - **Leche en Polvo**: Polvo.
   - **Derivados Lácteos**: Crema de Leche, Mantequilla, Quesos de Cabra.
   - **Huevos**: Huevos.

2. **Respaldo Muestral Prominente (Total de Registros / Muestras):**
   - **5,995 registros de campo** de El Tunal (Purísima, Alimex, Itálico).
   - **2,954 registros de campo** de Marcas Competidoras (Natulac, Pastoreña, San Simón, La Campiña, Plumrose, Paisa, Frica, Kaito, Parmalat, Fiesta, Hermo, Torondoy, Lácteos Maracay, Purovo, Ananké, Quiboreño, etc.).
   - **8,949 muestras totales** auditadas en más de 362 sucursales comerciales y 39 rutas.
   - Cada tarjeta de KPI, gráfico y fila de tabla destaca explícitamente el número de registros ($N$) que respaldan el dato.

3. **Cumplimiento Estricto de Reglas de Negocio:**
   - ❌ **Sin cálculos de precio promedio global** (se excluyen intencionalmente para evitar distorsiones entre categorías incomparables).
   - ❌ **Sin gráficos de evolución temporal** (enfoque exclusivo en la foto competitiva actual y profundidad muestral).

4. **Filtros Interactivos Multidimensionales:**
   - Filtro por **Categoría Oficial** con botones de navegación rápida y conteo de muestras en tiempo real.
   - Filtro por **Subcategoría** dinámica.
   - Filtro por **Sucursal (`SucCliente`)** (362 puntos de venta auditados).
   - Filtro por **Ruta de Distribución** (39 rutas comerciales).
   - Búsqueda en tiempo real por texto (Producto o Marca).
   - Selector "Solo Pares Homólogos" (para comparar únicamente SKUs presentes en ambas fuentes).

5. **Gráficos Comparativos Interactivos (Recharts):**
   - **Muestras por Subcategoría**: Comparativa directa de muestras Tunal vs Competencia.
   - **Comparativa de Precios al Detal**: Precios de referencia (mediana) con tooltip desglosando muestras auditadas y brecha en $ y %.
   - **Marcas Competidoras**: Distribución de volumen de muestras por marca rival.
   - **Top Sucursales**: Auditorías concentradas por punto de venta.

6. **Tabla Detallada con 3 Vistas Analíticas:**
   - **Benchmark Homólogo**: Comparación por subcategoría y presentación, conteo de muestras Tunal/Competencia, precio mínimo, máximo, mediana y brecha porcentual.
   - **Registros al Detal**: Auditoría registro a registro con ID, fecha, ruta, sucursal, producto y precio.
   - **Por Sucursal**: Muestras auditadas de El Tunal vs Competencia por cada cliente.
   - Exportación directa a **CSV** compatible con Microsoft Excel.

7. **Carga y Actualización en Caliente:**
   - Modal para importar y procesar nuevos archivos CSV/Excel en el navegador mediante SheetJS (`xlsx`).

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Construir para producción
npm run build

# 4. Previsualizar compilación de producción
npm run preview
```

---

## 🌐 Despliegue en Vercel

El proyecto incluye la configuración lista en `vercel.json`:
1. Subir el repositorio a GitHub / GitLab.
2. Importar el proyecto en [Vercel](https://vercel.com).
3. Vercel detectará automáticamente el framework **Vite**, ejecutará `npm run build` y servirá el directorio `dist/`.

---

## 📂 Estructura del Proyecto

```text
├── data/                                 # Archivos fuente (Excel y CSVs)
│   ├── Portafolio y Competencia (1).xlsx
│   ├── Precios mas recientes TUNAL.csv
│   └── Precios mas recientes Competencia.csv
├── public/
│   └── data/
│       └── pricingData.json             # Dataset preprocesado
├── src/
│   ├── components/
│   │   ├── Header.jsx                   # Barra superior y acciones
│   │   ├── CategoryNav.jsx              # Navegación con badges de muestras
│   │   ├── FilterBar.jsx                # Filtros superiores interactivos
│   │   ├── MetricCards.jsx              # Tarjetas de resumen de muestras
│   │   ├── ComparativeCharts.jsx        # Gráficos Recharts
│   │   ├── PricingTable.jsx             # Tablas detalladas y exportación CSV
│   │   ├── DataUploaderModal.jsx        # Importador de CSVs/Excel
│   │   └── CatalogModal.jsx             # Visualizador del catálogo maestro
│   ├── data/
│   │   ├── categoryStructure.js         # Mapeo oficial y reglas de clasificación
│   │   └── pricingData.json             # Datos procesados con 8,949 registros
│   ├── utils/
│   │   └── dataProcessor.js             # Lógica de agregación, filtros y CSV
│   ├── App.jsx                          # Componente raíz
│   ├── main.jsx                         # Entrada de React
│   └── index.css                        # Estilos Tailwind y tema oscuro ejecutivo
├── vercel.json                          # Configuración de despliegue Vercel
├── vite.config.js                       # Configuración de Vite
└── package.json
```
