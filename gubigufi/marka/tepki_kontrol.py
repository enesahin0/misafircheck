"""RUH HALİ TUTARLILIĞI kontrolü — uret.py içinden: from tepki_kontrol import kontrol; kontrol(TEP, SB)
Kurallar (MARKA.md 'RUH HALİ TUTARLILIĞI'):
  1) Bir karakterin bir sahnedeki tepkileri aynı duygu yönünde (olumlu / olumsuz) kalır; yön en fazla 1 kez değişir (anlatı dönüşü).
  2) Zıt yönlü iki tepki arasında en az 2.5 sn olur (art arda mutlu→ağla→mutlu olmaz).
  3) Bir video boyunca aynı tepki en fazla 3 kez kullanılır; sahne başına en az 1 farklı hareket.
  4) İki tepki arası en az 1.0 sn (üst üste binen el kol hareketi yok)."""
OLUMLU = {'mutlu', 'zipla', 'aha', 'alkis', 'kahkaha', 'goster', 'dans', 'takla', 'ask', 'yasasin', 'begen', 'zafer', 'gurur', 'evet', 'selam', 'kucakla', 'gel', 'donus'}
OLUMSUZ = {'uzgun', 'korku', 'agla', 'yorgun', 'bayil', 'eri', 'endise', 'titre', 'sinir', 'saklan', 'gozKapa', 'ayakTap', 'hayir', 'carp', 'sok', 'tokezle'}
yon = lambda t: 1 if t in OLUMLU else -1 if t in OLUMSUZ else 0

def kontrol(TEP, SB=None, sessiz=False):
    uyar, say = [], {}
    for sh, liste in TEP.items():
        for kim in ('gubi', 'gufi'):
            l = sorted([(a, tp) for k, a, tp in liste if k == kim])
            onceki, degisim, son = None, 0, None
            for a, tp in l:
                say[(kim, tp)] = say.get((kim, tp), 0) + 1
                if son is not None and a - son < 1.0: uyar.append(f'S{sh} {kim}: {tp}@{a} öncekine çok yakın ({a - son:.1f} sn)')
                y = yon(tp)
                if y and onceki and y != onceki[0]:
                    degisim += 1
                    if a - onceki[1] < 2.5: uyar.append(f'S{sh} {kim}: ruh hali çok hızlı döndü ({onceki[2]} → {tp}, {a - onceki[1]:.1f} sn)')
                if y: onceki = (y, a, tp)
                son = a
            if degisim > 1: uyar.append(f'S{sh} {kim}: ruh hali {degisim} kez yön değiştirdi (en fazla 1)')
    for (kim, tp), n in say.items():
        if n > 3: uyar.append(f'{kim}: "{tp}" videoda {n} kez (en fazla 3)')
    if not sessiz:
        print('RUH HALİ KONTROLÜ:', 'TAMAM ✓' if not uyar else f'{len(uyar)} uyarı'); [print('  ⚠', u) for u in uyar]
    return uyar
