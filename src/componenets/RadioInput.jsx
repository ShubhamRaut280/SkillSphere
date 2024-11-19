import React from "react";
import PropTypes from "prop-types";

const RadioInput = ({ id, value, label, checked, onChange }) => {
  return (
    <label className="label">
      <input
        type="radio"
        id={id}
        name="value-radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <p className="text">{label}</p>
    </label>
  );
};

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadioInput;
