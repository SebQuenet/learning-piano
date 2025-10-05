import React from 'react';
import PropTypes from 'prop-types';
import { MUSIC_SYMBOLS } from '../../constants/notes';
import classes from './Staff.module.scss';

/**
 * Musical staff component with clef and multiple notes
 * @param {string} clef - Type of clef ('treble' or 'bass')
 * @param {Array} notes - Array of note objects from the exercise
 * @param {number} currentIndex - Index of the current note to highlight
 * @param {number} displayCount - Number of notes to display (default 16)
 */
const Staff = ({ clef = 'treble', notes = [], currentIndex = 0, displayCount = 16 }) => {
  const clefSymbol = clef === 'treble'
    ? MUSIC_SYMBOLS.TREBLE_CLEF
    : MUSIC_SYMBOLS.BASS_CLEF;

  // Repeat staff line symbol for visual effect
  const staffLines = MUSIC_SYMBOLS.STAFF_LINE.repeat(60);

  // Calculate which notes to display (window around current note)
  const startIndex = Math.max(0, currentIndex - 2);
  const endIndex = Math.min(notes.length, startIndex + displayCount);
  const visibleNotes = notes.slice(startIndex, endIndex);

  return (
    <div className={classes.staffWrapper}>
      <span className={classes.staffLines}>{staffLines}</span>
      <span className={classes.clef}>{clefSymbol}</span>

      <div className={classes.notesContainer}>
        {visibleNotes.map((note, idx) => {
          const actualIndex = startIndex + idx;
          const isCurrent = actualIndex === currentIndex;
          const isPast = actualIndex < currentIndex;

          if (!note) return null;

          return (
            <span
              key={`${actualIndex}-${note.midiNumber}`}
              className={`
                ${classes.note}
                ${isCurrent ? classes.current : ''}
                ${isPast ? classes.past : ''}
              `}
              style={{
                top: `${note.position}rem`,
                left: `${4 + (idx * 2)}rem` // Spacing between notes
              }}
            >
              {MUSIC_SYMBOLS.QUARTER_NOTE}
            </span>
          );
        })}
      </div>
    </div>
  );
};

Staff.propTypes = {
  clef: PropTypes.oneOf(['treble', 'bass']),
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      midiNumber: PropTypes.number,
      position: PropTypes.number,
    })
  ),
  currentIndex: PropTypes.number,
  displayCount: PropTypes.number,
};

export default Staff;
