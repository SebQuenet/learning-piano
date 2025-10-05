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

      {/* Time signature 2/4 - only show on treble clef */}
      {clef === 'treble' && (
        <>
          <span className={classes.timeSignature} style={{ left: '2.5rem', top: '0.4rem' }}>2</span>
          <span className={classes.timeSignature} style={{ left: '2.5rem', top: '1.2rem' }}>4</span>

          {/* Tempo marking */}
          <span className={classes.tempo} style={{ left: '0rem', top: '-2.5rem' }}>♩ = 60-108</span>
        </>
      )}

      {/* Dynamic marking mf - show on both staves */}
      <span className={classes.dynamic} style={{ left: '3.5rem', top: clef === 'treble' ? '3rem' : '-1.5rem' }}>mf</span>

      <div className={classes.notesContainer}>
        {visibleNotes.map((note, idx) => {
          const actualIndex = startIndex + idx;
          const isCurrent = actualIndex === currentIndex;
          const isPast = actualIndex < currentIndex;

          if (!note) return null;

          // Determine if note has sharp or flat
          const hasSharp = note.id && note.id.includes('#');
          const hasFlat = note.id && note.id.includes('b');
          const accidental = hasSharp ? MUSIC_SYMBOLS.SHARP : hasFlat ? MUSIC_SYMBOLS.FLAT : null;

          const baseLeft = 4 + (idx * 2);

          // Determine if note needs a ledger line
          // For treble clef: C4 (middle C) and below need ledger lines
          // For bass clef: C4 (middle C) and above need ledger lines
          const needsLedgerLine = (clef === 'treble' && note.position >= 1.2) ||
                                   (clef === 'bass' && note.position <= -1.6);

          return (
            <React.Fragment key={`${actualIndex}-${note.midiNumber}`}>
              {needsLedgerLine && (
                <span
                  className={classes.ledgerLine}
                  style={{
                    top: `${note.position + 2.1}rem`,
                    left: `${baseLeft + 0.1}rem`
                  }}
                >
                  ─
                </span>
              )}
              {accidental && (
                <span
                  className={`
                    ${classes.accidental}
                    ${isCurrent ? classes.current : ''}
                    ${isPast ? classes.past : ''}
                  `}
                  style={{
                    top: `${note.position + 1.9}rem`, // Position lower, near the note head
                    left: `${baseLeft - 0.3}rem` // Position to the left of the note
                  }}
                >
                  {accidental}
                </span>
              )}
              <span
                className={`
                  ${classes.note}
                  ${isCurrent ? classes.current : ''}
                  ${isPast ? classes.past : ''}
                `}
                style={{
                  top: `${note.position}rem`,
                  left: `${baseLeft}rem` // Spacing between notes
                }}
              >
                {MUSIC_SYMBOLS.SIXTEENTH_NOTE}
              </span>
            </React.Fragment>
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
