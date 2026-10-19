"""gubigufi SES TASARIMI v2 — görüntüden türetilen, katmanlı, materyal eşlemeli efektler + profesyonel miks zinciri.
Kurallar: marka/motion/ARASTIRMA.md (1d). Girdi: olaylar.json (olay_tara.py), seslendirme, (isteğe bağlı) elle ipuçları.

  from ses2 import Tasarim
  T = Tasarim('../ses.mp3', sure=58.4, mod='pratik')      # mod: 'pratik' | 'gundem' (gündemde maskot sesi yok, daha kuru)
  T.olaylardan('olaylar.json')                             # görsel olaylar → katmanlı efektler (budama + varyasyon + panorama)
  T.ekle('rol:damga', 3.1, aile='darbe', guc=.8)            # elle vurgu (gerekirse)
  T.muzik_yatak(SB, akorlar=[...])                          # bölüm yapısına uyan yatak, kesmelerde nefes
  T.miksle('miks.wav')                                      # ducking + EQ oyuğu + oda + bus kompresör + limitör; ölçüm raporu basar
"""
import json, os, sys, hashlib
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ses_lib import SR, filt, pad, adsr, hz, soft_kick, voice_env, db, maskot_ses
from sfx_lib import Y, _yol, FF

# ---------------- AİLELER (kazanç dB, duck, sn başına üst sınır) ----------------
AILE = {
    'darbe':  dict(g=-6,  duck=False, maks=2.0),
    'damga':  dict(g=-9,  duck=False, maks=2.0),
    'whoosh': dict(g=-11, duck=True,  maks=1.5),
    'riser':  dict(g=-12, duck=False, maks=.2),
    'aksan':  dict(g=-13, duck=False, maks=1.0),
    'kagit':  dict(g=-13, duck=True,  maks=2.0),
    'ui':     dict(g=-18, duck=True,  maks=3.0),
    'doku':   dict(g=-24, duck=True,  maks=20),
    'maskot': dict(g=-20, duck=True,  maks=2.0),
}
# ---------------- MATERYAL HAVUZLARI (gövde katmanı) ----------------
# BigSoundBank kategorileri + kanal sesleri. Seçim, dosya analizine göre (kısa + keskin atak) otomatik yapılır.
MATERYAL = {
    'kagit':   dict(bsb=['PAPR'], rol=['kagit'], aile='kagit'),
    'plastik': dict(bsb=['PLAS', 'OBJ'], rol=['pop'], aile='ui'),
    'metal':   dict(bsb=['METL', 'TOOL'], rol=['darbe'], aile='darbe'),
    'cam':     dict(bsb=['GLAS'], rol=['pop'], aile='aksan'),
    'su':      dict(bsb=['WATR'], rol=[], aile='doku'),
    'kumas':   dict(bsb=['CLOTH'], rol=[], aile='kagit'),
    'ahsap':   dict(bsb=['WOOD', 'DRWR'], rol=['damga'], aile='darbe'),
    'lastik':  dict(bsb=['RUBR'], rol=['damga'], aile='damga'),
    None:      dict(bsb=[], rol=['pop'], aile='ui'),
}
# ağırlık → perde (yarım ton), kazanç, sub katmanı, ön-whoosh
AGIRLIK = {'hafif': (3, -6, 0, 0), 'orta': (0, -2, 0, .5), 'agir': (-3, 0, .55, 1), 'kahraman': (-5, 1, .8, 1), 'oyuncu': (2, -3, 0, .4)}
BSB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx_kutuphane', 'bsb')
INDEKS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sfx_kutuphane', 'bsb_indeks.json')

def _analiz(x):
    """süre, atak (tepeye varış ms), spektral ağırlık merkezi (Hz), kuyruk (tepe→-30 dB süresi)."""
    e = np.abs(x); tp = int(np.argmax(e)); pk = e[tp] + 1e-9
    f, P = signal.welch(x[:min(len(x), SR)], SR, nperseg=2048); c = float(np.sum(f * P) / (np.sum(P) + 1e-12))
    env = filt(e, 'lowpass', 40); son = np.where(env[tp:] > pk * .03)[0]
    return dict(sure=len(x) / SR, atak=tp / SR * 1000, merkez=c, kuyruk=(son[-1] if len(son) else 0) / SR)

def indeks():
    if os.path.exists(INDEKS): return json.load(open(INDEKS))
    ix = {}
    for kat in sorted(os.listdir(BSB)) if os.path.isdir(BSB) else []:
        for f in sorted(os.listdir(os.path.join(BSB, kat))):
            ad = f'bs:{kat}/{f[:4]}'
            try: ix[ad] = dict(_analiz(Y(ad)), kat=kat)
            except Exception: pass
    json.dump(ix, open(INDEKS, 'w'), indent=0); return ix

def _tohum(*a): return int(hashlib.md5(repr(a).encode()).hexdigest()[:8], 16)

def _perde(x, yt):
    if abs(yt) < .01: return x
    k = 2 ** (yt / 12); return np.interp(np.arange(0, len(x) - 1, k), np.arange(len(x)), x)

def _sondur(x, sure, sonum=.06):
    n = min(len(x), int(sure * SR)); x = x[:n].copy(); f = min(n, int(sonum * SR)); x[-f:] *= np.linspace(1, 0, f); return x

_kesit = {}
def kesit(ad, uzunluk=.32, on=.012):
    """Çok olaylı kayıttan tek vuruş: en güçlü tepenin 12 ms öncesinden 'uzunluk' kadar, üstel sönümle."""
    k = (ad, uzunluk)
    if k not in _kesit:
        x = Y(ad); e = filt(np.abs(x), 'lowpass', 120); tp = int(np.argmax(e)); i0 = max(0, tp - int(on * SR))
        y = x[i0:i0 + int(uzunluk * SR)].copy(); n = len(y); y *= np.exp(-np.linspace(0, 4.5, n)); y[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
        _kesit[k] = y / (np.abs(y).max() + 1e-9)
    return _kesit[k]

def _sub(f=58, d=.22):
    t = np.arange(int(d * SR)) / SR; f_ = f * (1 + .6 * np.exp(-t * 30)); return np.sin(2 * np.pi * np.cumsum(f_) / SR) * np.exp(-t * 14) * (1 - np.exp(-t * 900))

class Tasarim:
    def __init__(self, ses_yolu, sure, mod='pratik'):
        self.n = int(sure * SR); self.sure = sure; self.mod = mod
        self.bus = {k: np.zeros((self.n, 2)) for k in ('kuru', 'duck', 'muzik', 'oda')}
        import subprocess
        r = subprocess.run([FF, '-loglevel', 'error', '-i', ses_yolu, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
        v = np.frombuffer(r.stdout, np.int16).astype(np.float64) / 32768; self.ses = np.zeros(self.n); self.ses[:min(len(v), self.n)] = v[:self.n]
        self.ix = indeks(); self.kullanim = {}; self.ipuclari = []; self.rapor = []; self.olay_sn = 0

    # ---- havuzdan seç: kısa, keskin atak; tekrar yasağı (döndürme) ----
    def _sec(self, materyal, rol_yedek='pop', uzun=False, tohum=0, agirlik='orta'):
        M = MATERYAL.get(materyal, MATERYAL[None]); aday = [k for k, v in self.ix.items() if v['kat'] in M['bsb']]
        if getattr(self, 'kalin', False): aday = [k for k in aday if self.ix[k]['merkez'] <= 1700] or aday   # kalın mod: parlak/ince örnekler elenir
        if not aday: return f"rol:{(M['rol'] or [rol_yedek])[0]}#{tohum % 4}"
        # ağırlık eşlemesi: parlaklık hedefi (ağır → koyu, hafif → parlak); en az kullanılan önce
        hedef = {'hafif': 4200, 'orta': 2600, 'agir': 1500, 'kahraman': 1100, 'oyuncu': 3000}.get(agirlik, 2600)
        aday.sort(key=lambda k: (self.kullanim.get(k, 0), abs(np.log(self.ix[k]['merkez'] + 1) - np.log(hedef)) + (_tohum(k, tohum) % 100) / 400))
        k = aday[0]; self.kullanim[k] = self.kullanim.get(k, 0) + 1
        return kesit(k, .45 if uzun else .32)

    # ---- ham ipucu ekle (stereo, panorama, varyasyon) ----
    def ekle(self, kaynak, t, aile='darbe', guc=.5, x=540, perde=0, sure=None, ters=False, oda=.12):
        self.ipuclari.append(dict(kaynak=kaynak, t=t, aile=aile, guc=guc, x=x, perde=perde, sure=sure, ters=ters, oda=oda))

    def _yerlestir(self, ip):
        kare = int(round(ip['t'] * 30)); var = ((_tohum(kare, ip['kaynak'] if isinstance(ip['kaynak'], str) else 'sentez') % 1000) / 1000 - .5) * .5  # ±0,25 yarım ton
        x = ip['kaynak'] if isinstance(ip['kaynak'], np.ndarray) else Y(ip['kaynak'], sure=ip['sure'])
        if isinstance(ip['kaynak'], np.ndarray) and ip['sure']: x = _sondur(x, ip['sure'])
        kal = getattr(self, 'kalin', False); ak = ip['aile'] in ('ui', 'aksan', 'whoosh', 'kagit', 'doku')
        x = _perde(x, ip['perde'] + var - ((3 if ip['aile'] in ('ui', 'aksan', 'doku') else 2) if (kal and ak) else 0))
        if kal and ak: x = filt(x, 'lowpass', 2600)
        if kal and ip['aile'] in ('darbe', 'damga'): x = filt(filt(x, 'lowpass', 1300), 'lowpass', 1300)   # kalın mod: vuruşlar tok kalır, tıkırtı/parlaklık gider
        if ip['ters']: x = x[::-1].copy()
        a = AILE[ip['aile']]; g = db(a['g'] + (ip['guc'] - .5) * 6)
        p = np.clip((ip['x'] - 540) / 540, -1, 1) * .35; L, R = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)
        i0 = int(kare / 30 * SR) - (len(x) if ip['ters'] else 0); j = min(self.n, i0 + len(x))
        if j <= max(0, i0): return
        seg = x[max(0, -i0):j - i0] * g; st = np.stack([seg * L * 1.414, seg * R * 1.414], 1)
        hedef = 'duck' if a['duck'] else 'kuru'; self.bus[hedef][max(0, i0):j] += st
        self.bus['oda'][max(0, i0):j] += st * ip['oda']

    # ---- görsel olaylar → ses (3b) ----
    def olaylardan(self, yol, kelime_doku=False, sade=True, kalin=False):
        # kalin=True (kullanıcı 19.10.2026: 'otomatik sesleri geri ekle ama ince ses koyma'): tam otomatik efekt seti, AMA ince/parlak sesler elenir:
        # hafif/oyuncu çip girişleri ve sayaç tikleri yok; tüm UI/aksan/whoosh/kağıt dokuları 2,6 kHz alçak geçiren + yarım-ton aşağı perde; yoğunluk hedefi ≈0,7/sn
        self.kalin = kalin
        # sade=True (varsayılan, 19.10.2026 kullanıcı: 'geçiş efektlerini çok koyuyorsun, cıv cuv ince sesler'): hafif/oyuncu girişlerinde ses YOK,
        # öğe girişlerinde ön-whoosh YOK, çıkış whoosh'ı YOK, sahne geçişleri ve kamera whoosh'ı daha kısık, olay yoğunluğu hedefi ≈0,45/sn
        ol = json.load(open(yol)); ham = []; self.sade = sade
        for o in ol:
            t, x, tur = o['t'], o.get('x', 540), o['tur']
            if tur == 'giris':
                ag = o.get('agirlik', 'orta')
                if (sade or kalin) and ag in ('hafif', 'oyuncu'): continue
                yt, gd, sub, onW = AGIRLIK.get(ag, AGIRLIK['orta']); mat = o.get('materyal')
                guc = .5 + gd / 12; M = MATERYAL.get(mat, MATERYAL[None]); s = _tohum(t, x)
                ham.append(dict(kaynak=self._sec(mat, tohum=s, agirlik=ag), t=t, aile={'hafif': 'ui', 'oyuncu': 'ui', 'agir': 'darbe', 'kahraman': 'darbe'}.get(ag, M['aile']), guc=guc, x=x, perde=yt, sure=.9, oncelik=3 if ag in ('agir', 'kahraman') else 2))
                if sub and not kalin: ham.append(dict(kaynak=_sub(52 if ag == 'kahraman' else 60), t=t, aile='darbe', guc=sub, x=540, perde=0, oncelik=3, eslik=1))
                if onW and not sade and o.get('giris') in ('dus', 'yan', 'yuksel'):
                    ham.append(dict(kaynak=f"rol:gecis_yumusak#{s % 2}", t=t, aile='whoosh', guc=.35 * onW, x=x, perde=yt, sure=.45, ters=True, oncelik=1, eslik=1))
            elif tur == 'cikis':
                if not sade: ham.append(dict(kaynak=f"rol:gecis_hizli#{_tohum(t) % 2}", t=t + .05, aile='whoosh', guc=.2, x=x, perde=4, sure=.3, oncelik=0))
            elif tur == 'kamera':
                h = o.get('hiz', 0)
                if h > (450 if sade else 250): ham.append(dict(kaynak=f"rol:gecis#{_tohum(t) % 4}", t=t - .15, aile='whoosh', guc=(.6 if sade else 1) * min(.85, .3 + h / 2000), x=o.get('x', 540), perde=-2 if o.get('olcekDegisim', 1) > 1 else 1, sure=max(.5, o.get('sure', .8)), oncelik=2))
            elif tur == 'gecis':
                g = o.get('gecisTur'); s = _tohum(t)
                if g == 'yildiz': ham += [dict(kaynak='rol:gecis#0', t=t, aile='whoosh', guc=.7, x=540, perde=0, sure=.6, oncelik=3), dict(kaynak='rol:pop#1', t=t + .06, aile='aksan', guc=.45, x=540, perde=-2, oncelik=3, eslik=1)]
                elif g == 'itme': ham += [dict(kaynak='rol:riser#2', t=t, aile='riser', guc=.6, x=540, perde=0, sure=.9, ters=True, oncelik=3), dict(kaynak='rol:boom#1', t=t, aile='darbe', guc=.55, x=540, perde=0, sure=1.2, oncelik=3, eslik=1)]
                elif g == 'odak': ham.append(dict(kaynak='rol:gecis_yumusak#1', t=t, aile='whoosh', guc=.3 if sade else .45, x=540, perde=-3, sure=.7, oncelik=2))
                elif g == 'kayma': ham.append(dict(kaynak='rol:gecis_hizli#0', t=t, aile='whoosh', guc=.45 if sade else .7, x=900, perde=0, sure=.5, oncelik=3))
                elif g == 'perde': ham.append(dict(kaynak=self._sec('kumas', tohum=s, uzun=True), t=t, aile='kagit', guc=.6, x=540, perde=-2, sure=.7, oncelik=2))
            elif tur == 'sayac':
                if kalin: continue
                n = max(6, int(o.get('sure', 1) * 14))
                for k in range(n):
                    u = k / (n - 1); tt = t + o.get('sure', 1) * (1 - (1 - u) ** .35) * .98
                    ham.append(dict(kaynak='rol:tik', t=tt, aile='doku', guc=.5 + .3 * u, x=x, perde=u * 4, sure=.08, oncelik=-1, doku=1))
            elif tur == 'ucus':
                ham.append(dict(kaynak='rol:gecis_hizli#1', t=t, aile='whoosh', guc=.6, x=700, perde=3, sure=.8, oncelik=3))
            elif tur == 'varis':
                ham.append(dict(kaynak='rol:darbe#3', t=t, aile='darbe', guc=.45, x=x, perde=0, sure=.8, oncelik=3))
            elif tur == 'kelime' and kelime_doku:
                ham.append(dict(kaynak='ui:minimal/click', t=t + .05, aile='doku', guc=.3, x=x, perde=0, oncelik=-1, doku=1))
        self._budala(ham, hedef=.45 if sade else (.7 if kalin else .9))

    # ---- budama: maske penceresi, aile hız sınırı, küresel yoğunluk ----
    def _budala(self, ham, pencere=.06, hedef=.9):
        ham.sort(key=lambda c: (c['t'], -c.get('oncelik', 0))); tut, son_olay, aile_son = [], -9, {}
        for c in ham:
            if c.get('eslik') and c['aile'] == 'whoosh':
                if c['t'] - aile_son.get('_onW', -9) < .25: continue
                aile_son['_onW'] = c['t']
            if c.get('doku') or c.get('eslik'): tut.append(c); continue
            a = AILE[c['aile']]
            if c['t'] - son_olay < pencere and c.get('oncelik', 0) < 3: self.rapor.append(('maske', c['t'], c['aile'])); continue
            if c['t'] - aile_son.get(c['aile'], -9) < 1 / a['maks']:
                if c['aile'] in ('ui', 'kagit', 'aksan') and c['t'] - aile_son.get(c['aile'], -9) < .2:  # stagger kardeşi → doku olarak kalır
                    tut.append(dict(c, aile='doku', guc=c.get('guc', .5) + .4, doku=1)); continue
                self.rapor.append(('aile', c['t'], c['aile'])); continue
            tut.append(c); son_olay = c['t']; aile_son[c['aile']] = c['t']
        olay = [c for c in tut if not (c.get('doku') or c.get('eslik'))]
        while len(olay) / self.sure > hedef:
            dus = min(olay, key=lambda c: (c.get('oncelik', 0), c.get('guc', .5)))
            olay = [c for c in olay if c is not dus]; tut = [c for c in tut if c is not dus]; self.rapor.append(('yogunluk', dus['t'], dus['aile']))
        for c in tut: self.ekle(c['kaynak'], c['t'], c['aile'], c['guc'], c['x'], c['perde'], c.get('sure'), c.get('ters', False))
        self.olay_sn = len(olay) / self.sure

    # ---- maskot tepkileri (gündem modunda yok) ----
    def maskotlar(self, tepkiler_yolu):
        if self.mod == 'gundem': return
        for kim, at, tip in json.load(open(tepkiler_yolu)): self.ekle(maskot_ses(kim, tip), at, 'maskot', .5, 300 if kim == 'gufi' else 800, oda=.2)

    # ---- müzik yatağı v2 (3d): bölümlere oturan pad + kesmelerde nefes + isteğe bağlı nabız ----
    def muzik_yatak(self, SB, akorlar, nabiz=None, kazanc=.18, parlak=1100):
        """akorlar: [(t0, [notalar])...] — her akor bir sonrakine kadar sürer. nabiz: (t0, t1, bpm) yumuşak kick bölümü."""
        m = np.zeros(self.n)
        for i, (t0, notalar) in enumerate(akorlar):
            t1 = akorlar[i + 1][0] + .25 if i + 1 < len(akorlar) else self.sure; d = t1 - t0
            x = filt(pad([hz(n, o) for n, o in notalar], d, .4), 'lowpass', parlak) * adsr(int(d * SR), 1.0, 1.2)
            a = int(t0 * SR); j = min(self.n, a + len(x)); m[a:j] += x[:j - a] * kazanc
        if nabiz:
            for tk in np.arange(nabiz[0], nabiz[1], 60 / nabiz[2]):
                a = int(tk * SR); k = soft_kick(.35); j = min(self.n, a + len(k)); m[a:j] += k[:j - a] * .1
        # nefes: her kesmeden 0,35 sn önce −5 dB'e in, kesmeden sonra 0,8 sn'de geri gel → bölüm sınırı hissedilir
        g = np.ones(self.n); tt = np.arange(self.n) / SR
        for s in SB[1:-1]: g *= 1 - .45 * np.exp(-((tt - s) / .35) ** 2)
        m *= g; self.bus['muzik'][:, 0] += m; self.bus['muzik'][:, 1] += np.concatenate([np.zeros(int(.012 * SR)), m[:-int(.012 * SR)]])

    # ---- miks zinciri (3c) ----
    def miksle(self, cikti='miks.wav', muzik_db=-14):
        v = self.ses; ve = voice_env(v); vr = np.sqrt(np.mean(v[np.abs(v) > 1e-4] ** 2))
        # 1) ducking: sürekli dokular konuşma altında ~−10 dB, müzik ~−7 dB
        duck = (1 - .68 * np.clip(ve * 2.2, 0, 1))[:, None]; mduck = (1 - .55 * np.clip(ve * 2.2, 0, 1))[:, None]
        sfx = self.bus['kuru'] + self.bus['duck'] * duck
        mus = self.bus['muzik']; mus = mus * (vr / (np.sqrt(np.mean(mus[np.abs(mus[:, 0]) > 1e-5] ** 2)) + 1e-9) * db(muzik_db)) * mduck if np.abs(mus).max() > 0 else mus
        # 2) EQ oyuğu: 2–5 kHz bandı konuşma varken −4 dB (efekt + müzik)
        def oyuk(x):
            b = np.stack([filt(x[:, c], 'bandpass', [2000, 5000]) for c in range(2)], 1); return x - b * (1 - db(-4)) * np.clip(ve * 2, 0, 1)[:, None]
        sfx, mus = oyuk(sfx), oyuk(mus)
        # 3) ortak oda: kısa (0,45 sn) erken yansımalı reverb, −18 dB send
        rng = np.random.default_rng(7); tir = np.arange(int(.45 * SR)) / SR
        ir = rng.standard_normal((len(tir), 2)) * np.exp(-tir / .12)[:, None]; ir[:int(.008 * SR)] = 0; ir = np.stack([filt(ir[:, c], 'bandpass', [250, 6000]) for c in range(2)], 1); ir /= np.sqrt(np.sum(ir ** 2, 0)) + 1e-9
        oda = np.stack([signal.fftconvolve(self.bus['oda'][:, c], ir[:, c])[:self.n] for c in range(2)], 1) * db(-6)
        # 4) efekt bus kompresörü (yumuşak diz, 3:1, eşik −18 dBFS göreli)
        sfx = sfx + oda; tepe = np.abs(sfx).max() + 1e-9; sfx = sfx / tepe * vr * 3.0
        e = filt(np.abs(sfx).max(1), 'lowpass', 30); esik = vr * 1.2; kaz = np.where(e > esik, (esik + (e - esik) / 3) / (e + 1e-9), 1)
        sfx = sfx * kaz[:, None]
        # 5) toplam + tepe sınırlayıcı (−1 dBFS)
        top = np.stack([v, v], 1) + sfx + mus
        lim = db(-1); env = filt(np.abs(top).max(1), 'lowpass', 200); g = np.minimum(1, lim / (env + 1e-9)); top = top * g[:, None]; top = np.clip(top, -lim, lim)
        wavfile.write(cikti, SR, (top * 32767).astype(np.int16))
        # ölçüm raporu
        from collections import Counter
        print(f"[ses2] olay/sn {self.olay_sn:.2f} (hedef 0,7–0,9) · budanan: {dict(Counter(r[0] for r in self.rapor))} · ipucu: {len(self.ipuclari)}")
        print(f"[ses2] ses RMS {vr:.3f} · efekt tepe {np.abs(sfx).max():.3f} · müzik RMS {np.sqrt(np.mean(mus ** 2)):.4f} · limitör en çok {20 * np.log10(g.min() + 1e-9):.1f} dB")

    def yaz(self, cikti='miks.wav', muzik_db=-14):
        for ip in self.ipuclari: self._yerlestir(ip)
        self.miksle(cikti, muzik_db)
