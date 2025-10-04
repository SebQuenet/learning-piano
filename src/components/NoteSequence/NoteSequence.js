import React from 'react';
import PropTypes from 'prop-types';
import classes from './NoteSequence.module.scss';

/**
 * Displays a sequence of upcoming notes
 * @param {Array} notes - Array of note objects
 * @param {number} currentIndex - Current note index
 * @param {number} displayCount - Number of notes to display (default 8)
 */
const NoteSequence = ({ notes, currentIndex, displayCount = 8 }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className={classes.container}>
        <p className={classes.empty}>No notes to display</p>
      </div>
    );
  }

  // Calculate which notes to show
  const startIndex = Math.max(0, currentIndex - 1);
  const endIndex = Math.min(notes.length, startIndex + displayCount);
  const visibleNotes = notes.slice(startIndex, endIndex);

  return (
    <div className={classes.container}>
      <div className={classes.sequence}>
        {visibleNotes.map((note, idx) => {
          const actualIndex = startIndex + idx;
          const isCurrent = actualIndex === currentIndex;
          const isPast = actualIndex < currentIndex;

          return (
            <div
              key={actualIndex}
              className={`
                ${classes.noteItem}
                ${isCurrent ? classes.current : ''}
                ${isPast ? classes.past : ''}
              `}
            >
              <div className={classes.noteNumber}>{actualIndex + 1}</div>
              <div className={classes.noteName}>{note.noteName || '?'}</div>
              <div className={classes.midi}>MIDI: {note.midiNumber}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

NoteSequence.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      midiNumber: PropTypes.number.isRequired,
      noteName: PropTypes.string,
    })
  ).isRequired,
  currentIndex: PropTypes.number.isRequired,
  displayCount: PropTypes.number,
};

export default NoteSequence;
