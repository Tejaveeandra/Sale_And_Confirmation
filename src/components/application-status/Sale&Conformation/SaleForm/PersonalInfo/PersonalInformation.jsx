import { Formik, Form, Field } from "formik";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import { formFields, initialValues } from "./constants/formFields";
import { validationSchema } from "./constants/validationSchema";
import { usePersonalInfoSubmission } from "./hooks/usePersonalInfoSubmission";
import { useDropdownData } from "./hooks/useDropdownData";
import BasicInfo from "./components/BasicInfo";
import DownSection from "./components/DownSection";
import ProfilePhoto from "./components/ProfilePhoto";
import AdditionalFields from "./components/AdditionalFields";
import ParentInfo from "./components/ParentInfo";
import styles from "./PersonalInformation.module.css";

const PersonalInformation = ({ onSuccess }) => {
  const { isSubmitting, error, handleSubmit } = usePersonalInfoSubmission();
  const { 
    quotaOptions, 
    admissionReferredByOptions, 
    admissionTypeOptions,
    genderOptions,
    authorizedByOptions,
    loading: dropdownLoading, 
    error: dropdownError 
  } = useDropdownData();

  console.log('=== PERSONAL INFORMATION RECEIVED DATA ===');
  console.log('Received quotaOptions:', quotaOptions.length, 'items');
  console.log('Received admissionReferredByOptions:', admissionReferredByOptions.length, 'items');
  console.log('Received admissionTypeOptions:', admissionTypeOptions.length, 'items');
  console.log('Received genderOptions:', genderOptions.length, 'items');
  console.log('Received authorizedByOptions:', authorizedByOptions.length, 'items');
  console.log('=== END PERSONAL INFORMATION RECEIVED DATA ===');


  // Handle form submission with API integration
  const onSubmit = async (values, { setSubmitting }) => {
    const result = await handleSubmit(values, onSuccess);
    setSubmitting(false);
    return result;
  };

  // Show error state if dropdown data fails to load (but still render the form)
  if (dropdownError) {
    console.warn('Dropdown data failed to load:', dropdownError);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur }) => (
        <Form>
          {/* Global Error Display */}
          {error && (
            <div className={styles.global_error}>
              {error}
            </div>
          )}

          {/* Personal Information Section Title - Full Width */}
          <div className={`${styles.personal_info_section_general_field_label_wrapper} ${styles.personal_info_full_width}`}>
            <span className={styles.personal_info_section_general_field_label}>
              Personal Information
            </span>
            <div className={styles.personal_info_section_general_line}></div>
          </div>

    <div className={styles.custom_flex_container}>
            {/* Left Side - Two divs (up and down) */}
      <div className={styles.custom_left_group}>
        {/* UP DIV - First Name and Surname */}
              <BasicInfo
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                errors={errors}
                admissionReferredByOptions={admissionReferredByOptions}
                quotaOptions={quotaOptions}
                admissionTypeOptions={admissionTypeOptions}
                genderOptions={genderOptions}
                authorizedByOptions={authorizedByOptions}
                formFields={formFields}
              />

              {/* DOWN DIV - Gender and Aapar No */}
              <DownSection
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                formFields={formFields}
                genderOptions={genderOptions}
              />
      </div>
      
            {/* Right Side - Profile Photo */}
            <div className={styles.custom_right_group}>
              <ProfilePhoto
                touched={touched}
                errors={errors}
              />
            </div>
          </div>

          {/* Additional Fields */}
          <AdditionalFields
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            admissionReferredByOptions={admissionReferredByOptions}
            quotaOptions={quotaOptions}
            admissionTypeOptions={admissionTypeOptions}
            genderOptions={genderOptions}
            authorizedByOptions={authorizedByOptions}
            formFields={formFields}
            setFieldValue={setFieldValue}
          />

          {/* Parent Information */}
          <ParentInfo
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            admissionReferredByOptions={admissionReferredByOptions}
            quotaOptions={quotaOptions}
            formFields={formFields}
            setFieldValue={setFieldValue}
          />
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInformation;