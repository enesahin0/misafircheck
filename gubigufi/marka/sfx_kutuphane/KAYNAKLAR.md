# Ses efekti kaynakları ve lisansları

Kanal şu an para kazanmıyor (kullanıcı kararı, 15.10.2026): ticari olmayan lisanslı kaynaklar da kullanılabilir.
**Para kazanmaya başlanınca:** `TİCARİ: HAYIR` satırındaki kaynakların efektleri yeni videolarda kullanılmaz; eskileri gerekiyorsa yeniden mikslenir (`grep -l "bb:" ../../*/*/kaynak/ses.py`).

| Önek | Kaynak | Adet | Lisans | TİCARİ | Repoda mı | Nasıl gelir |
|---|---|---|---|---|---|---|
| `kn:` | Kenney (kenney.nl) — interface, impact, ui, digital, casino, rpg, jingles | 538 | CC0 | EVET | evet | — |
| `ui:` | uisfx (github.com/romainsimon/uisfx) — 12 tema × 78 arayüz sesi | 936 | CC0 | EVET | evet | — |
| `ve:` | videoeditingsfx.com — video kurgu efektleri (cinematic hit/boom/reverse/riser, whoosh, kamera, UI) | 100 | CC0 | EVET | evet | — |
| `sx:` | rse/soundfx (github.com/rse/soundfx) | 67 | CC0 / CC-BY-3.0 (dosyanın .txt'si) | EVET (CC-BY'de atıf) | evet | — |
| `mb:` | motion-bang-bang skill (ElevenLabs üretimi) | 42 | ElevenLabs ücretli plan çıktısı | EVET | evet (skill içinde) | — |
| `mk:` | Mixkit seçkisi (mixkit_secki.json; katalog 907) | 88 | Mixkit Sound Effects Free License | EVET (atıfsız) | HAYIR (dağıtım yasak) | `python3 mixkit_indir.py` |
| `sn:` | Sonniss #GameAudioGDC 2026 (32 paket örneği) + GDC 2015–2023 (145 motion design paketi) — archive.org | 684 | Sonniss GDC EULA: ticari serbest, atıfsız; satmak + AI eğitimi yasak | EVET | HAYIR | `python3 sonniss_indir.py` |
| `bb:` | BBC Sound Effects (sound-effects.bbcrewind.co.uk, 33.000+) | isteğe göre | RemArc: kişisel/eğitim/ticari olmayan | **HAYIR** | HAYIR | `python3 bbc_ara.py "sorgu" --n 5 --max 6` |

Elenenler: PSFX (lisans AI kullanımını yasaklıyor), JimLynchCodes/Game-Sound-Effects (lisans yok), MaterialFoundry (masaüstü oyun, karışık lisans), soundcn (çoğu Kenney kopyası + Blizzard sesleri).
Ek kaynak adayları: Sonniss GDC 2015–2025 arşivleri (archive.org, aynı lisans, toplam ~200 GB), Freesound / Pixabay (ağ erişimi kapalı — 403).
