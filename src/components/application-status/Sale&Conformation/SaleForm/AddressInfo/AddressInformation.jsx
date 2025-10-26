import { Formik, Form } from "formik";
import * as Yup from "yup";
import { formFields, initialValues } from "./constants/addressConstants";
import { useAddressSubmission } from "./hooks/useAddressSubmission";
import AddressFormTitle from "./components/AddressFormTitle";
import AddressFormGrid from "./components/AddressFormGrid";
import styles from "./AddressInformation.module.css";

const AddressInformation = ({ onSuccess }) => {
  const { isSubmitting, error, handleSubmit } = useAddressSubmission();

  // Validation schema
  const validationSchema = Yup.object({
    doorNo: Yup.string().required("Door No is required"),
    area: Yup.string().required("Area is required"),
    mandal: Yup.string().required("Mandal is required"),
    streetName: Yup.string().required("Street Name is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    city: Yup.string().required("City is required"),
    landmark: Yup.string().notRequired(),
    district: Yup.string().required("District is required"),
    gpin: Yup.string().notRequired()
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

          {/* Address Information Section Title */}
          <AddressFormTitle />

          {/* Form Grid */}
          <AddressFormGrid
            formFields={formFields}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddressInformation;
