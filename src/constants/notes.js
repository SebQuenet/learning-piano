/**
 * Musical notes configuration for the piano learning game
 */

// Note definitions with MIDI numbers, positions for both treble and bass clef
// Positions are in rem units relative to the staff
// Includes all chromatic notes (sharps/flats)
export const NOTES = [
  // Bass clef notes (C2 to B3) - chromatic
  { id: 'C2', name: 'do', midiNumber: 36, position: 3.6 },
  { id: 'C#2', name: 'do#', midiNumber: 37, position: 3.4 },
  { id: 'D2', name: 'ré', midiNumber: 38, position: 3.2 },
  { id: 'D#2', name: 'ré#', midiNumber: 39, position: 3.0 },
  { id: 'E2', name: 'mi', midiNumber: 40, position: 2.8 },
  { id: 'F2', name: 'fa', midiNumber: 41, position: 2.4 },
  { id: 'F#2', name: 'fa#', midiNumber: 42, position: 2.2 },
  { id: 'G2', name: 'sol', midiNumber: 43, position: 2.0 },
  { id: 'G#2', name: 'sol#', midiNumber: 44, position: 1.8 },
  { id: 'A2', name: 'la', midiNumber: 45, position: 1.6 },
  { id: 'A#2', name: 'la#', midiNumber: 46, position: 1.4 },
  { id: 'B2', name: 'si', midiNumber: 47, position: 1.2 },
  { id: 'C3', name: 'do', midiNumber: 48, position: 0.8 },
  { id: 'C#3', name: 'do#', midiNumber: 49, position: 0.6 },
  { id: 'D3', name: 'ré', midiNumber: 50, position: 0.4 },
  { id: 'D#3', name: 'ré#', midiNumber: 51, position: 0.2 },
  { id: 'E3', name: 'mi', midiNumber: 52, position: 0.0 },
  { id: 'F3', name: 'fa', midiNumber: 53, position: -0.4 },
  { id: 'F#3', name: 'fa#', midiNumber: 54, position: -0.6 },
  { id: 'G3', name: 'sol', midiNumber: 55, position: -0.8 },
  { id: 'G#3', name: 'sol#', midiNumber: 56, position: -1.0 },
  { id: 'A3', name: 'la', midiNumber: 57, position: -1.2 },
  { id: 'A#3', name: 'la#', midiNumber: 58, position: -1.4 },
  { id: 'B3', name: 'si', midiNumber: 59, position: -1.6 },

  // Treble clef notes (C4 to C6) - chromatic
  { id: 'C4', name: 'do', midiNumber: 60, position: 1.2 },
  { id: 'C#4', name: 'do#', midiNumber: 61, position: 1.0 },
  { id: 'D4', name: 'ré', midiNumber: 62, position: 0.8 },
  { id: 'D#4', name: 'ré#', midiNumber: 63, position: 0.6 },
  { id: 'E4', name: 'mi', midiNumber: 64, position: 0.4 },
  { id: 'F4', name: 'fa', midiNumber: 65, position: 0.0 },
  { id: 'F#4', name: 'fa#', midiNumber: 66, position: -0.2 },
  { id: 'G4', name: 'sol', midiNumber: 67, position: -0.4 },
  { id: 'G#4', name: 'sol#', midiNumber: 68, position: -0.6 },
  { id: 'A4', name: 'la', midiNumber: 69, position: -0.8 },
  { id: 'A#4', name: 'la#', midiNumber: 70, position: -1.0 },
  { id: 'B4', name: 'si', midiNumber: 71, position: -1.2 },
  { id: 'C5', name: 'do', midiNumber: 72, position: -1.6 },
  { id: 'C#5', name: 'do#', midiNumber: 73, position: -1.8 },
  { id: 'D5', name: 'ré', midiNumber: 74, position: -2.0 },
  { id: 'D#5', name: 'ré#', midiNumber: 75, position: -2.2 },
  { id: 'E5', name: 'mi', midiNumber: 76, position: -2.4 },
  { id: 'F5', name: 'fa', midiNumber: 77, position: -2.7 },
  { id: 'F#5', name: 'fa#', midiNumber: 78, position: -2.85 },
  { id: 'G5', name: 'sol', midiNumber: 79, position: -3.0 },
  { id: 'G#5', name: 'sol#', midiNumber: 80, position: -3.2 },
  { id: 'A5', name: 'la', midiNumber: 81, position: -3.4 },
  { id: 'A#5', name: 'la#', midiNumber: 82, position: -3.6 },
  { id: 'B5', name: 'si', midiNumber: 83, position: -3.8 },
  { id: 'C6', name: 'do', midiNumber: 84, position: -4.2 },
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
  SHARP: '♯',
  FLAT: '♭',
};
