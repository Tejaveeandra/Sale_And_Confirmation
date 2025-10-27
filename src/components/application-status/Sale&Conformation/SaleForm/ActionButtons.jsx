import React, { useState } from 'react';
import Button from '../../../../widgets/Button/Button';
import {ReactComponent as StarTickIcon} from '../../../../assets/application-status/starTick.svg';
import {ReactComponent as BlueArrowIcon} from '../../../../assets/application-status/blue color arrow.svg';
import PaymentModal from './Paymentinfo/PaymentModal';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onPaymentSuccess, onSaleAndConform, onSubmitCompleteSale, isSubmitting, formData, onPaymentInfoSuccess }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleProceedToSale = () => {
    console.log('Proceed to Sale clicked');
    setIsPaymentModalOpen(true);
  };

  const handleSaleAndConform = async () => {
    console.log('Sale & Conform clicked');
    console.log('Current form data before submission:', formData);
    
    // Check if all required form data is available
    const requiredFields = ['firstName', 'academicYear', 'doorNo', 'amount'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please complete all form sections before proceeding. Missing: ${missingFields.join(', ')}`);
      return;
    }
    
    // Submit complete sale form
    if (onSubmitCompleteSale) {
      const result = await onSubmitCompleteSale();
      if (result && result.success) {
        if (onSaleAndConform) {
          onSaleAndConform();
        }
      }
    }
  };

  const handleCloseModal = (success) => {
    setIsPaymentModalOpen(false);
    // Only trigger success page if database submission was successful
    if (success && onPaymentSuccess) {
      console.log('✅ Modal closed with success - showing success page');
      onPaymentSuccess(true);
    } else {
      console.log('❌ Modal closed without success - not showing success page');
    }
  };

  const handlePaymentInfoSuccess = (paymentData) => {
    // Pass payment data to parent orchestration
    if (onPaymentInfoSuccess) {
      onPaymentInfoSuccess(paymentData);
    }
  };

  return (
    <div className={styles.action_buttons_container}>
      <Button
        buttonname="Show Data"
        onClick={() => {
          console.log('🔍 === MANUAL DATA DISPLAY === 🔍');
          console.log('📊 Current Single Object:', formData);
          console.log('📋 Object Keys:', Object.keys(formData));
          console.log('📋 Object Values:', Object.values(formData));
          console.log('📊 Object Size:', Object.keys(formData).length, 'fields');
          console.log('🎯 === END MANUAL DATA DISPLAY === 🎯');
        }}
        variant="secondary"
        width="auto"
        type="button"
      />
      
      <Button
        buttonname="Proceed to Sale"
        righticon={
          <BlueArrowIcon />
        }
        onClick={handleProceedToSale}
        variant="secondary"
        width="auto"
        type="button"
      />
      
      <Button
        buttonname="Sale & Conform"
        lefticon={
          <StarTickIcon />
        }
        onClick={handleSaleAndConform}
        variant="primary"
        width="auto"
        type="button"
        disabled={isSubmitting}
      />
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={handleCloseModal}
        onPaymentSuccess={handlePaymentInfoSuccess}
        onSubmitCompleteSale={onSubmitCompleteSale}
      />
    </div>
  );
};

export default ActionButtons;
