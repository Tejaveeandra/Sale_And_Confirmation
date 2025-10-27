import React, { useMemo, useCallback, memo } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import FormError from './FormError';
import { ReactComponent as PhoneIcon } from '../../../../../../assets/application-status/PhoneIcon.svg';
import { capitalizeWords } from '../../../../../../utils/textUtils';

// Debug flag for conditional logging
const DEBUG = process.env.NODE_ENV === 'development';

const FieldRenderer = ({ 
  fields, 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  admissionReferredByOptions,
  quotaOptions,
  admissionTypeOptions,
  genderOptions,
  authorizedByOptions,
  errorClassName,
  setFieldValue
}) => {
  const getOptions = useCallback((optionsKey) => {
    const options = (() => {
      switch (optionsKey) {
        case "admissionReferredByOptions":
          return admissionReferredByOptions || [];
        case "quotaOptions":
          return quotaOptions || [];
        case "admissionTypeOptions":
          return admissionTypeOptions || [];
        case "genderOptions":
          return genderOptions || [];
        case "authorizedByOptions":
          return authorizedByOptions || [];
        case "employeeIdOptions":
          return authorizedByOptions || [];
        default:
          return [];
      }
    })();
    
    return options;
  }, [admissionReferredByOptions, quotaOptions, admissionTypeOptions, genderOptions, authorizedByOptions]);

  // Custom onChange handler for name fields with capitalization - optimized with useCallback
  const handleNameFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    const capitalizedValue = capitalizeWords(value);
    
    // Use Formik's setFieldValue to update the field
    if (setFieldValue) {
      setFieldValue(name, capitalizedValue);
    } else {
      // Fallback to regular handleChange
      handleChange(e);
    }
  }, [setFieldValue, handleChange]);

  const renderedFields = useMemo(() => {
    return fields.map((field) => {
      // Conditional visibility for Employee ID field (previously Admission Referred By)
      if (field.name === "employeeId") {
        // Check if the selected quota is "Staff children" by finding the quota option
        const selectedQuotaOption = quotaOptions.find(option => option.value === values.quota);
        const isStaffChildSelected = selectedQuotaOption?.label === "Staff children";
        
        
        if (!isStaffChildSelected) {
          return null; // Hide the field if Staff children is not selected
        }
      }

      // Conditional visibility for PRO Receipt No field
      if (field.name === "proReceiptNo") {
        // Check if the selected admission type is "with pro" by comparing with the label
        const selectedAdmissionTypeLabel = admissionTypeOptions.find(option => option.value === values.admissionType)?.label;
        const isWithProSelected = selectedAdmissionTypeLabel === "with pro" || selectedAdmissionTypeLabel === "With Pro"|| selectedAdmissionTypeLabel === "With pro";
        const category = localStorage.getItem("category");
        const isCollegeCategory = category === "COLLEGE";
        
        // Hide the field if "with pro" is not selected OR if category is COLLEGE
        if (!isWithProSelected || isCollegeCategory) {
          return null;
        }
      }

    return (
      <div key={field.id} >
       
        <Field name={field.name}>
          {({ field: fieldProps, meta }) => {
            const options = getOptions(field.options);
            const stringOptions = options.map(option => option.label || option.value);
            
            
            // Get the current selected option to display the label
            const selectedOption = options.find(option => option.value === values[field.name]);
            const displayValue = selectedOption ? selectedOption.label : values[field.name] || "";
            
            // Custom onChange handler for dropdowns to store the value (ID) instead of label
            const handleDropdownChange = (e) => {
              const selectedLabel = e.target.value;
              const selectedOption = options.find(option => option.label === selectedLabel);
              
              if (selectedOption) {
                // Store the value (ID) instead of the label
                handleChange({
                  target: {
                    name: field.name,
                    value: selectedOption.value
                  }
                });
              }
            };
            
            // Special handling for phone number field with icon
            if (field.name === "phoneNumber") {
              return (
                <div style={{ position: 'relative' }}>
                  <Inputbox
                    label={field.label}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={field.type}
                    error={meta.touched && meta.error}
                    required={field.required}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '68%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <PhoneIcon style={{ width: '16px', height: '16px', color: '#98A2B3' }} />
                  </div>
                </div>
              );
            }

            // Special handling for name fields with capitalization
            const nameFields = ["firstName", "surname", "fatherName"];
            if (nameFields.includes(field.name)) {
              return (
                <Inputbox
                  label={field.label}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] || ""}
                  onChange={handleNameFieldChange}
                  onBlur={handleBlur}
                  type={field.type}
                  error={meta.touched && meta.error}
                  required={field.required}
                />
              );
            }
            
            return field.type === "dropdown" ? (
              <Dropdown
                dropdownname={field.label}
                id={field.id}
                name={field.name}
                value={displayValue}
                onChange={handleDropdownChange}
                results={stringOptions}
                required={field.required}
                disabled={false}
                dropdownsearch={true}
              />
            ) : (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                type={field.type}
                error={meta.touched && meta.error}
                required={field.required}
              />
            );
          }}
        </Field>
        <FormError
          name={field.name}
          touched={touched}
          errors={errors}
          className={errorClassName}
        />
      </div>
    );
    });
  }, [fields, values, handleChange, handleBlur, touched, errors, admissionReferredByOptions, quotaOptions, admissionTypeOptions, genderOptions, authorizedByOptions, errorClassName, setFieldValue]);

  return renderedFields;
};

export default React.memo(FieldRenderer);
