import React, { useState } from 'react';
import Inputbox from '../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../widgets/Dropdown/Dropdown';
import styles from './ConcessionInformation.module.css';

const ConcessionInformation = () => {
  const [formData, setFormData] = useState({
    yearConcession1st: '',
    yearConcession2nd: '',
    yearConcession3rd: '',
    givenBy: '',
    description: '',
    authorizedBy: '',
    reason: '',
    additionalConcession: false,
    concessionAmount: '',
    concessionWrittenBy: '',
    additionalReason: ''
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Define field configurations
  const fields = [
    // Concession Information Section
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
    },
    {
      type: 'dropdown',
      name: 'givenBy',
      label: 'Given By',
      placeholder: 'Select name',
      options: ['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4']
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
      placeholder: 'Select authoriser name',
      options: ['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4']
    },
    {
      type: 'dropdown',
      name: 'reason',
      label: 'Reason',
      placeholder: 'Select Reason',
      options: ['Academic Excellence', 'Financial Need', 'Sports Achievement', 'Cultural Activity', 'Other']
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
              />
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
                results={['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4']}
                value={formData.concessionWrittenBy}
                onChange={handleDropdownChange}
                dropdownsearch={true}
              />
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
