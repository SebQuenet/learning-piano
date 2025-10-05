import { useState, useCallback } from 'react';
import { getRandomNoteIndex, getNoteByIndex } from '../utils/noteUtils';

/**
 * Custom hook to manage piano game state and logic
 * @returns {Object} Game state and methods
 */
export const usePianoGame = () => {
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

  return {
    currentNote,
    score,
    checkNote,
    resetGame,
  };
};
