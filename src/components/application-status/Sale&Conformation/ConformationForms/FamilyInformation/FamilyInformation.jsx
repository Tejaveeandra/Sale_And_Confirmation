import React, { useState, useEffect } from "react";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import { ReactComponent as EmailIcon } from "../../../../../assets/application-status/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../../../../../assets/application-status/PhoneIcon.svg";
import { capitalizeWords } from "../../../../../utils/textUtils";
import { useSectors, useOccupations } from "../hooks/useConfirmationData";
import styles from "./FamilyInformation.module.css";

const FamilyInformation = ({ formData = {}, onSuccess }) => {
  
  // Fetch sectors and occupations data using custom hooks
  const { sectors, loading: sectorsLoading, error: sectorsError } = useSectors();
  const { occupations, loading: occupationsLoading, error: occupationsError } = useOccupations();
  
  // Local state for form data
  const [localFormData, setLocalFormData] = useState({
    fatherName: formData.fatherName || "",
    fatherPhoneNumber: formData.fatherPhoneNumber || "",
    fatherEmail: formData.fatherEmail || "",
    fatherSector: formData.fatherSector || "",
    fatherSectorId: formData.fatherSectorId || "", // Store sector ID for backend
    fatherOccupation: formData.fatherOccupation || "",
    fatherOccupationId: formData.fatherOccupationId || "", // Store occupation ID for backend
    fatherOtherOccupation: formData.fatherOtherOccupation || "",
    motherName: formData.motherName || "",
    motherPhoneNumber: formData.motherPhoneNumber || "",
    motherEmail: formData.motherEmail || "",
    motherSector: formData.motherSector || "",
    motherSectorId: formData.motherSectorId || "", // Store sector ID for backend
    motherOccupation: formData.motherOccupation || "",
    motherOccupationId: formData.motherOccupationId || "", // Store occupation ID for backend
    motherOtherOccupation: formData.motherOtherOccupation || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Capitalize name fields
    const nameFields = ["fatherName", "motherName"];
    const processedValue = nameFields.includes(name) ? capitalizeWords(value) : value;
    
    // Handle sector selection - store both label and ID
    if (name === "fatherSector" || name === "motherSector") {
      const selectedSector = sectors.find(sector => sector.label === value);
      const sectorId = selectedSector ? selectedSector.id : "";
      
      setLocalFormData(prev => ({
        ...prev,
        [name]: processedValue,
        [`${name}Id`]: sectorId // Store the ID for backend
      }));
    } else if (name === "fatherOccupation" || name === "motherOccupation") {
      const selectedOccupation = occupations.find(occupation => occupation.label === value);
      const occupationId = selectedOccupation ? selectedOccupation.id : "";
      
      setLocalFormData(prev => ({
        ...prev,
        [name]: processedValue,
        [`${name}Id`]: occupationId // Store the ID for backend
      }));
    } else {
      setLocalFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  // Update parent when form data changes (prevent infinite loop)
  useEffect(() => {
    if (onSuccess && Object.keys(localFormData).length > 0) {
      onSuccess(localFormData);
    }
  }, [localFormData]);
  
  // Occupation options for dropdown - now fetched from API
  const occupationOptions = occupations.map(occupation => occupation.label);

  // Sector options for dropdown - now fetched from API
  const sectorOptions = sectors.map(sector => sector.label);

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
      {/* Error display for sectors loading */}
     
      
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
                const selectedOccupation = localFormData.fatherOccupation?.toLowerCase() || "";
                const isOtherSelected = selectedOccupation.includes("other");
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
                    disabled={sectorsLoading || occupationsLoading}
                    placeholder={
                      (sectorsLoading || occupationsLoading) 
                        ? "Loading..." 
                        : field.placeholder
                    }
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
                const selectedOccupation = localFormData.motherOccupation?.toLowerCase() || "";
                const isOtherSelected = selectedOccupation.includes("other");
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
                    disabled={sectorsLoading || occupationsLoading}
                    placeholder={
                      (sectorsLoading || occupationsLoading) 
                        ? "Loading..." 
                        : field.placeholder
                    }
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
