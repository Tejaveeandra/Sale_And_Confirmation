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

const PaymentForm = ({ onClose, onPaymentSuccess, isConfirmationMode = false, onSubmitCompleteSale, onSubmitConfirmation }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Cash");
  const { isSubmitting, error, handleSubmit } = usePaymentSubmission();

  const onSubmit = async (values) => {
    console.log('PaymentForm onSubmit called with values:', values);
    console.log('Selected payment mode:', selectedPaymentMode);
    
    const result = await handleSubmit(values, selectedPaymentMode, onClose);
    
    console.log('PaymentForm handleSubmit result:', result);
    
      // Pass payment data to parent orchestration
      if (result && result.success && onPaymentSuccess) {
        const paymentData = {
          ...values,
          paymentMode: selectedPaymentMode
        };
        console.log('PaymentForm calling onPaymentSuccess with:', paymentData);
        const updatedFormData = onPaymentSuccess(paymentData);
        
        // After adding payment data, submit based on mode
        if (isConfirmationMode && onSubmitConfirmation) {
          console.log('PaymentForm calling onSubmitConfirmation to submit confirmation data');
          
          // Submit confirmation data
          const submitResult = await onSubmitConfirmation();
          
          // Only close modal and show success if confirmation API actually succeeded
          if (submitResult && submitResult.success) {
            console.log('✅ Confirmation submission successful - closing modal and showing success page');
            onClose(true); // Close modal, parent will show success page
          } else {
            console.log('❌ Confirmation submission failed - keeping modal open');
            // Modal stays open, error will be shown in the parent component
            // Don't close the modal on API failure
          }
        } else if (!isConfirmationMode && onSubmitCompleteSale) {
          console.log('PaymentForm calling onSubmitCompleteSale to show backend data');
          
          // Pass the updated form data directly to avoid state timing issues
          const submitResult = await onSubmitCompleteSale(updatedFormData);
          
          // Only close modal and show success if database submission was successful
          if (submitResult && submitResult.success) {
            console.log('✅ Database submission successful - closing modal and showing success page');
            onClose(true); // Close modal with success flag
          } else {
            console.log('❌ Database submission failed - keeping modal open');
            // Modal stays open, error will be shown
          }
        }
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
