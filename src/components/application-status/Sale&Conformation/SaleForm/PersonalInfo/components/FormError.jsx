import React from 'react';

const FormError = ({ name, touched, errors, className }) => {
  if (!touched[name] || !errors[name]) return null;
  
  return (
    <div className={className}>
      {errors[name]}
    </div>
  );
};

export default FormError;
