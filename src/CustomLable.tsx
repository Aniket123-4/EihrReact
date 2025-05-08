import React from 'react';

interface CustomLabelProps {
  text: any;
  required?: any;
  value?:any;
}

const CustomLabel: React.FC<CustomLabelProps> = ({ text, required, value }) => (
  <label style={{ color: "#000" }}>
      {text}
      {required && (
          <span style={{ color: value ? 'green' : 'red' }}>*</span>
      )}
  </label>
);

export default CustomLabel;