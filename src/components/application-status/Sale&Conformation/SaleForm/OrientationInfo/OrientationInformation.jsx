import { Formik, Form } from "formik";
import * as Yup from "yup";
import { formFields, initialValues } from "./constants/orientationConstants";
import { useOrientationSubmission } from "./hooks/useOrientationSubmission";
import OrientationFormTitle from "./components/OrientationFormTitle";
import OrientationFormGrid from "./components/OrientationFormGrid";
import styles from "./OrientationInformation.module.css";

const OrientationInformation = ({ onSuccess }) => {
  const { isSubmitting, error, handleSubmit } = useOrientationSubmission();

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
    const result = await handleSubmit(values, onSuccess);
    setSubmitting(false);
    return result;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
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
      )}
    </Formik>
  );
};

export default OrientationInformation;
