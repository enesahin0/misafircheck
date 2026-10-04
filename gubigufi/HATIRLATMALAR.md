# Hatırlatmalar (kullanıcıya uygun anda söyle)

- [ ] **Twitter bağlantısı (agent-reach):** Kullanıcı ikinci bir Twitter hesabı açıp bağlayacak; o zamana kadar Twitter KULLANILMAYACAK.
  Gerekenler: ortam değişkenleri `TWITTER_AUTH_TOKEN` + `TWITTER_CT0` (ikincil hesabın x.com çerezleri, ortam ayarlarında; sohbete yapıştırılmaz)
  + ağ izinleri: x.com, twitter.com, api.x.com, *.twimg.com. Ayrıntı: `.claude/skills/agent-reach/KAYNAK.txt`.
  Ne zaman hatırlat: trend/konu araştırması konuşulurken ya da ağ izinleri açıldığında.
- [ ] **Ağ izinleri (agent-reach):** youtube.com, www.youtube.com, *.googlevideo.com, r.jina.ai, mcp.exa.ai (+ reddit.com, www.reddit.com, oauth.reddit.com) henüz açılmadı.
- [ ] **Rakip/piyasa araştırması (bekliyor):** Kullanıcı ağ izinlerini açınca (youtube.com, www.youtube.com, *.googlevideo.com, *.ytimg.com, r.jina.ai, mcp.exa.ai) YouTube'dan rakip Shorts'ların başlık/izlenme/altyazılarını çekip kanca analizi yap. Ayar: oturum başlığı → ortam → Edit → Network access → Custom → Allowed domains (varsayılan paket listesi kalsın). Mobilde bulunamazsa tarayıcıdan claude.ai/code (masaüstü sitesi).
  Şimdiye kadar bulunanlar: IG sinyalleri = izlenme süresi + DM gönderimi/erişim (beğeniden 3–5 kat ağır) + beğeni/erişim; tekrar izleme sayılıyor. YT Shorts: ilk 2 sn'de %70+ kaydırma = kanca bozuk; ilk 3 sn geçiş oranı hedefi >%70.
