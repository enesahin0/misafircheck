"""mixkit_secki.json'daki efektleri yerel mixkit/ klasörüne indirir (repoya girmez — .gitignore). Lisans: Mixkit Sound Effects Free License."""
import json, os, time, urllib.request
os.makedirs('mixkit', exist_ok=True)
for ad, i in json.load(open('mixkit_secki.json')).items():
    yol = f'mixkit/{ad}.mp3'
    if os.path.exists(yol): continue
    for k in range(4):
        try:
            d = urllib.request.urlopen(urllib.request.Request(f'https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3', headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()
            open(yol, 'wb').write(d); break
        except Exception as e: print('tekrar', ad, e); time.sleep(3 * (k + 1))
    time.sleep(.3)
print(len(os.listdir('mixkit')), 'dosya')
