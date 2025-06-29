const fs = require('fs');
const MidiParser = require('midi-parser-js');

// MIDI note numaralarını Arduino notalarına çevir
const midiToArduino = {
  // C notaları
  12: 'NOTE_C1', 24: 'NOTE_C2', 36: 'NOTE_C3', 48: 'NOTE_C4', 
  60: 'NOTE_C5', 72: 'NOTE_C6', 84: 'NOTE_C7', 96: 'NOTE_C8',
  
  // C# notaları  
  13: 'NOTE_CS1', 25: 'NOTE_CS2', 37: 'NOTE_CS3', 49: 'NOTE_CS4',
  61: 'NOTE_CS5', 73: 'NOTE_CS6', 85: 'NOTE_CS7', 97: 'NOTE_CS8',
  
  // D notaları
  14: 'NOTE_D1', 26: 'NOTE_D2', 38: 'NOTE_D3', 50: 'NOTE_D4',
  62: 'NOTE_D5', 74: 'NOTE_D6', 86: 'NOTE_D7', 98: 'NOTE_D8',
  
  // D# notaları
  15: 'NOTE_DS1', 27: 'NOTE_DS2', 39: 'NOTE_DS3', 51: 'NOTE_DS4',
  63: 'NOTE_DS5', 75: 'NOTE_DS6', 87: 'NOTE_DS7', 99: 'NOTE_DS8',
  
  // E notaları
  16: 'NOTE_E1', 28: 'NOTE_E2', 40: 'NOTE_E3', 52: 'NOTE_E4',
  64: 'NOTE_E5', 76: 'NOTE_E6', 88: 'NOTE_E7', 100: 'NOTE_E8',
  
  // F notaları
  17: 'NOTE_F1', 29: 'NOTE_F2', 41: 'NOTE_F3', 53: 'NOTE_F4',
  65: 'NOTE_F5', 77: 'NOTE_F6', 89: 'NOTE_F7', 101: 'NOTE_F8',
  
  // F# notaları
  18: 'NOTE_FS1', 30: 'NOTE_FS2', 42: 'NOTE_FS3', 54: 'NOTE_FS4',
  66: 'NOTE_FS5', 78: 'NOTE_FS6', 90: 'NOTE_FS7', 102: 'NOTE_FS8',
  
  // G notaları
  19: 'NOTE_G1', 31: 'NOTE_G2', 43: 'NOTE_G3', 55: 'NOTE_G4',
  67: 'NOTE_G5', 79: 'NOTE_G6', 91: 'NOTE_G7', 103: 'NOTE_G8',
  
  // G# notaları
  20: 'NOTE_GS1', 32: 'NOTE_GS2', 44: 'NOTE_GS3', 56: 'NOTE_GS4',
  68: 'NOTE_GS5', 80: 'NOTE_GS6', 92: 'NOTE_GS7', 104: 'NOTE_GS8',
  
  // A notaları
  21: 'NOTE_A1', 33: 'NOTE_A2', 45: 'NOTE_A3', 57: 'NOTE_A4',
  69: 'NOTE_A5', 81: 'NOTE_A6', 93: 'NOTE_A7', 105: 'NOTE_A8',
  
  // A# notaları
  22: 'NOTE_AS1', 34: 'NOTE_AS2', 46: 'NOTE_AS3', 58: 'NOTE_AS4',
  70: 'NOTE_AS5', 82: 'NOTE_AS6', 94: 'NOTE_AS7', 106: 'NOTE_AS8',
  
  // B notaları
  23: 'NOTE_B1', 35: 'NOTE_B2', 47: 'NOTE_B3', 59: 'NOTE_B4',
  71: 'NOTE_B5', 83: 'NOTE_B6', 95: 'NOTE_B7', 107: 'NOTE_B8'
};

// Kullanım: node midi-to-arduino.js music.mid [tempo] [track]
const midiFile = process.argv[2] || 'music.mid';
const customTempo = process.argv[3] || null;
const trackNumber = parseInt(process.argv[4]) || 0;

if (!fs.existsSync(midiFile)) {
  console.log('❌ MIDI dosyası bulunamadı:', midiFile);
  console.log('📝 Kullanım: node midi-to-arduino.js music.mid [tempo] [track]');
  process.exit(1);
}

console.log(`🎹 MIDI dosyası analiz ediliyor: ${midiFile}`);

try {
  // MIDI dosyasını oku
  const midiData = fs.readFileSync(midiFile);
  const midi = MidiParser.parse(midiData);
  
  console.log(`📊 MIDI bilgileri:`);
  console.log(`   - Format: ${midi.formatType}`);
  console.log(`   - Ticks per quarter: ${midi.timeDivision}`);
  
  // MIDI yapısını kontrol et - bu parser'da track.event şeklinde geliyor
  let tracks = midi.track || [];
  if (!Array.isArray(tracks)) {
    console.log('❌ Track array bulunamadı');
    throw new Error('Track dizisi bulunamadı');
  }
  
  console.log(`   - Track sayısı: ${tracks.length}`);
  
  // Her track'in event array'ini al
  tracks = tracks.map(track => track.event || track);
  
  // Tempo bilgisini al
  let bpm = customTempo || 120;
  tracks.forEach((trackEvents, index) => {
    if (!Array.isArray(trackEvents)) return;
    
    trackEvents.forEach(event => {
      if (event.type === 81) { // Set Tempo event
        const microsecondsPerBeat = (event.data[0] << 16) | (event.data[1] << 8) | event.data[2];
        bpm = Math.round(60000000 / microsecondsPerBeat);
        console.log(`🎵 MIDI'den tempo algılandı: ${bpm} BPM (Track ${index})`);
      }
    });
  });
  
  if (customTempo) {
    bpm = customTempo;
    console.log(`⚡ Manuel tempo kullanılıyor: ${bpm} BPM`);
  }
  
  // Seçilen track'i işle
  if (trackNumber >= tracks.length) {
    console.log(`❌ Track ${trackNumber} bulunamadı. Mevcut trackler: 0-${tracks.length - 1}`);
    process.exit(1);
  }
  
  const selectedTrack = tracks[trackNumber];
  console.log(`🎼 Track ${trackNumber} işleniyor (${selectedTrack.length} event)`);
  
  // Notaları çıkart
  let melodyNotes = [];
  let currentTime = 0;
  let activeNotes = new Map(); // Note on/off takibi
  
  selectedTrack.forEach(event => {
    currentTime += event.deltaTime;
    
    // MIDI type 9 = Note On, type 8 = Note Off
    if (event.type === 9 && event.data[1] > 0) { // Note On
      const noteNumber = event.data[0];
      const velocity = event.data[1];
      
      if (midiToArduino[noteNumber]) {
        activeNotes.set(noteNumber, {
          startTime: currentTime,
          velocity: velocity,
          arduino: midiToArduino[noteNumber]
        });
      }
    } else if (event.type === 8 || (event.type === 9 && event.data[1] === 0)) { // Note Off
      const noteNumber = event.data[0];
      
      if (activeNotes.has(noteNumber)) {
        const noteInfo = activeNotes.get(noteNumber);
        const duration = currentTime - noteInfo.startTime;
        
        // Süreyi Arduino formatına çevir (tick'i beat'e çevir)
        const durationInBeats = duration / midi.timeDivision;
        let arduinoDuration = Math.round(1 / durationInBeats);
        
        // Minimum ve maksimum değerler
        if (arduinoDuration < 1) arduinoDuration = 1;
        if (arduinoDuration > 32) arduinoDuration = 32;
        
        melodyNotes.push({
          note: noteInfo.arduino,
          duration: arduinoDuration,
          time: noteInfo.startTime
        });
        
        activeNotes.delete(noteNumber);
      }
    }
  });
  
  // Zamanına göre sırala
  melodyNotes.sort((a, b) => a.time - b.time);
  
  console.log(`🎵 ${melodyNotes.length} nota bulundu`);
  
  if (melodyNotes.length === 0) {
    console.log('❌ Hiç nota bulunamadı! Başka bir track dene veya MIDI dosyasını kontrol et.');
    console.log('💡 Track içerikleri:');
    tracks.forEach((track, i) => {
      const noteEvents = track.filter(e => e.type === 9 || e.type === 8);
      console.log(`   Track ${i}: ${noteEvents.length} nota eventi`);
    });
    process.exit(1);
  }
  
  // Arduino formatına çevir
  let arduinoMelody = [];
  melodyNotes.forEach(note => {
    arduinoMelody.push(`  ${note.note}, ${note.duration}`);
  });
  
  // Arduino kodunu oluştur
  const outputFile = midiFile.replace('.mid', '.ino').replace('.midi', '.ino');
  const songTitle = midiFile.replace('.mid', '').replace('.midi', '');
  
  const arduinoCode = generateArduinoCode(songTitle, arduinoMelody, bpm, trackNumber);
  
  fs.writeFileSync(outputFile, arduinoCode);
  
  console.log(`🔥 ${outputFile} oluşturuldu!`);
  console.log(`🎼 Şarkı: ${songTitle}`);
  console.log(`📊 ${melodyNotes.length} nota işlendi`);
  console.log(`⚡ Tempo: ${bpm} BPM`);
  console.log(`🎹 Track: ${trackNumber}`);
  console.log('🚀 Arduino\'ya yükle ve piezo buzzeri pin 2\'ye bağla!');
  
  // İlk 10 notayı göster
  console.log(`\n🎵 İlk 10 nota önizleme:`);
  melodyNotes.slice(0, 10).forEach((note, i) => {
    console.log(`   ${i + 1}. ${note.note} (${note.duration})`);
  });

} catch (error) {
  console.error('❌ MIDI işleme hatası:', error.message);
  console.log('💡 İpucu: MIDI dosyasının format 0 veya 1 olduğundan emin ol');
}

function generateArduinoCode(songTitle, melodyArray, tempo, track) {
  return `/*
  🎹 ${songTitle}
  MIDI'den otomatik çevrilen Arduino müzik çalar
  Piezo buzzer -> Pin 2
  Tempo: ${tempo} BPM
  Track: ${track}
  
  Bağlantı:
  - Buzzer (+) -> Pin 2  
  - Buzzer (-) -> GND
*/

int tempo = ${tempo};
int buzzerPin = 2;

// Tüm nota tanımları
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

// 🎹 ${songTitle} melodisi (Track ${track})
int melody[] = {
${melodyArray.join(',\n')}
};

// Oynatma değişkenleri  
int totalNotes = sizeof(melody) / sizeof(melody[0]) / 2;
int noteIndex = 0;
bool isPlaying = false;
unsigned long previousMillis = 0;
int noteDuration = 0;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
  
  Serial.println("🎹 ================================");
  Serial.println("    ${songTitle}");
  Serial.println("🎹 ================================");
  Serial.print("📊 Toplam nota: ");
  Serial.println(totalNotes);
  Serial.print("⚡ Tempo: ");
  Serial.print(tempo);
  Serial.println(" BPM");
  Serial.print("🎼 Track: ");
  Serial.println(${track});
  Serial.println("🚀 Çalmaya başlıyor...");
  Serial.println();
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Yeni nota çalmaya başla
  if (!isPlaying && noteIndex < totalNotes * 2) {
    int thisNote = noteIndex;
    int divider = melody[thisNote + 1];
    int wholenote = (60000 * 4) / tempo;
    
    // Nota süresini hesapla
    if (divider > 0) {
      noteDuration = wholenote / divider;
    } else {
      noteDuration = wholenote / 4; // Varsayılan
    }
    
    // Nota çal
    tone(buzzerPin, melody[thisNote], noteDuration * 0.85);
    
    Serial.print("♪ ");
    Serial.print(melody[thisNote]);
    Serial.print("Hz (");
    Serial.print(noteDuration);
    Serial.println("ms)");
    
    isPlaying = true;
    previousMillis = currentMillis;
  }
  
  // Nota süresi doldu mu?
  if (isPlaying && (currentMillis - previousMillis >= noteDuration)) {
    noTone(buzzerPin);
    noteIndex += 2;
    isPlaying = false;
    
    // Şarkı bitti mi?
    if (noteIndex >= totalNotes * 2) {
      Serial.println();
      Serial.println("🎉 Şarkı tamamlandı!");
      Serial.println("🔄 3 saniye sonra tekrar başlıyor...");
      Serial.println();
      
      delay(3000);
      noteIndex = 0;
    }
  }
}`;
}

console.log('\n📝 Kullanım örnekleri:');
console.log('node midi-to-arduino.js music.mid');
console.log('node midi-to-arduino.js song.mid 120');
console.log('node midi-to-arduino.js track.mid 90 1  // 1. track');
console.log('');
console.log('🎹 MIDI dosyasını bu klasöre at ve çalıştır!');
