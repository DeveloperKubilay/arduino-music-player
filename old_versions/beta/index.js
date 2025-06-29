const fs = require('fs');
const xml2js = require('xml2js');
var texthaci = ""
const dosyaYolu = 'score.xml';
const karakterKodlamasi = 'utf-8';

// XML dosyasını okuyun
fs.readFile(dosyaYolu, karakterKodlamasi, (hata, veri) => {
  if (hata) {
    console.error('Dosya okunamadı:', hata);
  } else {
    // XML verilerini JavaScript nesnelerine dönüştürün
    xml2js.parseString(veri, (hata, sonuc) => {
      if (hata) {
        console.error('XML ayrıştırılamadı:', hata);
      } else {
        // Dönüştürülmüş veriyi kullanın
var aa = sonuc["score-partwise"]["part"][0]["measure"]
        aa.map((x)=>{
           if(x.note)x.note.map((y)=>{if(!y.pitch) {
            if(y.duration.length) texthaci += ""
            return;
           }
            texthaci += "NOTE_"+y.pitch[0].step+y.pitch[0].octave+", "+y.duration[0]+", "
           })
        })
       
   fs.writeFileSync("output.txt",texthaci)
      }
    });
  }
});
