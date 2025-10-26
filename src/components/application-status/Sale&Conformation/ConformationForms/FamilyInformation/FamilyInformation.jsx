import React, { useState } from "react";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import { ReactComponent as EmailIcon } from "../../../../../assets/application-status/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../../../../../assets/application-status/PhoneIcon.svg";
import { capitalizeWords } from "../../../../../utils/textUtils";
import styles from "./FamilyInformation.module.css";

const FamilyInformation = ({ formData = {} }) => {
  console.log('FamilyInformation component rendered with formData:', formData);
  
  // Local state for form data
  const [localFormData, setLocalFormData] = useState({
    fatherName: formData.fatherName || "",
    fatherPhoneNumber: formData.fatherPhoneNumber || "",
    fatherEmail: formData.fatherEmail || "",
    fatherSector: formData.fatherSector || "",
    fatherOccupation: formData.fatherOccupation || "",
    fatherOtherOccupation: formData.fatherOtherOccupation || "",
    motherName: formData.motherName || "",
    motherPhoneNumber: formData.motherPhoneNumber || "",
    motherEmail: formData.motherEmail || "",
    motherSector: formData.motherSector || "",
    motherOccupation: formData.motherOccupation || "",
    motherOtherOccupation: formData.motherOtherOccupation || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Capitalize name fields
    const nameFields = ["fatherName", "motherName"];
    const processedValue = nameFields.includes(name) ? capitalizeWords(value) : value;
    
    setLocalFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  // Occupation options for dropdown
  const occupationOptions = [
    "Government Employee",
    "Private Employee", 
    "Business Owner",
    "Self Employed",
    "Farmer",
    "Teacher",
    "Doctor",
    "Engineer",
    "Lawyer",
    "Other"
  ];

  // Sector options for dropdown
  const sectorOptions = [
    "SELF EMPLOYED",
    "PUBLIC",
    "PRIVATE",
    "Others"
  ];

  const fatherFields = [
    { label: "Father Name", name: "fatherName", placeholder: "Enter Father Name", type: "input", required: true },
   
    { label: "Phone Number", name: "fatherPhoneNumber", placeholder: "Enter Phone Number",type: "input", required: true },
    { label: "Email Id", name: "fatherEmail", placeholder: "Enter Father Mail id", type: "Email" },
    {label: "Sector", name: "fatherSector", placeholder: "Select Sector", type: "dropdown", options: sectorOptions },
    { label: "Occupation", name: "fatherOccupation", placeholder: "Select Occupation", type: "dropdown", options: occupationOptions },
    { label: "Other Occupation", name: "fatherOtherOccupation", placeholder: "Enter Other Occupation", type: "input", required: false },
  ];

  const motherFields = [
    { label: "Mother Name", name: "motherName", placeholder: "Enter Mother Name", type: "input", required: true },
   
    { label: "Phone Number", name: "motherPhoneNumber", placeholder: "Enter Phone Number", type: "input", required: true },
    { label: "Email Id", name: "motherEmail", placeholder: "Enter Mother Mail id", type: "Email" },
    { label: "Sector", name: "motherSector", placeholder: "Select Sector", type: "dropdown", options: sectorOptions },
    { label: "Occupation", name: "motherOccupation", placeholder: "Select Occupation", type: "dropdown", options: occupationOptions },
    { label: "Other Occupation", name: "motherOtherOccupation", placeholder: "Enter Other Occupation", type: "input", required: false },
  ];

  return (
    <>
      {/* Father Information */}
      <div className={styles.family_info_section_general_form_row}>
        <div className={`${styles.family_info_section_general_sibling_container} ${styles.family_info_section_general_full_width}`}>
          <div className={styles.family_info_section_general_field_label_wrapper}>
            <span className={styles.family_info_section_general_field_label}>Parent Information</span>
            <div className={styles.family_info_section_general_line}></div>
          </div>
          <div className={styles.family_info_section_general_form_grid}>
            {fatherFields.map((field, index) => {
              // Conditional visibility for Other Occupation field
              if (field.name === "fatherOtherOccupation") {
                const isOtherSelected = localFormData.fatherOccupation === "Other";
                if (!isOtherSelected) {
                  return null; // Hide the field if "Other" is not selected
                }
              }

              return (
                <div key={index} className={styles.family_info_section_general_form_field}>
                  {field.name === "fatherPhoneNumber" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={localFormData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      type={field.type || "text"}
                    />
                    <PhoneIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.name === "fatherEmail" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={localFormData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      type={field.type || "text"}
                    />
                    <EmailIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.type === "dropdown" ? (
                  <Dropdown
                    dropdownname={field.label}
                    id={field.name}
                    name={field.name}
                    value={localFormData[field.name] || ""}
                    onChange={handleChange}
                    results={field.options}
                    required={field.required}
                    dropdownsearch={true}
                  />
                ) : (
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={localFormData[field.name] || ""}
                    onChange={handleChange}
                    type={field.type || "text"}
                    required={field.required}
                  />
                )}
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacing between Father and Mother Information */}
      <div style={{ marginTop: "20px" }}></div>

      {/* Mother Information */}
      <div className={styles.family_info_section_general_form_row}>
        <div className={`${styles.family_info_section_general_sibling_container} ${styles.family_info_section_general_full_width}`}>
          {/* <div className={styles.family_info_section_general_field_label_wrapper}>
            <span className={styles.family_info_section_general_field_label}>Mother Information</span>
            <div className={styles.family_info_section_general_line}></div>
          </div> */}
          <div className={styles.family_info_section_general_form_grid}>
            {motherFields.map((field, index) => {
              // Conditional visibility for Other Occupation field
              if (field.name === "motherOtherOccupation") {
                const isOtherSelected = localFormData.motherOccupation === "Other";
                if (!isOtherSelected) {
                  return null; // Hide the field if "Other" is not selected
                }
              }

              return (
              <div key={index} className={styles.family_info_section_general_form_field}>
                {field.name === "motherPhoneNumber" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={localFormData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      type={field.type || "text"}
                    />
                    <PhoneIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.name === "motherEmail" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={localFormData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      type={field.type || "text"}
                    />
                    <EmailIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.type === "dropdown" ? (
                  <Dropdown
                    dropdownname={field.label}
                    id={field.name}
                    name={field.name}
                    value={localFormData[field.name] || ""}
                    onChange={handleChange}
                    results={field.options}
                    required={field.required}
                    dropdownsearch={true}
                  />
                ) : (
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={localFormData[field.name] || ""}
                    onChange={handleChange}
                    type={field.type || "text"}
                    required={field.required}
                  />
                )}
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyInformation;
