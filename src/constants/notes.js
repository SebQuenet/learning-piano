/**
 * Musical notes configuration for the piano learning game
 */

// MIDI note positions on the staff (in rem units)
export const NOTE_POSITIONS = {
  '-2': 1.2,   // do (C4)
  '-1': 0.8,   // ré (D4)
  '0': 0.4,    // mi (E4)
  '1': 0,      // fa (F4)
  '2': -0.4,   // sol (G4)
  '3': -0.8,   // la (A4)
  '4': -1.2,   // si (B4)
  '5': -1.6,   // do (C5)
  '6': -2.0,   // ré (D5)
  '7': -2.4,   // mi (E5)
  '8': -2.7,   // fa (F5)
  '9': -3.0,   // sol (G5)
};

// Note definitions with their MIDI numbers and French names
export const NOTES = [
  { id: -2, name: 'do', midiNumber: 60, position: NOTE_POSITIONS['-2'] },
  { id: -1, name: 'ré', midiNumber: 62, position: NOTE_POSITIONS['-1'] },
  { id: 0, name: 'mi', midiNumber: 64, position: NOTE_POSITIONS['0'] },
  { id: 1, name: 'fa', midiNumber: 65, position: NOTE_POSITIONS['1'] },
  { id: 2, name: 'sol', midiNumber: 67, position: NOTE_POSITIONS['2'] },
  { id: 3, name: 'la', midiNumber: 69, position: NOTE_POSITIONS['3'] },
  { id: 4, name: 'si', midiNumber: 71, position: NOTE_POSITIONS['4'] },
  { id: 5, name: 'do', midiNumber: 72, position: NOTE_POSITIONS['5'] },
  { id: 6, name: 'ré', midiNumber: 74, position: NOTE_POSITIONS['6'] },
  { id: 7, name: 'mi', midiNumber: 76, position: NOTE_POSITIONS['7'] },
  { id: 8, name: 'fa', midiNumber: 77, position: NOTE_POSITIONS['8'] },
  { id: 9, name: 'sol', midiNumber: 79, position: NOTE_POSITIONS['9'] },
];

// MIDI configuration
export const MIDI_CONFIG = {
  INSTRUMENT: 3,
  CHORD_DURATION: 2.5,
};

// Musical symbols
export const MUSIC_SYMBOLS = {
  TREBLE_CLEF: '𝄞',
  BASS_CLEF: '𝄢',
  STAFF_LINE: '𝄚',
  QUARTER_NOTE: '♩',
};
