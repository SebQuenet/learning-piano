import React from 'react';
import PropTypes from 'prop-types';
import classes from './MIDISelector.module.scss';

/**
 * MIDI device selector component
 * @param {Array} devices - Array of MIDI input devices
 * @param {string} selectedId - Currently selected device ID
 * @param {Function} onSelect - Callback when device is selected
 */
const MIDISelector = ({ devices, selectedId, onSelect }) => {
  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  if (!devices || devices.length === 0) {
    return (
      <div className={classes.noDevices}>
        No MIDI devices found. Please connect a MIDI keyboard.
      </div>
    );
  }

  return (
    <select
      className={classes.selector}
      value={selectedId || ''}
      onChange={handleChange}
    >
      {devices.map((device) => (
        <option key={device.id} value={device.id}>
          {device.name}
        </option>
      ))}
    </select>
  );
};

MIDISelector.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default MIDISelector;
