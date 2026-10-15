"""Sonniss #GameAudioGDC 2026 (archive.org kopyası) — seçili paketleri sonniss/<paket>/ altına indirir.
Lisans: Sonniss GDC Bundle EULA — kişisel + TİCARİ kullanım serbest, atıf gerekmez; efektleri olduğu gibi satmak ve AI EĞİTİMİ yasak.
Ham dosyalar repoya KONMAZ (.gitignore). Yeni oturumda: python3 sonniss_indir.py"""
import json, os, sys, time, urllib.request, urllib.parse
ID = 'sonniss-gdc-2026-game-audio-bundle-normalized'
PAKETLER = [
 'Cinematic Sound Design - Cartoon & Animation Vol 2', 'Cinematic Sound Design - Cartoon Bloopers', 'Cinematic Sound Design - Cartoon Impacts',
 'Cinematic Sound Design - Colossal Impacts', 'Cinematic Sound Design - Hybrid Game & UI Elements', 'Cinematic Sound Design - Interface & Infographics',
 'Cinematic Sound Design - Paper Foley', 'Cinematic Sound Design - System & UI Feedback Elements', 'Cinematic Sound Design - UI Interaction Elements',
 'Cinematic Sound Design - Ultra Transitions & Impacts', 'Cinematic Sound Design - User Interface',
 '344 Audio - Air Designed', '344 Audio - Bass Drops & Downers Vol. 1', '344 Audio - Bass Drops & Downers Vol. 2', '344 Audio - Bass Drops & Downers Vol. 3',
 '344 Audio - Antique Typewriter', '344 Audio - Antique Books', '344 Audio - Cinema Experience Vol. 1', '344 Audio - Antique Telephone',
 '344 Audio - British Police Radio Vol. 1', '344 Audio - Elemental Palette Designed Vol. 1',
 'Epic Stock Media - Elemental Mutation Whooshes and Impacts', 'Epic Stock Media - Board Game - Sound Set Kit for Tabletop and Digital Games',
 'Epic Stock Media - HD Lock And Mechanism Sound Design Kit', 'Epic Stock Media - Anime Game', 'Epic Stock Media - Fake Advertisements and Radio Sound Effects Audio Construction Kit',
 'Federico Soler - Effective Trailer Booms Vol. 2', 'Federico Soler - Effective Trailer Alarms Vol. 2', 'Jake Fielding - Cinematic Horn Braams',
 'The Noisery - Rich Glitch', 'Sonic Bat - Music Boxes', 'Jake Fielding - Interior Wind Rain and Storms',
]
meta = json.load(urllib.request.urlopen(f'https://archive.org/metadata/{ID}', timeout=60))
hedef = [f for f in meta['files'] if '/' in f['name'] and f['name'].split('/')[0] in PAKETLER and f['name'].lower().endswith('.mp3')]
print(len(hedef), 'dosya,', round(sum(int(f.get('size', 0)) for f in hedef) / 1e6), 'MB')
for i, f in enumerate(hedef):
    yol = os.path.join('sonniss', f['name'])
    if os.path.exists(yol) and os.path.getsize(yol) == int(f.get('size', 0)): continue
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    url = f'https://archive.org/download/{ID}/' + urllib.parse.quote(f['name'])
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'gubigufi/1.0'}), timeout=300) as r, open(yol, 'wb') as o:
                while True:
                    b = r.read(1 << 20)
                    if not b: break
                    o.write(b)
            break
        except Exception as e: print('tekrar', f['name'], e); time.sleep(5 * (k + 1))
    if i % 25 == 0: print(i, '/', len(hedef), flush=True)
print('bitti')

# --- 2. kaynak: Sonniss GDC 2015–2023 (archive.org 'gameaudiogdc-part1through7'), motion design anahtar kelimeleriyle süzülmüş paketler (aynı EULA)
import re
ID2 = 'gameaudiogdc-part1through7'
KW = re.compile(r'whoosh|woosh|swoosh|impact|hit|interface|\bui\b|transition|cartoon|riser|glitch|paper|typewriter|braam|boom|trailer|foley|pop|click|button|menu|notification|stinger|magic|crowd|applause|cinematic|motion|graphic|logo|swish|swipe', re.I)
meta2 = json.load(urllib.request.urlopen(f'https://archive.org/metadata/{ID2}', timeout=120))
h2 = []
for f in meta2['files']:
    p = f['name'].split('/')
    if f['name'].lower().endswith('.mp3') and len(p) > 2 and KW.search(p[1]): h2.append(f)
print('GDC 2015–2023:', len(h2), 'dosya,', round(sum(int(f.get('size', 0)) for f in h2) / 1e6), 'MB')
for i, f in enumerate(h2):
    p = f['name'].split('/'); yil = re.search(r'GDC\s*(\d{4})', p[0]); yil = yil.group(1) if yil else '2015'
    yol = os.path.join('sonniss', f'GDC{yil} - ' + p[1], p[-1])
    if os.path.exists(yol): continue
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    url = f'https://archive.org/download/{ID2}/' + urllib.parse.quote(f['name'])
    for k in range(4):
        try: open(yol, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'gubigufi/1.0'}), timeout=180).read()); break
        except Exception as e: print('tekrar', f['name'][-60:], e); time.sleep(5 * (k + 1))
    if i % 50 == 0: print(i, '/', len(h2), flush=True)
print('bitti2')
