/*
  Steel for Humans - Vocal Lines 🎵
  Akıcı ve temiz müzik çalma sistemi 
  Piezo buzzer pin 8'e bağlanacak
*/

int tempo = 105; // Şarkının temposu
int buzzerPin = 2; // Buzzer'ın bağlı olduğu pin

// Nota tanımları
#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978
#define REST     0

// Şarkının notaları - XML'den çıkardığımız notalar
// Steel for Humans - Vocal Lines
int melody[] = {
  // Ölçü 1: Oy lazare lazare
  NOTE_D4, 4, NOTE_D4, 4, NOTE_D4, 4, NOTE_G4, 4, 
  // Ölçü 2: Tuka ni sa kazale
  NOTE_F4, 4, NOTE_E4, 4, NOTE_D4, 6, NOTE_E4, 2, 
  // Ölçü 3
  NOTE_F4, 4, NOTE_E4, 4, NOTE_F4, 4, NOTE_E4, 4, 
  // Ölçü 4
  NOTE_C4, 4, NOTE_D4, 4, NOTE_D4, 8, 
  // Ölçü 5: Kolko liste po gora
  NOTE_D4, 4, NOTE_D4, 4, NOTE_D4, 4, NOTE_G4, 4, 
  // Ölçü 6
  NOTE_F4, 4, NOTE_E4, 4, NOTE_D4, 6, NOTE_E4, 2, 
  // Ölçü 7: Tolko zave naz kishta
  NOTE_F4, 4, NOTE_E4, 4, NOTE_F4, 4, NOTE_E4, 4, 
  // Ölçü 8
  NOTE_C4, 4, NOTE_D4, 4, NOTE_D4, 8,
  // Ölçü 9: Tervo tuka doydohme
  NOTE_D4, 4, NOTE_D4, 4, NOTE_D4, 4, NOTE_G4, 4,
  // Ölçü 10
  NOTE_F4, 4, NOTE_E4, 4, NOTE_D4, 6, NOTE_E4, 2,
  // Ölçü 11: Moma momche naydohme
  NOTE_F4, 4, NOTE_E4, 4, NOTE_F4, 4, NOTE_E4, 4,
  // Ölçü 12
  NOTE_C4, 4, NOTE_D4, 4, NOTE_D4, 8,
  // Ölçü 13: Ya momata godete
  NOTE_D4, 4, NOTE_D4, 4, NOTE_D4, 4, NOTE_G4, 4,
  // Ölçü 14
  NOTE_F4, 4, NOTE_E4, 4, NOTE_D4, 6, NOTE_E4, 2,
  // Ölçü 15: Ya momcheto zenete
  NOTE_F4, 4, NOTE_E4, 4, NOTE_F4, 4, NOTE_E4, 4,
  // Ölçü 16
  NOTE_C4, 4, NOTE_D4, 4, NOTE_D4, 8,
  // Ölçü 17: Varara tariga, balala taira
  REST, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 4, NOTE_E4, 2,
  // Ölçü 18
  NOTE_E4, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 2, NOTE_C4, 4,
  // Ölçü 19: Varara tarina, balala tarina 
  REST, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 4, NOTE_E4, 2,
  // Ölçü 20
  NOTE_E4, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 2, NOTE_C4, 4,
  // Ölçü 21: Varara tariga
  REST, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 4, NOTE_E4, 2,
  // Ölçü 22: balala taira
  NOTE_E4, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 2, NOTE_C4, 4,
  // Ölçü 23: Varara tariga, balala taira 
  REST, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 4, NOTE_E4, 2,
  // Ölçü 24
  NOTE_E4, 2, NOTE_F4, 2, NOTE_E4, 2, NOTE_F4, 2, NOTE_G4, 2, NOTE_E4, 2, NOTE_C4, 4,
  // Ölçü 25: Varara tarina, balala tarina
  REST, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 4, NOTE_G4, 2,
  // Ölçü 26
  NOTE_G4, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 2, NOTE_E4, 4,
  // Ölçü 27: Varara tariga, balala taira 
  REST, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 4, NOTE_G4, 2,
  // Ölçü 28
  NOTE_G4, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 2, NOTE_E4, 4,
  // Ölçü 29: Varara tarina, balala tarina
  REST, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 4, NOTE_G4, 2,
  // Ölçü 30
  NOTE_G4, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 2, NOTE_E4, 4,
  // Ölçü 31: Varara tariga 
  REST, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 4, NOTE_G4, 2,
  // Ölçü 32: balala taira 
  NOTE_G4, 2, NOTE_A4, 2, NOTE_G4, 2, NOTE_A4, 2, NOTE_AS4, 2, NOTE_G4, 2, NOTE_E4, 4
};

// Müziği daha akıcı hale getiren değişkenler
int noteDuration = 0;
int pauseBetweenNotes = 0;
unsigned long previousMillis = 0;
int noteIndex = 0;
bool isPlaying = false;
int totalNotes = 0;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
  
  // Nota sayısını hesapla
  totalNotes = sizeof(melody) / sizeof(melody[0]) / 2;
  
  Serial.print("Toplam nota sayısı: ");
  Serial.println(totalNotes);
  Serial.println("Çalmaya başlıyor... 🎵");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Nota çalma durumunu kontrol et
  if (!isPlaying && noteIndex < totalNotes * 2) {
    // Yeni nota çalmaya başla
    int thisNote = noteIndex;
    
    // Nota frekansını ve süresini al
    int divider = melody[thisNote + 1];
    int wholenote = (60000 * 4) / tempo;
    
    // Nota süresini hesapla
    if (divider > 0) {
      noteDuration = wholenote / divider;
    } else if (divider < 0) {
      // Noktalı nota için %50 daha uzun
      noteDuration = wholenote / abs(divider);
      noteDuration *= 1.5;
    }
    
    // Akıcılık için notayı daha kısa çal ve notalar arası hafif boşluk bırak
    tone(buzzerPin, melody[thisNote], noteDuration * 0.9);
    
    // Notalar arası geçiş süresi (akıcılık için)
    pauseBetweenNotes = noteDuration * 0.1;
    if (pauseBetweenNotes < 20) pauseBetweenNotes = 20; // Minimum bekleme
    
    // Çalmaya başladığını işaretle
    isPlaying = true;
    previousMillis = currentMillis;
    
    // Debug bilgisi (isteğe bağlı)
    if (melody[thisNote] != REST) {
      Serial.print("Nota: ");
      Serial.print(melody[thisNote]);
      Serial.print(", Süre: ");
      Serial.println(noteDuration);
    } else {
      Serial.println("Sus");
    }
  }
  
  // Şu anki notanın süresi doldu mu?
  if (isPlaying && (currentMillis - previousMillis >= noteDuration + pauseBetweenNotes)) {
    // Ses çalmayı durdur
    noTone(buzzerPin);
    
    // Sonraki notaya geç
    noteIndex += 2;
    
    // Durumu resetle
    isPlaying = false;
    
    // Tüm notalar çalındıysa
    if (noteIndex >= totalNotes * 2) {
      Serial.println("Müzik bitti! 🎉");
      delay(3000); // Bitiş sonrası bekle
      noteIndex = 0; // Tekrar başlat (istersen kaldırabilirsin)
    }
  }
}