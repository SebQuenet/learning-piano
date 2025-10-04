import React from 'react';
import PropTypes from 'prop-types';
import classes from './ExerciseDisplay.module.scss';

/**
 * Exercise metadata and progress display
 * @param {Object} metadata - Exercise metadata (title, composer)
 * @param {number} currentIndex - Current note index
 * @param {number} totalNotes - Total number of notes
 * @param {number} score - Correct notes played
 * @param {number} errors - Incorrect attempts
 * @param {number} progress - Progress percentage
 * @param {boolean} isComplete - Whether exercise is complete
 * @param {Function} onReset - Reset callback
 */
const ExerciseDisplay = ({
  metadata,
  currentIndex,
  totalNotes,
  score,
  errors,
  progress,
  isComplete,
  onReset,
}) => {
  return (
    <div className={classes.container}>
      {metadata && (
        <div className={classes.metadata}>
          {metadata.title && <h2 className={classes.title}>{metadata.title}</h2>}
          {metadata.composer && <p className={classes.composer}>{metadata.composer}</p>}
        </div>
      )}

      <div className={classes.stats}>
        <div className={classes.stat}>
          <span className={classes.label}>Progress:</span>
          <span className={classes.value}>
            {currentIndex + 1} / {totalNotes} ({progress}%)
          </span>
        </div>

        <div className={classes.stat}>
          <span className={classes.label}>Correct:</span>
          <span className={classes.value}>{score}</span>
        </div>

        <div className={classes.stat}>
          <span className={classes.label}>Errors:</span>
          <span className={classes.value}>{errors}</span>
        </div>
      </div>

      <div className={classes.progressBar}>
        <div
          className={classes.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {isComplete && (
        <div className={classes.complete}>
          <p>Exercise Complete! 🎉</p>
          <button onClick={onReset} className={classes.resetButton}>
            Play Again
          </button>
        </div>
      )}

      {!isComplete && (
        <button onClick={onReset} className={classes.resetButton}>
          Restart
        </button>
      )}
    </div>
  );
};

ExerciseDisplay.propTypes = {
  metadata: PropTypes.shape({
    title: PropTypes.string,
    composer: PropTypes.string,
  }),
  currentIndex: PropTypes.number.isRequired,
  totalNotes: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  errors: PropTypes.number.isRequired,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isComplete: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ExerciseDisplay;
