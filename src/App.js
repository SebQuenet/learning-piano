import React, { useState, useRef } from "react";
import { useMIDI, useMIDINote } from "@react-midi/hooks";
import MIDISounds from "midi-sounds-react";
import "./App.css";
import { MIDI_CONFIG } from "./constants/notes";
import { usePianoGame } from "./hooks/usePianoGame";
import { useMIDISound } from "./hooks/useMIDISound";
import Staff from "./components/Staff";
import MIDISelector from "./components/MIDISelector";
import ScoreDisplay from "./components/ScoreDisplay";

const App = () => {
  const { inputs } = useMIDI();
  const [selectedMidiId, setSelectedMidiId] = useState(inputs[0]?.id);
  const midiSoundsRef = useRef();

  // Get selected MIDI controller
  const midiController = inputs.find((input) => input.id === selectedMidiId);
  const midiEvent = useMIDINote(midiController);

  // Use custom hooks for game logic and sound
  const { currentNote, score } = usePianoGame(midiEvent);
  useMIDISound(midiEvent, midiSoundsRef);

  return (
    <div>
      <MIDISounds
        ref={midiSoundsRef}
        appElementName="root"
        instruments={[MIDI_CONFIG.INSTRUMENT]}
      />

      <MIDISelector
        devices={inputs}
        selectedId={selectedMidiId}
        onSelect={setSelectedMidiId}
      />

      <ScoreDisplay score={score} />

      <Staff clef="treble" note={currentNote} />
      <Staff clef="bass" />
    </div>
  );
};

export default App;
