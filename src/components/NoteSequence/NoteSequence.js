import React from 'react';
import PropTypes from 'prop-types';
import classes from './NoteSequence.module.scss';

/**
 * Displays a sequence of upcoming notes for both hands
 * @param {Array} upperNotes - Array of note objects for right hand
 * @param {Array} lowerNotes - Array of note objects for left hand
 * @param {number} currentIndex - Current note index
 * @param {number} displayCount - Number of note pairs to display (default 8)
 */
const NoteSequence = ({ upperNotes, lowerNotes, currentIndex, displayCount = 8 }) => {
  const totalNotes = Math.max(upperNotes?.length || 0, lowerNotes?.length || 0);

  if (totalNotes === 0) {
    return (
      <div className={classes.container}>
        <p className={classes.empty}>No notes to display</p>
      </div>
    );
  }

  // Calculate which notes to show
  const startIndex = Math.max(0, currentIndex - 1);
  const endIndex = Math.min(totalNotes, startIndex + displayCount);

  const items = [];
  for (let i = startIndex; i < endIndex; i++) {
    items.push({
      index: i,
      upperNote: upperNotes?.[i],
      lowerNote: lowerNotes?.[i],
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.sequence}>
        {items.map(({ index, upperNote, lowerNote }) => {
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <div
              key={index}
              className={`
                ${classes.noteItem}
                ${isCurrent ? classes.current : ''}
                ${isPast ? classes.past : ''}
              `}
            >
              <div className={classes.noteNumber}>{index + 1}</div>

              {/* Right Hand (Upper) */}
              <div className={classes.hand}>
                <div className={classes.handLabel}>RH</div>
                <div className={classes.noteName}>
                  {upperNote?.noteName || '—'}
                </div>
                <div className={classes.midi}>
                  {upperNote ? `${upperNote.midiNumber}` : ''}
                </div>
              </div>

              {/* Left Hand (Lower) */}
              <div className={classes.hand}>
                <div className={classes.handLabel}>LH</div>
                <div className={classes.noteName}>
                  {lowerNote?.noteName || '—'}
                </div>
                <div className={classes.midi}>
                  {lowerNote ? `${lowerNote.midiNumber}` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

NoteSequence.propTypes = {
  upperNotes: PropTypes.arrayOf(
    PropTypes.shape({
      midiNumber: PropTypes.number.isRequired,
      noteName: PropTypes.string,
    })
  ),
  lowerNotes: PropTypes.arrayOf(
    PropTypes.shape({
      midiNumber: PropTypes.number.isRequired,
      noteName: PropTypes.string,
    })
  ),
  currentIndex: PropTypes.number.isRequired,
  displayCount: PropTypes.number,
};

export default NoteSequence;
