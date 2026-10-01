import csv
from collections import Counter
import json

def classify_product(name, seg=''):
    name_u = (name or '').upper().strip()
    seg_u = (seg or '').upper().strip()

    # 1. HUEVOS
    if 'HUEVO' in name_u or 'PUROVO' in name_u or seg_u == 'PRODHUEVOS':
        return ('Huevos', 'Huevos')

    # 2. LECHE EN POLVO
    if any(k in name_u for k in ['LECHE EN POLVO', 'POLV.', 'POLVO', 'PURISIMA 900GR', 'PURISIMA 400GR', 'PURISIMA 200GR', 'PURISIMA 500GR', 'PURISIMA 1KG']) and not any(k in name_u for k in ['LIQUIDA', 'BARISTA', 'UHT']):
        return ('Leche en Polvo', 'Polvo')
    if 'CAMPINA' in name_u or 'CAMPIÑA' in name_u:
        if any(g in name_u for g in ['400', '900', '200', '1KG', 'SOBRE', 'POLVO']):
            return ('Leche en Polvo', 'Polvo')

    # 3. LECHE LIQUIDA
    if any(k in name_u for k in ['LECHE COMPLETA', 'LECHE DESCREMADA', 'LECHE  DESLACTOSADA', 'LECHE DESLACTOSADA', 'LECHE SEMIDESCREMADA', 'BARISTA LIQUIDA', 'LECHE UHT', 'UHT']) or (('LECHE' in name_u) and any(m in name_u for m in ['PASTORENA', 'NATULAC', 'SAN SIMON', 'PURISIMA']) and 'POLVO' not in name_u and 'POLV' not in name_u and '900' not in name_u and '400' not in name_u):
        return ('Leche Líquida', 'Líquida UHT')

    # 4. BEBIDAS (Té, Light, Jugos y Néctares)
    if 'TE ' in name_u or ' TÉ ' in name_u or ('TE' in name_u and any(f in name_u for f in ['LIMON', 'DURAZNO', 'NEGRO', 'VERDE', 'FRUTOS', 'PARMALAT'])):
        return ('Bebidas', 'Té')
    if 'LIGHT' in name_u or 'LIGTH' in name_u:
        return ('Bebidas', 'Light')
    if any(k in name_u for k in ['NECTAR', 'NÉCTAR', 'JUGO', 'NARANJADA', 'DURAZNO', 'MANZANA', 'PERA', 'NARANJA', 'FRUTAS', 'FRICA', 'KAITO', 'YUKERY']) or seg_u == 'PRODBEBIDAS':
        return ('Bebidas', 'Jugos y Néctares')

    # 5. DERIVADOS LACTEOS
    if 'CREMA' in name_u or 'SUERO' in name_u:
        return ('Derivados Lácteos', 'Crema de Leche')
    if 'MANTEQUILLA' in name_u:
        return ('Derivados Lácteos', 'Mantequilla')
    if any(k in name_u for k in ['CABRA', 'QUESO', 'ANANKE', 'ANANKÉ', 'QUIBORENO', 'QUIBOREÑO', 'MADURADO', 'SEMIMADURADO', 'GOUDA', 'PARMESANO', 'EDAM']):
        return ('Derivados Lácteos', 'Quesos de Cabra')

    # 6. EMBUTIDOS
    if 'SALCHICHA' in name_u:
        return ('Embutidos', 'Salchichas')
    if 'MORTADELA' in name_u:
        return ('Embutidos', 'Mortadelas')
    if 'CHORIZO' in name_u or 'CHORIZON' in name_u or 'CHORIZÓN' in name_u:
        return ('Embutidos', 'Chorizos')
    if any(k in name_u for k in ['AHUMADO', 'AHUMADA', 'TOCINETA', 'CHULETA']):
        return ('Embutidos', 'Ahumados')
    if any(k in name_u for k in ['JAMON', 'JAMÓN', 'FIAMBRE', 'PIERNA', 'ESPALDA', 'PECHUGA', 'VISKING', 'AREPERO', 'ALIMEX', 'ITALICO', 'PLUMROSE', 'HERMO']) or seg_u in ['PRODJAMONERIA', 'PRODEMBUTIDOS']:
        return ('Embutidos', 'Jamones')

    return ('Embutidos', 'Jamones')

def extract_competitor_brand(name):
    n = (name or '').upper()
    if 'NATULAC' in n: return 'Natulac'
    if 'PASTORENA' in n or 'PASTOREÑA' in n: return 'Pastoreña'
    if 'SAN SIMON' in n or 'SAN SIMÓN' in n: return 'San Simón'
    if 'CAMPINA' in n or 'CAMPIÑA' in n: return 'La Campiña'
    if 'PLUMROSE' in n: return 'Plumrose'
    if 'PAISA' in n: return 'Paisa'
    if 'FRICA' in n: return 'Frica'
    if 'KAITO' in n: return 'Kaito'
    if 'PARMALAT' in n: return 'Parmalat'
    if 'FIESTA' in n: return 'Fiesta'
    if 'HERMO' in n: return 'Hermo'
    if 'TORONDOI' in n or 'TORONDOY' in n: return 'Torondoy'
    if 'MARACAY' in n or 'LACTEOS MARACAY' in n: return 'Lácteos Maracay'
    if 'MONSERRATINA' in n or 'MONTSERRATINA' in n: return 'La Montserratina'
    if 'MILLENIUM' in n: return 'Millenium'
    if 'ANANKE' in n or 'ANANKÉ' in n: return 'Ananké'
    if 'QUIBORENO' in n or 'QUIBOREÑO' in n: return 'Quiboreño'
    if 'PUROVO' in n: return 'Purovo'
    if 'RICCI' in n: return 'Ricci'
    if 'LEYTON' in n: return 'Leyton'
    if 'QUENACA' in n: return 'Quenaca'
    if 'YUKERY' in n: return 'Yukery'
    if 'OSCAR MAYER' in n: return 'Oscar Mayer'
    if 'FLOR DE ARAGUA' in n: return 'Flor de Aragua'
    return 'Otra Competencia'

def extract_presentation(name):
    n = (name or '').upper()
    if '1L' in n or '1 L' in n or '1 LITRO' in n or '1LT' in n: return '1 Litro'
    if '900GR' in n or '900 GR' in n or '900G' in n: return '900g'
    if '400GR' in n or '400 GR' in n or '400G' in n: return '400g'
    if '500GR' in n or '500 GR' in n or '500G' in n or '500 ML' in n or '500ML' in n or '50OML' in n: return '500g/ml'
    if '250GR' in n or '250 GR' in n or '250G' in n or '250 ML' in n or '250ML' in n: return '250g/ml'
    if '200GR' in n or '200 GR' in n or '200G' in n or '200 ML' in n or '200ML' in n: return '200g/ml'
    if '225GR' in n or '225 GR' in n or '225G' in n: return '225g'
    if '450GR' in n or '450 GR' in n or '450G' in n: return '450g'
    if '800GR' in n or '800 GR' in n or '800G' in n: return '800g'
    if '1KG' in n or '1 KG' in n or '1000G' in n: return '1kg'
    if '30 UND' in n or '30UND' in n or '30 UNIDADES' in n: return '30 und'
    if '15 UND' in n or '15UND' in n or '1X15' in n: return '15 und'
    if '12' in n or '1X12' in n: return '12 und'
    if '6' in n or '1X6' in n or '2 X 6' in n: return '6 und'
    return 'Estándar'

tunal_records = []
with open('data/Precios mas recientes TUNAL.csv', 'r', encoding='latin1') as f:
    for row in csv.DictReader(f, delimiter=';'):
        cat, sub = classify_product(row['Productos'], row.get('Segmento', ''))
        try:
            precio = float(row['Precio_Venta_Detal'].replace(',', '.'))
        except:
            precio = 0.0
        tunal_records.append({
            'origen': 'El Tunal',
            'idDC': row.get('idDC', ''),
            'fecha': row.get('Fecha_DC', ''),
            'ruta': row.get('Ruta', '').strip(),
            'sucCliente': row.get('SucCliente', '').strip(),
            'producto': row.get('Productos', '').strip(),
            'marca': 'El Tunal / Purísima / Alimex',
            'categoria': cat,
            'subcategoria': sub,
            'presentacion': extract_presentation(row.get('Productos', '')),
            'precio': precio
        })

comp_records = []
with open('data/Precios mas recientes Competencia.csv', 'r', encoding='latin1') as f:
    for row in csv.DictReader(f, delimiter=';'):
        cat, sub = classify_product(row['Productos'])
        marca = extract_competitor_brand(row.get('Productos', ''))
        try:
            precio = float(row['Precio_Venta_Detal'].replace(',', '.'))
        except:
            precio = 0.0
        comp_records.append({
            'origen': 'Competencia',
            'idDC': row.get('idDC', ''),
            'fecha': row.get('Fecha_DC', ''),
            'ruta': row.get('Ruta', '').strip(),
            'sucCliente': row.get('SucCliente', '').strip(),
            'producto': row.get('Productos', '').strip(),
            'marca': marca,
            'categoria': cat,
            'subcategoria': sub,
            'presentacion': extract_presentation(row.get('Productos', '')),
            'precio': precio
        })

print(f"Total Tunal parsed: {len(tunal_records)}")
print(f"Total Competencia parsed: {len(comp_records)}")

# Category breakdown
t_cat = Counter((r['categoria'], r['subcategoria']) for r in tunal_records)
c_cat = Counter((r['categoria'], r['subcategoria']) for r in comp_records)

all_cats = sorted(set(list(t_cat.keys()) + list(c_cat.keys())))
print(f"{'Categoria / Subcategoria':<35} | {'Tunal Muestras':<15} | {'Comp Muestras':<15}")
print("-" * 70)
for k in all_cats:
    print(f"{k[0] + ' / ' + k[1]:<35} | {t_cat[k]:<15} | {c_cat[k]:<15}")
