// Definicion Oficial de Categorias y Subcategorias para el Dashboard El Tunal
export const CATEGORY_STRUCTURE = {
  "Embutidos": {
    name: "Embutidos",
    icon: "Beef",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    color: "#e11d48", // Rose-600
    subcategories: ["Jamones", "Ahumados", "Chorizos", "Mortadelas", "Salchichas"]
  },
  "Bebidas": {
    name: "Bebidas",
    icon: "Coffee",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    color: "#f59e0b", // Amber-500
    subcategories: ["Jugos y Néctares", "Light", "Té"]
  },
  "Leche Líquida": {
    name: "Leche Líquida",
    icon: "Milk",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    color: "#0284c7", // Sky-600
    subcategories: ["Líquida UHT"]
  },
  "Leche en Polvo": {
    name: "Leche en Polvo",
    icon: "Package",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    color: "#8b5cf6", // Violet-500
    subcategories: ["Polvo"]
  },
  "Derivados Lácteos": {
    name: "Derivados Lácteos",
    icon: "Utensils",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "#10b981", // Emerald-500
    subcategories: ["Crema de Leche", "Mantequilla", "Quesos de Cabra"]
  },
  "Huevos": {
    name: "Huevos",
    icon: "Egg",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    color: "#f97316", // Orange-500
    subcategories: ["Huevos"]
  }
};

export const OFFICIAL_CATEGORIES = Object.keys(CATEGORY_STRUCTURE);

/**
 * Normaliza cadenas removiendo acentos y caracteres especiales para comparaciones seguras
 */
export function normalizeCategoryName(str) {
  if (!str) return "";
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .toUpperCase();
}

/**
 * Normaliza una categoria al nombre canonico oficial
 */
export function canonicalCategory(cat) {
  const norm = normalizeCategoryName(cat);
  if (norm.includes("EMBUTIDO")) return "Embutidos";
  if (norm.includes("BEBIDA")) return "Bebidas";
  if (norm.includes("LECHE EN POLVO") || norm.includes("POLVO")) return "Leche en Polvo";
  if (norm.includes("LECHE") && (norm.includes("LIQUIDA") || norm.includes("UHT") || norm.includes("BARISTA"))) return "Leche Líquida";
  if (norm.includes("LECHE")) return "Leche Líquida";
  if (norm.includes("DERIVADO") || norm.includes("LACTEO") || norm.includes("QUESO") || norm.includes("MANTEQUILLA")) return "Derivados Lácteos";
  if (norm.includes("HUEVO")) return "Huevos";
  return cat || "Embutidos";
}

/**
 * Normaliza una subcategoria al nombre canonico oficial
 */
export function canonicalSubcategory(sub, cat = "") {
  const norm = normalizeCategoryName(sub);
  if (norm.includes("JAMON")) return "Jamones";
  if (norm.includes("AHUMADO") || norm.includes("TOCINETA") || norm.includes("CHULETA")) return "Ahumados";
  if (norm.includes("CHORIZO")) return "Chorizos";
  if (norm.includes("MORTADELA")) return "Mortadelas";
  if (norm.includes("SALCHICHA")) return "Salchichas";

  if (norm.includes("JUGO") || norm.includes("NECTAR") || norm.includes("NARANJADA")) return "Jugos y Néctares";
  if (norm.includes("LIGHT") || norm.includes("LIGTH")) return "Light";
  if (norm.includes("TE")) return "Té";

  if (norm.includes("LIQUIDA") || norm.includes("UHT") || norm.includes("BARISTA")) return "Líquida UHT";
  if (norm.includes("POLVO")) return "Polvo";

  if (norm.includes("CREMA") || norm.includes("SUERO") || norm.includes("NATA")) return "Crema de Leche";
  if (norm.includes("MANTEQUILLA")) return "Mantequilla";
  if (norm.includes("CABRA") || norm.includes("QUESO")) return "Quesos de Cabra";

  if (norm.includes("HUEVO")) return "Huevos";
  return sub || "General";
}

// Mapeo inteligente de productos a Categoria y Subcategoria
export function classifyProduct(rawName, segmentoHint = "") {
  const name = (rawName || "").toUpperCase().trim();
  const seg = (segmentoHint || "").toUpperCase().trim();

  // 1. HUEVOS
  if (name.includes("HUEVO") || name.includes("PUROVO") || seg === "PRODHUEVOS") {
    return {
      category: "Huevos",
      subcategory: "Huevos",
      unitCategory: extractPresentation(name)
    };
  }

  // 2. EMBUTIDOS (Salchichas, Mortadelas, Chorizos, Ahumados, Jamones)
  if (name.includes("SALCHICHA")) {
    return {
      category: "Embutidos",
      subcategory: "Salchichas",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("MORTADELA")) {
    return {
      category: "Embutidos",
      subcategory: "Mortadelas",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("CHORIZO") || name.includes("CHORIZON") || name.includes("CHORIZÓN")) {
    return {
      category: "Embutidos",
      subcategory: "Chorizos",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("AHUMADO") || name.includes("AHUMADA") || name.includes("TOCINETA") || name.includes("CHULETA")) {
    return {
      category: "Embutidos",
      subcategory: "Ahumados",
      unitCategory: extractPresentation(name)
    };
  }

  if (
    name.includes("JAMON") ||
    name.includes("JAMÓN") ||
    name.includes("PIERNA") ||
    name.includes("ESPALDA") ||
    name.includes("AREPERO") ||
    name.includes("VISKING") ||
    name.includes("ALIMEX") ||
    name.includes("ITALICO") ||
    name.includes("PLUMROSE") ||
    name.includes("HERMO") ||
    seg === "PRODJAMONERIA" ||
    seg === "PRODEMBUTIDOS"
  ) {
    return {
      category: "Embutidos",
      subcategory: "Jamones",
      unitCategory: extractPresentation(name)
    };
  }

  // 3. DERIVADOS LACTEOS
  // Excluir DESCREMADA (que contiene "CREMA" pero es leche liquida)
  if ((name.includes("CREMA DE LECHE") || /\bCREMA\b/.test(name) || name.includes("SUERO") || name.includes("NATA")) && !name.includes("DESCREMADA")) {
    return {
      category: "Derivados Lácteos",
      subcategory: "Crema de Leche",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("MANTEQUILLA")) {
    return {
      category: "Derivados Lácteos",
      subcategory: "Mantequilla",
      unitCategory: extractPresentation(name)
    };
  }

  if (
    name.includes("CABRA") ||
    name.includes("QUESO") ||
    name.includes("ANANKE") ||
    name.includes("QUIBORENO") ||
    name.includes("QUIBOREÑO") ||
    name.includes("QUBORENO") ||
    name.includes("MADURADO") ||
    name.includes("SEMIMADURADO") ||
    name.includes("GOUDA") ||
    name.includes("PARMESANO") ||
    name.includes("EDAM")
  ) {
    return {
      category: "Derivados Lácteos",
      subcategory: "Quesos de Cabra",
      unitCategory: extractPresentation(name)
    };
  }

  // 4. LECHE EN POLVO
  if (
    (name.includes("LECHE EN POLVO") ||
      name.includes("POLV.") ||
      name.includes("POLVO") ||
      name.includes("PURISIMA 900GR") ||
      name.includes("PURISIMA 400GR") ||
      name.includes("PURISIMA 200GR") ||
      name.includes("PURISIMA 500GR") ||
      name.includes("PURISIMA 1KG")) &&
    !name.includes("LIQUIDA") &&
    !name.includes("BARISTA") &&
    !name.includes("UHT")
  ) {
    return {
      category: "Leche en Polvo",
      subcategory: "Polvo",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("CAMPINA") || name.includes("CAMPIÑA")) {
    if (name.includes("400") || name.includes("900") || name.includes("200") || name.includes("1KG") || name.includes("SOBRE") || name.includes("POLVO")) {
      return {
        category: "Leche en Polvo",
        subcategory: "Polvo",
        unitCategory: extractPresentation(name)
      };
    }
  }

  // 5. LECHE LIQUIDA
  if (
    name.includes("LECHE COMPLETA") ||
    name.includes("LECHE DESCREMADA") ||
    name.includes("LECHE  DESLACTOSADA") ||
    name.includes("LECHE DESLACTOSADA") ||
    name.includes("LECHE SEMIDESCREMADA") ||
    name.includes("BARISTA LIQUIDA") ||
    name.includes("BARISTA") ||
    name.includes("LECHE UHT") ||
    name.includes("UHT") ||
    seg === "PRODBEBIDAS_LACT" ||
    (name.includes("LECHE") &&
      (name.includes("PASTORENA") || name.includes("NATULAC") || name.includes("SAN SIMON") || name.includes("PURISIMA")) &&
      !name.includes("POLVO") &&
      !name.includes("POLV") &&
      !name.includes("900") &&
      !name.includes("400"))
  ) {
    return {
      category: "Leche Líquida",
      subcategory: "Líquida UHT",
      unitCategory: "1L"
    };
  }

  // 6. BEBIDAS (TE, LIGHT, JUGOS Y NECTARES)
  if (/\bT[EÉ]\b/.test(name) || name.startsWith("TE ") || name.startsWith("TÉ ") || name.includes(" TE ") || name.includes(" TÉ ")) {
    return {
      category: "Bebidas",
      subcategory: "Té",
      unitCategory: extractPresentation(name)
    };
  }

  if (name.includes("LIGHT") || name.includes("LIGTH")) {
    return {
      category: "Bebidas",
      subcategory: "Light",
      unitCategory: extractPresentation(name)
    };
  }

  if (
    name.includes("NECTAR") ||
    name.includes("NÉCTAR") ||
    name.includes("NARANJADA") ||
    name.includes("DURAZNO") ||
    name.includes("MANZANA") ||
    name.includes("PERA") ||
    name.includes("NARANJA") ||
    name.includes("PINA") ||
    name.includes("PIÑA") ||
    name.includes("FRUTAS") ||
    name.includes("FRICA") ||
    name.includes("KAITO") ||
    name.includes("YUKERY") ||
    seg === "PRODBEBIDAS"
  ) {
    return {
      category: "Bebidas",
      subcategory: "Jugos y Néctares",
      unitCategory: extractPresentation(name)
    };
  }

  // Fallback defaults based on Segmento
  if (seg === "PRODEMBUTIDOS" || seg === "PRODJAMONERIA") {
    return { category: "Embutidos", subcategory: "Jamones", unitCategory: extractPresentation(name) };
  }
  if (seg === "PRODDERIV_LACTEOS") {
    return { category: "Derivados Lácteos", subcategory: "Mantequilla", unitCategory: extractPresentation(name) };
  }
  if (seg === "PRODBEBIDAS_LACT") {
    return { category: "Leche Líquida", subcategory: "Líquida UHT", unitCategory: "1L" };
  }
  if (seg === "PRODBEBIDAS") {
    return { category: "Bebidas", subcategory: "Jugos y Néctares", unitCategory: extractPresentation(name) };
  }

  return {
    category: "Embutidos",
    subcategory: "Jamones",
    unitCategory: "Estándar"
  };
}

// Extractor de presentacion / gramaje / tamano
export function extractPresentation(name) {
  const n = (name || "").toUpperCase();
  if (n.includes("1L") || n.includes("1 L") || n.includes("1 LITRO") || n.includes("1LT")) return "1 Litro";
  if (n.includes("900GR") || n.includes("900 GR") || n.includes("900G")) return "900g";
  if (n.includes("400GR") || n.includes("400 GR") || n.includes("400G")) return "400g";
  if (n.includes("200GR") || n.includes("200 GR") || n.includes("200G")) return "200g";
  if (n.includes("225GR") || n.includes("225 GR") || n.includes("225G")) return "225g";
  if (n.includes("450GR") || n.includes("450 GR") || n.includes("450G")) return "450g";
  if (n.includes("800GR") || n.includes("800 GR") || n.includes("800G")) return "800g";
  if (n.includes("500GR") || n.includes("500 GR") || n.includes("500G") || n.includes("500 ML") || n.includes("500ML") || n.includes("50OML")) return "500g/ml";
  if (n.includes("250GR") || n.includes("250 GR") || n.includes("250G") || n.includes("250 ML") || n.includes("250ML")) return "250g/ml";
  if (n.includes("1KG") || n.includes("1 KG") || n.includes("1000G")) return "1kg";
  if (n.includes("30 UND") || n.includes("30UND") || n.includes("30 UNIDADES")) return "30 und";
  if (n.includes("15 UND") || n.includes("15UND") || n.includes("1X15")) return "15 und";
  if (n.includes("12") || n.includes("1X12")) return "12 und";
  if (n.includes("6") || n.includes("1X6") || n.includes("2 X 6")) return "6 und";
  if (n.includes("4.4KG") || n.includes("4.4 KG")) return "4.4kg";
  if (n.includes("5.9KG") || n.includes("5.9 KG")) return "5.9kg";
  if (n.includes("3.3 KG") || n.includes("3.5 KG") || n.includes("3.3KG") || n.includes("3.5KG")) return "3.3kg - 3.5kg";
  if (n.includes("7KG") || n.includes("7 KG")) return "7kg";
  return "Estándar";
}

// Extractor de Marca de la Competencia
export function extractCompetitorBrand(name) {
  const n = (name || "").toUpperCase();
  if (n.includes("NATULAC")) return "Natulac";
  if (n.includes("PASTORENA") || n.includes("PASTOREÑA")) return "Pastoreña";
  if (n.includes("SAN SIMON") || n.includes("SAN SIMÓN")) return "San Simón";
  if (n.includes("CAMPINA") || n.includes("CAMPIÑA")) return "La Campiña";
  if (n.includes("PLUMROSE")) return "Plumrose";
  if (n.includes("PAISA")) return "Paisa";
  if (n.includes("FRICA")) return "Frica";
  if (n.includes("KAITO")) return "Kaito";
  if (n.includes("PARMALAT")) return "Parmalat";
  if (n.includes("FIESTA")) return "Fiesta";
  if (n.includes("HERMO")) return "Hermo";
  if (n.includes("TORONDOI") || n.includes("TORONDOY")) return "Torondoy";
  if (n.includes("MARACAY") || n.includes("LACTEOS MARACAY")) return "Lácteos Maracay";
  if (n.includes("MONSERRATINA") || n.includes("MONTSERRATINA")) return "La Montserratina";
  if (n.includes("MILLENIUM")) return "Millenium";
  if (n.includes("ANANKE") || n.includes("ANANKÉ")) return "Ananké";
  if (n.includes("QUIBORENO") || n.includes("QUIBOREÑO") || n.includes("QUBORENO")) return "Quiboreño";
  if (n.includes("PUROVO")) return "Purovo";
  if (n.includes("RICCI")) return "Ricci";
  if (n.includes("LEYTON")) return "Leyton";
  if (n.includes("QUENACA")) return "Quenaca";
  if (n.includes("YUKERY")) return "Yukery";
  if (n.includes("OSCAR MAYER")) return "Oscar Mayer";
  if (n.includes("FLOR DE ARAGUA")) return "Flor de Aragua";
  return "Otra Competencia";
}

// Extractor de Marca El Tunal
export function extractTunalBrand(name) {
  const n = (name || "").toUpperCase();
  if (n.includes("PURISIMA") || n.includes("PURÍSIMA")) return "Purísima";
  if (n.includes("ALIMEX")) return "Alimex";
  if (n.includes("ITALICO") || n.includes("ITÁLICO")) return "Itálico";
  return "El Tunal";
}
