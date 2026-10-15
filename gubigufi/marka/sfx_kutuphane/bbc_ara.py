"""BBC Sound Effects arşivi (sound-effects.bbcrewind.co.uk, 33.000+ kayıt) — ara + indir.
LİSANS: RemArc — YALNIZCA TİCARİ OLMAYAN / kişisel / eğitim kullanımı. Kanal para kazanmaya başlayınca BBC efektleri videolardan ÇIKARILIR
(sfx_lib'de 'bb:' önekiyle işaretli; `grep -l "bb:" */*/kaynak/ses.py` ile bulunur). Ham dosyalar repoya KONMAZ (.gitignore).
Kullanım:  python3 bbc_ara.py "whoosh" --n 8 --max 6     # en fazla 6 sn'lik ilk 8 sonucu bbc/ altına indirir
           python3 bbc_ara.py "crowd applause" --listele    # sadece listeler"""
import json, os, sys, argparse, urllib.request
ap = argparse.ArgumentParser(); ap.add_argument('sorgu'); ap.add_argument('--n', type=int, default=8); ap.add_argument('--max', type=float, default=12); ap.add_argument('--min', type=float, default=0)
ap.add_argument('--listele', action='store_true'); ap.add_argument('--etiket', default=None)
a = ap.parse_args()
def ara(q, size=60):
    body = json.dumps({'criteria': {'from': 0, 'size': size, 'tags': None, 'categories': None, 'durations': None, 'continents': None, 'sortBy': None, 'source': None, 'recordist': None, 'habitat': None, 'query': q}}).encode()
    r = urllib.request.Request('https://sound-effects-api.bbcrewind.co.uk/api/sfx/search', data=body, headers={'Content-Type': 'application/json', 'User-Agent': 'gubigufi/1.0'})
    return json.load(urllib.request.urlopen(r, timeout=60))['results']
sonuc = [r for r in ara(a.sorgu) if a.min <= r['duration'] / 1000 <= a.max][:a.n]
os.makedirs('bbc', exist_ok=True)
kat_yol = 'bbc/katalog.json'; kat = json.load(open(kat_yol)) if os.path.exists(kat_yol) else {}
et = (a.etiket or a.sorgu).replace(' ', '_')
for r in sonuc:
    s = r['duration'] / 1000; print(f"{r['id']}  {s:5.1f} sn  {r['description'][:90]}")
    if a.listele: continue
    yol = f"bbc/{r['id']}.mp3"
    if not os.path.exists(yol):
        d = urllib.request.urlopen(urllib.request.Request(f"https://sound-effects-media.bbcrewind.co.uk/mp3/{r['id']}.mp3", headers={'User-Agent': 'gubigufi/1.0'}), timeout=120).read()
        open(yol, 'wb').write(d)
    kat[r['id']] = {'aciklama': r['description'], 'sure': round(s, 2), 'etiket': sorted(set(kat.get(r['id'], {}).get('etiket', []) + [et]))}
if not a.listele: json.dump(kat, open(kat_yol, 'w'), ensure_ascii=False, indent=0)
