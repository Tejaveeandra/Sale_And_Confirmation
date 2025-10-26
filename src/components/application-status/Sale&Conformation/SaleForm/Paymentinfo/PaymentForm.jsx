import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { paymentModes, initialValues } from './constants/paymentConstants';
import { getPaymentFields } from './constants/paymentFieldConfigs';
import { usePaymentSubmission } from './hooks/usePaymentSubmission';
import PaymentModeSelector from './components/PaymentModeSelector';
import CreditCardOptions from './components/CreditCardOptions';
import PaymentFormFields from './components/PaymentFormFields';
import PaymentFormActions from './components/PaymentFormActions';
import styles from './PaymentForm.module.css';

const PaymentForm = ({ onClose, onPaymentSuccess, isConfirmationMode = false }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Cash");
  const { isSubmitting, error, handleSubmit } = usePaymentSubmission();

  const onSubmit = async (values) => {
    const result = await handleSubmit(values, selectedPaymentMode, onClose);
    
    // Pass payment data to parent orchestration
    if (result && result.success && onPaymentSuccess) {
      onPaymentSuccess({
        ...values,
        paymentMode: selectedPaymentMode
      });
    }
  };

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
  };

  return (
    <div className={styles.payment_form_container}>
      <PaymentModeSelector
        selectedPaymentMode={selectedPaymentMode}
        onPaymentModeSelect={handlePaymentModeSelect}
        paymentModes={paymentModes}
      />

      <div className={styles.payment_form_down}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form className={styles.payment_form}>
              {/* Global Error Display */}
              {error && (
                <div className={styles.global_error}>
                  {error}
                </div>
              )}

              {/* PRO Credit Card and Application Special Concession - only visible when Credit/Debit Card is selected */}
              {selectedPaymentMode === "Credit/Debit Card" && (
                <CreditCardOptions
                  values={values}
                  handleChange={handleChange}
                />
              )}

              <PaymentFormFields
                formFields={getPaymentFields(selectedPaymentMode)}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />

              <PaymentFormActions
                onSubmit={onSubmit}
                values={values}
                isSubmitting={isSubmitting}
                buttonText={isConfirmationMode ? "Finish Sale & Confirmation" : "Finish Sale"}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentForm;
