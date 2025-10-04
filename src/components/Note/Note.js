import React from 'react';
import PropTypes from 'prop-types';
import { MUSIC_SYMBOLS } from '../../constants/notes';
import classes from './Note.module.scss';

/**
 * A musical note displayed on the staff
 * @param {number} position - Vertical position in rem units
 */
const Note = ({ position }) => {
  return (
    <span
      className={classes.note}
      style={{ top: `${position}rem` }}
    >
      {MUSIC_SYMBOLS.QUARTER_NOTE}
    </span>
  );
};

Note.propTypes = {
  position: PropTypes.number.isRequired,
};

export default Note;
