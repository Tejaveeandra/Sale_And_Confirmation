import { Field } from "formik";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import GenderSelection from "./GenderSelection";
import FormError from "./FormError";
import styles from "./DownSection.module.css";

const DownSection = ({ 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  setFieldValue,
  setFieldTouched,
  formFields,
  genderOptions
}) => {
  return (
    <div className={styles.down_section_container}>
      <div className={styles.down_section_form_row}>
        <GenderSelection
          values={values}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          touched={touched}
          errors={errors}
          genderOptions={genderOptions}
        />
        <div className={styles.down_section_form_field}>
          {(() => {
            const aaparField = formFields.find(field => field.name === "aaparNo");
            return (
              <Field name={aaparField.name}>
                {({ field: fieldProps, meta }) => (
                  <Inputbox
                    label={aaparField.label}
                    id={aaparField.id}
                    name={aaparField.name}
                    placeholder={aaparField.placeholder}
                    value={values[aaparField.name] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={aaparField.type}
                    error={meta.touched && meta.error}
                    required={aaparField.required}
                  />
                )}
              </Field>
            );
          })()}
          <FormError
            name="aaparNo"
            touched={touched}
            errors={errors}
            className={styles.down_section_error}
          />
        </div>
      </div>
    </div>
  );
};

export default DownSection;
