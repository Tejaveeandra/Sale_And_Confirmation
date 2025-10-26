import React, { useState } from 'react';
import Inputbox from '../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../widgets/Dropdown/Dropdown';
import styles from './AcademicInformation.module.css';

const AcademicInformation = () => {
  const [formData, setFormData] = useState({
    orientationBatch: '',
    schoolState: '',
    schoolName: '',
    marks: '',
    orientationDates: '',
    schoolDistrict: '',
    additionalOrientationFee: '',
    foodType: '',
    orientationFee: '0.0',
    schoolType: 'SSC',
    scoreAppNo: '',
    bloodGroup: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Define field configurations
  const fields = [
    // Column 1
    {
      type: 'input',
      name: 'htNo',
      label: 'HT No',
      placeholder: 'Enter HT No'
    },
    {
      type: 'dropdown',
      name: 'orientationName',
      label: 'Orientation Name',
      placeholder: 'Select orientation name',
      options: ['Orientation 1', 'Orientation 2', 'Orientation 3', 'Orientation 4']
    },
    {
      type: 'dropdown',
      name: 'orientationBatch',
      label: 'Orientation Batch',
      placeholder: 'Select course batch',
      options: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4']
    },
    {
      type: 'input',
      name: 'orientationDates',
      label: 'Orientation Dates',
      placeholder: 'Orientation date',
      inputType: 'date'
    },
    {
      type: 'input',
      name: 'orientationFee',
      label: 'Orientation Fee',
      placeholder: 'Orientation fee',
      value: '0.0'
    },
   
    {
      type: 'dropdown',
      name: 'schoolState',
      label: 'School State',
      placeholder: 'Select state',
      options: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Delhi']
    },
    {
      type: 'dropdown',
      name: 'schoolDistrict',
      label: 'School District',
      placeholder: 'Select district',
      options: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad']
    },
    {
      type: 'dropdown',
      name: 'schoolType',
      label: 'School Type',
      placeholder: 'Select school type',
      options: ['SSC', 'CBSE', 'ICSE', 'IB', 'State Board'],
      value: 'SSC'
    },
    {
      type: 'input',
      name: 'schoolName',
      label: 'School Name',
      placeholder: 'Enter name of the school'
    },
    {
      type: 'input',
      name: 'scoreAppNo',
      label: 'Score App NO',
      placeholder: 'Enter score app No'
    },
    {
      type: 'input',
      name: 'scoreMarks',
      label: 'Score Marks',
      placeholder: 'Enter score marks'
    },
    // Column 2
    

  
    {
      type: 'dropdown',
      name: 'foodType',
      label: 'Food Type',
      placeholder: 'Select Food Type',
      options: ['Veg', 'Non-Veg', 'Jain', 'No Preference']
    },
    // Column 3
    
   
    
    {
      type: 'dropdown',
      name: 'bloodGroup',
      label: 'Blood Group',
      placeholder: 'Select Blood Group',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      type: 'dropdown',
      name: 'caste',
      label: 'Caste ',
      placeholder: 'Select Caste',
      options: ['SC', 'ST', 'OBC', 'General']
    },
    {
      type: 'dropdown',
      name: 'religion',
      label: 'Religion',
      placeholder: 'Select Religion',
      options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other']
    },
  ];

  return (
    <div className={styles.academic_information_container}>
      <div className={styles.academic_section_label_wrapper}>
        <span className={styles.academic_section_label}>Academic Information</span>
        <div className={styles.academic_section_line}></div>
      </div>
      
      <div className={styles.form_grid}>
        {fields.map((field, index) => (
          <div key={field.name} className={styles.field_wrapper}>
            {field.type === 'input' ? (
              <Inputbox
                label={field.label}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || field.value || ''}
                onChange={handleInputChange}
                type={field.inputType || 'text'}
              />
            ) : (
              <Dropdown
                dropdownname={field.label}
                name={field.name}
                results={field.options}
                value={formData[field.name] || field.value || ''}
                onChange={handleDropdownChange}
                dropdownsearch={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicInformation;
