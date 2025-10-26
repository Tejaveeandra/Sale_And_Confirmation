import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import { saleApi } from '../../services/saleApi';
import styles from './PaymentFormFields.module.css';

const PaymentFormFields = ({ formFields, values, handleChange, handleBlur, setFieldValue }) => {
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const data = await saleApi.getOrganizations();
        
        // Handle different response formats
        let organizationsArray = [];
        if (Array.isArray(data)) {
          organizationsArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          organizationsArray = data.data;
        } else if (data && data.organizations && Array.isArray(data.organizations)) {
          organizationsArray = data.organizations;
        } else if (data && data.result && Array.isArray(data.result)) {
          organizationsArray = data.result;
        }

        if (organizationsArray.length > 0) {
          const transformedOptions = organizationsArray.map(item => ({
            value: item.id || item.organizationId,
            label: item.name || item.organizationName
          }));
          setOrganizationOptions(transformedOptions);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setOrganizationOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Fetch banks when organization changes
  useEffect(() => {
    const fetchBanks = async (organizationId) => {
      if (!organizationId) {
        setBankOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await saleApi.getBanksByOrganization(organizationId);
        
        // Handle different response formats
        let banksArray = [];
        if (Array.isArray(data)) {
          banksArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          banksArray = data.data;
        } else if (data && data.banks && Array.isArray(data.banks)) {
          banksArray = data.banks;
        } else if (data && data.result && Array.isArray(data.result)) {
          banksArray = data.result;
        }

        if (banksArray.length > 0) {
          const transformedOptions = banksArray.map(item => ({
            value: item.id || item.bankId,
            label: item.name || item.bankName
          }));
          setBankOptions(transformedOptions);
        } else {
          setBankOptions([]);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        setBankOptions([]);
      } finally {
        setLoading(false);
      }
    };

    // Check both DD and Cheque organization IDs
    const ddOrgId = values.mainDdOrganisationId;
    const chequeOrgId = values.mainChequeOrganisationId;
    
    if (ddOrgId) {
      fetchBanks(ddOrgId);
    } else if (chequeOrgId) {
      fetchBanks(chequeOrgId);
    } else {
      setBankOptions([]);
    }
  }, [values.mainDdOrganisationId, values.mainChequeOrganisationId]);

  // Fetch branches when both organization and bank are selected
  useEffect(() => {
    const fetchBranches = async (organizationId, bankId) => {
      if (!organizationId || !bankId) {
        setBranchOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await saleApi.getBranchesByOrganizationAndBank(organizationId, bankId);
        
        // Handle different response formats
        let branchesArray = [];
        if (Array.isArray(data)) {
          branchesArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          branchesArray = data.data;
        } else if (data && data.branches && Array.isArray(data.branches)) {
          branchesArray = data.branches;
        } else if (data && data.result && Array.isArray(data.result)) {
          branchesArray = data.result;
        }

        if (branchesArray.length > 0) {
          const transformedOptions = branchesArray.map(item => ({
            value: item.id || item.branchId,
            label: item.name || item.branchName
          }));
          setBranchOptions(transformedOptions);
        } else {
          setBranchOptions([]);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranchOptions([]);
      } finally {
        setLoading(false);
      }
    };

    // Check both DD and Cheque organization and bank IDs
    const ddOrgId = values.mainDdOrganisationId;
    const ddBankId = values.mainDdBankId;
    const chequeOrgId = values.mainChequeOrganisationId;
    const chequeBankId = values.mainChequeBankId;
    
    if (ddOrgId && ddBankId) {
      fetchBranches(ddOrgId, ddBankId);
    } else if (chequeOrgId && chequeBankId) {
      fetchBranches(chequeOrgId, chequeBankId);
    } else {
      setBranchOptions([]);
    }
  }, [values.mainDdOrganisationId, values.mainDdBankId, values.mainChequeOrganisationId, values.mainChequeBankId]);

  const getOptions = (optionsKey) => {
    const optionsMap = {
      "organizationOptions": organizationOptions,
      "bankOptions": bankOptions,
      "branchOptions": branchOptions
    };
    return optionsMap[optionsKey] || [];
  };

  // Handle organization change to store ID
  const handleOrganizationChange = (e) => {
    handleChange(e);
    const fieldName = e.target.name;
    
    // Check if this is an organization field
    if (fieldName === "mainDdOrganisationName" || fieldName === "mainChequeOrganisationName") {
      // Find the selected option to get both label and ID
      const selectedOption = organizationOptions.find(option => option.label === e.target.value);
      if (selectedOption) {
        // Store the organization ID for backend submission
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, selectedOption.value);
        console.log(`${idFieldName} stored for backend:`, selectedOption.value);
        console.log('Organization name:', selectedOption.label);
        
        // Clear bank fields when organization changes
        if (fieldName === "mainDdOrganisationName") {
          setFieldValue('mainDdBankName', '');
          setFieldValue('mainDdBankId', '');
          setFieldValue('mainDdBranchName', '');
          setFieldValue('mainDdBranchId', '');
        } else if (fieldName === "mainChequeOrganisationName") {
          setFieldValue('mainChequeBankName', '');
          setFieldValue('mainChequeBankId', '');
          setFieldValue('mainChequeBranchName', '');
          setFieldValue('mainChequeBranchId', '');
        }
      } else {
        // Clear the organization ID if no option is selected
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, '');
        console.log(`${idFieldName} cleared`);
        
        // Clear bank fields when organization is cleared
        if (fieldName === "mainDdOrganisationName") {
          setFieldValue('mainDdBankName', '');
          setFieldValue('mainDdBankId', '');
          setFieldValue('mainDdBranchName', '');
          setFieldValue('mainDdBranchId', '');
        } else if (fieldName === "mainChequeOrganisationName") {
          setFieldValue('mainChequeBankName', '');
          setFieldValue('mainChequeBankId', '');
          setFieldValue('mainChequeBranchName', '');
          setFieldValue('mainChequeBranchId', '');
        }
      }
    }
  };

  // Handle bank change to store ID
  const handleBankChange = (e) => {
    handleChange(e);
    const fieldName = e.target.name;
    
    // Check if this is a bank field
    if (fieldName === "mainDdBankName" || fieldName === "mainChequeBankName") {
      // Find the selected option to get both label and ID
      const selectedOption = bankOptions.find(option => option.label === e.target.value);
      if (selectedOption) {
        // Store the bank ID for backend submission
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, selectedOption.value);
        console.log(`${idFieldName} stored for backend:`, selectedOption.value);
        console.log('Bank name:', selectedOption.label);
        
        // Clear branch fields when bank changes
        if (fieldName === "mainDdBankName") {
          setFieldValue('mainDdBranchName', '');
          setFieldValue('mainDdBranchId', '');
        } else if (fieldName === "mainChequeBankName") {
          setFieldValue('mainChequeBranchName', '');
          setFieldValue('mainChequeBranchId', '');
        }
      } else {
        // Clear the bank ID if no option is selected
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, '');
        console.log(`${idFieldName} cleared`);
        
        // Clear branch fields when bank is cleared
        if (fieldName === "mainDdBankName") {
          setFieldValue('mainDdBranchName', '');
          setFieldValue('mainDdBranchId', '');
        } else if (fieldName === "mainChequeBankName") {
          setFieldValue('mainChequeBranchName', '');
          setFieldValue('mainChequeBranchId', '');
        }
      }
    }
  };

  // Handle branch change to store ID
  const handleBranchChange = (e) => {
    handleChange(e);
    const fieldName = e.target.name;
    
    // Check if this is a branch field
    if (fieldName === "mainDdBranchName" || fieldName === "mainChequeBranchName") {
      // Find the selected option to get both label and ID
      const selectedOption = branchOptions.find(option => option.label === e.target.value);
      if (selectedOption) {
        // Store the branch ID for backend submission
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, selectedOption.value);
        console.log(`${idFieldName} stored for backend:`, selectedOption.value);
        console.log('Branch name:', selectedOption.label);
      } else {
        // Clear the branch ID if no option is selected
        const idFieldName = fieldName.replace('Name', 'Id');
        setFieldValue(idFieldName, '');
        console.log(`${idFieldName} cleared`);
      }
    }
  };

  return (
    <div className={styles.form_fields_container}>
      {formFields.map((field, index) => (
        <div key={field.name} className={styles.form_field}>
          <Field name={field.name}>
            {({ field: fieldProps, meta }) => (
              field.type === "dropdown" ? (
                <Dropdown
                  dropdownname={field.label}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={
                    field.options === 'organizationOptions' ? handleOrganizationChange :
                    field.options === 'bankOptions' ? handleBankChange :
                    field.options === 'branchOptions' ? handleBranchChange :
                    handleChange
                  }
                  results={typeof field.options === 'string' ? getOptions(field.options).map(option => option.label) : field.options || []}
                  required={field.required}
                  disabled={loading && (field.options === 'organizationOptions' || field.options === 'bankOptions' || field.options === 'branchOptions')}
                  dropdownsearch={true}
                />
              ) : (
                <Inputbox
                  label={field.label}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={field.type}
                  placeholder={field.placeholder}
                  error={meta.touched && meta.error}
                  required={field.required}
                />
              )
            )}
          </Field>
        </div>
      ))}
    </div>
  );
};

export default PaymentFormFields;
