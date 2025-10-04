import React, { useState, useEffect, useRef, useReducer } from "react";
import { useMIDI, useMIDINote } from "@react-midi/hooks";
import MIDISounds from "midi-sounds-react";
import "./App.css";
import classes from "./App.module.scss";
import Note0 from "./components/Note0";
import Note1 from "./components/Note1";
import Note2 from "./components/Note2";
import Note3 from "./components/Note3";
import Note4 from "./components/Note4";
import Note5 from "./components/Note5";
import Note6 from "./components/Note6";
import Note7 from "./components/Note7";
import Note8 from "./components/Note8";
import Note9 from "./components/Note9";
import Notem1 from "./components/Notem1";
import Notem2 from "./components/Notem2";

// <div>𝄞♩♭♯𝄚</div>

const listOfNotes = [
  { component: Notem2, note: "do", noteNumber: 60 },
  { component: Notem1, note: "ré", noteNumber: 62 },
  { component: Note0, note: "mi", noteNumber: 64 },
  { component: Note1, note: "fa", noteNumber: 65 },
  { component: Note2, note: "sol", noteNumber: 67 },
  { component: Note3, note: "la", noteNumber: 69 },
  { component: Note4, note: "si", noteNumber: 71 },
  { component: Note5, note: "do", noteNumber: 72 },
  { component: Note6, note: "ré", noteNumber: 74 },
  { component: Note7, note: "mi", noteNumber: 76 },
  { component: Note8, note: "fa", noteNumber: 77 },
  { component: Note9, note: "sol", noteNumber: 79 },
];

const noteLevel = () => Math.floor(Math.random() * 12);

const gameReducer = (state, action) => {
  switch (action.type) {
    case "startGame":
      return "game/STARTED";
    case "stopGame":
      return "game/STOPPED";
    default:
      return "game/UNKNOWN";
  }
};

const gameReducerInitialState = "game/NOT_STARTED";

const App = () => {
  const { inputs, outputs } = useMIDI();
  const [selectedMidiId, setSelectedMidiId] = useState(inputs[0]?.id);
  const [nextScaleIndex, setNextScaleIndex] = useState(noteLevel());
  const [score, setScore] = useState(0);
  const midiController = inputs.find((input) => input.id === selectedMidiId);
  const [gameState, gameReducerDispatch] = useReducer(
    gameReducer,
    gameReducerInitialState
  );
  const event = useMIDINote(midiController);
  const decreaseNum = () => setTimer((prev) => prev - 1);
  const [timer, setTimer] = useState(3);

  let midiSounds = useRef();
  let intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalRef.current);
    }
  }, [timer]);
  useEffect(() => {
    if (!event?.on) return;
    midiSounds.playChordNow(3, [event?.note], 2.5);
    if (event.note === listOfNotes[nextScaleIndex]?.noteNumber) {
      setScore(score + 1);
    }
    setNextScaleIndex(noteLevel());
  }, [event]);

  return (
    <div>
      <MIDISounds
        ref={(ref) => (midiSounds = ref)}
        appElementName="root"
        instruments={[3]}
      />
      {timer}
      <select
        onChange={(e) => {
          setSelectedMidiId(e.target.value);
        }}
      >
        {inputs.map((input) => (
          <option key={input.id} value={input.id}>
            {input.name}
          </option>
        ))}
      </select>
      <p className={classes.score}>Score : {score}</p>
      <div className={classes.fiveLinesStaffWrapper}>
        <span className={classes.fiveLinesStaff}>
          𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚
        </span>
        <span className={classes.gClef}>𝄞</span>
        {listOfNotes[nextScaleIndex].component()}
      </div>
      <div className={classes.fiveLinesStaffWrapper}>
        <span className={classes.fiveLinesStaff}>
          𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚𝄚
        </span>
        <span className={classes.gClef}>𝄢</span>
      </div>
    </div>
  );
};
export default App;
