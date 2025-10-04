import React from 'react';
import PropTypes from 'prop-types';
import classes from './ScoreDisplay.module.scss';

/**
 * Score display component
 * @param {number} score - Current score
 */
const ScoreDisplay = ({ score }) => {
  return (
    <p className={classes.score}>
      Score: {score}
    </p>
  );
};

ScoreDisplay.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreDisplay;
