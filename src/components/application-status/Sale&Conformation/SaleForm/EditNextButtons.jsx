import React, { useState } from 'react';
import Button from '../../../../widgets/Button/Button';
import {ReactComponent as TrendingUpIcon} from '../../../../assets/application-status/Trending up.svg';
import {ReactComponent as EditIcon} from '../../../../assets/application-status/EditIcon.svg';
import PaymentModal from './Paymentinfo/PaymentModal';
import styles from './EditNextButtons.module.css';

const EditNextButtons = ({ onEdit, onNext, showSingleButton, singleButtonText, onSingleButtonClick, isConfirmationMode = false }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleEdit = () => {
    console.log('Edit button clicked');
    if (onEdit) {
      onEdit();
    }
  };

  const handleNext = () => {
    console.log('Next button clicked');
    if (onNext) {
      onNext();
    }
  };

  const handleSingleButton = () => {
    console.log('Single button clicked - opening payment modal');
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = (success) => {
    setIsPaymentModalOpen(false);
    if (success && onSingleButtonClick) {
      onSingleButtonClick();
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setIsPaymentModalOpen(false);
    if (onSingleButtonClick) {
      onSingleButtonClick();
    }
  };

  // Show single button if showSingleButton is true
  if (showSingleButton) {
    return (
      <>
        <div className={styles.edit_next_buttons_container}>
          <Button
            buttonname={singleButtonText || "Proceed to payment"}
            righticon={<TrendingUpIcon />}
            onClick={handleSingleButton}
            variant="primary"
            width="auto"
            type="button"
          />
        </div>
        
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={handleCloseModal}
          onPaymentSuccess={handlePaymentSuccess}
          totalSteps={isConfirmationMode ? 3 : 2}
          isConfirmationMode={isConfirmationMode}
        />
      </>
    );
  }

  // Show Edit and Next buttons by default
  return (
    <div className={styles.edit_next_buttons_container}>
      <Button
        buttonname="Edit"
        lefticon={<EditIcon />}
        onClick={handleEdit}
        variant="secondary"
        width="auto"
        type="button"
      />
      
      <Button
        buttonname="Next"
        righticon={<TrendingUpIcon />}
        onClick={handleNext}
        variant="primary"
        width="auto"
        type="button"
      />
    </div>
  );
};

export default EditNextButtons;
