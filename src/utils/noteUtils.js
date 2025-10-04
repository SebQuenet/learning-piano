import { NOTES } from '../constants/notes';

/**
 * Generates a random note index
 * @returns {number} Random index between 0 and NOTES.length - 1
 */
export const getRandomNoteIndex = () => {
  return Math.floor(Math.random() * NOTES.length);
};

/**
 * Gets a note by its MIDI number
 * @param {number} midiNumber - The MIDI note number
 * @returns {Object|undefined} The note object or undefined if not found
 */
export const getNoteByMidiNumber = (midiNumber) => {
  return NOTES.find((note) => note.midiNumber === midiNumber);
};

/**
 * Gets a note by its index
 * @param {number} index - The note index
 * @returns {Object|undefined} The note object or undefined if not found
 */
export const getNoteByIndex = (index) => {
  return NOTES[index];
};
