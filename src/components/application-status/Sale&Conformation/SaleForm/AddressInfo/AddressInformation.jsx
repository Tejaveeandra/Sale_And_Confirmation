import { Formik, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { formFields, initialValues } from "./constants/addressConstants";
import { useAddressSubmission } from "./hooks/useAddressSubmission";
import AddressFormTitle from "./components/AddressFormTitle";
import AddressFormGrid from "./components/AddressFormGrid";
import styles from "./AddressInformation.module.css";

const AddressInformation = ({ onSuccess }) => {
  const { isSubmitting, error, handleSubmit } = useAddressSubmission();

  // Track previous values to detect changes
  const [previousValues, setPreviousValues] = useState(initialValues);

  // Function to handle value changes
  const handleValuesChange = (values) => {
    // Check if values have actually changed
    const hasChanged = JSON.stringify(values) !== JSON.stringify(previousValues);
    if (hasChanged && onSuccess) {
      console.log('🔄 AddressInformation values changed:', values);
      console.log('🔄 Key fields:', {
        doorNo: values.doorNo,
        streetName: values.streetName,
        area: values.area,
        pincode: values.pincode,
        state: values.state,
        district: values.district,
        mandal: values.mandal,
        city: values.city
      });
      onSuccess(values);
      setPreviousValues(values);
    }
  };

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
    console.log('🔄 AddressInformation onSubmit called with values:', values);
    
    try {
      // Just validate and pass data to parent (matching existing pattern)
      console.log('🔄 AddressInformation calling onSuccess with:', values);
      if (onSuccess) {
        onSuccess(values);
      }
      
      setSubmitting(false);
      return { success: true };
    } catch (err) {
      console.error('Address information validation error:', err);
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
        );
      }}
    </Formik>
  );
};

export default AddressInformation;
