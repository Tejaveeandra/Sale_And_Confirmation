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
    
    // Check if all form data is available
    if (!formData.personalInfo || !formData.orientationInfo || !formData.addressInfo) {
      alert('Please complete all form sections before proceeding.');
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
    // Only trigger success page if success is true (from "Finish Sale" button)
    // If success is false (from X button), just close the modal
    if (success && onPaymentSuccess) {
      onPaymentSuccess(true);
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
      />
    </div>
  );
};

export default ActionButtons;
