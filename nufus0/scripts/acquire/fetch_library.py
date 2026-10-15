#!/usr/bin/env python3
"""Ses kütüphanesi edinme betiği (yalnızca Python standart kütüphanesi).

  python3 scripts/acquire/fetch_library.py [incompetech|mixkit|bbc|all] [--limit N]

Her kaynak public/audio/library/<kaynak>/ altına iner ve yanına _meta.json yazılır (etiketler, başlık, lisans, atıf).
Lisans sınıfları public/audio/library/ledger.json'dadır. Bu klasörler yeniden dağıtım şartları yüzünden .gitignore'dadır:
repoda betik + defter durur, dosyaları herkes kendi makinesinde bu betikle indirir.
"""
import concurrent.futures as cf, html, json, os, re, shutil, subprocess, sys, time, urllib.parse, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LIB = os.path.join(ROOT, "public", "audio", "library")
UA = {"User-Agent": "Mozilla/5.0 (compatible; nufus0-library-fetch/1.0)"}
HAVE_FFMPEG = shutil.which("ffmpeg") is not None


def get(url, data=None, headers=None, retries=3, timeout=60):
    h = dict(UA); h.update(headers or {})
    for i in range(retries):
        try:
            req = urllib.request.Request(url, data=data, headers=h)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            if i == retries - 1:
                raise
            time.sleep(1.5 * (i + 1))


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "x"


def words(*texts):
    out = []
    for t in texts:
        out += re.findall(r"[a-z]{3,}", (t or "").lower())
    stop = {"the", "and", "with", "for", "from", "that", "this", "are", "was", "sound", "sounds", "effect", "effects"}
    return sorted({w for w in out if w not in stop})


def write_meta(pack, files):
    d = os.path.join(LIB, pack)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "_meta.json"), "w", encoding="utf8") as f:
        json.dump({"pack": pack, "files": files}, f, ensure_ascii=False, indent=1)


def pmap(fn, items, workers=6):
    res = []
    with cf.ThreadPoolExecutor(workers) as ex:
        for r in ex.map(lambda x: safe(fn, x), items):
            if r:
                res.append(r)
    return res


def safe(fn, x):
    try:
        return fn(x)
    except Exception as e:
        print("  ! atlandı:", str(e)[:90])
        return None


# ------------------------------------------------------------------ incompetech (CC BY 4.0, atıf zorunlu)
DARK = ("dark", "ominous", "tense", "suspense", "eerie", "myster", "creep", "horror", "ambient", "drone", "uneasy", "spooky", "sinister", "anxious", "haunt", "sad", "melanchol", "noir", "calm", "slow")


def to_sec(s):
    h, m, x = (int(v) for v in s.split(":"))
    return h * 3600 + m * 60 + x


def fetch_incompetech(limit):
    base = "https://incompetech.com/music/royalty-free/"
    pieces = json.loads(get(base + "pieces.json"))
    genres = {str(g["id"]): g["genre"] for g in json.loads(get(base + "genre.json"))}
    cand = []
    for p in pieces:
        txt = " ".join(str(p.get(k) or "") for k in ("feel", "description", "title")).lower()
        gen = genres.get(str(p.get("genre")), "")
        score = sum(k in txt for k in DARK) + (3 if gen.lower() in ("horror", "cinematic", "ambient") else 0)
        sec = to_sec(p["length"])
        if score and 50 <= sec <= 330:
            cand.append((score, p, gen, sec))
    cand.sort(key=lambda c: (-c[0], c[1]["title"]))
    cand = cand[:limit]
    print(f"incompetech: {len(cand)} parça seçildi")
    out_dir = os.path.join(LIB, "incompetech"); os.makedirs(out_dir, exist_ok=True)

    def one(c):
        _, p, gen, sec = c
        fn = slug(p["title"]) + ".mp3"
        dst = os.path.join(out_dir, fn)
        if not os.path.exists(dst):
            raw = get(base + "mp3-royaltyfree/" + urllib.parse.quote(p["filename"]), timeout=180)
            tmp = dst + ".raw"
            open(tmp, "wb").write(raw)
            if HAVE_FFMPEG:  # 320 kbps → 128 kbps (disk tasarrufu)
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-b:a", "128k", "-map_metadata", "-1", dst], check=True)
                os.remove(tmp)
            else:
                os.replace(tmp, dst)
        attr = f'"{p["title"]}" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/'
        return {"file": fn, "title": p["title"], "tags": words(p["title"], p.get("feel"), p.get("description"), gen) + ["music"],
                "durationSec": sec, "bpm": p.get("bpm"), "attribution": attr, "sourceUrl": base + "mp3-royaltyfree/" + urllib.parse.quote(p["filename"])}
    files = pmap(one, cand, workers=3)
    write_meta("incompetech", files)
    print(f"incompetech: {len(files)} dosya")


# ------------------------------------------------------------------ Mixkit (Mixkit Sound Effects Free License)
MIX_KEYS = ("ambience", "horror", "alarm", "alert", "beep", "bleep", "bell", "boom", "break", "breath", "buzzer", "camera", "chime", "clock", "computer", "door", "electric", "elevator", "error", "foot", "glitch", "heart", "hit", "impact", "keyboard", "knock", "light", "machine", "metal", "notification", "paper", "phone", "radio", "rain", "scary", "static", "suspense", "switch", "tape", "thunder", "transition", "typing", "whoosh", "wind", "wood", "zap", "tv", "dark", "cinematic", "creak", "drone", "night", "office", "rope", "stairs", "water")


def fetch_mixkit(limit):
    cats_html = get("https://mixkit.co/free-sound-effects/").decode("utf8", "ignore")
    cats = sorted(set(re.findall(r'href="/free-sound-effects/([a-z0-9-]+)/"', cats_html)))
    cats = [c for c in cats if any(k in c for k in MIX_KEYS)]
    print(f"mixkit: {len(cats)} kategori")
    items = {}
    for c in cats:
        for page in (1, 2):
            try:
                h = get(f"https://mixkit.co/free-sound-effects/{c}/" + (f"?page={page}" if page > 1 else "")).decode("utf8", "ignore")
            except Exception:
                break
            urls = re.findall(r'data-audio-player-preview-url-value="([^"]+)"', h)
            titles = re.findall(r'item-grid-card__title">\s*([^<]+?)\s*</h2>', h)
            if not urls:
                break
            for u, t in zip(urls, titles):
                iid = re.search(r"/sfx/(\d+)/", u).group(1)
                it = items.setdefault(iid, {"url": u, "title": html.unescape(t), "cats": set()})
                it["cats"].add(c)
            time.sleep(0.2)
    lst = sorted(items.items(), key=lambda kv: int(kv[0]))[:limit]
    print(f"mixkit: {len(lst)} ses")
    out_dir = os.path.join(LIB, "mixkit"); os.makedirs(out_dir, exist_ok=True)

    def one(kv):
        iid, it = kv
        fn = f"{slug(it['title'])}-{iid}.mp3"
        dst = os.path.join(out_dir, fn)
        if not os.path.exists(dst):
            open(dst, "wb").write(get(it["url"]))
        return {"file": fn, "title": it["title"], "tags": words(it["title"], " ".join(it["cats"]).replace("-", " ")), "sourceUrl": it["url"]}
    files = pmap(one, lst, workers=8)
    write_meta("mixkit", files)
    print(f"mixkit: {len(files)} dosya")


# ------------------------------------------------------------------ BBC Sound Effects (RemArc: ticari OLMAYAN kullanım)
BBC_QUERIES = ["room tone", "ambience night", "clock tick", "door creak", "door close", "door slam", "footsteps", "footsteps stairs", "typewriter", "telephone ring", "wind", "rain", "thunder", "electrical hum", "machinery", "alarm", "siren", "crowd murmur", "heartbeat", "breathing", "lift", "keys", "paper rustle", "radio static", "light switch", "refrigerator", "water drip", "wood creak", "church bell", "tape", "television", "knock", "bang", "clang", "bell", "whistle", "children playing", "cat", "dog bark", "traffic", "street", "cafe", "kitchen", "tap running", "kettle", "glass", "cutlery", "stairs", "attic", "cellar"]


def fetch_bbc(limit):
    api = "https://sound-effects-api.bbcrewind.co.uk/api/sfx/search"
    seen = {}
    for q in BBC_QUERIES:
        body = {"criteria": {"query": q, "from": 0, "size": 12, "tags": None, "categories": None, "durations": None, "continents": None, "sortBy": None, "source": None, "recordist": None, "habitat": None}, "sections": ["results"]}
        try:
            d = json.loads(get(api, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}))
        except Exception as e:
            print("  ! arama hatası", q, str(e)[:60]); continue
        for r in d.get("results", []):
            dur = float(r.get("duration") or 0) / 1000.0
            if r["id"] in seen or not (1.0 <= dur <= 45):
                continue
            seen[r["id"]] = {"q": q, "r": r, "dur": dur}
        time.sleep(0.15)
    lst = list(seen.items())[:limit]
    print(f"bbc: {len(lst)} ses")
    out_dir = os.path.join(LIB, "bbc-sfx"); os.makedirs(out_dir, exist_ok=True)

    def one(kv):
        sid, v = kv
        r = v["r"]
        fn = f"{slug(r.get('description') or sid)}-{sid}.mp3"
        dst = os.path.join(out_dir, fn)
        if not os.path.exists(dst):
            open(dst, "wb").write(get(f"https://sound-effects-media.bbcrewind.co.uk/mp3/{sid}.mp3"))
        cats = [c["className"] for c in r.get("categories", [])]
        return {"file": fn, "title": (r.get("description") or sid).strip(), "tags": words(r.get("description"), v["q"], " ".join(cats).replace("_", " "), " ".join(r.get("tags") or [])), "durationSec": round(v["dur"], 2), "sourceUrl": f"https://sound-effects.bbcrewind.co.uk/search?q={sid}", "bbcId": sid}
    files = pmap(one, lst, workers=8)
    write_meta("bbc-sfx", files)
    print(f"bbc: {len(files)} dosya")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    which = args[0] if args else "all"
    lim = 10000
    if "--limit" in sys.argv:
        lim = int(sys.argv[sys.argv.index("--limit") + 1])
    if which in ("incompetech", "all"):
        fetch_incompetech(min(lim, 40))
    if which in ("mixkit", "all"):
        fetch_mixkit(lim)
    if which in ("bbc", "all"):
        fetch_bbc(lim)
