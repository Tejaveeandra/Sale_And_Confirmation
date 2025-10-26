import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSaleFormOrchestration } from './hooks/useSaleFormOrchestration';
import SaleFormContent from '../Sale&ConformatiionHeader/SaleFormContent';
import PersonalInformation from './PersonalInfo/PersonalInformation';
import OrientationInformation from './OrientationInfo/OrientationInformation';
import AddressInformation from './AddressInfo/AddressInformation';
import ActionButtons from './ActionButtons';
import EditNextButtons from './EditNextButtons';
import SuccessPage from '../ConformationPage/SuccessPage';
import StudentProfile from '../ConformationForms/StudentProfile';
import FamilyInformation from '../ConformationForms/FamilyInformation/FamilyInformation';
import SiblingInformation from '../ConformationForms/SiblingInformation/SiblingInformation';
import AcademicInformation from '../ConformationForms/AcademicInformation/AcademicInformation';
import ConcessionInformation from '../ConformationForms/ConcessionInformation/ConcessionInformation';

import styles from './SaleForm.module.css';

const SaleForm = ({ onBack, initialData = {} }) => {
  const { status } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConform, setShowConform] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = StudentProfile, 2 = FamilyInformation
  
  // Use orchestration hook for API integration
  const { 
    isSubmitting, 
    error, 
    success, 
    formData, 
    submitCompleteSale, 
    updateFormData, 
    resetAllFormData 
  } = useSaleFormOrchestration();

  const handlePaymentSuccess = (success) => {
    if (success) {
      setShowSuccess(true);
    }
  };

  const handleSaleAndConform = () => {
    setShowConform(true);
  };

  const handleNextStep = () => {
    console.log('Next step clicked, current step:', currentStep);
    
    if (currentStep === 1) {
      // Go to FamilyInformation step
      console.log('Moving to step 2 - FamilyInformation');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Go to success page
      console.log('Moving to success page');
      setShowSuccess(true);
    }
  };

  const handleBackStep = () => {
    console.log('Back step clicked');
    
    if (currentStep === 2) {
      // Go back to StudentProfile step
      setCurrentStep(1);
    }
  };

  // Handle form data updates from child components
  const handlePersonalInfoSuccess = (data) => {
    updateFormData('personalInfo', data);
  };

  const handleOrientationInfoSuccess = (data) => {
    updateFormData('orientationInfo', data);
  };

  const handleAddressInfoSuccess = (data) => {
    updateFormData('addressInfo', data);
  };

  const handlePaymentInfoSuccess = (data) => {
    updateFormData('paymentInfo', data);
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    // Go back to previous step or edit mode
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleNext = () => {
    console.log('Next button clicked');
    // Use the existing next step logic
    handleNextStep();
  };

  const handleSingleButton = () => {
    console.log('Single button clicked - proceed to payment');
    // Add your single button logic here
    handleNextStep();
  };

  // Update showConform when status changes
  useEffect(() => {
    setShowConform(status === "confirmation");
  }, [status]);

  // Show SuccessPage when form is submitted
  if (showSuccess) {
    return (
      <div className={styles.saleFormContainer}>
        <SaleFormContent 
          status={status}
          onBack={onBack}
          initialData={initialData}
          showSuccess={true}
          currentStep={status === "confirmation" ? 3 : 2}
        />
        <div className={styles.successPageContainer}>
          <SuccessPage
            applicationNo="APP-2024-001"
            studentName="John Doe"
            amount="₹50,000"
            campus="Main Campus"
            zone="Zone A"
            onBack={() => {
              setShowSuccess(false);
              if (onBack) onBack();
            }}
            statusType={status === "confirmation" ? "confirmation" : "sale"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.saleFormContainer}>
      <SaleFormContent 
        status={status}
        onBack={onBack}
        initialData={initialData}
        showSuccess={false} // Not success, just confirmation
        showConfirmation={showConform} // Pass showConform to show confirmation mode
        currentStep={currentStep} // Pass current step for progress header
      />
      
      {/* Show confirmation steps when in confirmation mode */}
      {showConform ? (
        <div className={styles.saleFormBody}>
          
          {currentStep === 1 && (
            <div className={styles.saleFormSection}>
             
              <StudentProfile />
            </div>
          )}
          
          {currentStep === 2 && (
            <>
              <div className={styles.saleFormSection}>
             
                <FamilyInformation formData={formData.personalInfo || {}} />
              </div>
              
              <div className={styles.saleFormSection}>
            
                <SiblingInformation />
              </div>
              
              <div className={styles.saleFormSection}>
                <AcademicInformation />
              </div>
              
              <div className={styles.saleFormSection}>
                <ConcessionInformation />
              </div>
            </>
          )}
          
          {/* Edit and Next Buttons */}
          <div className={styles.saleFormSection}>
            <EditNextButtons 
              onEdit={handleEdit}
              onNext={handleNext}
              showSingleButton={currentStep === 2}
              singleButtonText="Proceed to payment"
              onSingleButtonClick={handleSingleButton}
              isConfirmationMode={true}
            />
          </div>
        </div>
      ) : (
        /* Form Sections - Show when not in confirmation mode */
        <div className={styles.saleFormBody}>
          {/* Global Error Display */}
          {error && (
            <div className={styles.global_error}>
              {error}
            </div>
          )}

          {/* Personal Information Form */}
          <div className={styles.saleFormSection}>
        
            <PersonalInformation onSuccess={handlePersonalInfoSuccess} />
          </div>
          
          {/* Orientation Information Form */}
          <div className={styles.saleFormSection}>
           
            <OrientationInformation onSuccess={handleOrientationInfoSuccess} />
          </div>
          
          {/* Address Information Form */}
          <div className={styles.saleFormSection}>
           
            <AddressInformation onSuccess={handleAddressInfoSuccess} />
          </div>
          
          {/* Action Buttons */}
          <div className={styles.saleFormSection}>
           
            <ActionButtons 
              onPaymentSuccess={handlePaymentSuccess}
              onSaleAndConform={handleSaleAndConform}
              onSubmitCompleteSale={submitCompleteSale}
              isSubmitting={isSubmitting}
              formData={formData}
              onPaymentInfoSuccess={handlePaymentInfoSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleForm;
