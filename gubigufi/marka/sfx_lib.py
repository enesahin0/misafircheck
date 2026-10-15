"""gubigufi GERÇEK SES EFEKTİ kütüphanesi — sentez yerine kayıtlı efektler.
Kaynaklar (marka/sfx_kutuphane/):
  mk:<ad>   Mixkit seçkisi (mixkit_secki.json; Sound Effects Free License — dosyalar repoda YOK, `python3 mixkit_indir.py` ile indirilir)
  kn:<paket>/<dosya>   Kenney paketleri (CC0) — örn. kn:impact-sounds/impactPlate_heavy_000
  mb:<klasör>/<dosya>  motion-bang-bang skill kütüphanesi (.claude/skills/motion-bang-bang/assets/sfx; ElevenLabs, ticari kullanım açık)
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

# Sahne rolleri → varsayılan efekt (videolar arasında tutarlı "kanal sesi")
ROL = {
    'gecis': 'mk:whoosh_sinematik', 'gecis_yumusak': 'mk:whoosh_hava', 'gecis_hizli': 'mk:swoosh_hizli', 'ucus': 'mk:sweep_kisa',
    'kart_pop': 'mk:pop_kuru', 'cip_pop': 'mk:tik_balon', 'balon_pop': 'mk:pop_balon', 'etiket_vur': 'mk:darbe_hafif',
    'darbe': 'mk:darbe_zoom', 'darbe_agir': 'mk:darbe_buyuk', 'bomba': 'mk:darbe_epik', 'bas': 'mk:bas_vurus',
    'damga': 'mb:stamp/stamp-rubber-01', 'kagit': 'mk:kagit_kay', 'sayfa': 'mk:sayfa_cevir', 'foto': 'mb:paper/photo-cardboard-place-03',
    'deklansor': 'mk:deklansor', 'tik': 'mb:accent/counter-tick-mech-01', 'saat': 'mk:saat_tiktak',
    'dogru': 'mk:ton_dogru', 'yanlis': 'mk:ton_yanlis', 'uyari': 'mk:bip_cift', 'ding': 'mk:zil_dikkat',
    'riser': 'mk:riser_drama', 'gerilim': 'mk:gerilim_kabarma', 'kalp': 'mk:kalp_darbe', 'catlak': 'mk:cam_kir',
    'pirilti': 'mk:pirilti_dokun', 'sihir': 'mk:sihir_gecis', 'kazanc': 'mk:bildirim_kazan', 'boing': 'mk:boing',
    'metal_kapi': 'mk:metal_izgara', 'mandal': 'mk:kapi_mandal', 'para': 'kn:casino-audio/chips-collide-1',
}
_onbellek = {}

def _yol(ad):
    if ad.startswith('rol:'): ad = ROL[ad[4:]]
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
    raise ValueError(ad)

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
    for kok, _, fs in os.walk(MBB):
        if '_originals' in kok: continue
        out += ['mb:' + os.path.relpath(os.path.join(kok, os.path.splitext(f)[0]), MBB) for f in sorted(fs) if f.endswith('.wav') and not f.startswith('_')]
    return out

if __name__ == '__main__':
    L = listele(); print(len(L), 'efekt'); eksik = [r for r, a in ROL.items() if not os.path.exists(_yol(a))]; print('eksik roller:', eksik or 'yok')
