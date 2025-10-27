import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
  const { status, applicationNo } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConform, setShowConform] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = StudentProfile, 2 = FamilyInformation
  
  // Direct Formik collection - single object to store all form data
  const [allFormData, setAllFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePaymentSuccess = (success) => {
    // Don't show success page here - wait for backend submission
    console.log('Payment success callback received:', success);
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

  // Function to add form data to single object
  const addFormData = (data) => {
    console.log('🔄 Adding form data to single object:', data);
    setAllFormData(prev => {
      const newData = { ...prev, ...data };
      console.log('🔄 Updated single object:', newData);
      return newData;
    });
    // Return the updated data immediately
    return { ...allFormData, ...data };
  };

  // Function to collect all data and send to backend
  const submitCompleteSale = async (formDataToUse = null) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Use provided form data or fall back to state
      const dataToUse = formDataToUse || allFormData;
      
      console.log('🚀 === FINISH SALE CLICKED - PREPARING BACKEND DATA === 🚀');
      console.log('📊 Raw Form Data (Single Object):', dataToUse);
      console.log('📋 Form Data Keys:', Object.keys(dataToUse));
      console.log('📋 Form Data Values:', Object.values(dataToUse));
      console.log('📊 Total Fields Collected:', Object.keys(dataToUse).length);
      console.log('🔢 Application Number from URL:', applicationNo);
      
      // Debug specific fields that should be IDs
      console.log('🔍 ID Field Debug:', {
        gender: dataToUse.gender,
        quota: dataToUse.quota,
        admissionType: dataToUse.admissionType,
        academicYear: dataToUse.academicYear,
        branch: dataToUse.branch,
        branchType: dataToUse.branchType,
        city: dataToUse.city,
        studentType: dataToUse.studentType,
        joiningClass: dataToUse.joiningClass,
        orientationName: dataToUse.orientationName,
        state: dataToUse.state,
        district: dataToUse.district,
        mandal: dataToUse.mandal,
        paymentMode: dataToUse.paymentMode,
        amount: dataToUse.amount,
        paymentDate: dataToUse.paymentDate
      });
      
      // Transform data for backend API structure
      const backendData = {
        // Personal Information
        firstName: dataToUse.firstName || "",
        lastName: dataToUse.surname || "",
        genderId: parseInt(dataToUse.gender) || 0,
        apaarNo: dataToUse.aaparNo || "",
        dob: dataToUse.dateOfBirth ? new Date(dataToUse.dateOfBirth).toISOString() : new Date().toISOString(),
        aadharCardNo: parseInt(dataToUse.aadharCardNo) || 0,
        quotaId: parseInt(dataToUse.quota) || 0,
        proReceiptNo: parseInt(dataToUse.proReceiptNo) || 0,
        admissionTypeId: parseInt(dataToUse.admissionType) || 0,
        admissionReferedBy: dataToUse.admissionReferredBy || "",
        appSaleDate: new Date().toISOString(),
        fatherName: dataToUse.fatherName || "",
        fatherMobileNo: parseInt(dataToUse.phoneNumber) || 0,
        
        // Orientation Information - Use ID fields that are already available
        academicYearId: parseInt(dataToUse.academicYearId) || (() => {
          // Extract year from academic year string like "A.Y 2025-2026" -> "25"
          if (dataToUse.academicYear && typeof dataToUse.academicYear === 'string') {
            const yearMatch = dataToUse.academicYear.match(/(\d{4})/);
            if (yearMatch) {
              const fullYear = yearMatch[1];
              const shortYear = fullYear.slice(-2); // Get last 2 digits (25 from 2025)
              return parseInt(shortYear);
            }
          }
          return 0;
        })(),
        branchId: parseInt(dataToUse.branchId) || 0,
        studentTypeId: parseInt(dataToUse.studentTypeId) || 0,
        classId: parseInt(dataToUse.joiningClassId) || 0,
        orientationId: parseInt(dataToUse.orientationId) || 0,
        appTypeId: parseInt(dataToUse.admissionType) || parseInt(dataToUse.admissionTypeId) || 1,
        
        // Address Information (nested object) - Use ID fields
        addressDetails: {
          doorNo: dataToUse.doorNo || "",
          street: dataToUse.streetName || "",
          landmark: dataToUse.landmark || "",
          area: dataToUse.area || "",
          cityId: parseInt(dataToUse.cityId) || 0,
          mandalId: parseInt(dataToUse.mandalId) || 0,
          districtId: parseInt(dataToUse.districtId) || 0,
          pincode: parseInt(dataToUse.pincode) || 0,
          stateId: parseInt(dataToUse.stateId) || 0,
          createdBy: 0 // You may need to get this from user context
        },
        
        // Additional fields
        studAdmsNo: parseInt(applicationNo) || 0, // Use application number as admission number
        proId: parseInt(dataToUse.proId) || 1, // Use actual PRO ID, default to 1
        createdBy: 0, // You may need to get this from user context
        
        // Payment Information (nested object) - Use actual payment data
        paymentDetails: {
          paymentModeId: parseInt(dataToUse.paymentModeId) || parseInt(dataToUse.payMode) || parseInt(dataToUse.paymentMode) || 1,
          paymentDate: dataToUse.paymentDate ? new Date(dataToUse.paymentDate).toISOString() : new Date().toISOString(),
          amount: parseFloat(dataToUse.amount) || 0.1,
          prePrintedReceiptNo: dataToUse.receiptNumber || "",
          remarks: dataToUse.remarks || "",
          createdBy: 0 // You may need to get this from user context
        }
      };
      
      console.log('🔄 === BACKEND DATA OBJECT READY === 🔄');
      console.log('📤 Backend Data Object:', backendData);
      console.log('📋 Backend Data Keys:', Object.keys(backendData));
      console.log('📋 Backend Data Values:', Object.values(backendData));
      console.log('📊 Backend Fields Count:', Object.keys(backendData).length);
      console.log('🔢 ID Fields:', Object.entries(backendData).filter(([key, value]) => key.includes('Id')).map(([key, value]) => `${key}: ${value}`));
      console.log('💰 Amount Field:', `amount: ${backendData.amount}`);
      console.log('📅 Date Fields:', `paymentDate: ${backendData.paymentDate}, dateOfBirth: ${backendData.dateOfBirth}`);
      console.log('🎯 === BACKEND DATA OBJECT COMPLETE === 🎯');
      
      // Direct backend API call
      const response = await fetch('http://localhost:8080/api/student-admissions-sale/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your auth token
        },
        body: JSON.stringify(backendData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      console.log('📋 Response Content-Type:', contentType);
      
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('✅ Backend Response (JSON):', result);
      } else {
        // If not JSON, get as text but still treat as success if HTTP status is OK
        const textResponse = await response.text();
        console.log('✅ Backend Response (Text):', textResponse);
        result = { message: 'Data saved successfully', textResponse: textResponse };
      }
      
      // Show success page after successful database submission (HTTP 200)
      console.log('🎉 Database submission successful - showing success page');
      setSuccess(true);
      setShowSuccess(true); // Show success page only after backend success
      return { success: true, data: result };
      
    } catch (err) {
      console.error('Sale submission error:', err);
      setError(err.message || 'Sale submission failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form data updates from child components
  const handlePersonalInfoSuccess = (data) => {
    console.log('🔄 Personal Info Success - Adding to single object:', data);
    addFormData(data);
  };

  const handleOrientationInfoSuccess = (data) => {
    console.log('🔄 Orientation Info Success - Adding to single object:', data);
    addFormData(data);
  };

  const handleAddressInfoSuccess = (data) => {
    console.log('🔄 Address Info Success - Adding to single object:', data);
    addFormData(data);
  };

  const handlePaymentInfoSuccess = (data) => {
    console.log('🔄 Payment Info Success - Adding to single object:', data);
    addFormData(data);
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
             
                <FamilyInformation formData={allFormData.personalInfo || {}} />
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
              formData={allFormData}
              onPaymentInfoSuccess={handlePaymentInfoSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleForm;
