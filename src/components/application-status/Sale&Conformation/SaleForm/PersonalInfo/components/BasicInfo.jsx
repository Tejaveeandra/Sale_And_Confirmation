import { Field } from "formik";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import FormError from "./FormError";
import styles from "./BasicInfo.module.css";

const BasicInfo = ({ 
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
  formFields
}) => {
  // Helper function to get options based on field type
  const getOptions = (optionsKey) => {
    switch (optionsKey) {
      case "quotaOptions":
        return quotaOptions || [];
      case "admissionReferredByOptions":
        return admissionReferredByOptions || [];
      case "admissionTypeOptions":
        return admissionTypeOptions || [];
      case "genderOptions":
        return genderOptions || [];
      case "authorizedByOptions":
        return authorizedByOptions || [];
      default:
        return [];
    }
  };

  return (
    <div className={styles.basic_info_up_section}>
      <div className={styles.basic_info_form_row}>
        {formFields.slice(0, 2).map((field) => (
          <div key={field.id} className={styles.basic_info_form_field}>
            <Field name={field.name}>
              {({ field: fieldProps, meta }) => {
                const options = getOptions(field.options);
                const stringOptions = options.map(option => option.label || option.value);
                
                return field.type === "dropdown" ? (
                  <Dropdown
                    dropdownname={field.label}
                    id={field.id}
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={handleChange}
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
              className={styles.basic_info_error}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInfo;
