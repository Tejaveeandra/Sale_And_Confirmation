import React, { useState, useEffect } from "react";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import { Button as MuiButton } from "@mui/material";
import Button from "../../../../../widgets/Button/Button";
import { ReactComponent as Add } from "../../../../../assets/application-status/si_add-fill.svg";
import { ReactComponent as UploadIcon } from "../../../../../assets/application-status/Upload.svg";
import { useRelationTypes, useStudentClasses, useGenders } from "../hooks/useConfirmationData";
import styles from "./SiblingInformation.module.css";

const SiblingInformation = ({ onSuccess }) => {
  // Fetch relation types, student classes, and genders data using custom hooks
  const { relationTypes, loading: relationTypesLoading, error: relationTypesError } = useRelationTypes();
  const { studentClasses, loading: studentClassesLoading, error: studentClassesError } = useStudentClasses();
  const { genders, loading: gendersLoading, error: gendersError } = useGenders();
  
  // Field configuration - all labels and options in one place
  const fieldConfig = [
    {
      type: 'input',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter Full Name',
      required: true
    },
    {
      type: 'dropdown',
      name: 'relationType',
      label: 'Relation Type',
      options: relationTypes, // Now using dynamic data from API
      filterOptions: ['Father', 'Mother', 'Guardian']
    },
    {
      type: 'dropdown',
      name: 'class',
      label: 'Select Class',
      options: studentClasses, // Now using dynamic data from API
    },
    {
      type: 'dropdown',
      name: 'gender',
      label: 'Gender',
      options: genders, // Now using dynamic data from API
    },
    {
      type: 'input',
      name: 'schoolName',
      label: 'School Name',
      placeholder: 'Enter School Name'
    }
  ];
  const [showSiblings, setShowSiblings] = useState(false);
  const [siblings, setSiblings] = useState([]);
  const [annexure, setAnnexure] = useState([]);

  // Update parent when siblings data changes (prevent infinite loop)
  useEffect(() => {
    if (onSuccess && siblings.length >= 0) {
      onSuccess(siblings);
    }
  }, [siblings]);

  const handleAddSibling = () => {
    setSiblings(prev => [...prev, {
      fullName: "",
      relationType: "",
      class: "",
      schoolName: "",
      gender: "",
    }]);
    setShowSiblings(true);
  };

  const handleRemoveSibling = (index) => {
    setSiblings(prev => {
      const newSiblings = prev.filter((_, i) => i !== index);
      if (newSiblings.length === 0) {
        setShowSiblings(false);
      }
      return newSiblings;
    });
  };

  const handleClearSibling = (index) => {
    setSiblings(prev => prev.map((sibling, i) => 
      i === index ? {
        fullName: "",
        relationType: "",
        class: "",
        schoolName: "",
        gender: "",
      } : sibling
    ));
  };

  const handleFieldChange = (index, field, value) => {
    setSiblings(prev => prev.map((sibling, i) => 
      i === index ? { ...sibling, [field]: value } : sibling
    ));
  };

  const handleAddAnnexure = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    input.multiple = true;
    input.onchange = (e) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        setAnnexure(prev => [...prev, ...Array.from(files)]);
      }
    };
    input.click();
  };

  const handleRemoveAnnexure = (index) => {
    setAnnexure(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.Sibling_Info_Section_general_form_row}>
    
      
      <div className={`${styles.Sibling_Info_Section_general_sibling_container} ${styles.Sibling_Info_Section_general_full_width}`}>
        {showSiblings && (
          <div className={styles.siblingContainer}>
            <div className={styles.Sibling_Info_Section_general_field_label_wrapper}>
              <span className={styles.Sibling_Info_Section_general_field_label}>Sibling Information</span>
              <div className={styles.Sibling_Info_Section_general_line}></div>
            </div>
            <div>
              {siblings.map((sibling, i) => (
                <div key={i} className={styles.siblingBox}>
                  <div className={styles.siblingHeader}>
                    <span className={styles.siblingTag}>Sibling {i + 1}</span>
                    <div className={styles.actionBtns}>
                      <MuiButton
                        type="button"
                        className={styles.clearBtn}
                        onClick={() => handleClearSibling(i)}
                      >
                        Clear
                      </MuiButton>
                      <MuiButton
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => handleRemoveSibling(i)}
                      >
                        ✕
                      </MuiButton>
                    </div>
                  </div>
                  <div className={styles.siblingFields}>
                    {fieldConfig.map((field) => {
                      if (field.type === 'input') {
                        return (
                          <Inputbox
                            key={field.name}
                            label={field.label}
                            placeholder={field.placeholder}
                            value={sibling[field.name] || ""}
                            onChange={(e) => handleFieldChange(i, field.name, e.target.value)}
                            required={field.required}
                          />
                        );
                      } else if (field.type === 'dropdown') {
                        const filteredOptions = field.filterOptions 
                          ? field.options.filter(opt => !field.filterOptions.includes(opt.label))
                          : field.options;
                        
                        return (
                          <Dropdown
                            key={field.name}
                            dropdownname={field.label}
                            results={filteredOptions.map(opt => opt.label)}
                            value={field.options.find(opt => opt.id === sibling[field.name])?.label || ""}
                            dropdownsearch={true}
                            onChange={(e) => {
                              const selectedLabel = e.target.value;
                              const selectedOption = field.options.find(opt => opt.label === selectedLabel);
                              handleFieldChange(i, field.name, selectedOption ? selectedOption.id : "");
                            }}
                            disabled={relationTypesLoading || studentClassesLoading || gendersLoading}
                            loading={relationTypesLoading || studentClassesLoading || gendersLoading}
                            placeholder={
                              (relationTypesLoading || studentClassesLoading || gendersLoading) 
                                ? "Loading..." 
                                : "Select " + field.label
                            }
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              
              {/* Add Another Sibling and Add Annexure buttons - side by side */}
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                <Button
                  type="button"
                  variant="secondary"
                  buttonname="Add Another Sibling"
                  righticon={<Add className={styles.addIcon} />}
                  className={styles.addSiblingBtn}
                  onClick={handleAddSibling}
                />
                <Button
                  type="button"
                  variant="secondary"
                  buttonname="Upload Annexure"
                  righticon={<UploadIcon className={styles.uploadIcon} />}
                  className={styles.addSiblingBtn}
                  onClick={handleAddAnnexure}
                />
              </div>
              
              {/* File list for annexure */}
              {annexure.length > 0 && (
                <div className={styles.fileList} style={{ marginTop: "10px" }}>
                  <ul>
                    {annexure.map((file, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <MuiButton
                          type="button"
                          style={{ marginLeft: "10px", color: "red" }}
                          onClick={() => handleRemoveAnnexure(i)}
                        >
                          Remove
                        </MuiButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Initial state - show when no siblings */}
        {!showSiblings && siblings.length === 0 && (
          <div
            className={styles.Sibling_Info_Section_general_form_row}
            style={{
              display: "flex",
              gap: "40px",
            }}
          >
            <div className={styles.Sibling_Info_Section_general_form_field}>
              <Button
                type="button"
                variant="secondary"
                buttonname="Add Sibling"
                lefticon={<Add />}
                width={"100%"}
                className={styles.addSiblingBtn}
                onClick={handleAddSibling}
              />
            </div>
            <div className={styles.Sibling_Info_Section_general_form_field}>
              <Button
                type="button"
                variant="secondary"
                buttonname="Upload Annexure"
                lefticon={<UploadIcon className={styles.uploadIcon} />}
                width={"100%"}
                className={styles.addAnnexures}
                onClick={handleAddAnnexure}
              />
              {annexure.length > 0 && (
                <div className={styles.fileList} style={{ marginTop: "10px" }}>
                  <ul>
                    {annexure.map((file, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <MuiButton
                          type="button"
                          style={{ marginLeft: "10px", color: "red" }}
                          onClick={() => handleRemoveAnnexure(i)}
                        >
                          Remove
                        </MuiButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.Sibling_Info_Section_general_form_field}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiblingInformation;