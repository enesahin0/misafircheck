"""Ses kataloğu dinleme videosu: kategorilere göre numaralı efektler → dinleme.mp4 + dinleme_secim.json (etiket → efekt adı)."""
import sys, json, subprocess, os
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '..')
from sfx_lib import Y, FF
from ses_lib import SR
K = {
 'GEÇİŞ': ['mk:whoosh_sinematik', 'mk:whoosh_hava', 'mk:swoosh_sinematik', 've:deep-whoosh-1', 've:deep-whoosh-3', 've:fast-whoosh', 've:swoosh-quick-low', 've:cinematic-whoosh-reverse',
           'sn:Cinematic Sound Design - Ultra Transitions & Impacts/Woosh Sweep', 'sn:Cinematic Sound Design - Cartoon & Animation Vol 2/Cartoon Pull Swoosh', 'mb:whoosh/whoosh-camera-large-01', 'ui:cinematic/swipe'],
 'POP / ÇİP': ['mk:pop_kuru', 'mk:pop_balon', 'mk:tik_balon', 've:pop-sound', 'sn:Cinematic Sound Design - Interface & Infographics/Interface Pop High', 'sn:Cinematic Sound Design - Interface & Infographics/Interface Percussion Snap',
           'sn:Cinematic Sound Design - Interface & Infographics/Interface Accept Glassy', 'ui:rubber/press', 'ui:glass/select', 'ui:studio/snap', 'mb:ui/comic-pop-toon-04', 'mb:ui/ui-pop-sticker-02'],
 'DARBE': ['mk:darbe_zoom', 'mk:darbe_hafif', 've:deep-hit', 've:deep-hit-2', 've:impact-hit-1', 've:cinematic-heavy-hit', 've:swoosh-sharp-hit', 'sn:Cinematic Sound Design - Ultra Transitions & Impacts/Impact Hit Rapid',
           'kn:impact-sounds/impactPunch_heavy_000', 'mb:impact/impact-medium-02'],
 'BÜYÜK DARBE / BOOM': ['mk:darbe_epik', 'mk:darbe_buyuk', 've:cinematic-boom', 've:cinematic-bang', 've:dramatic-impact', 've:impact-and-subdrop', 've:inception-thump',
           'sn:Federico Soler - Effective Trailer Booms Vol. 2/EffectiveTrailer_Booms_Vol2_011', 'sn:Cinematic Sound Design - Colossal Impacts/Impact Cut Sweep', 'sn:344 Audio - Bass Drops & Downers Vol. 1/DSGNBass_Bass Drop & Downer Fast'],
 'RISER / GERİLİM': ['mk:riser_drama', 've:riser-1', 've:cinematic-riser-wildfire', 've:dramatic-buildup-reveal', 've:tremolo-riser-big-hit', 'mb:transition/riser-soft-01'],
 'DAMGA / KÂĞIT': ['mb:stamp/stamp-rubber-01', 'mk:kagit_kay', 'mk:sayfa_cevir', 'sn:Cinematic Sound Design - Paper Foley/A4 Printing Paper', 'mb:paper/photo-cardboard-place-03', 'kn:impact-sounds/impactWood_medium_000'],
 'DİNG / DOĞRU-YANLIŞ': ['mk:ton_dogru', 'mk:ton_yanlis', 'mk:zil_dikkat', 've:chime', 've:success', 'ui:studio/success', 'ui:studio/error', 'sn:Cinematic Sound Design - System & UI Feedback Elements/Interface Deny'],
 'ÇİZGİ FİLM': ['mk:boing', 'mk:yay', 'mk:trombon_hayal', 'mk:cizgi_olumlu', 'sn:Cinematic Sound Design - Cartoon Impacts/Vibrato Impact Snap', 'sn:Cinematic Sound Design - Cartoon & Animation Vol 2/Cartoon Bubbles', 'sn:Cinematic Sound Design - Cartoon Bloopers/Cartoon Confused Dizzy'],
}
MAXS, BOS = 2.6, .55
t = .6; seg = []; secim = {}
for kat, l in K.items():
    t += 1.6; seg.append((t - 1.6, t, kat, '', True))
    for i, ad in enumerate(l, 1):
        try: x = Y(ad, sure=MAXS)
        except Exception as e: print('YOK', ad, e); continue
        d = len(x) / SR; seg.append((t, t + d + BOS, f'{kat} {i}', ad, False)); secim[f'{kat} {i}'] = ad
        seg[-1] = seg[-1] + (x,); t += d + BOS
T = t + 1
out = np.zeros(int(T * SR))
for s in seg:
    if len(s) == 6: x = s[5] * .7; a = int(s[0] * SR); out[a:a + len(x)] += x[:len(out) - a]
out /= max(1, np.abs(out).max() / .9)
wavfile.write('dinleme.wav', SR, (out * 32767).astype(np.int16))
json.dump(secim, open('dinleme_secim.json', 'w'), ensure_ascii=False, indent=1)
from PIL import Image, ImageDraw, ImageFont
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
os.makedirs('_dinleme', exist_ok=True)
f1, f2, f3 = ImageFont.truetype(F, 92), ImageFont.truetype(F, 30), ImageFont.truetype(F, 40)
liste = []
for k, s_ in enumerate(seg):
    a, b, et, ad, baslik = s_[:5]
    im = Image.new('RGB', (1080, 1920), (11, 20, 51)); d = ImageDraw.Draw(im)
    if baslik:
        d.text((540, 900), et, font=f1, fill=(251, 172, 57), anchor='mm'); d.text((540, 1010), 'kategori', font=f3, fill=(138, 148, 168), anchor='mm')
    else:
        d.text((540, 880), et, font=f1, fill=(255, 243, 214), anchor='mm'); d.text((540, 990), ad[:58], font=f2, fill=(138, 148, 168), anchor='mm')
    p = f'_dinleme/{k:03d}.png'; im.save(p); liste.append((p, b - a))
with open('_dinleme/liste.txt', 'w') as o:
    o.write(f"file '{os.path.abspath(liste[0][0])}'\nduration {seg[0][0]:.3f}\n")
    for p, d_ in liste: o.write(f"file '{os.path.abspath(p)}'\nduration {d_:.3f}\n")
    o.write(f"file '{os.path.abspath(liste[-1][0])}'\n")
subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', '_dinleme/liste.txt', '-i', 'dinleme.wav', '-vf', 'fps=30,format=yuv420p',
                '-c:v', 'libx264', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'dinleme.mp4'], check=True)
import shutil; shutil.rmtree('_dinleme')
print(len(secim), 'efekt,', round(T), 'sn')
