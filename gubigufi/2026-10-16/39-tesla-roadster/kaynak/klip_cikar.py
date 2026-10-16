"""Reel (kaynak: Instagram @teslamotors, 15.10.2026 — yerelde gorsel_ham/reel.mp4, repoda YOK) → kare dizileri.
Kullanım: python3 klip_cikar.py   (gorsel_ham/reel.mp4 gerekir: yt-dlp ile indirilir)
Çıktı: ortak/img/klip/<ad>/0001.jpg … (1080x1350, repoda YOK)"""
import subprocess, os, json
FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
KLIPLER = {  # ad: (başlangıç sn, süre sn)
    'a': (31.4, 1.7),   # karanlıkta Roadster, iki mavi itici alevi
    'b': (33.0, 1.9),   # ters dönmüş araç, iticiler, iniş dumanı
    'c': (26.0, 2.4),   # römorkun üzerinden atlayış, itici jeti
    'd': (39.0, 1.9),   # havada dönen araç, mavi jetler
    'e': (19.4, 2.4),   # fırlayış, takla, iniş
}
bilgi = {}
for ad, (ss, d) in KLIPLER.items():
    o = f'ortak/img/klip/{ad}'; os.makedirs(o, exist_ok=True)
    for f in os.listdir(o): os.remove(os.path.join(o, f))
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', str(ss), '-t', str(d), '-i', 'gorsel_ham/reel.mp4', '-vf', 'scale=1080:1350', '-q:v', '4', f'{o}/%04d.jpg'], check=True)
    bilgi[ad] = len(os.listdir(o))
json.dump(bilgi, open('ortak/img/klip/bilgi.json', 'w')); print(bilgi)
