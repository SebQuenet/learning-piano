import React, { useState, useRef, useEffect } from "react";
import { useMIDI, useMIDINote } from "@react-midi/hooks";
import MIDISounds from "midi-sounds-react";
import "./App.css";
import { MIDI_CONFIG } from "./constants/notes";
import { NOTES } from "./constants/notes";
import { usePianoGame } from "./hooks/usePianoGame";
import { useExercise } from "./hooks/useExercise";
import { useMIDISound } from "./hooks/useMIDISound";
import { parseLilypondFile } from "./utils/lilypondParser";
import Staff from "./components/Staff";
import MIDISelector from "./components/MIDISelector";
import ScoreDisplay from "./components/ScoreDisplay";
import ExerciseDisplay from "./components/ExerciseDisplay";
import NoteSequence from "./components/NoteSequence";
import classes from "./App.module.scss";

const App = () => {
  const { inputs } = useMIDI();
  const [selectedMidiId, setSelectedMidiId] = useState(inputs[0]?.id);
  const [mode, setMode] = useState("random"); // "random" or "exercise"
  const [exerciseData, setExerciseData] = useState(null);
  const midiSoundsRef = useRef();

  // Get selected MIDI controller
  const midiController = inputs.find((input) => input.id === selectedMidiId);
  const midiEvent = useMIDINote(midiController);

  // Load LilyPond exercise file
  useEffect(() => {
    const loadExercise = async () => {
      try {
        const response = await fetch('/hanon.lilypond');
        const content = await response.text();
        const parsed = parseLilypondFile(content);
        setExerciseData(parsed);
      } catch (error) {
        console.error('Failed to load exercise file:', error);
      }
    };

    loadExercise();
  }, []);

  // Use custom hooks based on mode
  const randomGame = usePianoGame(midiEvent);
  const exercise = useExercise(
    mode === "exercise" ? exerciseData?.upper : [],
    mode === "exercise" ? exerciseData?.lower : [],
    midiEvent
  );

  // Use sound hook
  useMIDISound(midiEvent, midiSoundsRef);

  // Map exercise notes to NOTES with positions for staff display
  const mapNotesToStaffPositions = (exerciseNotes) => {
    if (!exerciseNotes) return [];
    return exerciseNotes.map(exerciseNote => {
      const matchedNote = NOTES.find(n => n.midiNumber === exerciseNote.midiNumber);
      return matchedNote || null;
    }).filter(note => note !== null);
  };

  // Get note sequences for staff display
  const upperNotesForStaff = mode === "exercise" && exerciseData
    ? mapNotesToStaffPositions(exerciseData.upper)
    : mode === "random" && randomGame.currentNote
      ? [randomGame.currentNote]
      : [];

  const lowerNotesForStaff = mode === "exercise" && exerciseData
    ? mapNotesToStaffPositions(exerciseData.lower)
    : [];

  // Get current index based on mode
  const currentNoteIndex = mode === "exercise" ? exercise.currentIndex : 0;

  return (
    <div>
      <MIDISounds
        ref={midiSoundsRef}
        appElementName="root"
        instruments={[MIDI_CONFIG.INSTRUMENT]}
      />

      <div className={classes.header}>
        <h1>Piano Learning</h1>

        <MIDISelector
          devices={inputs}
          selectedId={selectedMidiId}
          onSelect={setSelectedMidiId}
        />

        <div className={classes.modeSelector}>
          <button
            className={`${classes.modeButton} ${mode === "random" ? classes.active : ""}`}
            onClick={() => setMode("random")}
          >
            Random Notes
          </button>
          <button
            className={`${classes.modeButton} ${mode === "exercise" ? classes.active : ""}`}
            onClick={() => setMode("exercise")}
            disabled={!exerciseData}
          >
            Exercise Mode
          </button>
        </div>
      </div>

      {mode === "random" ? (
        <ScoreDisplay score={randomGame.score} />
      ) : (
        exerciseData && (
          <>
            <ExerciseDisplay
              metadata={exerciseData.metadata}
              currentIndex={exercise.currentIndex}
              totalNotes={exercise.totalNotes}
              score={exercise.score}
              errors={exercise.errors}
              progress={exercise.progress}
              isComplete={exercise.isComplete}
              onReset={exercise.resetExercise}
            />
            <NoteSequence
              upperNotes={exerciseData.upper}
              lowerNotes={exerciseData.lower}
              currentIndex={exercise.currentIndex}
            />
          </>
        )
      )}

      <Staff
        clef="treble"
        notes={upperNotesForStaff}
        currentIndex={currentNoteIndex}
        displayCount={16}
      />
      <Staff
        clef="bass"
        notes={lowerNotesForStaff}
        currentIndex={currentNoteIndex}
        displayCount={16}
      />
    </div>
  );
};

export default App;
