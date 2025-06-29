const MidiParser = {
    parse: function (fileBuffer, callback) {
        let lastEvent = null;
        let midiData = {};

        let byteArray = new Uint8Array(fileBuffer);

        // Header Chunk check
        if (!(byteArray[0] === 77 && byteArray[1] === 84 &&
            byteArray[2] === 104 && byteArray[3] === 100))
            throw new Error("Header not recognized! This is not a MIDI file.");

        midiData.formatType = byteArray[9];
        let trackCount = (byteArray[10] << 8) + byteArray[11];
        let timeDivision = (byteArray[12] << 8) + byteArray[13];
        midiData.timeDivision = timeDivision;

        // Process tracks
        let tracks = [];
        let pointer = 14;

        for (let i = 0; i < trackCount; i++) {
            let track = { event: [] };

            // Track chunk check (MTrk)
            if (!(byteArray[pointer] === 77 && byteArray[pointer + 1] === 84 &&
                byteArray[pointer + 2] === 114 && byteArray[pointer + 3] === 107))
                throw new Error(`Track ${i} not recognized!`);

            // Track length
            let trackLength = (byteArray[pointer + 4] << 24) +
                (byteArray[pointer + 5] << 16) +
                (byteArray[pointer + 6] << 8) +
                byteArray[pointer + 7];

            pointer += 8; // After track header
            let endOfTrack = pointer + trackLength;

            // Read track events
            let statusByte = 0;

            while (pointer < endOfTrack) {
                let event = {};

                // Delta time
                let deltaTime = 0;
                let byte = 0;
                do {
                    byte = byteArray[pointer++];
                    deltaTime = (deltaTime << 7) + (byte & 0x7F);
                } while (byte & 0x80);

                event.deltaTime = deltaTime;

                // Event type
                byte = byteArray[pointer++];

                // Running status
                if (byte < 0x80) {
                    pointer--;
                    byte = statusByte;
                } else {
                    statusByte = byte;
                }

                // Meta events
                if (byte === 0xFF) {
                    let metaType = byteArray[pointer++];
                    event.type = metaType;

                    // Read length
                    let length = 0;
                    byte = 0;
                    do {
                        byte = byteArray[pointer++];
                        length = (length << 7) + (byte & 0x7F);
                    } while (byte & 0x80);

                    // Read data
                    event.data = [];
                    for (let j = 0; j < length; j++) {
                        event.data.push(byteArray[pointer++]);
                    }

                }
                // System Exclusive events
                else if (byte === 0xF0 || byte === 0xF7) {
                    event.type = byte;

                    // Read length
                    let length = 0;
                    byte = 0;
                    do {
                        byte = byteArray[pointer++];
                        length = (length << 7) + (byte & 0x7F);
                    } while (byte & 0x80);

                    // Read data
                    event.data = [];
                    for (let j = 0; j < length; j++) {
                        event.data.push(byteArray[pointer++]);
                    }

                }
                // MIDI events
                else {
                    let eventType = byte >> 4;
                    event.channel = byte & 0x0F;
                    event.type = eventType;

                    // Note on/off, key pressure, control change
                    if (eventType >= 0x8 && eventType <= 0xB) {
                        event.data = [
                            byteArray[pointer++], // note number / controller
                            byteArray[pointer++]  // velocity / value
                        ];
                    }
                    // Program change, channel pressure
                    else if (eventType >= 0xC && eventType <= 0xD) {
                        event.data = [byteArray[pointer++]];
                    }
                    // Pitch bend
                    else if (eventType === 0xE) {
                        event.data = [
                            byteArray[pointer++],
                            byteArray[pointer++]
                        ];
                    }
                }

                track.event.push(event);
            }

            tracks.push(track);
            pointer = endOfTrack;
        }

        midiData.track = tracks;
        callback(midiData);
    }
};

// MIDI note numbers to Arduino notes
const midiToArduino = {
    12: 'NOTE_C1', 24: 'NOTE_C2', 36: 'NOTE_C3', 48: 'NOTE_C4',
    60: 'NOTE_C5', 72: 'NOTE_C6', 84: 'NOTE_C7', 96: 'NOTE_C8',
    13: 'NOTE_CS1', 25: 'NOTE_CS2', 37: 'NOTE_CS3', 49: 'NOTE_CS4',
    61: 'NOTE_CS5', 73: 'NOTE_CS6', 85: 'NOTE_CS7', 97: 'NOTE_CS8',
    14: 'NOTE_D1', 26: 'NOTE_D2', 38: 'NOTE_D3', 50: 'NOTE_D4',
    62: 'NOTE_D5', 74: 'NOTE_D6', 86: 'NOTE_D7', 98: 'NOTE_D8',
    15: 'NOTE_DS1', 27: 'NOTE_DS2', 39: 'NOTE_DS3', 51: 'NOTE_DS4',
    63: 'NOTE_DS5', 75: 'NOTE_DS6', 87: 'NOTE_DS7', 99: 'NOTE_DS8',
    16: 'NOTE_E1', 28: 'NOTE_E2', 40: 'NOTE_E3', 52: 'NOTE_E4',
    64: 'NOTE_E5', 76: 'NOTE_E6', 88: 'NOTE_E7', 100: 'NOTE_E8',
    17: 'NOTE_F1', 29: 'NOTE_F2', 41: 'NOTE_F3', 53: 'NOTE_F4',
    65: 'NOTE_F5', 77: 'NOTE_F6', 89: 'NOTE_F7', 101: 'NOTE_F8',
    18: 'NOTE_FS1', 30: 'NOTE_FS2', 42: 'NOTE_FS3', 54: 'NOTE_FS4',
    66: 'NOTE_FS5', 78: 'NOTE_FS6', 90: 'NOTE_FS7', 102: 'NOTE_FS8',
    19: 'NOTE_G1', 31: 'NOTE_G2', 43: 'NOTE_G3', 55: 'NOTE_G4',
    67: 'NOTE_G5', 79: 'NOTE_G6', 91: 'NOTE_G7', 103: 'NOTE_G8',
    20: 'NOTE_GS1', 32: 'NOTE_GS2', 44: 'NOTE_GS3', 56: 'NOTE_GS4',
    68: 'NOTE_GS5', 80: 'NOTE_GS6', 92: 'NOTE_GS7', 104: 'NOTE_GS8',
    21: 'NOTE_A1', 33: 'NOTE_A2', 45: 'NOTE_A3', 57: 'NOTE_A4',
    69: 'NOTE_A5', 81: 'NOTE_A6', 93: 'NOTE_A7', 105: 'NOTE_A8',
    22: 'NOTE_AS1', 34: 'NOTE_AS2', 46: 'NOTE_AS3', 58: 'NOTE_AS4',
    70: 'NOTE_AS5', 82: 'NOTE_AS6', 94: 'NOTE_AS7', 106: 'NOTE_AS8',
    23: 'NOTE_B1', 35: 'NOTE_B2', 47: 'NOTE_B3', 59: 'NOTE_B4',
    71: 'NOTE_B5', 83: 'NOTE_B6', 95: 'NOTE_B7', 107: 'NOTE_B8'
};

let generatedArduinoCode = '';
const statusMessage = document.getElementById('statusMessage');

document.getElementById('midiFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    showStatus('🎵 MIDI loaded: ' + file.name, 'info');

    const reader = new FileReader();
    reader.onload = function (e) {
        const midiArrayBuffer = e.target.result;
        processMidiFile(midiArrayBuffer, file.name);
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('convertBtn').addEventListener('click', function () {
    const midiFile = document.getElementById('midiFile').files[0];
    if (!midiFile) {
        showStatus('❌ Please select a MIDI file', 'error');
        return;
    }

    showStatus('⏳ Converting...', 'info');

    const reader = new FileReader();
    reader.onload = function (e) {
        const midiArrayBuffer = e.target.result;
        convertToArduino(midiArrayBuffer, midiFile.name);
    };
    reader.readAsArrayBuffer(midiFile);
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    if (!generatedArduinoCode) {
        showStatus('❌ No code to download', 'error');
        return;
    }

    const fileName = document.getElementById('midiFile').files[0].name.replace('.mid', '.ino').replace('.midi', '.ino');
    downloadFile(fileName, generatedArduinoCode);
    showStatus('⬇️ Downloading: ' + fileName, 'success');
});

document.getElementById('copyBtn').addEventListener('click', function () {
    if (!generatedArduinoCode) {
        showStatus('❌ No code to copy', 'error');
        return;
    }

    copyToClipboard(generatedArduinoCode);
    showCopyToast();
    showStatus('📋 Code copied!', 'success');
});

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .catch(err => {
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {}

    document.body.removeChild(textArea);
}

function showCopyToast() {
    const toast = document.getElementById('copyToast');
    toast.classList.add('show');

    setTimeout(function () {
        toast.classList.remove('show');
    }, 2000);
}

function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    setTimeout(() => {
        statusMessage.textContent = '';
    }, 3000);
}

function processMidiFile(midiArrayBuffer, fileName) {
    MidiParser.parse(midiArrayBuffer, function (midi) {
        let tracks = midi.track || [];
        if (!Array.isArray(tracks)) {
            showStatus('❌ Could not read MIDI file', 'error');
            return;
        }

        const trackSelect = document.getElementById('trackSelect');
        trackSelect.innerHTML = '';

        tracks.forEach((track, index) => {
            const noteEvents = track.event ? track.event.filter(e => e.type === 9 || e.type === 8) : [];
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Track ${index} (${noteEvents.length} note events)`;
            trackSelect.appendChild(option);
        });

        let detectedBpm = 120;
        tracks.forEach((track, index) => {
            if (!track.event) return;

            track.event.forEach(event => {
                if (event.type === 81) {
                    const microsecondsPerBeat = (event.data[0] << 16) | (event.data[1] << 8) | event.data[2];
                    detectedBpm = Math.round(60000000 / microsecondsPerBeat);
                }
            });
        });

        document.getElementById('tempoInput').placeholder = `Auto: ${detectedBpm}`;

        showStatus('✅ MIDI analysis complete', 'success');
    });
}

function convertToArduino(midiArrayBuffer, fileName) {
    const customTempo = document.getElementById('tempoInput').value || null;
    const trackNumber = parseInt(document.getElementById('trackSelect').value) || 0;
    const melodyMode = document.getElementById('melodyMode').value || 'smart';
    const includeRests = document.getElementById('includeRests').checked;
    const loopPlayback = document.getElementById('loopPlayback').checked;

    MidiParser.parse(midiArrayBuffer, function (midi) {
        try {
            let tracks = midi.track || [];
            if (!Array.isArray(tracks)) {
                showStatus('❌ Track array not found', 'error');
                throw new Error('Track array not found');
            }

            let bpm = customTempo || 120;
            tracks.forEach((track) => {
                if (!track.event) return;

                track.event.forEach(event => {
                    if (event.type === 81) {
                        const microsecondsPerBeat = (event.data[0] << 16) | (event.data[1] << 8) | event.data[2];
                        const detectedBpm = Math.round(60000000 / microsecondsPerBeat);
                        bpm = detectedBpm;
                    }
                });
            });

            if (customTempo) {
                bpm = customTempo;
            }

            if (trackNumber >= tracks.length) {
                showStatus(`❌ Track ${trackNumber} not found`, 'error');
                return;
            }

            const selectedTrack = tracks[trackNumber];

            let melodyNotes = [];
            let currentTime = 0;
            let activeNotes = new Map();
            let noteEvents = [];

            const MAX_NOTES = 512;
            let reachedLimit = false;

            if (!selectedTrack.event) {
                showStatus('❌ No events in this track!', 'error');
                return;
            }

            selectedTrack.event.forEach(event => {
                currentTime += event.deltaTime;

                if (event.type === 9 && event.data[1] > 0) {
                    const noteNumber = event.data[0];
                    const velocity = event.data[1];

                    if (midiToArduino[noteNumber]) {
                        noteEvents.push({
                            time: currentTime,
                            type: 'on',
                            note: noteNumber,
                            velocity: velocity,
                            arduino: midiToArduino[noteNumber]
                        });
                    }
                } else if (event.type === 8 || (event.type === 9 && event.data[1] === 0)) {
                    const noteNumber = event.data[0];

                    if (midiToArduino[noteNumber]) {
                        noteEvents.push({
                            time: currentTime,
                            type: 'off',
                            note: noteNumber,
                            arduino: midiToArduino[noteNumber]
                        });
                    }
                }
            });

            noteEvents.sort((a, b) => a.time - b.time);

            let activeNotesAtTime = new Map();
            let lastMelodyTime = -1;
            let lastNoteEndTime = -1;

            noteEvents.forEach(event => {
                if (reachedLimit) return;

                if (event.type === 'on') {
                    activeNotesAtTime.set(event.note, {
                        startTime: event.time,
                        velocity: event.velocity,
                        arduino: event.arduino,
                        pitch: event.note
                    });
                } else if (event.type === 'off' && activeNotesAtTime.has(event.note)) {
                    const noteInfo = activeNotesAtTime.get(event.note);
                    const duration = event.time - noteInfo.startTime;

                    let selectedNote = noteInfo;
                    if (activeNotesAtTime.size > 1 && melodyMode !== 'all') {
                        const candidates = Array.from(activeNotesAtTime.values());

                        if (melodyMode === 'highest') {
                            const highestPitch = Math.max(...candidates.map(n => n.pitch));
                            selectedNote = candidates.find(n => n.pitch === highestPitch);
                        } else if (melodyMode === 'loudest') {
                            selectedNote = candidates.reduce((prev, curr) =>
                                curr.velocity > prev.velocity ? curr : prev
                            );
                        } else {
                            const highestPitch = Math.max(...candidates.map(n => n.pitch));
                            const highPitchNotes = candidates.filter(n => n.pitch === highestPitch);

                            if (highPitchNotes.length === 1) {
                                selectedNote = highPitchNotes[0];
                            } else {
                                selectedNote = highPitchNotes.reduce((prev, curr) =>
                                    curr.velocity > prev.velocity ? curr : prev
                                );
                            }
                        }
                    }

                    const durationInBeats = duration / midi.timeDivision;
                    let arduinoDuration = Math.round(1 / durationInBeats);

                    if (arduinoDuration < 1) arduinoDuration = 1;
                    if (arduinoDuration > 32) arduinoDuration = 32;

                    const timeDiff = selectedNote.startTime - lastMelodyTime;
                    const minInterval = midi.timeDivision / 8;

                    const minDuration = midi.timeDivision / 16;

                    if (timeDiff > minInterval || lastMelodyTime === -1) {
                        if (duration >= minDuration && arduinoDuration >= 1) {
                            if (includeRests && lastNoteEndTime !== -1 &&
                                selectedNote.startTime > lastNoteEndTime + minInterval) {

                                if (melodyNotes.length >= MAX_NOTES - 1) {
                                    reachedLimit = true;
                                    showStatus('⚠️ 2048 byte limit reached! Some notes skipped.', 'warning');
                                    return;
                                }

                                const restDuration = selectedNote.startTime - lastNoteEndTime;
                                const restDurationInBeats = restDuration / midi.timeDivision;
                                let arduinoRestDuration = Math.round(1 / restDurationInBeats) * 2;

                                if (arduinoRestDuration < 1) arduinoRestDuration = 1;
                                if (arduinoRestDuration > 32) arduinoRestDuration = 32;

                                melodyNotes.push({
                                    note: "REST",
                                    duration: arduinoRestDuration,
                                    time: lastNoteEndTime,
                                    velocity: 0
                                });
                            }

                            if (melodyNotes.length >= MAX_NOTES) {
                                reachedLimit = true;
                                showStatus('⚠️ 2048 byte limit reached! Some notes skipped.', 'warning');
                                return;
                            }

                            melodyNotes.push({
                                note: selectedNote.arduino,
                                duration: arduinoDuration,
                                time: selectedNote.startTime,
                                velocity: selectedNote.velocity
                            });

                            lastMelodyTime = selectedNote.startTime;
                            lastNoteEndTime = event.time;
                        }
                    }

                    activeNotesAtTime.delete(event.note);
                }
            });

            melodyNotes.sort((a, b) => a.time - b.time);

            if (melodyNotes.length === 0) {
                showStatus('❌ No notes found!', 'error');
                return;
            }

            if (reachedLimit) {
                showStatus(`⚠️ Note count limited (${melodyNotes.length}/${MAX_NOTES})`, 'warning');
            } else {
                showStatus(`✅ ${melodyNotes.length} notes processed`, 'success');
            }

            let arduinoMelody = [];
            melodyNotes.forEach(note => {
                arduinoMelody.push(`  ${note.note}, ${note.duration}`);
            });

            const songTitle = fileName.replace('.mid', '').replace('.midi', '');

            generatedArduinoCode = generateArduinoCode(songTitle, arduinoMelody, bpm, trackNumber, loopPlayback);

            document.getElementById('codeDisplay').textContent = generatedArduinoCode;

            document.getElementById('resultContainer').style.display = 'block';
            showStatus(`✅ Converted with ${melodyNotes.length} notes!`, 'success');

        } catch (error) {
            showStatus(`❌ Error: ${error.message}`, 'error');
        }
    });
}

function generateArduinoCode(songTitle, melodyArray, tempo, track, loopPlayback) {
    return `/*
  🎹 ${songTitle}
  Arduino music player auto-generated from MIDI
  Piezo buzzer -> Pin 11
  Tempo: ${tempo} BPM
  Track: ${track}
  Notes: ${melodyArray.length / 2} (max: 512)
  
  Wiring:
  - Buzzer (+) -> Pin 11  
  - Buzzer (-) -> GND

  ❤️ Developed by Kubi
*/

int tempo = ${tempo};
int buzzerPin = 11;

// All note definitions
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

// 🎹 ${songTitle} melody (Track ${track})
int melody[] = {
${melodyArray.join(',\n')}
};

// Playback variables  
int totalNotes = sizeof(melody) / sizeof(melody[0]) / 2;
int noteIndex = 0;
bool isPlaying = false;
unsigned long previousMillis = 0;
int noteDuration = 0;
bool songFinished = false;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
  
  Serial.println("🎹 ================================");
  Serial.println("    ${songTitle}");
  Serial.println("🎹 ================================");
  Serial.print("📊 Total notes: ");
  Serial.println(totalNotes);
  Serial.print("⚡ Tempo: ");
  Serial.print(tempo);
  Serial.println(" BPM");
  Serial.print("🎼 Track: ");
  Serial.println(${track});
  Serial.println("🚀 Starting playback...");
  Serial.println();
}

void loop() {
  if (songFinished) {
    return; // Song finished, stop loop
  }

  unsigned long currentMillis = millis();
  
  // Start playing new note
  if (!isPlaying && noteIndex < totalNotes * 2) {
    int thisNote = noteIndex;
    int divider = melody[thisNote + 1];
    int wholenote = 60000 / tempo;
    
    // Calculate note duration
    if (divider > 0) {
      noteDuration = wholenote / divider;
    } else {
      noteDuration = wholenote / 4;
    }
    
    // If not REST, play note; if REST, stay silent
    if (melody[thisNote] != REST) {
      tone(buzzerPin, melody[thisNote], noteDuration * 0.85);
      Serial.print("♪ ");
      Serial.print(melody[thisNote]);
      Serial.print("Hz (");
      Serial.print(noteDuration);
      Serial.println("ms)");
    } else {
      noteDuration = noteDuration * 0.5;
      noTone(buzzerPin);
      Serial.print("⏸️ REST (");
      Serial.print(noteDuration);
      Serial.println("ms)");
    }
    
    isPlaying = true;
    previousMillis = currentMillis;
  }
  
  // Note duration finished?
  if (isPlaying && (currentMillis - previousMillis >= noteDuration)) {
    noTone(buzzerPin);
    noteIndex += 2;
    isPlaying = false;
    
    // Song finished?
    if (noteIndex >= totalNotes * 2) {
      Serial.println();
      Serial.println("🎉 Song finished!");
      ${loopPlayback ?
            `Serial.println("🔄 Restarting in 3 seconds...");
      Serial.println();
      delay(3000);
      noteIndex = 0;` :
            `songFinished = true;
      Serial.println("✨ Program ended.");`}
    }
  }
}`;
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

document.addEventListener('DOMContentLoaded', function () {
    showStatus('❤️ Developed by Kubi', 'info');
});
