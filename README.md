# Discord Özel Oda Sistemi Botu

Çoklu sunucu destekli, tamamen buton tabanlı, modern Discord özel oda sistemi botu.

## Özellikler

- ✅ Çoklu sunucu desteği (her sunucu için ayrı ayarlar)
- 🎧 Otomatik özel oda oluşturma
- 📝 Kalıcı oda isimlendirme sistemi
- 🎨 Renkli ve emojili buton tabanlı yönetim paneli
- 🔒 Oda kilitleme/açma
- 🔢 Kullanıcı limiti ayarlama (1-99)
- ➕ Üye ekleme/çıkarma
- 🚫 Ban sistemi
- 🗑️ Manuel oda silme
- ♻️ Otomatik boş oda temizleme

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables Ayarlayın

`.env` dosyası oluşturun ve aşağıdaki bilgileri doldurun:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

**Bot Token ve Client ID Nasıl Alınır:**

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın ve botunuza bir isim verin
3. Sol menüden "Bot" sekmesine gidin
4. "Reset Token" butonuna tıklayarak token'ınızı alın (bu `DISCORD_TOKEN`)
5. Sol menüden "OAuth2" > "General" sekmesine gidin
6. "Client ID"yi kopyalayın (bu `CLIENT_ID`)

**Bot İzinleri:**

Bot invite link'inizi oluştururken şu izinleri vermelisiniz:
- `Manage Channels` (Kanalları Yönet)
- `Manage Roles` (Rolleri Yönet)
- `Move Members` (Üyeleri Taşı)
- `View Channels` (Kanalları Görüntüle)
- `Connect` (Bağlan)
- `Send Messages` (Mesaj Gönder)

**Intents:**

Developer Portal'da Bot ayarlarından şu intent'leri aktif edin:
- `Server Members Intent`
- `Message Content Intent` (opsiyonel)

### 3. Botu Başlatın

```bash
npm start
```

## Kullanım

### 1. Sistemi Kurun

Sunucunuzda admin yetkisine sahip bir kullanıcı olarak:

```
/özeloda-kur
```

Komutu çalıştırın ve:
- **Panel Kanalı:** Yönetim panelinin gönderileceği metin kanalını seçin
- **Ana Kanal:** Kullanıcıların özel oda oluşturmak için gireceği ses kanalını seçin

### 2. Özel Oda Oluşturma

Kullanıcılar ana ses kanalına girdiklerinde otomatik olarak kendilerine özel bir ses kanalı oluşturulur.

### 3. Yönetim Paneli

Panel kanalında gönderilen mesajdaki butonlarla odanızı yönetebilirsiniz:

- **📝 Oda Adı Belirle:** Odanıza özel bir isim verin (kalıcı olarak kaydedilir)
- **🔒 Kilitle/Kilidi Aç:** Odanızı kilitleyip açın
- **🔢 Kullanıcı Limiti:** Maksimum kullanıcı sayısını ayarlayın (1-99, 0=limitsiz)
- **➕ Üye Ekle:** Belirli bir üyeye odanıza erişim verin
- **➖ Üye Çıkar:** Odanızdan birini çıkarın
- **🚫 Üyeyi Banla:** Birini odanızdan kalıcı olarak yasaklayın
- **♻️ Banı Kaldır:** Ban listesinden birini çıkarın
- **🗑️ Odayı Sil:** Özel odanızı manuel olarak silin

## Proje Yapısı

```
discord-ozel-oda-bot/
├── src/
│   ├── commands/           # Slash komutlar
│   │   └── ozeloda-kur.js
│   ├── events/             # Discord event'leri
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   └── voiceStateUpdate.js
│   ├── handlers/           # Yükleyici handler'lar
│   │   ├── commandHandler.js
│   │   ├── eventHandler.js
│   │   └── interactionHandler.js
│   ├── interactions/
│   │   ├── buttons/        # Buton etkileşimleri
│   │   ├── modals/         # Modal etkileşimleri
│   │   └── selectmenus/    # Select menu etkileşimleri
│   └── utils/              # Yardımcı araçlar
│       ├── dataManager.js  # Veri yönetimi
│       └── panelManager.js # Panel yönetimi
├── data/
│   └── guilds.json         # Sunucu ayarları (otomatik oluşturulur)
├── index.js                # Ana bot dosyası
├── package.json
└── .env                    # Environment variables
```

## Çoklu Sunucu Desteği

Bot, her sunucu için ayrı ayarları `data/guilds.json` dosyasında saklar:

- Her sunucunun panel kanalı
- Ana ses kanalı
- Kullanıcıların özel oda isimleri
- Ban listeleri
- Aktif odalar
- Oda limitleri

Tüm bu veriler `guildId` bazında ayrılmıştır ve hiçbir sunucunun verileri birbiriyle karışmaz.

## Veri Yapısı

```json
{
  "guilds": {
    "GUILD_ID": {
      "panelChannelId": "CHANNEL_ID",
      "panelMessageId": "MESSAGE_ID",
      "mainVoiceChannelId": "CHANNEL_ID",
      "userRoomNames": {
        "USER_ID": "Özel Oda Adı"
      },
      "userBans": {
        "OWNER_ID": ["BANNED_USER_ID"]
      },
      "activeRooms": {
        "USER_ID": "ROOM_CHANNEL_ID"
      },
      "roomLimits": {
        "CHANNEL_ID": 5
      }
    }
  }
}
```

## Teknik Detaylar

- **Discord.js:** v14
- **Node.js:** v16+
- **Modüler yapı:** Kolay geliştirme ve bakım
- **Event-driven:** Optimize edilmiş performans
- **Interaction-based:** Modern Discord UI özellikleri
- **Guild-specific storage:** Çoklu sunucu izolasyonu

## Sorun Giderme

### Bot komutları görmüyor
- Bot'un sunucuya düzgün invite edildiğinden emin olun
- `CLIENT_ID` değerinin doğru olduğunu kontrol edin
- Botu yeniden başlatın

### Odalar oluşturulmuyor
- Bot'un `Manage Channels` iznine sahip olduğundan emin olun
- Ana ses kanalının doğru seçildiğini kontrol edin
- Console loglarını kontrol edin

### Panel mesajı silinmiş
- Bot otomatik olarak yeniden oluşturacaktır
- Veya `/özeloda-kur` komutunu tekrar çalıştırın

### Butonlar çalışmıyor
- Sadece kendi odanızda butonları kullanabilirsiniz
- Bir ses kanalında olduğunuzdan emin olun

## Lisans

MIT

## Destek

Herhangi bir sorun için GitHub Issues kullanabilirsiniz.
