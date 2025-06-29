const fs = require('fs');

// output.txt'den notaları oku
const notaVerisi = fs.readFileSync('output.txt', 'utf-8');

// Notaları ayır ve temizle
const notalar = notaVerisi.trim().split(', ').filter(n => n.length > 0);

// Arduino melodisi oluştur
let arduinoMelodi = [];
for (let i = 0; i < notalar.length; i += 2) {
    if (notalar[i] && notalar[i + 1]) {
        arduinoMelodi.push(`  ${notalar[i]}, ${notalar[i + 1]}`);
    }
}

// Template Arduino kodunu oluştur
const arduinoKod = `/*
  🎵 Otomatik XML'den Arduino Müzik Çalar 
  Piezo buzzer pin 2'ye bağlanacak
*/

int tempo = 120;
int buzzerPin = 2;

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

// XML'den çevrilen melodinin notaları
int melody[] = {
${arduinoMelodi.join(',\n')}
};

int totalNotes = sizeof(melody) / sizeof(melody[0]) / 2;
int noteIndex = 0;
bool isPlaying = false;
unsigned long previousMillis = 0;
int noteDuration = 0;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
  
  Serial.print("Toplam nota: ");
  Serial.println(totalNotes);
  Serial.println("🎵 Çalmaya başlıyor...");
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (!isPlaying && noteIndex < totalNotes * 2) {
    int thisNote = noteIndex;
    int divider = melody[thisNote + 1];
    int wholenote = (60000 * 4) / tempo;
    
    if (divider > 0) {
      noteDuration = wholenote / divider;
    } else if (divider < 0) {
      noteDuration = wholenote / abs(divider);
      noteDuration *= 1.5;
    }
    
    if (melody[thisNote] != REST) {
      tone(buzzerPin, melody[thisNote], noteDuration * 0.9);
    }
    
    isPlaying = true;
    previousMillis = currentMillis;
    
    Serial.print("♪ ");
    Serial.print(melody[thisNote]);
    Serial.print(" - ");
    Serial.println(noteDuration);
  }
  
  if (isPlaying && (currentMillis - previousMillis >= noteDuration)) {
    noTone(buzzerPin);
    noteIndex += 2;
    isPlaying = false;
    
    if (noteIndex >= totalNotes * 2) {
      Serial.println("🎉 Bitti! Tekrar başlıyor...");
      delay(2000);
      noteIndex = 0;
    }
  }
}`;

// Arduino dosyasını kaydet
fs.writeFileSync('generated_arduino.ino', arduinoKod);

console.log('🔥 Arduino kodu oluşturuldu: generated_arduino.ino');
console.log(`📊 Toplam ${arduinoMelodi.length} nota işlendi`);
console.log('🎵 Artık Arduino\'ya yükleyebilirsin!');
