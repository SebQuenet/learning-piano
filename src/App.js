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
    midiEvent
  );

  // Use sound hook
  useMIDISound(midiEvent, midiSoundsRef);

  // Get current note based on mode
  const getCurrentNote = () => {
    if (mode === "random") {
      return randomGame.currentNote;
    } else if (mode === "exercise" && exercise.currentNote) {
      // Find matching note from NOTES constant for positioning
      return NOTES.find(n => n.midiNumber === exercise.currentNote.midiNumber) || null;
    }
    return null;
  };

  const currentNote = getCurrentNote();

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
              notes={exerciseData.upper}
              currentIndex={exercise.currentIndex}
            />
          </>
        )
      )}

      <Staff clef="treble" note={currentNote} />
      <Staff clef="bass" />
    </div>
  );
};

export default App;
