const fs = require('fs');

// Basit MIDI dosyası oluştur (test için)
// Bu sadece test amaçlı, gerçek MIDI dosyaları farklı araçlarla oluşturulur

console.log('🎹 Demo MIDI sistemi hazırlandı!');
console.log('');
console.log('📁 Şimdi MIDI dosyasını bu klasöre at:');
console.log('   c:\\Users\\kubil\\Desktop\\arduinonota\\');
console.log('');
console.log('📝 Sonra şu komutu çalıştır:');
console.log('   node midi-to-arduino.js music.mid');
console.log('');
console.log('🎵 Popüler MIDI siteleri:');
console.log('   - freemidi.org');
console.log('   - midiworld.com');
console.log('   - classicalarchives.com');
console.log('');
console.log('💡 İpuçları:');
console.log('   - Format 0 veya 1 MIDI dosyaları desteklenir');
console.log('   - Mono melody (tek ses) en iyi sonuç verir');
console.log('   - Çok hızlı notalar varsa tempo düşür');
console.log('   - Farklı trackler varsa track numarası belirt');
