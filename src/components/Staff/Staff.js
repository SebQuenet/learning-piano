import React from 'react';
import PropTypes from 'prop-types';
import { MUSIC_SYMBOLS } from '../../constants/notes';
import Note from '../Note';
import classes from './Staff.module.scss';

/**
 * Musical staff component with clef and optional note
 * @param {string} clef - Type of clef ('treble' or 'bass')
 * @param {Object} note - Note object to display (optional)
 */
const Staff = ({ clef = 'treble', note = null }) => {
  const clefSymbol = clef === 'treble'
    ? MUSIC_SYMBOLS.TREBLE_CLEF
    : MUSIC_SYMBOLS.BASS_CLEF;

  // Repeat staff line symbol for visual effect
  const staffLines = MUSIC_SYMBOLS.STAFF_LINE.repeat(32);

  return (
    <div className={classes.staffWrapper}>
      <span className={classes.staffLines}>{staffLines}</span>
      <span className={classes.clef}>{clefSymbol}</span>
      {note && <Note position={note.position} />}
    </div>
  );
};

Staff.propTypes = {
  clef: PropTypes.oneOf(['treble', 'bass']),
  note: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    midiNumber: PropTypes.number,
    position: PropTypes.number,
  }),
};

export default Staff;
