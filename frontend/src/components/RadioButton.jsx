import React from "react";

const RadioButton = ({ label, name, value, checked, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio text-indigo-600 h-4 w-4"
      />
      <label
        htmlFor={value}
        className="ml-2 block text-gray-700 text-sm font-medium"
      >
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
