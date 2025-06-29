# 🎹 MIDI to Arduino Converter 🔊

This dope project lets you convert your fav MIDI tracks to Arduino code! Blast those tunes through a buzzer, no cap! 🔥

## ✨ Features

- 🎵 Upload any MIDI file and convert it to Arduino-ready code
- 🎚️ Select specific tracks from your MIDI
- 🧠 Smart melody extraction modes:
  - 💯 Smart mode (default) - picks the best notes
  - 🔝 Highest note mode - always grabs the highest notes
  - 💪 Loudest note mode - prioritizes the loudest notes
  - 🎛️ All notes mode - tries to include everything
- ⏱️ Auto-detects or manually set BPM
- 🔄 Optional looping playback
- ⬇️ Download Arduino code as .ino file
- 📋 Copy code to clipboard

## 🚀 How to Use

1. Drop your MIDI file into the converter
2. Choose your track (if multiple tracks exist)
3. Select melody extraction mode
4. Hit that "Convert to Arduino Code" button
5. Download or copy the generated code
6. Upload to your Arduino
7. Vibe to your tunes! 🎶

## 🔌 Circuit Setup

Super basic - just connect:
- Piezo buzzer positive (+) leg to Arduino pin 11
- Piezo buzzer negative (-) leg to Arduino GND

## ⚙️ Technical Details

- Uses a lightweight MIDI parser to extract note data
- Converts MIDI note numbers to Arduino frequency constants
- Calculates note durations based on tempo
- Intelligently extracts melody from complex MIDI files
- Limits output to fit Arduino's memory constraints (max ~512 notes)

## 🛑 Limitations

- Memory: Arduino has limited memory, so very long songs might be truncated
- Polyphony: Basic Arduino can only play one note at a time
- Complexity: Some complex MIDI files might not convert perfectly

## 🤔 Tips for Best Results

- Simple MIDI files work best
- Try different melody extraction modes for best sound
- If your song has too many notes, consider using a shorter section

## 🎵 Where to Find MIDI Files

You can use any MIDI files you want! Here are some fire resources to get you started:

- 🔥 **Online Sequencer**: Check out [Online Sequencer](https://onlinesequencer.net/sequences) - tons of community-created tunes you can download as MIDI
- 🎮 Video game music archives
- 🎸 Classical music libraries
- 🎧 Create your own using DAW software

To download from Online Sequencer:
1. Find a sequence you like
2. Click on the three dots menu (...)
3. Select "Download" and then "MIDI"
4. Upload that file to our converter and you're good to go!

Not all MIDI files will sound perfect - simpler melodies with clear lead parts work best for Arduino buzzers!