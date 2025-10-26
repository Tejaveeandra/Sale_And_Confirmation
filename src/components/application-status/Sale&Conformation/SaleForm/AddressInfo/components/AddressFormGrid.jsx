import React from 'react';
import AddressFormField from './AddressFormField';
import styles from './AddressFormGrid.module.css';

const AddressFormGrid = ({ formFields, values, handleChange, handleBlur, errors, touched, setFieldValue }) => {
  return (
    <div className={styles.address_info_form_grid}>
      {formFields.map((field) => (
        <AddressFormField
          key={field.id}
          field={field}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
        />
      ))}
    </div>
  );
};

export default AddressFormGrid;
