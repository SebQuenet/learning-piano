import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to manage exercise progression with two-handed piano playing
 * @param {Array} upperSequence - Array of note objects for right hand (upper voice)
 * @param {Array} lowerSequence - Array of note objects for left hand (lower voice)
 * @returns {Object} Exercise state and methods
 */
export const useExercise = (upperSequence, lowerSequence) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Use ref to track which hands have been played (avoids closure issues)
  const playedNotesRef = useRef(new Set());

  const currentUpperNote = upperSequence?.[currentIndex] || null;
  const currentLowerNote = lowerSequence?.[currentIndex] || null;
  const totalNotes = Math.max(upperSequence?.length || 0, lowerSequence?.length || 0);
  const progress = totalNotes > 0 ? ((currentIndex / totalNotes) * 100).toFixed(0) : 0;

  // Use refs to store current values for stable callback
  const currentIndexRef = useRef(currentIndex);
  const isCompleteRef = useRef(isComplete);
  const totalNotesRef = useRef(totalNotes);

  // Update refs when state changes
  currentIndexRef.current = currentIndex;
  isCompleteRef.current = isComplete;
  totalNotesRef.current = totalNotes;

  const checkNote = useCallback((playedMidiNumber) => {
    if (isCompleteRef.current) return false;

    const idx = currentIndexRef.current;
    const currentUpperNote = upperSequence?.[idx] || null;
    const currentLowerNote = lowerSequence?.[idx] || null;

    console.log(`\n=== Checking Note at Index ${idx} ===`);
    console.log(`Upper note at ${idx}:`, currentUpperNote);
    console.log(`Lower note at ${idx}:`, currentLowerNote);
    console.log(`Played MIDI: ${playedMidiNumber}`);

    const upperMatch = currentUpperNote && playedMidiNumber === currentUpperNote.midiNumber;
    const lowerMatch = currentLowerNote && playedMidiNumber === currentLowerNote.midiNumber;

    console.log(`Upper match: ${upperMatch}, Lower match: ${lowerMatch}`);

    if (upperMatch || lowerMatch) {
      const handKey = upperMatch ? 'upper' : 'lower';

      // Check if already played this hand
      if (playedNotesRef.current.has(handKey)) {
        console.log(`Hand ${handKey} already played for note ${idx + 1}`);
        return true;
      }

      // Add to played hands
      playedNotesRef.current.add(handKey);
      console.log(`Note ${idx + 1}: Played ${handKey} hand (MIDI ${playedMidiNumber})`);
      console.log(`Hands played so far:`, Array.from(playedNotesRef.current));

      setScore((prev) => prev + 1);

      // Check if both hands have been played
      const bothHandsPlayed = (playedNotesRef.current.has('upper') || !currentUpperNote) &&
                              (playedNotesRef.current.has('lower') || !currentLowerNote);

      console.log(`Both hands played? ${bothHandsPlayed}`);

      if (bothHandsPlayed) {
        // Advance to next note
        if (idx < totalNotesRef.current - 1) {
          const newIndex = idx + 1;
          console.log(`Advancing from note ${idx + 1} to ${newIndex + 1}`);
          setCurrentIndex(newIndex);
          currentIndexRef.current = newIndex; // Update ref immediately!
          playedNotesRef.current = new Set(); // Reset for next pair
        } else {
          console.log('Exercise complete!');
          setIsComplete(true);
          isCompleteRef.current = true; // Update ref immediately!
          playedNotesRef.current = new Set();
        }
      }

      return true;
    } else {
      setErrors((prev) => prev + 1);
      return false;
    }
  }, [upperSequence, lowerSequence]);

  const resetExercise = useCallback(() => {
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setScore(0);
    setErrors(0);
    setIsComplete(false);
    isCompleteRef.current = false;
    playedNotesRef.current = new Set();
  }, []);

  const goToNote = useCallback((index) => {
    if (index >= 0 && index < totalNotes) {
      setCurrentIndex(index);
      currentIndexRef.current = index;
      setIsComplete(false);
      isCompleteRef.current = false;
      playedNotesRef.current = new Set();
    }
  }, [totalNotes]);

  return {
    currentUpperNote,
    currentLowerNote,
    currentIndex,
    totalNotes,
    score,
    errors,
    progress,
    isComplete,
    playedNotes: playedNotesRef.current,
    checkNote,
    resetExercise,
    goToNote,
  };
};
