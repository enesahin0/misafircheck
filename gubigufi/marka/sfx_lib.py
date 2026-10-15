"""gubigufi GERÇEK SES EFEKTİ kütüphanesi — sentez yerine kayıtlı efektler.
Kaynaklar (marka/sfx_kutuphane/):
  mk:<ad>   Mixkit seçkisi (mixkit_secki.json; Sound Effects Free License — dosyalar repoda YOK, `python3 mixkit_indir.py` ile indirilir)
  kn:<paket>/<dosya>   Kenney paketleri (CC0) — örn. kn:impact-sounds/impactPlate_heavy_000
  mb:<klasör>/<dosya>  motion-bang-bang skill kütüphanesi (.claude/skills/motion-bang-bang/assets/sfx; ElevenLabs, ticari kullanım açık)
  ve:<ad>              videoeditingsfx.com (CC0) — 100 video kurgu efekti: cinematic hit/boom/reverse/riser, whoosh, kamera, UI
  ui:<tema>/<ad>       uisfx (CC0) — 12 tema × 78 arayüz sesi (cinematic, glass, rubber, soft, studio, arcade, organic, minimal, mechanical, scifi, dreamy, zen)
  sx:<ad>              rse/soundfx (CC0 / CC-BY-3.0 — dosyanın .txt'sine bak)
  sn:<paket>/<dosya>   Sonniss GDC 2026 seçkisi (ticari serbest, atıfsız; repoda YOK → python3 sonniss_indir.py). Dosya adının başı yeterli.
  bb:<id>              BBC Sound Effects (RemArc — SADECE TİCARİ OLMAYAN; para kazanılınca çıkarılacak). python3 bbc_ara.py "sorgu" ile indir.
Lisans özeti: sfx_kutuphane/KAYNAKLAR.md
Kullanım (ses.py içinde):
  from sfx_lib import Y
  S(Y('mk:whoosh_sinematik'), 6.3, .5)          # dosya → mono 48 kHz, tepe 1.0'a normalize, baştaki sessizlik kırpılmış
  Y('mk:darbe_buyuk', sure=1.5, perde=-2)        # sure: kes + sön; perde: yarım ton kaydır
Rol kısayolları için ROL sözlüğüne bak (Y('rol:gecis') gibi)."""
import os, subprocess, json
import numpy as np
from ses_lib import SR

KOK = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx_kutuphane')
MBB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../.claude/skills/motion-bang-bang/assets/sfx'))
FF_YOL = '/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath'
FF = open(FF_YOL).read().strip() if os.path.exists(FF_YOL) else 'ffmpeg'

# KANAL SESLERİ — kullanıcının dinleme kataloğundan seçtikleri (15.10.2026). Y('rol:gecis') ilk varyant, Y('rol:gecis#2') 3. varyant (mod).
# Art arda aynı sesi tekrarlamamak için sahnelerde #0, #1, #2… diye döndür.
ROL = {
    'gecis': ['mk:whoosh_sinematik', 'mk:whoosh_hava', 've:deep-whoosh-1', 've:fast-whoosh'],           # GEÇİŞ 1-2-4-6
    'gecis_yumusak': ['mk:whoosh_hava', 've:deep-whoosh-1'], 'gecis_hizli': ['ve:fast-whoosh', 'mk:whoosh_sinematik'],
    'pop': ['sn:Cinematic Sound Design - Interface & Infographics/Interface Percussion Snap', 'mb:ui/ui-pop-sticker-02'],  # POP 6, 12
    'darbe': ['ve:deep-hit', 've:deep-hit-2', 've:swoosh-sharp-hit', 'mb:impact/impact-medium-02'],      # DARBE 3-4-7-10
    'boom': ['mk:darbe_buyuk', 've:cinematic-boom', 've:cinematic-bang', 've:dramatic-impact'],          # BÜYÜK DARBE 2-3-4-5
    'riser': ['mk:riser_drama', 've:cinematic-riser-wildfire', 'mb:transition/riser-soft-01'],          # RISER 1-3-6
    'damga': ['mb:stamp/stamp-rubber-01', 'kn:impact-sounds/impactWood_medium_000'],                     # DAMGA/KÂĞIT 1, 6
    'kagit': ['mk:kagit_kay', 'sn:Cinematic Sound Design - Paper Foley/A4 Printing Paper'],             # DAMGA/KÂĞIT 2, 4
    'dogru': ['mk:ton_dogru'], 'yanlis': ['mk:ton_yanlis'],                                              # DOĞRU-YANLIŞ 1-2
    'cizgi': ['mk:cizgi_olumlu'],                                                                        # ÇİZGİ FİLM 4
    # eşanlamlılar (eski ses.py'ler için)
    'kart_pop': 'pop', 'cip_pop': 'pop#1', 'balon_pop': 'pop', 'etiket_vur': 'darbe#3', 'bomba': 'boom', 'darbe_agir': 'boom#1', 'bas': 'boom#3',
    'gerilim': 'riser#2', 'foto': 'kagit#1', 'sayfa': 'kagit#1', 'ding': 'dogru', 'kazanc': 'cizgi', 'boing': 'cizgi', 'ucus': 'gecis#3',
    # katalogda sorulmamış, şimdilik kalanlar
    'tik': ['mb:accent/counter-tick-mech-01'], 'saat': ['mk:saat_tiktak'], 'uyari': ['mk:bip_cift'], 'catlak': ['mk:cam_kir'], 'kalp': ['mk:kalp_darbe'],
    'pirilti': ['mk:pirilti_dokun'], 'sihir': ['mk:sihir_gecis'], 'metal_kapi': ['mk:metal_izgara'], 'mandal': ['mk:kapi_mandal'], 'deklansor': ['mk:deklansor'],
    'para': ['kn:casino-audio/chips-collide-1'],
}
def _rol(ad):
    r, _, i = ad.partition('#'); i = int(i or 0); v = ROL[r]
    if isinstance(v, str): return _rol(v if '#' in v or not i else f"{v.partition('#')[0]}#{int(v.partition('#')[2] or 0) + i}")
    return v[i % len(v)]
_onbellek = {}

def _yol(ad):
    if ad.startswith('rol:'): ad = _rol(ad[4:])
    tur, ad2 = ad.split(':', 1)
    if tur == 'mk': return os.path.join(KOK, 'mixkit', ad2 + '.mp3')
    if tur == 'kn':
        p, f = ad2.split('/', 1)
        for alt in ('Audio', 'audio', ''):
            for uz in ('.ogg', '.wav', '.mp3'):
                y = os.path.join(KOK, 'kenney', p, alt, f + uz)
                if os.path.exists(y): return y
        raise FileNotFoundError(ad)
    if tur == 'mb': return os.path.join(MBB, ad2 + '.wav')
    if tur == 've': return os.path.join(KOK, 'vesfx', ad2 + '.mp3')
    if tur == 'ui': return os.path.join(KOK, 'uisfx', ad2 + '.mp3')
    if tur == 'sx': return os.path.join(KOK, 'soundfx', ad2 + '.mp3')
    if tur == 'bb': return os.path.join(KOK, 'bbc', ad2 + '.mp3')
    if tur == 'sn':
        p, f = ad2.split('/', 1); kl = os.path.join(KOK, 'sonniss', p)
        if not os.path.isdir(kl):
            adaylar = [d for d in os.listdir(os.path.join(KOK, 'sonniss')) if d.lower().startswith(p.lower()) or p.lower() in d.lower()]
            if not adaylar: raise FileNotFoundError(ad)
            kl = os.path.join(KOK, 'sonniss', adaylar[0])
        for g in sorted(os.listdir(kl)):
            if g == f or g.lower().startswith(f.lower()) or f.lower() in g.lower(): return os.path.join(kl, g)
        raise FileNotFoundError(ad)
    raise ValueError(ad)

TICARI_DEGIL = ('bb:',)  # para kazanılınca bu önekler videolardan çıkarılır

def _oku(yol):
    if yol not in _onbellek:
        if not os.path.exists(yol): raise FileNotFoundError(f'{yol} yok — Mixkit ise: cd marka/sfx_kutuphane && python3 mixkit_indir.py')
        r = subprocess.run([FF, '-loglevel', 'error', '-i', yol, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
        x = np.frombuffer(r.stdout, np.int16).astype(np.float64) / 32768
        e = np.abs(x); esik = e.max() * .02; i = int(np.argmax(e > esik)) if e.max() > 0 else 0
        x = x[max(0, i - int(.004 * SR)):]
        _onbellek[yol] = x / (np.abs(x).max() + 1e-9)
    return _onbellek[yol]

def Y(ad, sure=None, perde=0, sonum=.08):
    x = _oku(_yol(ad)).copy()
    if perde:
        k = 2 ** (perde / 12); idx = np.arange(0, len(x) - 1, k); x = np.interp(idx, np.arange(len(x)), x)
    if sure is not None and len(x) > int(sure * SR):
        x = x[:int(sure * SR)]; f = min(len(x), int(sonum * SR)); x[-f:] *= np.linspace(1, 0, f)
    return x

def listele():
    """Kullanılabilir tüm efekt adlarını döndürür."""
    out = ['mk:' + k for k in json.load(open(os.path.join(KOK, 'mixkit_secki.json')))]
    for p in sorted(os.listdir(os.path.join(KOK, 'kenney'))):
        for kok, _, fs in os.walk(os.path.join(KOK, 'kenney', p)):
            out += [f'kn:{p}/{os.path.splitext(f)[0]}' for f in sorted(fs) if f.endswith(('.ogg', '.wav'))]
    for t in sorted(os.listdir(os.path.join(KOK, 'uisfx'))):
        d = os.path.join(KOK, 'uisfx', t)
        if os.path.isdir(d): out += [f'ui:{t}/{os.path.splitext(f)[0]}' for f in sorted(os.listdir(d)) if f.endswith('.mp3')]
    out += ['ve:' + os.path.splitext(f)[0] for f in sorted(os.listdir(os.path.join(KOK, 'vesfx'))) if f.endswith('.mp3')]
    out += ['sx:' + os.path.splitext(f)[0] for f in sorted(os.listdir(os.path.join(KOK, 'soundfx'))) if f.endswith('.mp3')]
    for kl in ('sonniss', 'bbc'):
        k = os.path.join(KOK, kl)
        if not os.path.isdir(k): continue
        for kok2, _, fs in os.walk(k):
            for f in sorted(fs):
                if not f.lower().endswith(('.wav', '.mp3', '.flac')): continue
                out.append(('sn:' + os.path.relpath(os.path.join(kok2, f), k)) if kl == 'sonniss' else 'bb:' + os.path.splitext(f)[0])
    for kok, _, fs in os.walk(MBB):
        if '_originals' in kok: continue
        out += ['mb:' + os.path.relpath(os.path.join(kok, os.path.splitext(f)[0]), MBB) for f in sorted(fs) if f.endswith('.wav') and not f.startswith('_')]
    return out

if __name__ == '__main__':
    L = listele(); print(len(L), 'efekt'); eksik = [r for r in ROL if not os.path.exists(_yol('rol:' + r))]; print('eksik roller:', eksik or 'yok')
