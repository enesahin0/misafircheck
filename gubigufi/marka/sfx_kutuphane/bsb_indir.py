"""BigSoundBank (Joseph Sardin) — CC0 / kamu malı eşdeğeri, ticari serbest, atıfsız, hesap gerekmez.
Materyal foley seçkisi indirir → bsb/<KATEGORİ>/<id>_<ad>.wav (repoda YOK; .gitignore). 20 sn'den uzun kayıtlar atlanır.
Kullanım: python3 bsb_indir.py [KAT ...]   (varsayılan: materyal kategorileri)"""
import os, re, sys, json, subprocess, urllib.request
from concurrent.futures import ThreadPoolExecutor
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"}
KOK = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bsb')
VARS = ['PAPR', 'PLAS', 'RUBR', 'CLOTH', 'SWSH', 'UI', 'WOOD', 'GLAS', 'METL', 'WATR', 'DSGN', 'TOON', 'OBJ', 'DRWR', 'TOOL']
FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip() if os.path.exists('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath') else 'ffmpeg'
def al(u): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
def katalog(kat):
    ses, sayfa = {}, 0
    while True:
        h = al(f"https://bigsoundbank.com/search?CatID={kat}" + (f"&page={sayfa}" if sayfa else "")).decode('utf8', 'ignore')
        yeni = {m[1]: m[0] for m in re.findall(r"href=['\"]/([a-z0-9\-]+)-s(\d{4})\.html['\"]", h)}
        n = len(ses); ses.update(yeni)
        if len(ses) == n or sayfa > 12: break
        sayfa += 1
    return ses
def indir(a):
    kat, sid, ad = a; d = os.path.join(KOK, kat); os.makedirs(d, exist_ok=True); y = os.path.join(d, f"{sid}_{ad[:40]}.wav")
    if os.path.exists(y): return 'var'
    try:
        veri = al(f"https://bigsoundbank.com/UPLOAD/bwf-en/{sid}.wav"); open(y, 'wb').write(veri)
        r = subprocess.run([FF.replace('ffmpeg', 'ffprobe') if os.path.exists(FF.replace('ffmpeg', 'ffprobe')) else FF, '-i', y], capture_output=True, text=True)
        m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
        if m and int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) > 20: os.remove(y); return 'uzun'
        return 'ok'
    except Exception as e: return f'hata {e}'
if __name__ == '__main__':
    kats = sys.argv[1:] or VARS; isler = []
    for k in kats:
        c = katalog(k); print(k, len(c)); isler += [(k, s, a) for s, a in c.items()]
    with ThreadPoolExecutor(8) as ex: sonuc = list(ex.map(indir, isler))
    from collections import Counter; print(Counter(r.split()[0] for r in sonuc))
