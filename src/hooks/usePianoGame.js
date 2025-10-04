import { useState, useEffect, useCallback } from 'react';
import { getRandomNoteIndex, getNoteByIndex } from '../utils/noteUtils';

/**
 * Custom hook to manage piano game state and logic
 * @param {Object} midiEvent - MIDI event from useMIDINote hook
 * @returns {Object} Game state and methods
 */
export const usePianoGame = (midiEvent) => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(getRandomNoteIndex());
  const [score, setScore] = useState(0);

  const currentNote = getNoteByIndex(currentNoteIndex);

  const checkNote = useCallback((playedMidiNumber) => {
    const isCorrect = playedMidiNumber === currentNote?.midiNumber;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Generate next random note
    setCurrentNoteIndex(getRandomNoteIndex());

    return isCorrect;
  }, [currentNote]);

  const resetGame = useCallback(() => {
    setScore(0);
    setCurrentNoteIndex(getRandomNoteIndex());
  }, []);

  // Handle MIDI input
  useEffect(() => {
    if (midiEvent?.on && midiEvent?.note) {
      checkNote(midiEvent.note);
    }
  }, [midiEvent, checkNote]);

  return {
    currentNote,
    score,
    checkNote,
    resetGame,
  };
};
