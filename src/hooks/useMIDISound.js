import { useEffect } from 'react';
import { MIDI_CONFIG } from '../constants/notes';

/**
 * Custom hook to handle MIDI sound playback
 * @param {Object} midiEvent - MIDI event from useMIDINote hook
 * @param {Object} midiSoundsRef - Reference to MIDISounds component
 */
export const useMIDISound = (midiEvent, midiSoundsRef) => {
  useEffect(() => {
    if (!midiEvent?.on || !midiSoundsRef.current) return;

    midiSoundsRef.current.playChordNow(
      MIDI_CONFIG.INSTRUMENT,
      [midiEvent.note],
      MIDI_CONFIG.CHORD_DURATION
    );
  }, [midiEvent, midiSoundsRef]);
};
