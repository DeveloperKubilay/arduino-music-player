# � MIDI to Arduino Müzik Çevirici

MIDI (.mid) dosyalarını Arduino piezo buzzer kodu haline çeviren otomatik sistem.

## 📋 Özellikler

- ✅ MIDI formatından Arduino koduna otomatik çevirme  
- ✅ Tempo otomatik algılama + manuel ayarlama
- ✅ Çoklu track desteği (track seçebilirsin)
- ✅ Tüm nota tanımları dahil (C1-C8)
- ✅ MIDI note on/off event işleme
- ✅ Serial monitor ile debug bilgileri
- ✅ Otomatik tekrar çalma
- ✅ Non-blocking kod (Arduino diğer işlemleri yapabilir)

## 🚀 Kurulum

```bash
npm install xml2js midi-parser-js
```

## 💻 Kullanım

### 🎹 MIDI Çevirme (Ana Özellik)
```bash
node midi-to-arduino.js music.mid
```
- music.mid → music.ino (otomatik tempo + track 0)

### 🎹 Gelişmiş MIDI Çevirme
```bash
node midi-to-arduino.js [midi-dosyası] [tempo] [track]
```

**Örnekler:**
```bash
node midi-to-arduino.js song.mid
node midi-to-arduino.js jazz.mid 120  
node midi-to-arduino.js symphony.mid 90 1  # 1. track, 90 BPM
```

### 🎵 XML Çevirme (Eski Versiyon)
```bash
node xml-to-arduino.js score.xml output.ino 105
```

## 🔌 Arduino Bağlantısı

```
Arduino Uno    Piezo Buzzer
Pin 2     -->  Pozitif (+)
GND       -->  Negatif (-)
```

## 📁 Dosya Yapısı

```
📂 arduinonota/
├── � midi-to-arduino.js       # Ana MIDI çevirici
├── 🎹 midi-demo.js             # MIDI demo ve bilgi
├── 🎼 xml-to-arduino.js        # XML çevirici (eski)
├── 🔧 arduino-generator.js     # Basit çevirici
├── 📝 index.js                 # XML okuyucu
├── 📤 output.txt              # Ham nota çıktısı
├── 🎵 *.ino                   # Üretilen Arduino kodları
└── 📖 README.md               # Bu dosya
```

## ⚙️ Script Detayları

### 🎹 midi-to-arduino.js (Ana Script)
- MIDI parser ile Note On/Off events
- Otomatik tempo algılama
- Track seçimi (0,1,2...)
- MIDI note → Arduino frequency çevirimi
- Delta time → duration hesaplama

### 🎼 xml-to-arduino.js (XML Desteği)  
- MusicXML parsing
- Şarkı adı otomatik algılama
- REST nota desteği

## 🎼 Desteklenen Formatlar

**Ana Giriş:** MIDI (.mid, .midi) 🎹
**Ek Giriş:** MusicXML (.xml, .musicxml) 🎵  
**Çıkış:** Arduino C++ (.ino) 🔧

## 🔥 Örnekler

### 🎹 MIDI Çevirme
```bash
# Basit çevirme
node midi-to-arduino.js song.mid

# Tempo ayarlı  
node midi-to-arduino.js song.mid 120

# Track seçimli
node midi-to-arduino.js song.mid 90 1
```

### 🎵 XML Çevirme
```bash
node xml-to-arduino.js score.xml steel.ino 105
```
**Sonuç:** 204 nota, 32 ölçü ✅

## 🛠️ Teknik Detaylar

**Nota Frekansları:** 31Hz (NOTE_B0) - 4978Hz (NOTE_DS8)
**Tempo Formülü:** `(60000 * 4) / tempo`
**Süre Hesaplama:** `wholenote / divider`
**Non-blocking:** `millis()` tabanlı zamanlama

## 🎯 İpuçları

1. **MIDI Dosyası:** freemidi.org, midiworld.com'dan indir 🎹
2. **Buzzer Seçimi:** Aktif/pasif piezo buzzer kullanın 🔊
3. **Tempo:** Yavaş şarkılar için 60-90, hızlı için 120-150 BPM ⚡
4. **Track Seçimi:** Melody track'i seç, drum tracklerinden kaçın 🥁
5. **Ses Kalitesi:** 500-2000Hz arası notalar en net çıkar 🎵
6. **Debug:** Serial Monitor'da nota bilgilerini izleyin 📺
7. **Format:** MIDI Format 0 veya 1 kullan, Format 2 desteklenmiyor ⚠️

## 🤝 Katkıda Bulunma

1. Fork et 🍴
2. Feature branch oluştur 🌿
3. Commit et 💾
4. Push et 🚀  
5. Pull request aç 📬

## 📜 Lisans

MIT License - Özgürce kullan! 🎉

---

**Made with 💖 by Arduino Music Lovers**
"# arduino-music-player" 
