# -*- coding: utf-8 -*-
"""
TÜRKİYE 81 İL PUZZLE MODELİ — Blender 5.2 üretim betiği
=========================================================

Ne yapar?
  * Taban (TEK nesne, tek STL): dikdörtgen çerçeve + Türkiye anakarası için tek ve
    kesintisiz çukur (yuva) + SABİT deniz yüzeyleri + SABİT adalar + SABİT komşu ülkeler.
    Denizler, adalar ve komşu ülkeler tabanla bütünleşiktir; çıkarılabilir parça DEĞİLDİR.
  * 81 il: her biri ayrı nesne ve ayrı STL. Üst yüzeye il adı İÇE GÖMÜLÜ gravür,
    üst çevreye yuvarlatılmış pah. Adalar ilin parçası değil, tabanın sabit parçasıdır.
  * Her nesne için manifold / kapalı mesh doğrulaması, STL dışa aktarımı ve rapor.

Nasıl çalıştırılır?  (ayrıntı: README.md)
  1) Blender 5.2 > Scripting > Open > bu dosya > Run Script   (veya)
  2) blender --background --python turkiye_puzzle.py
  Varsayılan MODE = "TEST": 3 il (büyük/küçük/dar-karmaşık) + taban üretilir.
  Sonuç doğruysa MODE = "FULL" yapıp tekrar çalıştırın (81 il).

Birimler: 1 Blender birimi = 1 mm (sahne birimi de milimetre). STL'ler mm cinsindendir.

Not: 2D coğrafi hazırlık (komşu il sınırlarının onarımı, ofset) `shapely` ister. Blender'ın
Python'unda yoksa betik önce data/geometri_onbellek.json dosyasını kullanır (2D parametreler
aynıysa). Parametre değiştirip önbellek uyuşmazsa betik shapely'yi otomatik kurmayı dener.
"""

# =====================================================================================
#  KULLANICI PARAMETRELERİ  (hepsi milimetre)
# =====================================================================================
MODE = "TEST"                  # "TEST" = TEST_PLATES illeri + taban ; "FULL" = 81 il + taban
TEST_PLATES = (42, 77, 31)     # Konya (büyük), Yalova (küçük), Hatay (dar/karmaşık)

# --- Harita ölçeği / çerçeve -------------------------------------------------------
MAP_WIDTH_MM = 360.0           # Türkiye'nin doğu-batı uzunluğu (adalar dahil)
PROJECTION_LAT0 = 39.0         # eş dikdörtgen izdüşüm standart paraleli (enlem)
FRAME_MARGIN_MM = 30.0         # taban çerçevesi: Türkiye kutusunun her yanındaki pay (seçim: B)

# --- Yükseklikler (z) ---------------------------------------------------------------
LAND_TOP_Z = 6.0               # komşu ülke + ada üst yüzeyi (tabanın en yüksek düzlemi)
SEA_DEPTH_MM = 1.0             # deniz yüzeyi kara yüzeyinin bu kadar altında
POCKET_DEPTH_MM = 3.0          # yuva tabanı = LAND_TOP_Z - POCKET_DEPTH_MM
PIECE_HEIGHT_MM = 5.0          # il parçası yüksekliği (yuva zemininden)
COUNTRY_GROOVE_WIDTH_MM = 0.5  # komşu ülkeler arası sınır olu­ğu genişliği (0 = oluk yok)
COUNTRY_GROOVE_DEPTH_MM = 0.3

# --- MONTAJ TOLERANSI ---------------------------------------------------------------
# POCKET_CLEARANCE_MM: yuva duvarı, birleşik harita dış kenarından HER YANDA bu kadar
#   dışarıdadır (TEK TARAFLI). Yani yuva, birleşik haritadan toplam 2x (=0,50 mm) geniştir.
#   İl parçalarının kendi aralarındaki ortak sınırlar birebir örtüşür (boşluk yok).
POCKET_CLEARANCE_MM = 0.25
# PIECE_GAP_MM: >0 ise komşu iller arasında TOPLAM bu kadar boşluk bırakılır (her il
#   kenarından gap/2 içeri çekilir). Varsayılan 0 = boşluksuz (istenen davranış).
PIECE_GAP_MM = 0.0

# --- Gravür (il adı) ----------------------------------------------------------------
ENGRAVE_DEPTH_MM = 0.40        # içe gömülü yazı derinliği
TEXT_CASE = "upper"            # "upper" (BÜYÜK, Türkçe kurallı İ/I) | "title" (Adıyaman)
TEXT_MAX_CAP_HEIGHT_MM = 6.0   # büyük harf yüksekliği üst sınırı
TEXT_MIN_CAP_HEIGHT_MM = 1.6   # bundan küçük olursa ad yerine plaka kodu denenir (DejaVu Bold gövde ≈ 0,41 mm)
TEXT_WALL_MM = 0.6             # yazı ile pah/kenar arasında bırakılan düz yüzey payı
TEXT_FALLBACK_TO_PLATE = True  # ad sığmazsa plaka kodunu (örn. 77) gravürle
TEXT_SMALL_WALL_MM = 0.45      # çok küçük illerde (son çare) azaltılmış kenar payı
TEXT_ABS_MIN_CAP_HEIGHT_MM = 1.4   # son çare plaka kodu için mutlak alt sınır
FONT_PATH = ""                 # boşsa sistemde kalın bir TTF aranır (Türkçe karakterli olmalı)

# --- Üst kenar pahı -----------------------------------------------------------------
BEVEL_WIDTH_MM = 0.40
BEVEL_SEGMENTS = 4             # 3–4
BEVEL_PROFILE = 0.5            # 0.5 = dairesel yuvarlak
BEVEL_FALLBACK_WIDTHS = (0.30, 0.22, 0.15, 0.10, 0.06)   # dar bölgede otomatik küçültme
BEVEL_MAX_SKIP_FRACTION = 0.25  # çok dar kıyı şeritlerinde pahsız bırakılabilecek en çok çevre oranı

# --- 2D geometri hazırlığı ----------------------------------------------------------
SIMPLIFY_TOL_MM = 0.08         # il sınırı sadeleştirme (pahın düzgün çalışması için)
MIN_EDGE_MM = 0.30             # bundan kısa il kenarları komşularla TUTARLI biçimde birleştirilir (pah için)
MIN_ISLAND_AREA_MM2 = 0.15     # bundan küçük adacıklar basılamaz → atılır (raporlanır)
HOLE_FILL_MAX_MM2 = 20.0       # kaynak veri boşluk/delik onarımı üst sınırı
MAINLAND_MIN_AREA_MM2 = 300.0  # bundan büyük kara bütünleri "anakara" (Anadolu, Trakya)
BORDER_ZONE_MM = 1.6           # ülke sınırı boyunca veri uyuşmazlığı onarım şeridi
BORDER_CLOSE_MM = 0.7

# --- Çıktı --------------------------------------------------------------------------
OUTPUT_DIR = ""                # boşsa <betik klasörü>/cikti
EXPORT_STL = True
SAVE_BLEND = True              # ayrı bir .blend KOPYASI yazar (açık dosyanız bozulmaz)
ASCII_FILENAMES = False        # True: nesne/STL adlarında Türkçe karakterler sadeleştirilir
SELF_INTERSECTION_CHECK = True

# =====================================================================================
import os, sys, json, math, time, hashlib, struct, subprocess, traceback

ALGO_VERSION = "10"
MODE = os.environ.get("TR_PUZZLE_MODE", MODE)     # komut satırından geçici mod seçimi (opsiyonel)

OFFICIAL_PROVINCES = {
    1: "Adana", 2: "Adıyaman", 3: "Afyonkarahisar", 4: "Ağrı", 5: "Amasya", 6: "Ankara",
    7: "Antalya", 8: "Artvin", 9: "Aydın", 10: "Balıkesir", 11: "Bilecik", 12: "Bingöl",
    13: "Bitlis", 14: "Bolu", 15: "Burdur", 16: "Bursa", 17: "Çanakkale", 18: "Çankırı",
    19: "Çorum", 20: "Denizli", 21: "Diyarbakır", 22: "Edirne", 23: "Elazığ", 24: "Erzincan",
    25: "Erzurum", 26: "Eskişehir", 27: "Gaziantep", 28: "Giresun", 29: "Gümüşhane",
    30: "Hakkari", 31: "Hatay", 32: "Isparta", 33: "Mersin", 34: "İstanbul", 35: "İzmir",
    36: "Kars", 37: "Kastamonu", 38: "Kayseri", 39: "Kırklareli", 40: "Kırşehir",
    41: "Kocaeli", 42: "Konya", 43: "Kütahya", 44: "Malatya", 45: "Manisa",
    46: "Kahramanmaraş", 47: "Mardin", 48: "Muğla", 49: "Muş", 50: "Nevşehir", 51: "Niğde",
    52: "Ordu", 53: "Rize", 54: "Sakarya", 55: "Samsun", 56: "Siirt", 57: "Sinop",
    58: "Sivas", 59: "Tekirdağ", 60: "Tokat", 61: "Trabzon", 62: "Tunceli", 63: "Şanlıurfa",
    64: "Uşak", 65: "Van", 66: "Yozgat", 67: "Zonguldak", 68: "Aksaray", 69: "Bayburt",
    70: "Karaman", 71: "Kırıkkale", 72: "Batman", 73: "Şırnak", 74: "Bartın", 75: "Ardahan",
    76: "Iğdır", 77: "Yalova", 78: "Karabük", 79: "Kilis", 80: "Osmaniye", 81: "Düzce",
}
# Kaynak GeoJSON'daki farklı yazımlar → resmî ad (karşılaştırma raporu için)
SOURCE_NAME_ALIASES = {"Afyon": "Afyonkarahisar"}

_TR_FOLD = str.maketrans("çğıöşüÇĞİÖŞÜâîû", "cgiosuCGIOSUaiu")


def fold_ascii(s):
    return s.translate(_TR_FOLD)


def tr_upper(s):
    return s.replace("i", "İ").replace("ı", "I").upper()


def _script_dir():
    try:
        return os.path.dirname(os.path.abspath(__file__))
    except NameError:
        try:
            import bpy
            for t in bpy.data.texts:
                if t.filepath and t.filepath.endswith("turkiye_puzzle.py"):
                    return os.path.dirname(bpy.path.abspath(t.filepath))
        except Exception:
            pass
        return os.getcwd()


PROJECT_DIR = _script_dir()
DATA_DIR = os.path.join(PROJECT_DIR, "data")
CACHE_PATH = os.path.join(DATA_DIR, "geometri_onbellek.json")
TR_GEOJSON = os.path.join(DATA_DIR, "tr-cities.json")
NE_GEOJSON = os.path.join(DATA_DIR, "komsu_ulkeler_ne10m.json")
OUT_DIR = OUTPUT_DIR or os.path.join(PROJECT_DIR, "cikti")


def log(*a):
    print("[TR-PUZZLE]", *a, flush=True)


# =====================================================================================
#  1) 2D COĞRAFİ HAZIRLIK  (shapely)  →  önbellek
# =====================================================================================
def _params_2d():
    return {
        "algo": ALGO_VERSION, "MAP_WIDTH_MM": MAP_WIDTH_MM, "PROJECTION_LAT0": PROJECTION_LAT0,
        "FRAME_MARGIN_MM": FRAME_MARGIN_MM, "LAND_TOP_Z": LAND_TOP_Z, "SEA_DEPTH_MM": SEA_DEPTH_MM,
        "POCKET_CLEARANCE_MM": POCKET_CLEARANCE_MM, "PIECE_GAP_MM": PIECE_GAP_MM,
        "SIMPLIFY_TOL_MM": SIMPLIFY_TOL_MM, "MIN_EDGE_MM": MIN_EDGE_MM, "BEVEL_WIDTH_MM": BEVEL_WIDTH_MM, "MIN_ISLAND_AREA_MM2": MIN_ISLAND_AREA_MM2,
        "HOLE_FILL_MAX_MM2": HOLE_FILL_MAX_MM2, "MAINLAND_MIN_AREA_MM2": MAINLAND_MIN_AREA_MM2,
        "BORDER_ZONE_MM": BORDER_ZONE_MM, "BORDER_CLOSE_MM": BORDER_CLOSE_MM,
        "COUNTRY_GROOVE_WIDTH_MM": COUNTRY_GROOVE_WIDTH_MM,
    }


def _cache_key():
    h = hashlib.sha1(json.dumps(_params_2d(), sort_keys=True).encode())
    for p in (TR_GEOJSON, NE_GEOJSON):
        with open(p, "rb") as f:
            h.update(f.read())
    return h.hexdigest()


def _import_shapely():
    try:
        import shapely  # noqa
        return shapely
    except ImportError:
        pass
    libs = os.path.join(PROJECT_DIR, "_libs")
    if libs not in sys.path:
        sys.path.append(libs)
    try:
        import shapely  # noqa
        return shapely
    except ImportError:
        pass
    log("shapely bulunamadı; Blender Python'una kuruluyor (internet gerekir)...")
    try:
        subprocess.check_call([sys.executable, "-m", "ensurepip"])
    except Exception:
        pass
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--target", libs, "shapely"])
    import importlib
    importlib.invalidate_caches()
    import shapely  # noqa
    return shapely


def _rr(c, nd=5):
    return [round(c[0], nd), round(c[1], nd)]


def _ring_out(ring):
    pts, last = [], None
    for c in list(ring.coords)[:-1]:
        p = _rr(c)
        if p != last:
            pts.append(p)
            last = p
    if len(pts) > 1 and pts[0] == pts[-1]:
        pts.pop()
    return pts


def _poly_out(poly):
    rings = [_ring_out(poly.exterior)] + [_ring_out(r) for r in poly.interiors]
    return [r for r in rings if len(r) >= 3]


def _polys_of(g):
    if g is None or g.is_empty:
        return []
    if g.geom_type == "Polygon":
        return [g]
    if g.geom_type in ("MultiPolygon", "GeometryCollection"):
        out = []
        for x in g.geoms:
            out += _polys_of(x)
        return out
    return []



def _collapse_short_edges(geoms, min_edge, make_valid):
    """Tüm il halkalarında min_edge'den kısa kenarların uçlarını ORTAK köşe haritasıyla birleştirir.
    Komşu iller aynı köşeyi paylaştığı için kapsama (boşluksuz/çakışmasız) bozulmaz."""
    import numpy as _np
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    verts, coords = {}, []

    def vid(c):
        k = (c[0], c[1])
        i = verts.get(k)
        if i is None:
            i = len(coords)
            verts[k] = i
            coords.append(k)
        return i

    structure = {}
    for p, g in geoms.items():
        structure[p] = [[[vid(c) for c in list(r.coords)[:-1]] for r in [pg.exterior] + list(pg.interiors)]
                        for pg in _polys_of(g)]
    edges = set()
    for polys in structure.values():
        for rings in polys:
            for r in rings:
                for i in range(len(r)):
                    a, b = r[i], r[(i + 1) % len(r)]
                    if a != b:
                        edges.add((min(a, b), max(a, b)))
    xy = _np.array(coords)
    parent = list(range(len(coords)))
    members = {i: [i] for i in range(len(coords))}

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    merged = 0
    for L, a, b in sorted((float(_np.hypot(*(xy[a] - xy[b]))), a, b) for a, b in edges):
        if L >= min_edge:
            break
        ra, rb = find(a), find(b)
        if ra == rb:
            continue
        m = members[ra] + members[rb]
        pts = xy[m]
        if (pts.max(0) - pts.min(0)).max() > 1.5 * min_edge:
            continue
        parent[ra] = rb
        members[rb] = m
        del members[ra]
        merged += 1
    cent = {r: tuple(xy[m].mean(0)) for r, m in members.items()}
    out, warn, max_dev = {}, [], 0.0
    for p, polys in structure.items():
        newp = []
        for rings in polys:
            rr = []
            for r in rings:
                pts = []
                for i in r:
                    q = cent[find(i)]
                    if not pts or pts[-1] != q:
                        pts.append(q)
                if len(pts) > 1 and pts[0] == pts[-1]:
                    pts.pop()
                rr.append(pts)
            if len(rr[0]) < 3:
                continue
            pg = Polygon(rr[0], [h for h in rr[1:] if len(h) >= 3])
            if not pg.is_valid:
                warn.append(p)
                pg = make_valid(pg)
            newp.extend(_polys_of(pg))
        out[p] = unary_union(newp)
        max_dev = max(max_dev, abs(out[p].area - geoms[p].area) / max(geoms[p].area, 1e-9))
    return out, {"merged_vertex_pairs": merged, "invalid_fixed": sorted(set(warn)), "max_rel_area_change": max_dev}


def _blunt_sharp_tips(geoms, width, make_valid):
    """Pah genişliği 'width' için güvensiz DIŞBÜKEY sivri uçları (mitre uzunluğu komşu kenarların
    yarısından büyük) budar: köşe silinir, çıkan üçgen kapsama onarımında komşuya gider (kıyıda denize)."""
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    removed = 0
    out = {}
    for p, g in geoms.items():
        new_parts = []
        for pg in _polys_of(g):
            ring = [tuple(c) for c in list(pg.exterior.coords)[:-1]]
            n = len(ring)
            area2 = sum(ring[i][0] * ring[(i + 1) % n][1] - ring[(i + 1) % n][0] * ring[i][1] for i in range(n))
            orient = 1.0 if area2 > 0 else -1.0
            drop = set()
            for i in range(n):
                if (i - 1) % n in drop or n - len(drop) <= 4:
                    continue
                a, v, b = ring[i - 1], ring[i], ring[(i + 1) % n]
                e1 = (v[0] - a[0], v[1] - a[1])
                e2 = (b[0] - v[0], b[1] - v[1])
                if (e1[0] * e2[1] - e1[1] * e2[0]) * orient <= 0:
                    continue                      # dışbükey değil
                l1, l2 = math.hypot(*e1), math.hypot(*e2)
                if l1 < 1e-9 or l2 < 1e-9:
                    continue
                cosv = max(-1.0, min(1.0, ((a[0] - v[0]) * (b[0] - v[0]) + (a[1] - v[1]) * (b[1] - v[1])) / (l1 * l2)))
                theta = math.acos(cosv)
                if theta >= math.radians(95):
                    continue
                if width / math.tan(theta / 2) > 0.5 * min(l1, l2):
                    drop.add(i)
            if drop:
                removed += len(drop)
                ring = [c for i, c in enumerate(ring) if i not in drop]
            if len(ring) < 3:
                continue
            q = Polygon(ring, [list(h.coords)[:-1] for h in pg.interiors])
            if not q.is_valid:
                q = make_valid(q)
            new_parts.extend(_polys_of(q))
        out[p] = unary_union(new_parts)
    return out, removed


def build_geometry_2d():
    """Ham GeoJSON'lardan yerleşim hazır 2D geometriyi üretir. (shapely gerekir)"""
    _import_shapely()
    import shapely
    from shapely import affinity
    from shapely.geometry import shape, box, Polygon, MultiPolygon, LineString
    from shapely.ops import unary_union, polygonize
    from shapely.strtree import STRtree
    from shapely.validation import make_valid

    t0 = time.time()
    report = {"warnings": []}
    with open(TR_GEOJSON, encoding="utf-8") as f:
        tr = json.load(f)
    with open(NE_GEOJSON, encoding="utf-8") as f:
        ne = json.load(f)

    # --- il adı / plaka eşleştirme --------------------------------------------------
    raw = {}
    name_issues = []
    for ft in tr["features"]:
        plate = int(ft["properties"]["number"])
        src_name = ft["properties"]["name"]
        if plate in raw:
            name_issues.append("YİNELENEN plaka %d" % plate)
        raw[plate] = make_valid(shape(ft["geometry"]))
        off = OFFICIAL_PROVINCES.get(plate)
        if off is None:
            name_issues.append("Bilinmeyen plaka %d (%s)" % (plate, src_name))
        elif SOURCE_NAME_ALIASES.get(src_name, src_name) != off:
            name_issues.append("Plaka %d: kaynak '%s' ≠ resmî '%s'" % (plate, src_name, off))
        elif src_name != off:
            name_issues.append("Plaka %d: kaynak adı '%s' resmî ada ('%s') çevrildi" % (plate, src_name, off))
    for plate in OFFICIAL_PROVINCES:
        if plate not in raw:
            name_issues.append("EKSİK il: %d %s" % (plate, OFFICIAL_PROVINCES[plate]))
    report["name_issues"] = name_issues

    # --- izdüşüm + ölçek ------------------------------------------------------------
    k = math.cos(math.radians(PROJECTION_LAT0))
    allt = unary_union(list(raw.values()))
    minx, miny, maxx, maxy = allt.bounds
    s = MAP_WIDTH_MM / ((maxx - minx) * k)
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    M = [s * k, 0, 0, s, -s * k * cx, -s * cy]

    def P(g):
        return affinity.affine_transform(g, M)

    map_h = (maxy - miny) * s
    fw, fh = MAP_WIDTH_MM + 2 * FRAME_MARGIN_MM, map_h + 2 * FRAME_MARGIN_MM
    frame = box(-fw / 2, -fh / 2, fw / 2, fh / 2)
    report.update({"scale_mm_per_deg_lat": s, "map_height_mm": map_h, "frame_mm": [fw, fh]})

    prov = {p: P(g) for p, g in raw.items()}

    # --- anakara / ada ayrımı -------------------------------------------------------
    U0 = unary_union(list(prov.values()))
    comps = [c for c in _polys_of(U0)]
    mainland = [c for c in comps if c.area >= MAINLAND_MIN_AREA_MM2]
    report["mainland_components_mm2"] = sorted([round(c.area, 1) for c in mainland], reverse=True)
    ml_tree = STRtree(mainland)

    def in_mainland(part):
        pt = part.representative_point()
        return len(ml_tree.query(pt, predicate="within")) > 0

    main_parts, island_parts = {}, []
    for p, g in prov.items():
        mp = []
        for part in _polys_of(g):
            if in_mainland(part):
                mp.append(part)
            else:
                island_parts.append(part)
        main_parts[p] = mp

    def repair_coverage(parts_by_plate):
        """Çakışmaları ve boşlukları gideren düzlemsel-graf onarımı; komşu kenarlar BİREBİR ortak olur."""
        items = [(p, part) for p, parts in parts_by_plate.items() for part in parts]
        polys = [part for _, part in items]
        owners = [p for p, _ in items]
        tree = STRtree(polys)
        lines = unary_union([pg.boundary for pg in polys])
        faces = list(polygonize(lines))
        cover = []
        for fc in faces:
            rp = fc.representative_point()
            idx = [i for i in tree.query(rp, predicate="within")]
            cover.append(sorted(set(owners[i] for i in idx)))
        hole_faces_dropped = 0
        assign = [None] * len(faces)
        for i, cs in enumerate(cover):
            if len(cs) == 1:
                assign[i] = cs[0]
        ftree = STRtree(faces)

        def shared_len(i, owner):
            # yüz i'nin, 'owner'a atanmış yüzlerle ortak sınır uzunluğu
            tot = 0.0
            fi = faces[i]
            for j in ftree.query(fi.buffer(1e-7)):
                if j != i and assign[j] == owner:
                    tot += fi.boundary.intersection(faces[j].boundary).length
            return tot

        pending = [i for i in range(len(faces)) if assign[i] is None]
        n_overlap = sum(1 for i in pending if len(cover[i]) >= 2)
        n_gap = len(pending) - n_overlap
        for _round in range(12):
            if not pending:
                break
            nxt = []
            for i in pending:
                if len(cover[i]) >= 2:
                    cands = cover[i]
                else:
                    if faces[i].area > HOLE_FILL_MAX_MM2:
                        assign[i] = -1
                        hole_faces_dropped += 1
                        continue
                    cands = set()
                    for j in ftree.query(faces[i].buffer(1e-7)):
                        if j != i and assign[j] not in (None, -1):
                            cands.add(assign[j])
                    cands = sorted(cands)
                if not cands:
                    nxt.append(i)
                    continue
                best = max(cands, key=lambda o: (shared_len(i, o), -o))
                assign[i] = best
            pending = nxt
        for i in pending:
            assign[i] = -1
        stats = {"faces": len(faces), "overlap_faces": n_overlap, "gap_faces": n_gap,
                 "unassigned_big_holes": hole_faces_dropped}

        by = {}
        for i, o in enumerate(assign):
            if o is not None and o != -1:
                by.setdefault(o, []).append(faces[i])
        fixed = {p: unary_union(by[p]) for p in by}

        # kopuk küçük parçacıkları (veri artığı) komşuya ver
        for _ in range(2):
            for p in list(fixed):
                parts = _polys_of(fixed[p])
                if len(parts) < 2:
                    continue
                parts.sort(key=lambda x: -x.area)
                keep = [parts[0]]
                for part in parts[1:]:
                    if part.area < 3.0:
                        best, bl = None, 0.0
                        for q, gq in fixed.items():
                            if q == p:
                                continue
                            l = part.boundary.intersection(gq.boundary).length
                            if l > bl:
                                best, bl = q, l
                        if best is not None and bl > 0.3 * part.length:
                            fixed[best] = unary_union([fixed[best], part])
                            continue
                    keep.append(part)
                fixed[p] = unary_union(keep)
        # basılamayacak kadar küçük, komşusuz artıkları temizle (kıyı çıkıntısı kalıntıları)
        dropped = 0
        for p_ in list(fixed):
            keep = []
            for part in _polys_of(fixed[p_]):
                if part.area < MIN_ISLAND_AREA_MM2 and not any(
                        q != p_ and part.distance(gq) < 1e-9 and part.boundary.intersection(gq.boundary).length > 0
                        for q, gq in fixed.items()):
                    dropped += 1
                    continue
                keep.append(part)
            fixed[p_] = unary_union(keep)
        stats["tiny_fragments_dropped"] = dropped
        return fixed, stats

    fixed, stats = repair_coverage(main_parts)
    report["coverage_repair"] = stats


    missing = [p for p in OFFICIAL_PROVINCES if p not in fixed or fixed[p].is_empty]
    if missing:
        report["warnings"].append("Anakarada geometrisi olmayan iller: %s" % missing)

    # --- sadeleştirme (kapsama topolojisini bozmadan) --------------------------------
    order = sorted(fixed)
    arr = shapely.coverage_simplify([fixed[p] for p in order], SIMPLIFY_TOL_MM, simplify_boundary=True)
    simp = {p: g for p, g in zip(order, arr)}
    tips = 0
    for _round in range(3):
        n_changes = 0
        if MIN_EDGE_MM > 0:
            simp, crep = _collapse_short_edges(simp, MIN_EDGE_MM, make_valid)
            report["short_edge_collapse"] = crep
            n_changes += crep["merged_vertex_pairs"]
            if crep["invalid_fixed"]:
                report["warnings"].append("Kısa kenar birleştirme sonrası onarılan iller: %s" % crep["invalid_fixed"])
            simp, stats2 = repair_coverage({p: _polys_of(g) for p, g in simp.items()})
            report["coverage_repair_after_collapse"] = stats2
        if BEVEL_WIDTH_MM > 0:
            simp, n_rm = _blunt_sharp_tips(simp, BEVEL_WIDTH_MM, make_valid)
            tips += n_rm
            n_changes += n_rm
            if n_rm:
                simp, _st = repair_coverage({p: _polys_of(g) for p, g in simp.items()})
        if n_changes == 0:
            break
    report["sharp_tips_blunted"] = tips
    mins = []
    for g_ in simp.values():
        for pg_ in _polys_of(g_):
            c_ = list(pg_.exterior.coords)
            mins.extend(math.hypot(c_[i + 1][0] - c_[i][0], c_[i + 1][1] - c_[i][1]) for i in range(len(c_) - 1))
    report["min_edge_mm_after"] = min(mins) if mins else None
    report["edges_below_min_after"] = sum(1 for m_ in mins if m_ < MIN_EDGE_MM)
    inv = shapely.coverage_invalid_edges(list(simp.values()))
    bad = [order[i] for i, e in enumerate(inv) if e is not None and not e.is_empty]
    report["coverage_valid_after_simplify"] = not bad
    if bad:
        report["warnings"].append("Sadeleştirme/birleştirme sonrası uyumsuz kenarlı iller: %s" % bad)

    pieces_union = unary_union(list(simp.values()))
    pieces_area_sum = sum(g.area for g in simp.values())
    overlap_area = pieces_area_sum - pieces_union.area
    report["pieces_area_sum_mm2"] = pieces_area_sum
    report["pieces_union_area_mm2"] = pieces_union.area
    report["pieces_overlap_area_mm2"] = overlap_area

    # --- YUVA (pocket): birleşik anakara + montaj toleransı --------------------------
    # sadeleştirme (0,02 mm) boşluğu hedefin altına düşürmesin diye payı baştan eklenir
    pocket = pieces_union.buffer(POCKET_CLEARANCE_MM + 0.02, quad_segs=6)
    holes_keep = [Polygon(pg.exterior, [r for r in pg.interiors if Polygon(r).area > HOLE_FILL_MAX_MM2])
                  for pg in _polys_of(pocket)]
    pocket = unary_union(holes_keep).simplify(0.02, preserve_topology=True)
    report["pocket_components"] = len(_polys_of(pocket))
    report["pocket_holes"] = sum(len(pg.interiors) for pg in _polys_of(pocket))

    pieces = {}
    for p, g in simp.items():
        gg = g
        if PIECE_GAP_MM > 0:
            gg = g.buffer(-PIECE_GAP_MM / 2, join_style=2, mitre_limit=3)
        pieces[p] = _polys_of(gg)

    # --- adalar (tabana sabit) -------------------------------------------------------
    isl = unary_union(island_parts) if island_parts else Polygon()
    isl_parts_all = _polys_of(isl)
    isl_keep = [x for x in isl_parts_all if x.area >= MIN_ISLAND_AREA_MM2]
    report["islands_total"] = len(isl_parts_all)
    report["islands_kept"] = len(isl_keep)
    report["islands_dropped_area_mm2"] = sum(x.area for x in isl_parts_all if x.area < MIN_ISLAND_AREA_MM2)
    islands = unary_union(isl_keep).simplify(SIMPLIFY_TOL_MM / 2, preserve_topology=True) if isl_keep else Polygon()

    # --- komşu ülkeler + diğer kara (Natural Earth) ----------------------------------
    ne_tur, nbr = None, []
    for ft in ne["features"]:
        g = P(make_valid(shape(ft["geometry"])))
        if ft["properties"]["iso"] == "TUR":
            ne_tur = g
        else:
            c = g.intersection(frame)
            if not c.is_empty:
                nbr.append((ft["properties"]["name"], c))
    ne_tur_b = ne_tur.buffer(0.02)
    touching_parts, border_lines = [], []
    for name, g in nbr:
        for part in _polys_of(g):
            shared = part.boundary.intersection(ne_tur_b)
            if shared.length > 0.8:
                touching_parts.append(part)
                border_lines.append(shared)
    N_all = unary_union([g for _, g in nbr])
    zone = unary_union(border_lines).buffer(BORDER_ZONE_MM) if border_lines else Polygon()
    Z = unary_union([N_all, pocket])
    closed = Z.buffer(BORDER_CLOSE_MM, quad_segs=4).buffer(-BORDER_CLOSE_MM, quad_segs=4)
    fill = closed.difference(Z).intersection(zone)
    fill = unary_union([x for x in _polys_of(fill) if x.area > 1e-4])
    land = unary_union([N_all, islands, fill]).difference(pocket).intersection(frame)
    land = unary_union(_polys_of(land)).simplify(SIMPLIFY_TOL_MM / 2, preserve_topology=True)
    land = land.difference(pocket)
    # küçük kara kalıntıları / küçük göller
    lp = []
    for pg in _polys_of(land):
        if pg.area < MIN_ISLAND_AREA_MM2:
            continue
        lp.append(Polygon(pg.exterior, [r for r in pg.interiors if Polygon(r).area >= MIN_ISLAND_AREA_MM2]))
    land = unary_union(lp)

    # --- komşu ülkeler arası sınır olukları ------------------------------------------
    groove = Polygon()
    if COUNTRY_GROOVE_WIDTH_MM > 0:
        gl = []
        for i in range(len(nbr)):
            bi = nbr[i][1].buffer(0.02)
            for j in range(i + 1, len(nbr)):
                if nbr[j][1].distance(nbr[i][1]) < 0.05:
                    sh = nbr[j][1].boundary.intersection(bi)
                    if sh.length > 0.5:
                        gl.append(sh)
        if gl:
            gl_u = unary_union(gl).buffer(COUNTRY_GROOVE_WIDTH_MM / 2, cap_style=2, quad_segs=2)
            # yuva duvarına ve kıyıya çok yaklaşan kısımları kes (ince duvar oluşmasın)
            safe = land.buffer(-0.4).difference(pocket.buffer(0.4))
            groove = unary_union([x for x in _polys_of(gl_u.intersection(safe)) if x.area > 0.05])
    report["groove_area_mm2"] = groove.area

    # --- bölge bölümlemesi (düzlemsel graf): taban yüzeyleri -------------------------
    # 1 µm ızgarada düğümleme: neredeyse çakışık köşeler birleşir, yüzler tutarlı kalır
    lines = shapely.union_all([frame.boundary, pocket.boundary, land.boundary, groove.boundary], grid_size=1e-3)
    bfaces = list(polygonize(lines))
    from shapely.prepared import prep
    prep_pocket, prep_land, prep_groove = prep(pocket), prep(land), prep(groove)
    base_faces, area_by = [], {}
    for fc in bfaces:
        rp = fc.representative_point()
        if prep_groove.contains(rp):
            cls = "groove"
        elif prep_pocket.contains(rp):
            cls = "pocket"
        elif prep_land.contains(rp):
            cls = "land"
        else:
            cls = "sea"
        area_by[cls] = area_by.get(cls, 0) + fc.area
        rings = _poly_out(fc)
        if rings:
            tris = None
            try:
                pg2 = Polygon(rings[0], rings[1:])
                flat = [tuple(pt) for r in rings for pt in r]
                pos = {}
                for i_, pt in enumerate(flat):
                    pos.setdefault(pt, i_)
                tl, ta = [], 0.0
                for t in shapely.constrained_delaunay_triangles(pg2).geoms:
                    cs = list(t.exterior.coords)[:3]
                    tl.append([pos[(round(q[0], 5), round(q[1], 5))] for q in cs])
                    ta += t.area
                if abs(ta - pg2.area) <= 1e-6 * max(1.0, pg2.area):
                    tris = tl
            except Exception:
                tris = None
            base_faces.append({"c": cls, "r": rings, "t": tris})
    report["base_face_count"] = len(base_faces)
    report["base_area_by_class_mm2"] = area_by
    report["base_area_sum_mm2"] = sum(area_by.values())
    report["frame_area_mm2"] = frame.area

    out = {
        "key": None, "params": _params_2d(), "report": report,
        "frame": [fw, fh], "map_height_mm": map_h,
        "pocket": [_poly_out(pg) for pg in _polys_of(pocket)],
        "provinces": {str(p): [_poly_out(pg) for pg in pieces.get(p, [])] for p in OFFICIAL_PROVINCES},
        "base_faces": base_faces,
    }
    report["seconds"] = round(time.time() - t0, 1)
    log("2D hazırlık tamam (%.1f sn)" % report["seconds"])
    return out


def load_geometry_2d():
    key = _cache_key()
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, encoding="utf-8") as f:
                c = json.load(f)
            if c.get("key") == key:
                log("2D önbellek kullanıldı:", CACHE_PATH)
                return c
            log("Önbellek parametreleri uyuşmuyor; yeniden hesaplanacak.")
        except Exception as e:
            log("Önbellek okunamadı:", e)
    try:
        g = build_geometry_2d()
    except ImportError as e:
        raise RuntimeError("2D parametreler önbellekle uyuşmuyor ve shapely kurulamadı: %s\n"
                           "Çözüm: `python -m pip install shapely` (Blender Python'u için) veya "
                           "parametreleri varsayılana döndürün." % e)
    g["key"] = key
    try:
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(g, f, ensure_ascii=False, separators=(",", ":"))
        log("Önbellek yazıldı:", CACHE_PATH)
    except Exception as e:
        log("Önbellek yazılamadı:", e)
    return g


if __name__ == "__main__" and "--build-cache" in sys.argv:
    # bpy olmadan, sadece 2D önbelleği üretmek için:  python turkiye_puzzle.py --build-cache
    g = build_geometry_2d()
    g["key"] = _cache_key()
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(g, f, ensure_ascii=False, separators=(",", ":"))
    print(json.dumps(g["report"], ensure_ascii=False, indent=1))
    sys.exit(0)

# =====================================================================================
#  2) BLENDER KISMI
# =====================================================================================
import bpy
import bmesh
import numpy as np
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
from mathutils.bvhtree import BVHTree

EPS = 1e-6


class StageError(Exception):
    """Hangi aşamada hata olduğunu açıkça taşıyan hata."""

    def __init__(self, stage, msg):
        super().__init__("[%s] %s" % (stage, msg))
        self.stage = stage


# ------------------------------ mesh yardımcıları ------------------------------------
class MeshBuilder:
    def __init__(self):
        self.bm = bmesh.new()
        self.vc = {}
        self.dup_faces = 0
        self.bad_tess = 0

    def v(self, x, y, z):
        k = (round(x, 5), round(y, 5), round(z, 5))
        vv = self.vc.get(k)
        if vv is None:
            vv = self.bm.verts.new((k[0], k[1], k[2]))
            self.vc[k] = vv
        return vv

    def face(self, *vs):
        try:
            self.bm.faces.new(vs)
        except ValueError:
            self.dup_faces += 1

    def cap(self, rings, z, tris=None, ngon=False):
        """Delikli çokgeni z düzleminde üçgenle (hazır üçgen yoksa Blender tessellate; alanı doğrular).
        ngon=True ve delik yoksa tek bir n-gon yüz üretir (pah sonrası yüz yeniden üçgenlenir)."""
        if ngon and len(rings) == 1:
            self.face(*[self.v(p[0], p[1], z) for p in rings[0]])
            return
        flat = [p for r in rings for p in r]
        if tris is None:
            pts = [[Vector((p[0], p[1], 0.0)) for p in r] for r in rings]
            try:
                tris = tessellate_polygon(pts)
            except Exception as e:
                raise StageError("tessellate", str(e))
        true_area = abs(_ring_area(rings[0])) - sum(abs(_ring_area(h)) for h in rings[1:])
        got = 0.0
        for t in tris:
            a, b, c = (flat[i] for i in t)
            got += abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2
            self.face(self.v(a[0], a[1], z), self.v(b[0], b[1], z), self.v(c[0], c[1], z))
        if abs(got - true_area) > 1e-5 * max(1.0, true_area):
            self.bad_tess += 1

    def finish(self):
        bmesh.ops.recalc_face_normals(self.bm, faces=self.bm.faces)
        return self.bm


def bm_validate(bm):
    r = {"verts": len(bm.verts), "faces": len(bm.faces)}
    r["boundary_edges"] = sum(1 for e in bm.edges if len(e.link_faces) == 1)
    r["nonmanifold_edges"] = sum(1 for e in bm.edges if len(e.link_faces) > 2)
    r["loose_edges"] = sum(1 for e in bm.edges if len(e.link_faces) == 0)
    r["loose_verts"] = sum(1 for v in bm.verts if not v.link_edges)
    r["bowtie_verts"] = sum(1 for v in bm.verts if v.link_edges and not v.is_manifold)
    r["inconsistent_winding"] = sum(1 for e in bm.edges if len(e.link_faces) == 2 and not e.is_contiguous)
    r["zero_area_faces"] = sum(1 for f in bm.faces if f.calc_area() < 1e-9)
    vol = bm.calc_volume(signed=True)
    r["volume_mm3"] = vol
    r["flipped_normals"] = vol <= 0
    parent = list(range(len(bm.verts)))
    bm.verts.index_update()

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for e in bm.edges:
        a, b = find(e.verts[0].index), find(e.verts[1].index)
        if a != b:
            parent[a] = b
    r["shells"] = len({find(v.index) for v in bm.verts if v.link_edges})
    r["closed_manifold"] = (r["boundary_edges"] == 0 and r["nonmanifold_edges"] == 0 and r["loose_edges"] == 0
                            and r["loose_verts"] == 0 and r["bowtie_verts"] == 0
                            and r["inconsistent_winding"] == 0)
    r["ok"] = r["closed_manifold"] and r["zero_area_faces"] == 0 and not r["flipped_normals"]
    return r


def self_intersections(me, shrink=0.002):
    """Kendi kendini kesen üçgen çifti sayısı. Köşe paylaşmayan üçgenler test edilir; yalnızca
    kenar/köşe TEMASI (eşdoğrusal komşuluk) kesişim sayılmasın diye her üçgen %0,2 küçültülür."""
    me.calc_loop_triangles()
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    tri = np.empty(len(me.loop_triangles) * 3, dtype=np.int64)
    me.loop_triangles.foreach_get("vertices", tri)
    tri = tri.reshape(-1, 3)
    v = co[tri]                                            # (T,3,3)
    c = v.mean(1, keepdims=True)
    v = c + (v - c) * (1.0 - shrink)
    verts = [Vector(p) for p in v.reshape(-1, 3)]
    tris = [(3 * i, 3 * i + 1, 3 * i + 2) for i in range(len(tri))]
    bvh = BVHTree.FromPolygons(verts, tris, epsilon=0.0)
    sets = [set(t) for t in tri.tolist()]
    n = 0
    for i, j in bvh.overlap(bvh):
        if i < j and not (sets[i] & sets[j]):
            n += 1
    return n


# ------------------------------ 2D sayısal yardımcılar -------------------------------
def _segments(rings):
    A, B = [], []
    for r in rings:
        a = np.asarray(r, dtype=np.float64)
        A.append(a)
        B.append(np.roll(a, -1, axis=0))
    return np.concatenate(A), np.concatenate(B)


def dist_to_rings(P, rings, chunk=4000):
    """P (N,2) noktalarının halkalara (segmentlere) en kısa uzaklığı."""
    A, B = _segments(rings)
    D = B - A
    L2 = np.maximum((D ** 2).sum(1), 1e-18)
    out = np.empty(len(P))
    for s in range(0, len(P), chunk):
        p = P[s:s + chunk][:, None, :]
        t = np.clip(((p - A[None]) * D[None]).sum(2) / L2[None], 0, 1)
        proj = A[None] + t[..., None] * D[None]
        out[s:s + chunk] = np.sqrt(((p - proj) ** 2).sum(2)).min(1)
    return out


def inside_rings(P, rings, chunk=20000):
    """Çift-tek kuralı ile (delikli) çokgen içinde mi?"""
    A, B = _segments(rings)
    out = np.zeros(len(P), dtype=bool)
    for s in range(0, len(P), chunk):
        p = P[s:s + chunk]
        px, py = p[:, 0:1], p[:, 1:2]
        ay, by = A[:, 1][None], B[:, 1][None]
        ax, bx = A[:, 0][None], B[:, 0][None]
        cond = (ay > py) != (by > py)
        with np.errstate(divide="ignore", invalid="ignore"):
            xint = (bx - ax) * (py - ay) / (by - ay) + ax
        out[s:s + chunk] = ((cond & (px < xint)).sum(1) % 2) == 1
    return out


class SDFGrid:
    """İl içi 'kenara uzaklık' ızgarası (yazı yerleştirme için)."""

    def __init__(self, rings, step=0.25):
        allp = np.concatenate([np.asarray(r) for r in rings])
        self.step = step
        self.x0, self.y0 = allp.min(0) - step
        x1, y1 = allp.max(0) + step
        self.nx = int((x1 - self.x0) / step) + 2
        self.ny = int((y1 - self.y0) / step) + 2
        gx, gy = np.meshgrid(self.x0 + step * np.arange(self.nx), self.y0 + step * np.arange(self.ny))
        P = np.stack([gx.ravel(), gy.ravel()], 1)
        ins = inside_rings(P, rings)
        grid = np.full(len(P), -1e9)
        idx = np.nonzero(ins)[0]
        grid[idx] = dist_to_rings(P[idx], rings)
        self.grid = grid.reshape(self.ny, self.nx)
        self.P = P

    def lookup(self, X, Y):
        ix = np.rint((X - self.x0) / self.step).astype(np.int64)
        iy = np.rint((Y - self.y0) / self.step).astype(np.int64)
        ok = (ix >= 0) & (ix < self.nx) & (iy >= 0) & (iy < self.ny)
        v = np.full(X.shape, -1e9)
        v[ok] = self.grid[iy[ok], ix[ok]]
        return v


# ------------------------------ yazı (gravür) ----------------------------------------
BUNDLED_FONT = os.path.join(PROJECT_DIR, "fonts", "DejaVuSans-Bold.ttf")
FONT_CANDIDATES = [
    BUNDLED_FONT,
    r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\segoeuib.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/Library/Fonts/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
LABEL_CACHE_PATH = os.path.join(DATA_DIR, "yazi_onbellek.json")
LABEL_VERSION = "2"


def resolve_font():
    if FONT_PATH:
        if not os.path.exists(FONT_PATH):
            raise StageError("font", "FONT_PATH bulunamadı: %s" % FONT_PATH)
        return FONT_PATH
    for p_ in FONT_CANDIDATES:
        if os.path.exists(p_):
            return p_
    raise StageError("font", "Kalın bir TTF bulunamadı; FONT_PATH ile Türkçe karakter destekli bir yazı tipi verin")


def label_texts(name):
    return (tr_upper(name) if TEXT_CASE == "upper" else name), None


class GlyphFactory:
    """Yalnızca ETİKET ÖNBELLEĞİ ÜRETİRKEN kullanılır: yazı kontürlerini Blender'dan alır,
    shapely ile birleştirir (çakışan kontürler: Ş, Ç ... → tek temiz çokgen)."""

    def __init__(self, scene, font_path):
        self.scene = scene
        self.font = bpy.data.fonts.load(font_path)
        self.cu = bpy.data.curves.new("TRP_text", "FONT")
        self.cu.extrude = 0.0
        self.cu.fill_mode = "NONE"
        self.cu.resolution_u = 6
        self.cu.size = 1.0
        self.cu.align_x = "CENTER"
        self.cu.align_y = "CENTER"
        self.cu.font = self.font
        self.cu.font_bold = self.font
        self.ob = bpy.data.objects.new("TRP_text", self.cu)
        scene.collection.objects.link(self.ob)
        e_ = self.region("E").bounds
        self.cap_unit = float(e_[3] - e_[1])                 # size=1 için büyük harf yüksekliği
        self.notdef_bounds = tuple(round(v, 4) for v in self.region("\ue000").bounds) if not self.region("\ue000").is_empty else None

    def _loops(self, text):
        self.cu.body = text
        with bpy.context.temp_override(scene=self.scene, view_layer=self.scene.view_layers[0]):
            dg = bpy.context.evaluated_depsgraph_get()
            me = bpy.data.meshes.new_from_object(self.ob.evaluated_get(dg))
        co = np.empty(len(me.vertices) * 3)
        me.vertices.foreach_get("co", co)
        co = co.reshape(-1, 3)[:, :2]
        adj = {}
        for e in me.edges:
            a_, b_ = e.vertices
            adj.setdefault(a_, []).append(b_)
            adj.setdefault(b_, []).append(a_)
        bpy.data.meshes.remove(me)
        seen, loops = set(), []
        for st in adj:
            if st in seen:
                continue
            loop, prev, cur = [st], None, st
            seen.add(st)
            while True:
                nx = [n for n in adj[cur] if n != prev and n not in seen]
                if not nx:
                    break
                prev, cur = cur, nx[0]
                seen.add(cur)
                loop.append(cur)
            if len(loop) >= 3:
                loops.append(co[loop])
        return loops

    def region(self, text):
        from shapely.geometry import Polygon
        from shapely.ops import unary_union
        loops = self._loops(text)
        polys = []
        for l_ in loops:
            pg = Polygon(l_)
            if not pg.is_valid:
                pg = pg.buffer(0)
            if not pg.is_empty:
                polys.append((pg.area, Polygon(l_).exterior.is_ccw, pg))
        if not polys:
            return Polygon()
        outer_ccw = max(polys, key=lambda t: t[0])[1]
        outers = [p_ for _, ccw, p_ in polys if ccw == outer_ccw]
        holes = [p_ for _, ccw, p_ in polys if ccw != outer_ccw]
        res = unary_union(outers)
        return res.difference(unary_union(holes)) if holes else res

    def check_chars(self, chars):
        missing = []
        for ch in sorted(set(chars)):
            if ch == " ":
                continue
            r = self.region(ch)
            if r.is_empty or (self.notdef_bounds and tuple(round(v, 4) for v in r.bounds) == self.notdef_bounds):
                missing.append(ch)
        return missing

    def cleanup(self):
        bpy.data.objects.remove(self.ob)
        bpy.data.curves.remove(self.cu)


def _label_key(font_path):
    h = hashlib.sha1()
    with open(font_path, "rb") as f:
        h.update(f.read())
    h.update(("%s|%s|%s" % (TEXT_CASE, LABEL_VERSION, json.dumps(OFFICIAL_PROVINCES, sort_keys=True, ensure_ascii=False))).encode())
    return h.hexdigest()


def build_labels(scene, font_path):
    """Her il için ad ve plaka kodu çokgenlerini (büyük harf yüksekliği = 1 birim, bbox merkezi orijin) üretir."""
    _import_shapely()
    import shapely
    from shapely.geometry import Polygon
    gf = GlyphFactory(scene, font_path)
    chars = set("".join(label_texts(n)[0] for n in OFFICIAL_PROVINCES.values())) | set("0123456789")
    missing = gf.check_chars(chars)
    out = {"key": _label_key(font_path), "font": os.path.basename(font_path), "missing_chars": missing, "labels": {}}
    if missing:
        gf.cleanup()
        raise StageError("font", "Yazı tipinde eksik karakterler: %s (FONT_PATH ile Türkçe destekli bir TTF verin)" % missing)

    def pack(text):
        g = gf.region(text)
        minx, miny, maxx, maxy = g.bounds
        from shapely import affinity
        g = affinity.affine_transform(g, [1 / gf.cap_unit, 0, 0, 1 / gf.cap_unit,
                                          -(minx + maxx) / 2 / gf.cap_unit, -(miny + maxy) / 2 / gf.cap_unit])
        g = shapely.set_precision(g.simplify(0.003, preserve_topology=True), 1e-5)
        polys = []
        for pg in _polys_of(g):
            rings = _poly_out_n(pg, 5)
            if not rings:
                continue
            tris = None
            try:
                pg2 = Polygon(rings[0], rings[1:])
                flat = [tuple(p_) for r in rings for p_ in r]
                pos = {}
                for i_, p_ in enumerate(flat):
                    pos.setdefault(p_, i_)
                tl, ta = [], 0.0
                for t in shapely.constrained_delaunay_triangles(pg2).geoms:
                    cs = list(t.exterior.coords)[:3]
                    tl.append([pos[(round(q[0], 5), round(q[1], 5))] for q in cs])
                    ta += t.area
                if abs(ta - pg2.area) <= 1e-6:
                    tris = tl
            except Exception:
                tris = None
            polys.append({"r": rings, "t": tris})
        return polys

    for plate, name in OFFICIAL_PROVINCES.items():
        out["labels"][str(plate)] = {"ad": pack(label_texts(name)[0]), "plaka": pack("%02d" % plate)}
    gf.cleanup()
    return out


def _poly_out_n(poly, nd):
    def ring_(r):
        pts, last = [], None
        for c in list(r.coords)[:-1]:
            q = [round(c[0], nd), round(c[1], nd)]
            if q != last:
                pts.append(q)
                last = q
        if len(pts) > 1 and pts[0] == pts[-1]:
            pts.pop()
        return pts
    rings = [ring_(poly.exterior)] + [ring_(r) for r in poly.interiors]
    return [r for r in rings if len(r) >= 3] if len(rings[0]) >= 3 else []


def load_labels(scene):
    font_path = resolve_font()
    key = _label_key(font_path)
    if os.path.exists(LABEL_CACHE_PATH):
        try:
            with open(LABEL_CACHE_PATH, encoding="utf-8") as f:
                c = json.load(f)
            if c.get("key") == key:
                log("Yazı önbelleği kullanıldı (%s)" % c["font"])
                return c
        except Exception as e:
            log("Yazı önbelleği okunamadı:", e)
    log("Yazı çokgenleri üretiliyor (shapely gerekir)...")
    c = build_labels(scene, font_path)
    try:
        with open(LABEL_CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(c, f, ensure_ascii=False, separators=(",", ":"))
    except Exception as e:
        log("Yazı önbelleği yazılamadı:", e)
    return c


class Label:
    """Bir metnin hazır çokgenleri (cap yüksekliği = 1)."""

    def __init__(self, polys):
        self.polys = polys
        pts = []
        for pg in polys:
            for r in pg["r"][:1]:
                a = np.asarray(r, dtype=np.float64)
                pts.append(a)
                pts.append((a + np.roll(a, -1, axis=0)) / 2)
        self.pts = np.unique(np.round(np.concatenate(pts), 5), axis=0)


def fit_text(label, sdf, margin, hmin, hmax):
    """Yazıyı il içine sığdırır. Dönüş: (cap_yüksekliği_mm, açı_rad, cx, cy, min_boşluk) ya da None."""
    cells = np.argwhere(sdf.grid >= margin)
    if len(cells) == 0:
        return None
    if len(cells) > 1500:
        cells = cells[np.linspace(0, len(cells) - 1, 1500).astype(int)]
    cxs = sdf.x0 + sdf.step * cells[:, 1]
    cys = sdf.y0 + sdf.step * cells[:, 0]
    good = np.argwhere(sdf.grid > 0)
    gp = np.stack([sdf.x0 + sdf.step * good[:, 1], sdf.y0 + sdf.step * good[:, 0]], 1)
    w = np.maximum(sdf.grid[good[:, 0], good[:, 1]], 0.0)
    mu = (gp * w[:, None]).sum(0) / max(w.sum(), 1e-9)
    cov = np.cov((gp - mu).T, aweights=np.maximum(w, 1e-6))
    ev, evec = np.linalg.eigh(cov)
    pca = math.atan2(evec[1, 1], evec[0, 1])
    if pca > math.pi / 2:
        pca -= math.pi
    if pca <= -math.pi / 2:
        pca += math.pi
    angles = [0.0]
    if abs(math.degrees(pca)) > 12 and ev[1] / max(ev[0], 1e-9) > 1.6:
        angles.append(pca)
    heights = []
    h = hmax
    while h >= hmin - 1e-9:
        heights.append(h)
        h *= 0.93
    if not heights or heights[-1] > hmin + 1e-6:
        heights.append(hmin)
    results = []
    for ang in angles:
        c, s = math.cos(ang), math.sin(ang)
        R = np.array([[c, s], [-s, c]])
        for hh in heights:
            p = (label.pts * hh) @ R
            best, bi = -1e9, -1
            for st in range(0, len(cxs), 400):
                X = cxs[st:st + 400, None] + p[None, :, 0]
                Y = cys[st:st + 400, None] + p[None, :, 1]
                mn = sdf.lookup(X, Y).min(1)
                j = int(mn.argmax())
                if mn[j] > best:
                    best, bi = float(mn[j]), st + j
            if best >= margin:
                results.append((hh, ang, float(cxs[bi]), float(cys[bi]), best))
                break
    if not results:
        return None
    top = max(r[0] for r in results)
    horiz = [r for r in results if r[1] == 0.0]
    if horiz and horiz[0][0] * 1.25 >= top:
        return horiz[0]
    return max(results, key=lambda r: r[0])


# ------------------------------ il parçası -------------------------------------------
def build_piece_bm(polys, H):
    mb = MeshBuilder()
    for rings in polys:
        mb.cap(rings, H, ngon=True)
        mb.cap(rings, 0.0, ngon=True)
        for ring in rings:
            n = len(ring)
            for i in range(n):
                a, b = ring[i], ring[(i + 1) % n]
                mb.face(mb.v(a[0], a[1], 0.0), mb.v(b[0], b[1], 0.0), mb.v(b[0], b[1], H), mb.v(a[0], a[1], H))
    bm = mb.finish()
    return bm, mb


def thick_edge_mask(polys, w):
    """Her halka kenarı için 'pah sığar mı?' bayrağı: kenarın w kadar içindeki nokta, komşu olmayan
    sınırdan en az ~w uzakta olmalı (yani yerel kalınlık >= 2w). Dar kıyı şeritlerinde pah uygulanmaz."""
    rings = [np.asarray(r, dtype=np.float64) for rr in polys for r in rr]
    A = np.concatenate(rings)
    B = np.concatenate([np.roll(r, -1, axis=0) for r in rings])
    rid = np.concatenate([np.full(len(r), i) for i, r in enumerate(rings)])
    idx = np.concatenate([np.arange(len(r)) for r in rings])
    rlen = np.concatenate([np.full(len(r), len(r)) for r in rings])
    D = B - A
    L = np.maximum(np.hypot(D[:, 0], D[:, 1]), 1e-12)
    N = np.stack([-D[:, 1], D[:, 0]], 1) / L[:, None]
    mid = (A + B) / 2
    flat = [list(map(list, r)) for r in rings]
    q1, q2 = mid + N * w, mid - N * w
    i1, i2 = inside_rings(q1, flat), inside_rings(q2, flat)
    q = np.where(i1[:, None], q1, q2)
    inside_ok = i1 | i2
    L2 = np.maximum((D ** 2).sum(1), 1e-18)
    dmin = np.full(len(q), 1e9)
    for st in range(0, len(q), 400):
        qq = q[st:st + 400][:, None, :]
        t = np.clip(((qq - A[None]) * D[None]).sum(2) / L2[None], 0, 1)
        proj = A[None] + t[..., None] * D[None]
        dist = np.sqrt(((qq - proj) ** 2).sum(2))
        ii = np.arange(st, min(st + 400, len(q)))
        near = (rid[None, :] == rid[ii][:, None])
        diff = np.abs(idx[None, :] - idx[ii][:, None])
        diff = np.minimum(diff, rlen[ii][:, None] - diff)
        dist[near & (diff <= 2)] = 1e9
        dmin[st:st + 400] = dist.min(1)
    keep = inside_ok & (dmin >= 0.95 * w)
    return keep, A, B


def bevel_top(bm, H, width, segments, clamp, polys=None, mb=None):
    keep_xy = None
    vkey = None
    skipped_len = total_len = 0.0
    if polys is not None:
        keep, A, B = thick_edge_mask(polys, width)
        L = np.hypot(*(B - A).T)
        total_len, skipped_len = float(L.sum()), float(L[~keep].sum())
        keep_xy = set()
        bm.verts.index_update()
        vkey = {v.index: (k[0], k[1]) for k, v in mb.vc.items() if abs(k[2] - H) < EPS}
        for k, a_, b_ in zip(keep, A, B):
            if k:
                ka, kb = (round(float(a_[0]), 5), round(float(a_[1]), 5)), (round(float(b_[0]), 5), round(float(b_[1]), 5))
                keep_xy.add((ka, kb))
                keep_xy.add((kb, ka))
    top = []
    for e in bm.edges:
        if abs(e.verts[0].co.z - H) < EPS and abs(e.verts[1].co.z - H) < EPS and len(e.link_faces) == 2:
            nz = sorted(abs(f.normal.z) for f in e.link_faces)
            if nz[0] < 0.5 and nz[1] > 0.5:
                if keep_xy is not None:
                    if (vkey.get(e.verts[0].index), vkey.get(e.verts[1].index)) not in keep_xy:
                        continue
                top.append(e)
    if top:
        bmesh.ops.bevel(bm, geom=top, offset=width, offset_type="OFFSET", profile_type="SUPERELLIPSE",
                        segments=segments, profile=BEVEL_PROFILE, affect="EDGES", clamp_overlap=clamp,
                        loop_slide=True)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return len(top), (skipped_len / total_len if total_len else 0.0)


def bevel_check(bm, H, polys, width, skipped_fraction):
    """Pah gerçekten uygulandı mı? Pahlanan (dar olmayan) kenarların köşelerinde dikey duvarın üst ucu
    H'nin ~width kadar altına inmiş olmalı. Dönüş: (kabul, düz_yüzey_min_inset, pahlanmayan_köşe_oranı)."""
    zat = {}
    for v in bm.verts:
        zat.setdefault((round(v.co.x, 4), round(v.co.y, 4)), []).append(v.co.z)
    drops = []
    for rr in polys:
        for r in rr:
            for pt in r:
                zs = zat.get((round(pt[0], 4), round(pt[1], 4)))
                if zs:
                    drops.append(H - max(zs))
    drops = np.array(drops) if drops else np.array([0.0])
    full = float((drops >= 0.9 * width).mean())
    flat = np.array([[v.co.x, v.co.y] for v in bm.verts if v.co.z > H - EPS])
    inset = float(dist_to_rings(flat, [r for rr in polys for r in rr]).min()) if len(flat) else 0.0
    # pahsız bırakılan kenar payı + tam pahlanmayan köşe payı toplamı sınırlı olmalı
    ok = (full >= 1.0 - max(0.04, 1.5 * skipped_fraction + 0.02)) and skipped_fraction <= BEVEL_MAX_SKIP_FRACTION
    return bool(ok), inset, 1.0 - full


def make_piece_solid(polys, H):
    """Ana katıyı üretir, doğrular, sonra pahı güvenli genişlikle uygular."""
    bm0, mb = build_piece_bm(polys, H)
    base_rep = bm_validate(bm0)
    info = {"base_solid": base_rep, "dup_faces": mb.dup_faces, "bad_tess": mb.bad_tess}
    if not base_rep["ok"]:
        bm0.free()
        raise StageError("ana-kati", "Ana katı geçersiz: %s" % {k: base_rep[k] for k in
                         ("boundary_edges", "nonmanifold_edges", "bowtie_verts", "zero_area_faces", "flipped_normals")})
    bm0.free()
    tried = []
    widths = [BEVEL_WIDTH_MM] + [w for w in BEVEL_FALLBACK_WIDTHS if w < BEVEL_WIDTH_MM - 1e-9]
    # önce tam genişlik (kırpmasız → sonra kırpmalı), sonra daha küçük genişlikler
    for w in widths:
        for clamp in (False, True):
            bm, mbw = build_piece_bm(polys, H)
            try:
                n_edges, skipped = bevel_top(bm, H, w, BEVEL_SEGMENTS, clamp, polys, mbw)
                rep = bm_validate(bm)
                applied, inset, not_full = bevel_check(bm, H, polys, w, skipped)
                si = 0
                if rep["ok"] and applied and SELF_INTERSECTION_CHECK:
                    tmp = bpy.data.meshes.new("TRP_tmp")
                    bm.to_mesh(tmp)
                    si = self_intersections(tmp)
                    bpy.data.meshes.remove(tmp)
            except Exception as e:
                tried.append((w, clamp, "hata: %s" % e))
                bm.free()
                continue
            if rep["ok"] and applied and si == 0:
                info.update({"bevel_width_mm": w, "bevel_requested_mm": BEVEL_WIDTH_MM, "bevel_edges": n_edges,
                             "bevel_top_flat_min_inset_mm": inset, "bevel_clamp_overlap": clamp,
                             "bevel_not_full_fraction": not_full, "bevel_skipped_thin_fraction": skipped,
                             "bevel_tried": tried})
                return bm, info
            tried.append((w, clamp, "geçersiz mesh" if not rep["ok"] else
                          ("kendi kendini kesiyor (%d)" % si if si else "pah tam uygulanmadı")))
            bm.free()
    raise StageError("pah", "Hiçbir pah genişliği güvenli değil: %s" % tried)


def build_cutter_bm(label, h, ang, cx, cy, z0, z1):
    """Etiket çokgenlerinden kapalı, manifold prizma kesici (z0..z1) üretir."""
    c, s = math.cos(ang), math.sin(ang)
    mb = MeshBuilder()

    def tr(r):
        return [[(p[0] * h) * c - (p[1] * h) * s + cx, (p[0] * h) * s + (p[1] * h) * c + cy] for p in r]

    for pg in label.polys:
        rings = [tr(r) for r in pg["r"]]
        mb.cap(rings, z1, pg["t"])
        mb.cap(rings, z0, pg["t"])
        for ring in rings:
            n = len(ring)
            for i in range(n):
                a, b = ring[i], ring[(i + 1) % n]
                mb.face(mb.v(a[0], a[1], z0), mb.v(b[0], b[1], z0), mb.v(b[0], b[1], z1), mb.v(a[0], a[1], z1))
    return mb.finish(), mb


def engrave(scene, bm, polys, H, plate, name, labels, sdf_cache):
    """İl adını Boolean Difference ile üst yüzeye oyar. bm yerinde değişmez; yeni mesh döner."""
    info = {}
    text = label_texts(name)[0]
    margin = info["margin_mm"] = BEVEL_WIDTH_MM + TEXT_WALL_MM + 0.15
    rings = [r for rr in polys for r in rr]
    sdf = sdf_cache.get("sdf") or SDFGrid(rings)
    sdf_cache["sdf"] = sdf
    lab = labels[str(plate)]
    used, fit = None, None
    ladder = [("ad", text, margin, TEXT_MIN_CAP_HEIGHT_MM, "ad")]
    if TEXT_FALLBACK_TO_PLATE:
        ladder.append(("plaka", "%02d" % plate, margin, TEXT_MIN_CAP_HEIGHT_MM, "plaka"))
        small = BEVEL_WIDTH_MM + TEXT_SMALL_WALL_MM + 0.15
        if small < margin - 1e-9:
            ladder.append(("plaka", "%02d" % plate, small, TEXT_ABS_MIN_CAP_HEIGHT_MM, "plaka"))
    for label_name, txt, mg, hmin, key in ladder:
        lb = Label(lab[key])
        fit = fit_text(lb, sdf, mg, hmin, TEXT_MAX_CAP_HEIGHT_MM)
        if fit:
            used = (label_name, txt, lb)
            info["margin_mm"] = mg
            break
    if not fit:
        lb = Label(lab["ad"])
        half_diag = float(np.hypot(*np.abs(lb.pts).max(0))) * TEXT_MIN_CAP_HEIGHT_MM
        need = (half_diag + margin) / max(float(sdf.grid.max()), 1e-6)
        info.update({"mode": "YOK", "text": text,
                     "reason": "ad ve plaka kodu sığmadı (il içine en büyük sığan daire yarıçapı %.2f mm); "
                               "adın sığması için harita genişliği yaklaşık %.0f mm olmalı (pratik değil)" % (
                                   float(sdf.grid.max()), MAP_WIDTH_MM * need)})
        return None, info
    label_name, txt, lb = used
    h, ang, cx, cy, clr = fit
    cbm, cmb = build_cutter_bm(lb, h, ang, cx, cy, H - ENGRAVE_DEPTH_MM, H + 0.5)
    crep = bm_validate(cbm)
    info["cutter_closed_manifold"] = crep["closed_manifold"]
    if not crep["ok"]:
        cbm.free()
        raise StageError("gravur-kesici", "Kesici mesh geçersiz (%s)" % {k: crep[k] for k in
                         ("boundary_edges", "nonmanifold_edges", "bowtie_verts", "zero_area_faces")})
    cutter_vol = abs(crep["volume_mm3"])
    cutter_me = bpy.data.meshes.new("TRP_cutter")
    cbm.to_mesh(cutter_me)
    cbm.free()
    cutter = bpy.data.objects.new("TRP_cutter", cutter_me)
    scene.collection.objects.link(cutter)

    body_me = bpy.data.meshes.new("TRP_body")
    bm.to_mesh(body_me)
    body = bpy.data.objects.new("TRP_body", body_me)
    scene.collection.objects.link(body)
    chk = bmesh.new()
    chk.from_mesh(body_me)
    vol_before = chk.calc_volume(signed=True)
    chk.free()
    result = None
    for tol in (False, True):
        mod = body.modifiers.new("Gravur", "BOOLEAN")
        mod.operation = "DIFFERENCE"
        mod.operand_type = "OBJECT"
        mod.object = cutter
        mod.solver = "EXACT"
        mod.use_self = True
        mod.use_hole_tolerant = tol
        with bpy.context.temp_override(scene=scene, view_layer=scene.view_layers[0]):
            dg = bpy.context.evaluated_depsgraph_get()
            me = bpy.data.meshes.new_from_object(body.evaluated_get(dg))
        body.modifiers.remove(mod)
        rbm = bmesh.new()
        rbm.from_mesh(me)
        rep = bm_validate(rbm)
        if not rep["ok"] and rep["closed_manifold"]:
            # EXACT çözücünün bıraktığı dejenere (alanı ~0) yüzleri temizle, sonra tekrar doğrula
            for _pass in range(3):
                bmesh.ops.dissolve_degenerate(rbm, dist=1e-5, edges=rbm.edges)
                rep = bm_validate(rbm)
                if rep["ok"]:
                    break
            info["degenerate_cleanup"] = True
        if rep["ok"]:
            result = (me, rbm, rep)
            info["boolean_hole_tolerant"] = tol
            break
        rbm.free()
        bpy.data.meshes.remove(me)
    bpy.data.objects.remove(cutter)
    bpy.data.meshes.remove(cutter_me)
    bpy.data.objects.remove(body)
    bpy.data.meshes.remove(body_me)
    if result is None:
        raise StageError("gravur-boolean", "Boolean sonucu manifold değil (%s): %s" % (
            txt, {k: rep[k] for k in ("boundary_edges", "nonmanifold_edges", "bowtie_verts", "zero_area_faces")}))
    me, rbm, rep = result
    removed = vol_before - rep["volume_mm3"]
    expected = cutter_vol * ENGRAVE_DEPTH_MM / (ENGRAVE_DEPTH_MM + 0.5)
    info.update({"mode": "AD" if label_name == "ad" else "PLAKA KODU", "text": txt, "cap_height_mm": h,
                 "angle_deg": math.degrees(ang), "center": [cx, cy], "min_clearance_mm": clr,
                 "removed_mm3": removed, "expected_mm3": expected,
                 "volume_ok": abs(removed - expected) <= 0.10 * expected + 1e-6,
                 "depth_mm": ENGRAVE_DEPTH_MM})
    if not info["volume_ok"]:
        rbm.free()
        bpy.data.meshes.remove(me)
        raise StageError("gravur-dogrulama", "Çıkarılan hacim beklenenden farklı: %.3f vs %.3f" % (removed, expected))
    return (me, rbm), info


# ------------------------------ taban ------------------------------------------------
def build_base(c2d):
    zs = {"land": LAND_TOP_Z, "sea": LAND_TOP_Z - SEA_DEPTH_MM, "pocket": LAND_TOP_Z - POCKET_DEPTH_MM,
          "groove": LAND_TOP_Z - COUNTRY_GROOVE_DEPTH_MM}
    mb = MeshBuilder()
    seg = {}
    levels = {}                                    # düğüm -> kullanılan z seviyeleri
    for f in c2d["base_faces"]:
        cls, z = f["c"], zs[f["c"]]
        mb.cap(f["r"], z, f.get("t"))
        for ring in f["r"]:
            n = len(ring)
            for i in range(n):
                a, b = tuple(ring[i]), tuple(ring[(i + 1) % n])
                seg.setdefault((min(a, b), max(a, b)), []).append((cls, a, b))
                levels.setdefault(a, set()).add(z)
                levels.setdefault(b, set()).add(z)
    outer = {}
    for key, lst in seg.items():
        if len(lst) == 1:
            _, a, b = lst[0]
            levels[a].add(0.0)
            levels[b].add(0.0)

    def wall(a, b, lo, hi):
        """a-b kenarı boyunca lo..hi dikey duvar; uçlardaki ara seviyelere köşe ekler (T-kesişimi olmasın)."""
        pts = [mb.v(a[0], a[1], lo), mb.v(b[0], b[1], lo)]
        pts += [mb.v(b[0], b[1], l) for l in sorted(levels[b]) if lo + 1e-9 < l <= hi + 1e-9]
        pts += [mb.v(a[0], a[1], l) for l in sorted(levels[a], reverse=True) if lo + 1e-9 < l <= hi + 1e-9]
        mb.face(*pts)

    bad = 0
    for key, lst in seg.items():
        if len(lst) == 2:
            z1, z2 = zs[lst[0][0]], zs[lst[1][0]]
            if abs(z1 - z2) > 1e-9:
                wall(lst[0][1], lst[0][2], min(z1, z2), max(z1, z2))
        elif len(lst) == 1:
            cls, a, b = lst[0]
            wall(a, b, 0.0, zs[cls])
            outer.setdefault(a, []).append(b)
            outer.setdefault(b, []).append(a)
        else:
            bad += 1
    if bad:
        raise StageError("taban", "%d kenar 2'den fazla yüzle paylaşılıyor (topoloji hatası)" % bad)
    # alt yüz: çerçeve halkasını sırala
    start = next(iter(outer))
    ring, prev, cur = [start], None, start
    while True:
        nxt = [p for p in outer[cur] if p != prev]
        nx_ = nxt[0] if nxt else None
        if nx_ is None or nx_ == start:
            break
        ring.append(nx_)
        prev, cur = cur, nx_
        if len(ring) > len(outer) + 2:
            raise StageError("taban", "çerçeve halkası kapanmadı")
    if len(ring) != len(outer):
        raise StageError("taban", "çerçeve halkası tek parça değil (%d/%d)" % (len(ring), len(outer)))
    mb.face(*[mb.v(p[0], p[1], 0.0) for p in ring])
    bm = mb.finish()
    return bm, mb, zs


# ------------------------------ STL --------------------------------------------------
def write_stl(me, path):
    me.calc_loop_triangles()
    nt = len(me.loop_triangles)
    co = np.empty(len(me.vertices) * 3, dtype=np.float32)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    tri = np.empty(nt * 3, dtype=np.int32)
    me.loop_triangles.foreach_get("vertices", tri)
    tri = tri.reshape(-1, 3)
    v = co[tri]
    n = np.cross(v[:, 1] - v[:, 0], v[:, 2] - v[:, 0])
    ln = np.linalg.norm(n, axis=1, keepdims=True)
    n = np.divide(n, ln, out=np.zeros_like(n), where=ln > 0)
    rec = np.zeros(nt, dtype=[("n", "<f4", 3), ("v", "<f4", (3, 3)), ("a", "<u2")])
    rec["n"], rec["v"] = n, v
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(b"Turkiye puzzle STL (mm)".ljust(80, b" "))
        f.write(struct.pack("<I", nt))
        rec.tofile(f)
    size = os.path.getsize(path)
    ok = size == 84 + 50 * nt
    bb = (co.min(0).tolist(), co.max(0).tolist())
    return {"path": path, "triangles": nt, "bytes": size, "size_ok": ok, "bbox_min": bb[0], "bbox_max": bb[1]}


def safe_name(s):
    s = fold_ascii(s) if ASCII_FILENAMES else s
    return "".join(ch for ch in s if ch.isalnum() or ch in "_-")


def obj_name(plate):
    return "%02d_%s" % (plate, safe_name(OFFICIAL_PROVINCES[plate]))


# ------------------------------ sahne ------------------------------------------------
def fresh_scene(name):
    old = bpy.data.scenes.get(name)
    if old:
        for ob in list(old.objects):
            bpy.data.objects.remove(ob)
        bpy.data.scenes.remove(old)
    for me in list(bpy.data.meshes):
        if me.users == 0 and me.name.startswith(("TRP_", "01_", "Turkiye")):
            bpy.data.meshes.remove(me)
    sc = bpy.data.scenes.new(name)
    sc.unit_settings.system = "METRIC"
    sc.unit_settings.scale_length = 0.001
    sc.unit_settings.length_unit = "MILLIMETERS"
    return sc


# ------------------------------ ana akış ---------------------------------------------
def main():
    t_start = time.time()
    c2d = load_geometry_2d()
    r2 = c2d["report"]
    plates_all = sorted(OFFICIAL_PROVINCES)
    plates = plates_all if MODE.upper() == "FULL" else [p for p in TEST_PLATES if p in OFFICIAL_PROVINCES]
    scene = fresh_scene("TR_PUZZLE_%s" % MODE.upper())
    col_il = bpy.data.collections.new("Iller")
    col_tb = bpy.data.collections.new("Taban")
    scene.collection.children.link(col_tb)
    scene.collection.children.link(col_il)
    stl_dir = os.path.join(OUT_DIR, "stl")
    os.makedirs(stl_dir, exist_ok=True)

    rep = {"mode": MODE.upper(), "blender": bpy.app.version_string, "params": _params_2d(),
           "geometry_2d": r2, "provinces": [], "errors": [], "warnings": []}
    rep["params"].update({
        "BEVEL_WIDTH_MM": BEVEL_WIDTH_MM, "BEVEL_SEGMENTS": BEVEL_SEGMENTS, "ENGRAVE_DEPTH_MM": ENGRAVE_DEPTH_MM,
        "PIECE_HEIGHT_MM": PIECE_HEIGHT_MM, "POCKET_DEPTH_MM": POCKET_DEPTH_MM, "TEXT_CASE": TEXT_CASE})

    # --- yazı (etiket) çokgenleri + Türkçe karakter denetimi ---------------------------
    labels_c = load_labels(scene)
    labels = labels_c["labels"]
    rep["font"] = labels_c["font"]
    rep["font_missing_chars"] = labels_c.get("missing_chars", [])
    log("Yazı tipi:", labels_c["font"], "| eksik karakter:", rep["font_missing_chars"] or "yok")

    # --- TABAN ---------------------------------------------------------------------
    base = {"object": "Turkiye_Taban"}
    try:
        bm, mb, zs = build_base(c2d)
        base["mesh"] = bm_validate(bm)
        base["dup_faces"], base["bad_tess"] = mb.dup_faces, mb.bad_tess
        me = bpy.data.meshes.new("Turkiye_Taban")
        bm.to_mesh(me)
        bm.free()
        ob = bpy.data.objects.new("Turkiye_Taban", me)
        col_tb.objects.link(ob)
        ob["rol"] = "taban: yuva + deniz + adalar + komsu ulkeler (sabit, tek govde)"
        if SELF_INTERSECTION_CHECK:
            base["self_intersections"] = self_intersections(me)
        base["levels_z"] = zs
        base["size_mm"] = [c2d["frame"][0], c2d["frame"][1], LAND_TOP_Z]
        if EXPORT_STL:
            base["stl"] = write_stl(me, os.path.join(stl_dir, "Turkiye_Taban.stl"))
        base["status"] = "OK" if base["mesh"]["ok"] and base.get("self_intersections", 0) == 0 else "SORUNLU"
        log("Taban:", base["status"], "| yüz:", base["mesh"]["faces"])
    except Exception as e:
        base["status"] = "HATA"
        base["error"] = str(e)
        rep["errors"].append("TABAN: %s" % e)
        log("TABAN HATASI:", e)
        traceback.print_exc()
    rep["base"] = base

    # --- İL PARÇALARI --------------------------------------------------------------
    pocket_rings = [r for poly in c2d["pocket"] for r in poly]
    zF = LAND_TOP_Z - POCKET_DEPTH_MM
    for plate in plates:
        name = OFFICIAL_PROVINCES[plate]
        rec = {"plate": plate, "name": name, "object": obj_name(plate), "stage": "baslangic"}
        t0 = time.time()
        try:
            polys = c2d["provinces"].get(str(plate), [])
            if not polys:
                raise StageError("veri", "ilin anakara geometrisi yok")
            rec["parts"] = len(polys)
            rec["area_mm2"] = sum(abs(_ring_area(poly[0])) - sum(abs(_ring_area(h)) for h in poly[1:]) for poly in polys)
            rec["stage"] = "katı+pah"
            bm, info = make_piece_solid(polys, PIECE_HEIGHT_MM)
            rec.update({"bevel_width_mm": info["bevel_width_mm"], "bevel_edges": info["bevel_edges"],
                        "bevel_top_flat_min_inset_mm": info["bevel_top_flat_min_inset_mm"],
                        "bevel_clamp_overlap": info["bevel_clamp_overlap"],
                        "bevel_reduced": info["bevel_width_mm"] < BEVEL_WIDTH_MM - 1e-9,
                        "base_solid_ok": info["base_solid"]["ok"], "dup_faces": info["dup_faces"],
                        "bad_tess": info["bad_tess"]})
            rec["stage"] = "gravur"
            eng, einfo = engrave(scene, bm, polys, PIECE_HEIGHT_MM, plate, name, labels, {})
            rec["engrave"] = einfo
            if eng is None:
                # gravür fiziksel olarak mümkün değil: parça yine üretilir, durum UYARI olur
                me = bpy.data.meshes.new(rec["object"])
                bm.to_mesh(me)
                rbm = bm
                rec["warning"] = "GRAVÜR YOK: " + einfo.get("reason", "yazı yerleştirilemedi")
                rep["warnings"].append("%02d %s: %s" % (plate, name, rec["warning"]))
            else:
                me, rbm = eng
                bm.free()
            rec["stage"] = "dogrulama"
            rec["mesh"] = bm_validate(rbm)
            rbm.to_mesh(me)
            rbm.free()
            me.name = rec["object"]
            if SELF_INTERSECTION_CHECK:
                rec["self_intersections"] = self_intersections(me)
            # yuva uyumu
            pts = np.array([p for poly in polys for r in poly for p in r])
            rec["fit_inside_pocket"] = bool(inside_rings(pts, pocket_rings).all())
            rec["fit_min_clearance_mm"] = float(dist_to_rings(pts, pocket_rings).min())
            rec["fit_ok"] = rec["fit_inside_pocket"] and rec["fit_min_clearance_mm"] >= POCKET_CLEARANCE_MM - 0.005
            ob = bpy.data.objects.new(rec["object"], me)
            ob.location = (0.0, 0.0, zF)
            ob["plaka"] = plate
            ob["il_adi"] = name
            col_il.objects.link(ob)
            rec["stage"] = "stl"
            if EXPORT_STL:
                rec["stl"] = write_stl(me, os.path.join(stl_dir, rec["object"] + ".stl"))
            solid_ok = (rec["mesh"]["ok"] and rec.get("self_intersections", 0) == 0 and rec["fit_ok"]
                        and (not EXPORT_STL or rec["stl"]["size_ok"]))
            if not solid_ok or (rec["engrave"].get("mode") != "YOK" and not rec["engrave"].get("volume_ok", False)):
                rec["status"] = "SORUNLU"
            else:
                rec["status"] = "UYARI" if rec.get("warning") else "OK"
            rec["seconds"] = round(time.time() - t0, 1)
            e = rec["engrave"]
            log("%02d %-15s %s | pah %.2f | yazı:%s %.1fmm | %.1fs" % (
                plate, name, rec["status"], rec["bevel_width_mm"], e["mode"], e.get("cap_height_mm", 0), rec["seconds"]))
        except Exception as e:
            rec["status"] = "HATA"
            rec["error"] = "%s (aşama: %s)" % (e, rec.get("stage"))
            rep["errors"].append("%02d %s: %s" % (plate, name, rec["error"]))
            log("HATA %02d %s -> %s" % (plate, name, rec["error"]))
            traceback.print_exc()
        rep["provinces"].append(rec)

    # --- ADLANDIRMA / SAYI DOĞRULAMA -----------------------------------------------
    il_objs = [o.name for o in col_il.objects]
    expected = [obj_name(p) for p in plates]
    stl_files = sorted(f for f in os.listdir(stl_dir) if f.endswith(".stl")) if EXPORT_STL else []
    chk = {
        "beklenen_il_sayisi": len(plates), "olusan_il_nesnesi": len(il_objs),
        "yinelenen_nesne_adi": sorted({n for n in il_objs if il_objs.count(n) > 1}),
        "eksik_il_nesnesi": sorted(set(expected) - set(il_objs)),
        "fazla_il_nesnesi": sorted(set(il_objs) - set(expected)),
        "kaynak_ad_sorunlari": r2.get("name_issues", []),
        "resmi_liste_sayisi": len(OFFICIAL_PROVINCES),
        "stl_dosya_sayisi_il": len([f for f in stl_files if f != "Turkiye_Taban.stl"]),
        "stl_adlari_nesne_adlariyla_uyumlu": sorted(set(expected) - {f[:-4] for f in stl_files}) == [] if EXPORT_STL else None,
        "taban_nesnesi_var": "Turkiye_Taban" in [o.name for o in col_tb.objects],
    }
    chk["ok"] = (chk["beklenen_il_sayisi"] == chk["olusan_il_nesnesi"] and not chk["yinelenen_nesne_adi"]
                 and not chk["eksik_il_nesnesi"] and not chk["fazla_il_nesnesi"] and chk["taban_nesnesi_var"]
                 and chk["resmi_liste_sayisi"] == 81 and chk["stl_adlari_nesne_adlariyla_uyumlu"] in (True, None))
    rep["name_count_check"] = chk

    # --- raporu yaz ----------------------------------------------------------------
    rep["seconds"] = round(time.time() - t_start, 1)
    write_reports(rep)
    if SAVE_BLEND:
        try:
            p = os.path.join(OUT_DIR, "turkiye_puzzle_%s.blend" % MODE.lower())
            bpy.ops.wm.save_as_mainfile(filepath=p, copy=True)
            log("Blend kopyası:", p)
        except Exception as e:
            log("Blend kaydedilemedi:", e)
    bad = [r for r in rep["provinces"] if r["status"] not in ("OK", "UYARI")]
    warn = [r for r in rep["provinces"] if r["status"] == "UYARI"]
    log("ÖZET: %d il işlendi, %d OK, %d uyarı (gravür yok), %d sorunlu/hatalı, taban: %s, adlandırma/sayı denetimi: %s" % (
        len(rep["provinces"]), len(rep["provinces"]) - len(bad) - len(warn), len(warn), len(bad), base.get("status"),
        "OK" if chk["ok"] else "SORUNLU"))
    return rep


def _ring_area(r):
    a = 0.0
    for i in range(len(r)):
        x1, y1 = r[i]
        x2, y2 = r[(i + 1) % len(r)]
        a += x1 * y2 - x2 * y1
    return a / 2


def write_reports(rep):
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "rapor_%s.json" % rep["mode"].lower()), "w", encoding="utf-8") as f:
        json.dump(rep, f, ensure_ascii=False, indent=1, default=str)
    import csv
    with open(os.path.join(OUT_DIR, "rapor_iller_%s.csv" % rep["mode"].lower()), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["plaka", "il", "nesne", "durum", "parca_sayisi", "kapali_manifold", "acik_kenar", "manifold_olmayan_kenar",
                    "sifir_alan_yuz", "ters_normal", "govde_sayisi", "kendi_kesisim", "hacim_mm3", "pah_mm", "pah_kucultuldu",
                    "yazi_modu", "yazi", "yazi_cap_mm", "yazi_aci", "gravur_derinlik_mm", "yuvaya_uyum", "min_bosluk_mm",
                    "stl_dosya", "stl_ucgen", "stl_bayt", "stl_ok", "hata"])
        for r in rep["provinces"]:
            m, e, s = r.get("mesh", {}), r.get("engrave", {}), r.get("stl", {})
            w.writerow([r["plate"], r["name"], r["object"], r["status"], r.get("parts"), m.get("closed_manifold"),
                        m.get("boundary_edges"), m.get("nonmanifold_edges"), m.get("zero_area_faces"), m.get("flipped_normals"),
                        m.get("shells"), r.get("self_intersections"), round(m.get("volume_mm3", 0), 2), r.get("bevel_width_mm"),
                        r.get("bevel_reduced"), e.get("mode"), e.get("text"), round(e.get("cap_height_mm", 0), 2),
                        round(e.get("angle_deg", 0), 1), e.get("depth_mm"), r.get("fit_ok"),
                        round(r.get("fit_min_clearance_mm", 0), 3), os.path.basename(s.get("path", "")), s.get("triangles"),
                        s.get("bytes"), s.get("size_ok"), r.get("error", "")])
    L = []
    A = L.append
    A("TÜRKİYE PUZZLE — DOĞRULAMA RAPORU  (mod: %s, Blender %s, %.0f sn)" % (rep["mode"], rep["blender"], rep["seconds"]))
    A("=" * 100)
    p = rep["params"]
    A("Parametreler: harita %.0f mm | çerçeve payı %.0f mm | pah %.2f mm x %d seg | gravür %.2f mm | yuva toleransı %.2f mm/YAN (toplam %.2f mm) | il boşluğu %.2f mm" % (
        p["MAP_WIDTH_MM"], p["FRAME_MARGIN_MM"], p["BEVEL_WIDTH_MM"], p["BEVEL_SEGMENTS"], p["ENGRAVE_DEPTH_MM"],
        p["POCKET_CLEARANCE_MM"], 2 * p["POCKET_CLEARANCE_MM"], p["PIECE_GAP_MM"]))
    A("Yazı tipi: %s" % rep["font"])
    g = rep["geometry_2d"]
    A("")
    A("[2D COĞRAFİ HAZIRLIK]")
    A("  Kaynak komşu-sınır onarımı: %s" % g.get("coverage_repair"))
    A("  Kapsama geçerli (sadeleştirme sonrası): %s | il parçaları çakışma alanı: %.2e mm² | birleşim=toplam alan: %s" % (
        g.get("coverage_valid_after_simplify"), g.get("pieces_overlap_area_mm2", 0),
        abs(g.get("pieces_area_sum_mm2", 0) - g.get("pieces_union_area_mm2", 1)) < 1e-6))
    A("  Yuva: %d bileşen, %d iç ada(deniz) | anakara bütünleri mm²: %s" % (
        g.get("pocket_components"), g.get("pocket_holes"), g.get("mainland_components_mm2")))
    A("  Adalar: %d bulundu, %d tabana sabitlendi, %d basılamayacak kadar küçük atıldı (toplam %.2f mm²)" % (
        g.get("islands_total", 0), g.get("islands_kept", 0), g.get("islands_total", 0) - g.get("islands_kept", 0),
        g.get("islands_dropped_area_mm2", 0)))
    A("  Taban yüzey alanları: %s (toplam=çerçeve: %s)" % (
        {k: round(v) for k, v in g.get("base_area_by_class_mm2", {}).items()},
        abs(g.get("base_area_sum_mm2", 0) - g.get("frame_area_mm2", 1)) < 1e-5 * g.get("frame_area_mm2", 1)))
    for w_ in g.get("warnings", []):
        A("  UYARI: %s" % w_)
    A("")
    A("[TABAN]  durum: %s" % rep["base"].get("status"))
    b = rep["base"]
    if "mesh" in b:
        m = b["mesh"]
        A("  kapalı-manifold=%s açık_kenar=%d manifold_olmayan=%d sıfır_alan=%d ters_normal=%s gövde=%d kendi_kesişim=%s" % (
            m["closed_manifold"], m["boundary_edges"], m["nonmanifold_edges"], m["zero_area_faces"], m["flipped_normals"],
            m["shells"], b.get("self_intersections")))
        A("  boyut %.1f x %.1f x %.1f mm | seviyeler z: %s" % (b["size_mm"][0], b["size_mm"][1], b["size_mm"][2], b["levels_z"]))
    if "stl" in b:
        A("  STL: %s (%d üçgen, %d bayt, boyut_ok=%s)" % (os.path.basename(b["stl"]["path"]), b["stl"]["triangles"], b["stl"]["bytes"], b["stl"]["size_ok"]))
    if "error" in b:
        A("  HATA: %s" % b["error"])
    A("")
    A("[İL PARÇALARI]")
    A("%-3s %-15s %-8s %-6s %-5s %-6s %-7s %-14s %-6s %-8s %s" % ("No", "İl", "Durum", "Manif.", "Gövde", "Pah", "Yuva", "Yazı", "Cap", "STL", "Not"))
    for r in rep["provinces"]:
        m, e, s = r.get("mesh", {}), r.get("engrave", {}), r.get("stl", {})
        note = r.get("error", "")
        if r.get("bevel_reduced"):
            note += " pah küçültüldü"
        if e.get("mode") == "PLAKA KODU":
            note += " ad sığmadı→plaka kodu"
        A("%02d  %-15s %-8s %-6s %-5s %-6s %-7s %-14s %-6s %-8s %s" % (
            r["plate"], r["name"], r["status"], m.get("closed_manifold"), m.get("shells"), r.get("bevel_width_mm"),
            r.get("fit_ok"), "%s:%s" % (e.get("mode"), e.get("text")), "%.1f" % e["cap_height_mm"] if "cap_height_mm" in e else "-",
            s.get("size_ok"), note.strip()))
    c = rep["name_count_check"]
    A("")
    A("[AD / SAYI DOĞRULAMA]  sonuç: %s" % ("TAMAM" if c["ok"] else "SORUNLU"))
    for k, v in c.items():
        A("  %s: %s" % (k, v))
    if rep["warnings"]:
        A("")
        A("[UYARILAR]")
        for w_ in rep["warnings"]:
            A("  " + w_)
    if rep["errors"]:
        A("")
        A("[HATALAR]")
        for e in rep["errors"]:
            A("  " + e)
    with open(os.path.join(OUT_DIR, "rapor_%s.txt" % rep["mode"].lower()), "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    print("\n".join(L))


if __name__ == "__main__":
    main()
