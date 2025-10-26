import { useState, useCallback } from 'react';
import { saleApi } from '../services/saleApi';

/**
 * Custom hook for orchestrating the entire sale form process
 * This will handle API integration for the complete sale flow
 */
export const useSaleFormOrchestration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: null,
    orientationInfo: null,
    addressInfo: null,
    paymentInfo: null
  });

  // Transform all form data into backend API format
  const collectAllFormData = useCallback(() => {
    // Transform data into backend API format
    const transformedData = {
      // Personal Information
      firstName: formData.personalInfo?.firstName || "",
      lastName: formData.personalInfo?.surname || "",
      genderId: formData.personalInfo?.gender || 0,
      apaarNo: formData.personalInfo?.aaparNo || "",
      dob: formData.personalInfo?.dateOfBirth || new Date().toISOString(),
      aadharCardNo: formData.personalInfo?.aadharCardNo || 0,
      quotaId: formData.personalInfo?.quota || 0,
      proReceiptNo: formData.personalInfo?.proReceiptNo || 0,
      admissionReferedBy: formData.personalInfo?.admissionReferredBy || "",
      appSaleDate: new Date().toISOString(),
      fatherName: formData.personalInfo?.fatherName || "",
      fatherMobileNo: formData.personalInfo?.phoneNumber || 0,
      
      // Orientation Information
      academicYearId: formData.orientationInfo?.academicYearId || 0,
      branchId: formData.orientationInfo?.branchId || 0,
      studentTypeId: formData.orientationInfo?.studentType || 0,
      classId: formData.orientationInfo?.joiningClass || 0,
      orientationId: formData.orientationInfo?.orientationName || 0,
      appTypeId: formData.personalInfo?.admissionType || 0,
      
      // Auto-populated Orientation Fields (using IDs for backend)
      branchId: formData.orientationInfo?.branchId || 0,
      branchTypeId: formData.orientationInfo?.branchTypeId || 0,
      cityId: formData.orientationInfo?.cityId || 0,
      academicYear: formData.orientationInfo?.academicYear || "",
      
      // Keep labels for reference (optional)
      branch: formData.orientationInfo?.branch || "",
      branchType: formData.orientationInfo?.branchType || "",
      branchCity: formData.orientationInfo?.city || "",
      
      // Address Information (nested object)
      addressDetails: {
        doorNo: formData.addressInfo?.doorNo || "",
        street: formData.addressInfo?.streetName || "",
        landmark: formData.addressInfo?.landmark || "",
        area: formData.addressInfo?.area || "",
        cityId: formData.addressInfo?.cityId || 0,
        mandalId: formData.addressInfo?.mandalId || 0,
        districtId: formData.addressInfo?.districtId || 0,
        pincode: formData.addressInfo?.pincode || 0,
        stateId: formData.addressInfo?.stateId || 0,
        createdBy: 0 // You may need to get this from user context
      },
      
      // Additional fields
      studAdmsNo: 0, // You may need to generate this
      proId: 0, // You may need to get this from context
      createdBy: 0, // You may need to get this from user context
      
      // Payment Information (nested object)
      paymentDetails: {
        paymentModeId: formData.paymentInfo?.paymentMode || 0,
        paymentDate: new Date().toISOString(),
        amount: formData.paymentInfo?.amount || 0,
        prePrintedReceiptNo: formData.paymentInfo?.prePrintedReceiptNo || "",
        remarks: formData.paymentInfo?.remarks || "",
        createdBy: 0 // You may need to get this from user context
      }
    };
    
    return transformedData;
  }, [formData]);

  // Validate all forms
  const validateAllForms = useCallback(() => {
    const allData = collectAllFormData();
    
    // Check if all required form sections have data
    const requiredSections = ['personalInfo', 'orientationInfo', 'addressInfo', 'paymentInfo'];
    const missingSections = requiredSections.filter(section => !formData[section]);
    
    if (missingSections.length > 0) {
      throw new Error(`Missing required form sections: ${missingSections.join(', ')}`);
    }
    
    // Validate required fields in flattened data
    const requiredFields = [
      'firstName', 'lastName', 'email', // Personal Info
      'academicYear', 'joiningClass', 'branch', // Orientation Info  
      'doorNo', 'streetName', 'city', 'pincode', // Address Info
      'amount', 'paymentMode' // Payment Info
    ];
    
    const missingFields = requiredFields.filter(field => !allData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }, [collectAllFormData, formData]);

  // Submit complete sale form
  const submitCompleteSale = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate all forms first
      validateAllForms();
      
      // Collect all form data
      const allFormData = collectAllFormData();
      
      // Call unified API service
      const response = await saleApi.submitCompleteSale(allFormData);
      
      setSuccess(true);
      
      return { success: true };
    } catch (err) {
      console.error('Complete sale submission error:', err);
      setError(err.message || 'Sale submission failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAllForms, collectAllFormData]);

  // Update form data for a specific section
  const updateFormData = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  // Reset all form data
  const resetAllFormData = useCallback(() => {
    setFormData({
      personalInfo: null,
      orientationInfo: null,
      addressInfo: null,
      paymentInfo: null
    });
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    formData,
    submitCompleteSale,
    updateFormData,
    resetAllFormData,
    collectAllFormData,
    validateAllForms
  };
};
