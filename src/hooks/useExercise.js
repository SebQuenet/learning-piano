import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage exercise progression with two-handed piano playing
 * @param {Array} upperSequence - Array of note objects for right hand (upper voice)
 * @param {Array} lowerSequence - Array of note objects for left hand (lower voice)
 * @param {Object} midiEvent - MIDI event from useMIDINote hook
 * @returns {Object} Exercise state and methods
 */
export const useExercise = (upperSequence, lowerSequence, midiEvent) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [playedNotes, setPlayedNotes] = useState(new Set()); // Track which hand was played

  const currentUpperNote = upperSequence?.[currentIndex] || null;
  const currentLowerNote = lowerSequence?.[currentIndex] || null;
  const totalNotes = Math.max(upperSequence?.length || 0, lowerSequence?.length || 0);
  const progress = totalNotes > 0 ? ((currentIndex / totalNotes) * 100).toFixed(0) : 0;

  // Check if both hands have been played and advance to next note
  useEffect(() => {
    if (isComplete) return;

    const bothHandsPlayed = (playedNotes.has('upper') || !currentUpperNote) &&
                            (playedNotes.has('lower') || !currentLowerNote);

    if (bothHandsPlayed && playedNotes.size > 0) {
      // Move to next note pair after a short delay
      const timer = setTimeout(() => {
        if (currentIndex < totalNotes - 1) {
          setCurrentIndex((prev) => prev + 1);
          setPlayedNotes(new Set()); // Reset for next pair
        } else {
          setIsComplete(true);
          setPlayedNotes(new Set());
        }
      }, 100); // Small delay to ensure UI updates

      return () => clearTimeout(timer);
    }
  }, [playedNotes, currentUpperNote, currentLowerNote, currentIndex, totalNotes, isComplete]);

  const checkNote = useCallback((playedMidiNumber) => {
    if (isComplete) return false;

    const upperMatch = currentUpperNote && playedMidiNumber === currentUpperNote.midiNumber;
    const lowerMatch = currentLowerNote && playedMidiNumber === currentLowerNote.midiNumber;

    if (upperMatch || lowerMatch) {
      const handKey = upperMatch ? 'upper' : 'lower';

      // Only add if not already played
      setPlayedNotes((prev) => {
        if (prev.has(handKey)) return prev; // Already played this hand
        const newSet = new Set(prev);
        newSet.add(handKey);
        return newSet;
      });

      setScore((prev) => prev + 1);

      return true;
    } else {
      setErrors((prev) => prev + 1);
      return false;
    }
  }, [currentUpperNote, currentLowerNote, isComplete]);

  const resetExercise = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setErrors(0);
    setIsComplete(false);
    setPlayedNotes(new Set());
  }, []);

  const goToNote = useCallback((index) => {
    if (index >= 0 && index < totalNotes) {
      setCurrentIndex(index);
      setIsComplete(false);
      setPlayedNotes(new Set());
    }
  }, [totalNotes]);

  // Handle MIDI input
  useEffect(() => {
    if (midiEvent?.on && midiEvent?.note) {
      checkNote(midiEvent.note);
    }
  }, [midiEvent, checkNote]);

  return {
    currentUpperNote,
    currentLowerNote,
    currentIndex,
    totalNotes,
    score,
    errors,
    progress,
    isComplete,
    playedNotes,
    checkNote,
    resetExercise,
    goToNote,
  };
};
