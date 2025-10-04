import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage exercise progression
 * @param {Array} noteSequence - Array of note objects with midiNumber
 * @param {Object} midiEvent - MIDI event from useMIDINote hook
 * @returns {Object} Exercise state and methods
 */
export const useExercise = (noteSequence, midiEvent) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentNote = noteSequence?.[currentIndex] || null;
  const totalNotes = noteSequence?.length || 0;
  const progress = totalNotes > 0 ? ((currentIndex / totalNotes) * 100).toFixed(0) : 0;

  const checkNote = useCallback((playedMidiNumber) => {
    if (!currentNote || isComplete) return false;

    const isCorrect = playedMidiNumber === currentNote.midiNumber;

    if (isCorrect) {
      setScore((prev) => prev + 1);

      // Move to next note
      if (currentIndex < totalNotes - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    } else {
      setErrors((prev) => prev + 1);
    }

    return isCorrect;
  }, [currentNote, currentIndex, totalNotes, isComplete]);

  const resetExercise = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setErrors(0);
    setIsComplete(false);
  }, []);

  const goToNote = useCallback((index) => {
    if (index >= 0 && index < totalNotes) {
      setCurrentIndex(index);
      setIsComplete(false);
    }
  }, [totalNotes]);

  // Handle MIDI input
  useEffect(() => {
    if (midiEvent?.on && midiEvent?.note) {
      checkNote(midiEvent.note);
    }
  }, [midiEvent, checkNote]);

  return {
    currentNote,
    currentIndex,
    totalNotes,
    score,
    errors,
    progress,
    isComplete,
    checkNote,
    resetExercise,
    goToNote,
  };
};
