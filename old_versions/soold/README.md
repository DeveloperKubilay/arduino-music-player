# 🎵 XML to Arduino Müzik Çevirici

MusicXML dosyalarını Arduino piezo buzzer kodu haline çeviren otomatik sistem.

## 📋 Özellikler

- ✅ MusicXML formatından Arduino koduna otomatik çevirme
- ✅ Tempo ayarlanabilir
- ✅ Tüm nota tanımları dahil (C1-C8)
- ✅ Sus (REST) notaları destekli
- ✅ Serial monitor ile debug bilgileri
- ✅ Otomatik tekrar çalma
- ✅ Non-blocking kod (Arduino diğer işlemleri yapabilir)

## 🚀 Kurulum

```bash
npm install xml2js
```

## 💻 Kullanım

### 1. Basit Çevirme
```bash
node xml-to-arduino.js
```
- score.xml → generated_music.ino (120 BPM)

### 2. Özelleştirilmiş Çevirme  
```bash
node xml-to-arduino.js [xml-dosyası] [arduino-dosyası] [tempo]
```

**Örnekler:**
```bash
node xml-to-arduino.js score.xml my_song.ino 105
node xml-to-arduino.js beethoven.xml symphony.ino 120
node xml-to-arduino.js jazz.xml cool_jazz.ino 140
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
├── 🎼 score.xml                 # Örnek MusicXML dosyası
├── 🔧 xml-to-arduino.js         # Ana çevirici script
├── 🔧 arduino-generator.js      # Basit çevirici
├── 📝 index.js                  # XML okuyucu
├── 📤 output.txt               # Ham nota çıktısı
├── 🎵 steel_for_humans.ino     # Üretilen Arduino kodu
└── 📖 README.md                # Bu dosya
```

## ⚙️ Script Detayları

### xml-to-arduino.js (Ana Script)
- Gelişmiş XML parsing
- Tempo kontrolü
- Şarkı adı otomatik algılama
- REST nota desteği
- Detaylı hata yakalama

### arduino-generator.js (Basit Versiyon)  
- output.txt'den okur
- Sabit template kullanır
- Hızlı çevirme

## 🎼 Desteklenen Formatlar

**Giriş:** MusicXML (.xml, .musicxml)
**Çıkış:** Arduino C++ (.ino)

## 🔥 Örnekler

### Steel for Humans
```bash
node xml-to-arduino.js score.xml steel.ino 105
```
**Sonuç:** 204 nota, 32 ölçü ✅

### Hızlı Test
```bash
node arduino-generator.js
```
**Sonuç:** output.txt'den 164 nota ✅

## 🛠️ Teknik Detaylar

**Nota Frekansları:** 31Hz (NOTE_B0) - 4978Hz (NOTE_DS8)
**Tempo Formülü:** `(60000 * 4) / tempo`
**Süre Hesaplama:** `wholenote / divider`
**Non-blocking:** `millis()` tabanlı zamanlama

## 🎯 İpuçları

1. **Buzzer Seçimi:** Aktif/pasif piezo buzzer kullanın
2. **Tempo:** Yavaş şarkılar için 60-90, hızlı için 120-150 BPM
3. **Ses Kalitesi:** 500-2000Hz arası notalar en net çıkar
4. **Debug:** Serial Monitor'da nota bilgilerini izleyin

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
