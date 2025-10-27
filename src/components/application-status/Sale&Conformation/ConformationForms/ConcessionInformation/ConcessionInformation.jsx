import React, { useState, useEffect } from 'react';
import Inputbox from '../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../widgets/Dropdown/Dropdown';
import { useAuthorizedBy, useConcessionReasons, useConcessionTypes } from '../hooks/useConfirmationData';
import styles from './ConcessionInformation.module.css';

const ConcessionInformation = ({ category = 'COLLEGE', onSuccess }) => {
  // Fetch authorized by data using custom hook
  const { authorizedBy, loading: authorizedByLoading, error: authorizedByError } = useAuthorizedBy();
  
  // Fetch concession reasons data using custom hook
  const { concessionReasons, loading: concessionReasonsLoading, error: concessionReasonsError } = useConcessionReasons();
  
  // Fetch concession types data using custom hook
  const { concessionTypes, loading: concessionTypesLoading, error: concessionTypesError } = useConcessionTypes();
  
  
  const [formData, setFormData] = useState({
    yearConcession1st: '',
    yearConcession2nd: '',
    yearConcession3rd: '',
    admissionFee: '', // For SCHOOL category
    tuitionFee: '', // For SCHOOL category
    givenById: '', // Store ID for backend
    givenBy: '', // Store label for display
    description: '',
    authorizedById: '', // Store ID for backend
    authorizedBy: '', // Store label for display
    reasonId: '', // Store ID for backend
    reason: '', // Store label for display
    additionalConcession: false,
    concessionAmount: '',
    concessionWrittenById: '', // Store ID for backend
    concessionWrittenBy: '', // Store label for display
    additionalReason: '',
    // Store concession type IDs for backend
    concessionTypeIds: {}
  });

  // Function to get concession type ID for a field name
  const getConcessionTypeId = (fieldName) => {
    // Only log when actually processing a concession field
    const isConcessionField = ['yearConcession1st', 'yearConcession2nd', 'yearConcession3rd', 'admissionFee', 'tuitionFee'].includes(fieldName);
    
    if (!concessionTypes || concessionTypes.length === 0) {
      if (isConcessionField) {
        console.log('⚠️ No concession types loaded. Available:', concessionTypes);
      }
      return null;
    }
    
    // Map field names to concession type labels
    const fieldToLabelMap = {
      'yearConcession1st': '1st Year',
      'yearConcession2nd': '2nd Year', 
      'yearConcession3rd': '3rd Year',
      'admissionFee': 'Admission Fee',
      'tuitionFee': 'Tuition Fee'
    };
    
    const labelToFind = fieldToLabelMap[fieldName];
    if (!labelToFind) {
      return null;
    }
    
    // Find matching concession type
    const matchingType = concessionTypes.find(type => 
      type.label?.toLowerCase().includes(labelToFind.toLowerCase())
    );
    
    if (isConcessionField) {
      console.log(`🔍 Field: ${fieldName}, Looking for: "${labelToFind}"`);
      console.log('🔍 Found:', matchingType);
      if (!matchingType) {
        console.log('🔍 Available concession types:', concessionTypes.map(t => t.label));
      }
    }
    
    return matchingType ? matchingType.id : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if this is a concession field
    const concessionTypeId = getConcessionTypeId(name);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // If this is a concession field, also store the concession type ID
      if (concessionTypeId) {
        newData.concessionTypeIds = {
          ...prev.concessionTypeIds,
          [name]: concessionTypeId
        };
      }
      return newData;
    });
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    
    // For authorized by fields, store both ID and label
    if (name === 'givenBy' || name === 'authorizedBy' || name === 'concessionWrittenBy') {
      const selectedOption = authorizedBy.find(option => option.label === value);
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value, // Store label for display
          [name + 'Id']: selectedOption ? selectedOption.id : '' // Store ID for backend
        };
        return newData;
      });
    } else if (name === 'reason') {
      // For reason field, store both ID and label
      const selectedOption = concessionReasons.find(option => option.label === value);
      setFormData(prev => {
        const newData = {
          ...prev,
          reason: value, // Store label for display
          reasonId: selectedOption ? selectedOption.id : '' // Store ID for backend
        };
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Update parent when form data changes (prevent infinite loop)
  useEffect(() => {
    if (onSuccess && Object.keys(formData).length > 0) {
      onSuccess(formData);
    }
  }, [formData]);

  // Function to get concession fields based on category
  const getConcessionFields = () => {
    
    switch (category?.toUpperCase()) {
      case 'SCHOOL':
        return [
          {
            type: 'input',
            name: 'admissionFee',
            label: 'Admission Fee Concession',
            placeholder: 'Enter admission fee concession amount'
          },
          {
            type: 'input',
            name: 'tuitionFee',
            label: 'Tuition Fee Concession',
            placeholder: 'Enter tuition fee concession amount'
          }
        ];
      
      case 'DEGREE':
        return [
          {
            type: 'input',
            name: 'yearConcession1st',
            label: '1st Year Concession',
            placeholder: 'Enter 1st year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession2nd',
            label: '2nd Year Concession',
            placeholder: 'Enter 2nd year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession3rd',
            label: '3rd Year Concession',
            placeholder: 'Enter 3rd year concession amount'
          }
        ];
      
      case 'COLLEGE':
      default:
        return [
          {
            type: 'input',
            name: 'yearConcession1st',
            label: '1st Year Concession',
            placeholder: 'Enter 1st year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession2nd',
            label: '2nd Year Concession',
            placeholder: 'Enter 2nd year concession amount'
          }
        ];
    }
  };

  // Define field configurations
  const fields = [
    // Dynamic concession fields based on category
    ...getConcessionFields(),
    {
      type: 'dropdown',
      name: 'givenBy',
      label: 'Given By',
      placeholder: authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select name')),
      options: authorizedByLoading ? [] : (authorizedBy?.map(auth => auth.label) || []),
      loading: authorizedByLoading,
      error: authorizedByError,
      data: authorizedBy // Store the full data for ID mapping
    },
    {
      type: 'input',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter description'
    },
    {
      type: 'dropdown',
      name: 'authorizedBy',
      label: 'Authorized By',
      placeholder: authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select authoriser name')),
      options: authorizedByLoading ? [] : (authorizedBy?.map(auth => auth.label) || []),
      loading: authorizedByLoading,
      error: authorizedByError,
      data: authorizedBy // Store the full data for ID mapping
    },
    {
      type: 'dropdown',
      name: 'reason',
      label: 'Reason',
      placeholder: concessionReasonsLoading ? 'Loading...' : (concessionReasonsError ? 'Error loading data' : (concessionReasons?.length === 0 ? 'No data available' : 'Select Reason')),
      options: concessionReasonsLoading ? [] : (concessionReasons?.map(reason => reason.label) || []),
      loading: concessionReasonsLoading,
      error: concessionReasonsError,
      data: concessionReasons // Store the full data for ID mapping
    }
  ];

  return (
    <div className={styles.concession_information_container}>
      <div className={styles.concession_section_label_wrapper}>
        <span className={styles.concession_section_label}>Concession Information</span>
        <div className={styles.concession_section_line}></div>
      </div>
      
      <div className={styles.concession_form_grid}>
        {fields.map((field, index) => (
          <div key={field.name} className={styles.concession_field_wrapper}>
            {field.type === 'input' ? (
              <Inputbox
                label={field.label}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                type="text"
              />
            ) : (
              <Dropdown
                dropdownname={field.label}
                name={field.name}
                results={field.options}
                value={formData[field.name] || ''}
                onChange={handleDropdownChange}
                dropdownsearch={true}
                disabled={field.loading}
                loading={field.loading}
                placeholder={field.placeholder}
              />
            )}
            {/* Debug info for dropdown fields */}
            {field.type === 'dropdown' && (
              <div style={{fontSize: '10px', color: '#666', marginTop: '2px'}}>
                Debug: {field.name} - Options: {field.options?.length || 0}, Loading: {field.loading ? 'Yes' : 'No'}, Error: {field.error || 'None'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Concession Section */}
      <div className={styles.additional_concession_section}>
        <div className={styles.concession_checkbox_wrapper}>
          <label className={styles.concession_checkbox_label}>
            <input
              type="checkbox"
              name="additionalConcession"
              checked={formData.additionalConcession}
              onChange={handleCheckboxChange}
              className={styles.concession_checkbox}
            />
            <span className={styles.concession_checkmark}></span>
            Additional Concession Written on Application
          </label>
          <div className={styles.concession_line}></div>
        </div>

        {formData.additionalConcession && (
          <div className={styles.additional_concession_fields}>
            <div className={styles.concession_field_wrapper}>
              <Inputbox
                label="Concession Amount"
                id="concessionAmount"
                name="concessionAmount"
                placeholder="Enter Concession amount"
                value={formData.concessionAmount}
                onChange={handleInputChange}
                type="text"
              />
            </div>
            
            <div className={styles.concession_field_wrapper}>
              <Dropdown
                dropdownname="Concession Written By"
                name="concessionWrittenBy"
                results={authorizedBy?.map(auth => auth.label) || []}
                value={formData.concessionWrittenBy}
                onChange={handleDropdownChange}
                dropdownsearch={true}
                disabled={authorizedByLoading}
                loading={authorizedByLoading}
                placeholder={authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select name'))}
              />
              {/* Debug info */}
              <div style={{fontSize: '10px', color: '#666', marginTop: '2px'}}>
                Debug: concessionWrittenBy - Options: {authorizedBy?.length || 0}, Loading: {authorizedByLoading ? 'Yes' : 'No'}, Error: {authorizedByError || 'None'}
              </div>
            </div>
            
            <div className={styles.concession_field_wrapper}>
              <Inputbox
                label="Reason"
                id="additionalReason"
                name="additionalReason"
                placeholder="Enter Reason"
                value={formData.additionalReason}
                onChange={handleInputChange}
                type="text"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcessionInformation;
