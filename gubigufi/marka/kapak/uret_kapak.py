"""gubigufi REELS KAPAK ŞABLONU v2 — her video kendi olgun/zengin rengine sahip (çocuk renkleri yok), profil ızgarası rengârenk.
Düzen Instagram ızgarasının 3:4 kırpmasına (y 240–1680) göre: üst etiket · yuvarlak köşeli görsel kartı · başlık · logo.
Görsel: videonun kapak illüstrasyonu (kapak.html'in üst kısmı veya eski kapaktan kırpma).
Kullanım: python3 uret_kapak.py  (KAPAKLAR listesini günceller, hepsini render edip ilgili klasöre reels_kapak.jpg yazar)"""
import json, subprocess, os, shutil
KOK = os.path.dirname(os.path.abspath(__file__))
VID = os.path.join(KOK, '..', '..', '2026-09-30')
# olgun palet: (ad, zemin, zemin-koyu, vurgu, yazı)
PALET = {
    'petrol':   ('#0E4D57', '#093840', '#F4B942', '#FFF3E0'),
    'bordo':    ('#6B1E35', '#4E1426', '#F6C177', '#FFF3E0'),
    'orman':    ('#1F4D3A', '#153828', '#F29E4C', '#FFF3E0'),
    'terrakota':('#A8452B', '#80321E', '#FFE0A3', '#FFF6EA'),
    'civit':    ('#33429A', '#243078', '#FFB38A', '#FFF3E0'),
    'murdum':   ('#56264F', '#3E1A39', '#F2C14E', '#FFF3E0'),
    'zeytin':   ('#58642C', '#414A1E', '#F7C873', '#FFF6E6'),
    'hardal':   ('#A7791A', '#7F5A10', '#2B1B0E', '#FFF6E0'),
    'okyanus':  ('#0F6A80', '#0A5061', '#FFD27A', '#FFF3E0'),
    'kahve':    ('#5B3A29', '#43291C', '#F2B84B', '#FFF3E0'),
    'gul':      ('#8E3B4F', '#6C2A3B', '#FFD6A5', '#FFF3E0'),
    'deniz':    ('#16706A', '#0F544F', '#FFC56B', '#FFF3E0'),
}
# (klasör, palet, üst etiket, başlık, alt satır, görsel kaynağı: ('eski', y0, y1) eski kapaktan kırpma)
KAPAKLAR = [
    ('01-gobeklitepe', 'terrakota', '11.000 YIL ÖNCE', 'GÖBEKLİTEPE', 'Önce tapınak mı geldi?', (40, 1000)),
    ('02-derinkuyu', 'kahve', '80 METRE AŞAĞIDA', 'DERİNKUYU', 'Duvarın arkasında bir şehir', (40, 1000)),
    ('03-vombat', 'orman', 'DOĞADA TEK', 'KÜP KAKA', 'Vombatın köşeli sırrı', (0, 960)),
    ('04-turkey-hindi', 'bordo', 'KELİMENİN HİKÂYESİ', 'TURKEY = HİNDİ?', 'Kuş aslında Amerikalı', (0, 960)),
    ('05-dunyayi-kurtaran-adam', 'murdum', '1982 · KÜLT FİLM', 'TÜRK STAR WARS', 'Dünyayı Kurtaran Adam', (0, 960)),
    ('06-venus', 'hardal', "VENÜS'TE", '1 GÜN > 1 YIL', 'Doğum günün her sabahtan sık', (0, 1000)),
    ('07-isik-saciyorsun', 'civit', 'BİLİM DİYOR Kİ', 'ŞU AN PARLIYORSUN', 'Sadece gözün göremiyor', (150, 1100)),
    ('08-limon-soyguncu', 'zeytin', '1995 · GERÇEK HİKÂYE', 'LİMON SUYUYLA', 'GÖRÜNMEZ OLDU(!?)', (180, 1130)),
    ('09-ilk-bug', 'petrol', 'HARVARD · MARK II', 'İLK BİLGİSAYAR HATASI', 'GERÇEK BİR BÖCEKTİ', (200, 1150)),
    ('11-mikrop-icen-doktor', 'gul', 'GERÇEK HİKÂYE · NOBEL 2005', 'BAKTERİYİ İÇTİ', 'VE HAKLI ÇIKTI', (200, 1150)),
    ('12-capa-etkisi', 'okyanus', 'BEYİN TUZAKLARI', 'BİR ÇARK', 'CEVABINI DEĞİŞTİRDİ', (180, 1130)),
]
SABLON = open(os.path.join(KOK, 'sablon.html')).read()
os.makedirs(os.path.join(KOK, 'sayfalar'), exist_ok=True); os.makedirs(os.path.join(KOK, 'gorsel'), exist_ok=True)
FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "cikti": "x.mp4", "sahneler": []}
for i, (kl, pal, ust, bas, alt, kir) in enumerate(KAPAKLAR):
    g = os.path.join(KOK, 'gorsel', kl + '.png')
    kaynak = os.path.join(VID, kl, 'kapak_gorsel.png')
    if os.path.exists(kaynak): shutil.copy(kaynak, g)
    elif not os.path.exists(g):  # eski kapaktan illüstrasyonu kırp (ilk seferde)
        y0, y1 = kir; subprocess.run([FF, '-y', '-loglevel', 'error', '-i', os.path.join(VID, kl, 'reels_kapak.jpg'), '-vf', f'crop=1080:{y1 - y0}:0:{y0}', g], check=True)
    z, zk, v, y = PALET[pal]
    html = SABLON
    for k, val in {'__GORSEL__': f'../gorsel/{kl}.png', '__ZEMIN__': z, '__ZEMINK__': zk, '__VURGU__': v, '__YAZI__': y, '__UST__': ust, '__BASLIK__': bas, '__ALT__': alt}.items(): html = html.replace(k, val)
    open(os.path.join(KOK, 'sayfalar', kl + '.html'), 'w').write(html)
    plan['sahneler'].append({"dosya": f"sayfalar/{kl}.html", "baslangic": i, "bitis": i + 1})
json.dump(plan, open(os.path.join(KOK, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
for i, (kl, *_r) in enumerate(KAPAKLAR):
    subprocess.run(['python3', 'render.py', 'plan.json', '--kare', str(i + 1), '0'], cwd=KOK, check=True, capture_output=True)
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', os.path.join(KOK, f'kare_s{i + 1:02d}_0s.png'), '-q:v', '2', os.path.join(VID, kl, 'reels_kapak.jpg')], check=True)
    print('✓', kl)
