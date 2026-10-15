"""Mixkit (Sound Effects Free License) kataloğu: kategori sayfalarından id + başlık + süre çıkarır → mixkit_katalog.json.
Ham dosyalar repoya KONMAZ (lisans: tek başına yeniden dağıtım yok); mixkit_indir.py ile yerelde mixkit/ klasörüne indirilir."""
import re, json, html, sys, time, urllib.request
KAT = sys.argv[1:] or ['whoosh', 'transition', 'impact', 'boom', 'swoosh', 'pop', 'click', 'notification', 'cinematic', 'paper', 'camera', 'crowd', 'game', 'technology', 'magic', 'cartoon', 'drum', 'bell', 'glass', 'typewriter', 'applause', 'riser', 'hit', 'punch', 'alert', 'win']
out = {}
for k in KAT:
    for sayfa in (1, 2):
        url = f'https://mixkit.co/free-sound-effects/{k}/' + (f'?page={sayfa}' if sayfa > 1 else '')
        try: s = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode()
        except Exception as e: print(k, sayfa, e); break
        bloklar = s.split('class="item-grid__item"')[1:]
        if not bloklar: break
        for b in bloklar:
            m = re.search(r'sfx/(\d+)/\1-preview\.mp3', b)
            if not m: continue
            i = m.group(1)
            t = re.search(r'item-grid-card__title[^>]*>\s*([^<]+)<', b)
            d = re.search(r'(\d+:\d\d)', b)
            out.setdefault(i, {'id': int(i), 'baslik': html.unescape(t.group(1).strip()) if t else '', 'sure': d.group(1) if d else '', 'kat': []})
            if k not in out[i]['kat']: out[i]['kat'].append(k)
        time.sleep(1)
    print(k, sum(1 for v in out.values() if k in v['kat']))
json.dump(sorted(out.values(), key=lambda v: v['id']), open('mixkit_katalog.json', 'w'), ensure_ascii=False, indent=0)
print('toplam', len(out))
