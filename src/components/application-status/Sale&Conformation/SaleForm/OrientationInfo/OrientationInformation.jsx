import { Formik, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { formFields, initialValues } from "./constants/orientationConstants";
import { useOrientationSubmission } from "./hooks/useOrientationSubmission";
import OrientationFormTitle from "./components/OrientationFormTitle";
import OrientationFormGrid from "./components/OrientationFormGrid";
import styles from "./OrientationInformation.module.css";

const OrientationInformation = ({ onSuccess }) => {
  const { isSubmitting, error, handleSubmit } = useOrientationSubmission();

  // Track previous values to detect changes
  const [previousValues, setPreviousValues] = useState(initialValues);

  // Function to handle value changes
  const handleValuesChange = (values) => {
    // Check if values have actually changed
    const hasChanged = JSON.stringify(values) !== JSON.stringify(previousValues);
    if (hasChanged && onSuccess) {
      console.log('🔄 OrientationInformation values changed:', values);
      console.log('🔄 Key fields:', {
        academicYear: values.academicYear,
        branch: values.branch,
        branchType: values.branchType,
        city: values.city,
        studentType: values.studentType,
        joiningClass: values.joiningClass,
        orientationName: values.orientationName
      });
      onSuccess(values);
      setPreviousValues(values);
    }
  };

  // Validation schema
  const validationSchema = Yup.object({
    academicYear: Yup.string().required("Academic Year is required"),
    joiningClass: Yup.string().required("Joining Class is required"),
    branchType: Yup.string().required("Branch Type is required"),
    branch: Yup.string().required("Branch is required"),
    orientationName: Yup.string().required("Orientation Name is required"),
    admissionType: Yup.string().required("Admission Type is required"),
    studentType: Yup.string().required("Student Type is required"),
    city: Yup.string().required("City is required"),
    proReceiptNo: Yup.string().required("PRO Receipt No is required")
  });

  // Handle form submission with API integration
  const onSubmit = async (values, { setSubmitting }) => {
    console.log('🔄 OrientationInformation onSubmit called with values:', values);
    
    try {
      // Just validate and pass data to parent (matching existing pattern)
      console.log('🔄 OrientationInformation calling onSuccess with:', values);
      if (onSuccess) {
        onSuccess(values);
      }
      
      setSubmitting(false);
      return { success: true };
    } catch (err) {
      console.error('Orientation information validation error:', err);
      setSubmitting(false);
      return { success: false, error: err.message };
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
        // Pass data to parent whenever values change
        handleValuesChange(values);

        return (
        <Form>
          {/* Global Error Display */}
          {error && (
            <div className={styles.global_error}>
              {error}
            </div>
          )}

          {/* Orientation Information Section Title */}
          <OrientationFormTitle />

          {/* Form Grid */}
          <OrientationFormGrid
            formFields={formFields}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
          />
        </Form>
        );
      }}
    </Formik>
  );
};

export default OrientationInformation;
