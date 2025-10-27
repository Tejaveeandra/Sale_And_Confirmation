import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import SearchBox from '../../../../../../widgets/Searchbox/Searchbox';
import Snackbar from '../../../../../../widgets/Snackbar/Snackbar';
import { ReactComponent as SearchIcon } from '../../../../../../assets/application-status/Group.svg';
import { saleApi } from '../../services/saleApi';
import styles from './AddressFormField.module.css';

// Debug flag for conditional logging
const DEBUG = process.env.NODE_ENV === 'development';

const AddressFormField = ({ field, values, handleChange, handleBlur, errors, touched, setFieldValue }) => {
  // Combined state for better performance
  const [dropdownState, setDropdownState] = useState({
    stateOptions: [],
    districtOptions: [],
    mandalOptions: [],
    cityOptions: [],
    loading: false,
    mandalRenderKey: 0,
    cityRenderKey: 0
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Destructure for easier access
  const { stateOptions, districtOptions, mandalOptions, cityOptions, loading, mandalRenderKey, cityRenderKey } = dropdownState;

  // Force re-render when mandal options change
  useEffect(() => {
    if (mandalOptions.length > 0) {
      setDropdownState(prev => ({ ...prev, mandalRenderKey: prev.mandalRenderKey + 1 }));
    }
  }, [mandalOptions.length]);

  // Force re-render when district changes (for mandal and city fields)
  useEffect(() => {
    if (field.name === "mandal") {
      if (values.district && values.districtId) {
        // Trigger both state update and re-render
        fetchMandalsByDistrict(values.districtId);
        setDropdownState(prev => ({ ...prev, mandalRenderKey: prev.mandalRenderKey + 1 }));
      } else if (!values.district || !values.districtId) {
        // Clear mandal options when district is cleared
        setDropdownState(prev => ({ ...prev, mandalOptions: [] }));
        setFieldValue('mandal', '');
        setFieldValue('mandalId', '');
        setDropdownState(prev => ({ ...prev, mandalRenderKey: prev.mandalRenderKey + 1 }));
      }
    } else if (field.name === "city") {
      if (values.district && values.districtId) {
        // Trigger both state update and re-render
        fetchCitiesByDistrict(values.districtId);
        setDropdownState(prev => ({ ...prev, cityRenderKey: prev.cityRenderKey + 1 }));
      } else if (!values.district || !values.districtId) {
        // Clear city options when district is cleared
        setDropdownState(prev => ({ ...prev, cityOptions: [] }));
        setFieldValue('city', '');
        setFieldValue('cityId', '');
        setDropdownState(prev => ({ ...prev, cityRenderKey: prev.cityRenderKey + 1 }));
      }
    }
  }, [values.district, values.districtId, field.name]);

  // Function to show snackbar - optimized with useCallback
  const showSnackbar = useCallback((message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  // Function to close snackbar - optimized with useCallback
  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  // API call to fetch state and district by pincode
  const fetchStateDistrictByPincode = async (pincode) => {
    if (!pincode || pincode.length < 6) {
      return;
    }

    // Check if setFieldValue is available
    if (!setFieldValue) {
      return;
    }

    setDropdownState(prev => ({ ...prev, loading: true }));
    try {
      const data = await saleApi.getStateDistrictByPincode(pincode);
      
      if (data) {
        // Check if we got valid state and district data
        if (data.stateName && data.stateId && data.districtName && data.districtId) {
          // Update state options
          const stateOption = [{
            value: data.stateId,
            label: data.stateName
          }];
          setDropdownState(prev => ({ ...prev, stateOptions: stateOption }));
          setFieldValue('state', data.stateName);
          setFieldValue('stateId', data.stateId);

          // Update district options
          const districtOption = [{
            value: data.districtId,
            label: data.districtName
          }];
          setDropdownState(prev => ({ ...prev, districtOptions: districtOption }));
          setFieldValue('district', data.districtName);
          setFieldValue('districtId', data.districtId);

          // Clear mandal options and fetch mandals for the district
          setDropdownState(prev => ({ ...prev, mandalOptions: [] }));
          setFieldValue('mandal', '');
          setFieldValue('mandalId', '');
          
          // Fetch mandals for the auto-populated district
          await fetchMandalsByDistrict(data.districtId);

          // Show success message
          showSnackbar(`State: ${data.stateName}, District: ${data.districtName}`, 'success');
        } else {
          // Show polite error if data is incomplete
          showSnackbar('Please enter a valid 6-digit pincode to get location details.', 'warning');
          // Clear state and district
          setDropdownState(prev => ({ ...prev, stateOptions: [] }));
          setDropdownState(prev => ({ ...prev, districtOptions: [] }));
          setFieldValue('state', '');
          setFieldValue('stateId', '');
          setFieldValue('district', '');
          setFieldValue('districtId', '');
        }
      } else {
        // Show polite error if no data received
        showSnackbar('Sorry, we couldn\'t find location details for this pincode. Please verify and try again.', 'warning');
        // Clear state and district
        setDropdownState(prev => ({ ...prev, stateOptions: [] }));
        setDropdownState(prev => ({ ...prev, districtOptions: [] }));
        setFieldValue('state', '');
        setFieldValue('stateId', '');
        setFieldValue('district', '');
        setFieldValue('districtId', '');
      }
    } catch (error) {
      // Check for specific error types and show appropriate polite messages
      if (error.response?.status === 500) {
        showSnackbar('Our servers are temporarily experiencing issues. Please try again in a few moments.', 'error');
      } else if (error.response?.status === 404) {
        showSnackbar('Sorry, we couldn\'t find location details for this pincode. Please verify and try again.', 'warning');
      } else if (error.response?.status === 400) {
        showSnackbar('Please enter a valid 6-digit pincode to get location details.', 'warning');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        showSnackbar('Unable to connect to our servers. Please check your internet connection and try again.', 'error');
      } else {
        showSnackbar('Unable to fetch location details at the moment. Please try again later.', 'error');
      }
      
      // Clear state and district on error
      setDropdownState(prev => ({ ...prev, stateOptions: [] }));
      setDropdownState(prev => ({ ...prev, districtOptions: [] }));
      setFieldValue('state', '');
      setFieldValue('stateId', '');
      setFieldValue('district', '');
      setFieldValue('districtId', '');
    } finally {
      setDropdownState(prev => ({ ...prev, loading: false }));
    }
  };

  // API call to fetch mandals by district
  const fetchMandalsByDistrict = async (districtId) => {
    if (!districtId) {
      return;
    }

    // Check if setFieldValue is available
    if (!setFieldValue) {
      return;
    }

    setDropdownState(prev => ({ ...prev, loading: true }));
    try {
      const data = await saleApi.getMandalsByDistrict(districtId);

      // Handle different response formats
      let mandalsArray = [];
      if (Array.isArray(data)) {
        mandalsArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        mandalsArray = data.data;
      } else if (data && data.mandals && Array.isArray(data.mandals)) {
        mandalsArray = data.mandals;
      } else if (data && data.result && Array.isArray(data.result)) {
        mandalsArray = data.result;
      }

      if (mandalsArray.length > 0) {
        const transformedOptions = mandalsArray.map(item => ({
          value: item.id, // Use the actual ID from API response
          label: item.name // Use the actual name from API response
        }));
        setDropdownState(prev => ({ ...prev, mandalOptions: transformedOptions }));
      } else {
        setDropdownState(prev => ({ ...prev, mandalOptions: [] }));
        setFieldValue('mandal', '');
        setFieldValue('mandalId', '');
      }
    } catch (error) {
      // Check for specific error types and show appropriate polite messages
      if (error.response?.status === 500) {
        showSnackbar('Our servers are temporarily experiencing issues. Please try again in a few moments.', 'error');
      } else if (error.response?.status === 404) {
        showSnackbar('No mandals found for this district.', 'warning');
      } else if (error.response?.status === 400) {
        showSnackbar('Invalid district information. Please try again.', 'warning');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        showSnackbar('Unable to connect to our servers. Please check your internet connection and try again.', 'error');
      } else {
        showSnackbar('Unable to fetch mandals at the moment. Please try again later.', 'error');
      }
      
      setDropdownState(prev => ({ ...prev, mandalOptions: [] }));
      setFieldValue('mandal', '');
      setFieldValue('mandalId', '');
    } finally {
      setDropdownState(prev => ({ ...prev, loading: false }));
    }
  };

  // API call to fetch cities by district
  const fetchCitiesByDistrict = async (districtId) => {
    if (!districtId) {
      return;
    }

    // Check if setFieldValue is available
    if (!setFieldValue) {
      return;
    }

    setDropdownState(prev => ({ ...prev, loading: true }));
    try {
      const data = await saleApi.getCitiesByDistrict(districtId);

      // Handle different response formats
      let citiesArray = [];
      if (Array.isArray(data)) {
        citiesArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        citiesArray = data.data;
      } else if (data && data.cities && Array.isArray(data.cities)) {
        citiesArray = data.cities;
      } else if (data && data.result && Array.isArray(data.result)) {
        citiesArray = data.result;
      }

      if (citiesArray.length > 0) {
        const transformedOptions = citiesArray.map(item => ({
          value: item.id, // Use the actual ID from API response
          label: item.name // Use the actual name from API response
        }));
        setDropdownState(prev => ({ ...prev, cityOptions: transformedOptions }));
      } else {
        setDropdownState(prev => ({ ...prev, cityOptions: [] }));
        setFieldValue('city', '');
        setFieldValue('cityId', '');
      }
    } catch (error) {
      // Check for specific error types and show appropriate polite messages
      if (error.response?.status === 500) {
        showSnackbar('Our servers are temporarily experiencing issues. Please try again in a few moments.', 'error');
      } else if (error.response?.status === 404) {
        showSnackbar('No cities found for this district.', 'warning');
      } else if (error.response?.status === 400) {
        showSnackbar('Invalid district information. Please try again.', 'warning');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        showSnackbar('Unable to connect to our servers. Please check your internet connection and try again.', 'error');
      } else {
        showSnackbar('Unable to fetch cities at the moment. Please try again later.', 'error');
      }
      
      setDropdownState(prev => ({ ...prev, cityOptions: [] }));
      setFieldValue('city', '');
      setFieldValue('cityId', '');
    } finally {
      setDropdownState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle pincode change
  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    handleChange(e);
    
    // Check if setFieldValue is available
    if (!setFieldValue) {
      return;
    }
    
    // Trigger API call when pincode is 6 digits
    if (pincode.length === 6) {
      fetchStateDistrictByPincode(pincode);
    } else if (pincode.length < 6) {
      // Clear state and district if pincode is incomplete
      setDropdownState(prev => ({ ...prev, stateOptions: [] }));
      setDropdownState(prev => ({ ...prev, districtOptions: [] }));
      setFieldValue('state', '');
      setFieldValue('stateId', '');
      setFieldValue('district', '');
      setFieldValue('districtId', '');
    }
  };

  // Handle mandal change to store ID
  const handleMandalChange = (e) => {
    handleChange(e);
    if (field.name === "mandal") {
      // Find the selected option to get both label and ID
      const selectedOption = mandalOptions.find(option => option.label === e.target.value);
      if (selectedOption) {
        setFieldValue('mandalId', selectedOption.value);
        if (DEBUG) {
          console.log('Mandal ID stored for backend:', selectedOption.value);
          console.log('Mandal name:', selectedOption.label);
        }
      } else {
        setFieldValue('mandalId', '');
      }
    }
  };

  // Handle city change to store ID
  const handleCityChange = (e) => {
    handleChange(e);
    if (field.name === "city") {
      // Find the selected option to get both label and ID
      const selectedOption = cityOptions.find(option => option.label === e.target.value);
      if (selectedOption) {
        setFieldValue('cityId', selectedOption.value);
        if (DEBUG) {
          console.log('City ID stored for backend:', selectedOption.value);
          console.log('City name:', selectedOption.label);
        }
      } else {
        setFieldValue('cityId', '');
      }
    }
  };

  // Optimized options mapping with useMemo
  const optionsMap = useMemo(() => ({
    "stateOptions": stateOptions,
    "districtOptions": districtOptions,
    "mandalOptions": mandalOptions,
    "cityOptions": cityOptions
  }), [stateOptions, districtOptions, mandalOptions, cityOptions]);

  const getOptions = useCallback((optionsKey) => {
    return optionsMap[optionsKey] || [];
  }, [optionsMap]);

  return (
    <>
    <div className={styles.address_info_form_field}>
      <Field name={field.name}>
        {({ field: fieldProps, meta }) => {
          const options = getOptions(field.options);
          const stringOptions = options.map(option => option.label || option.value);

          if (field.type === "dropdown") {
            return (
              <Dropdown
                key={field.name === "mandal" ? `mandal-${mandalRenderKey}-${Date.now()}` : field.name === "city" ? `city-${cityRenderKey}-${Date.now()}` : field.id}
                dropdownname={field.label}
                id={field.id}
                name={field.name}
                value={values[field.name] || ""}
                onChange={field.name === "mandal" ? handleMandalChange : field.name === "city" ? handleCityChange : handleChange}
                results={stringOptions}
                required={field.required}
                disabled={loading && (field.name === "mandal" || field.name === "city")}
                dropdownsearch={true}
              />
            );
          } else if (field.type === "search") {
            return (
              <div className={styles.gpin_field_container}>
                <label htmlFor={field.name} className={styles.gpin_field_label}>
                  {field.label}
                  {field.required && <span className={styles.gpin_field_required}>*</span>}
                </label>
                <div className={styles.gpin_search_container}>
                  <SearchBox
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    searchicon={<SearchIcon />}
                  />
                </div>
                {meta.touched && meta.error && (
                  <div className={styles.gpin_field_error}>
                    {meta.error}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                  onChange={field.name === "pincode" ? handlePincodeChange : handleChange}
                onBlur={handleBlur}
                type={field.type}
                error={meta.touched && meta.error}
                required={field.required}
                  disabled={loading && field.name === "pincode"}
              />
            );
          }
        }}
      </Field>
      {touched[field.name] && errors[field.name] && (
        <div className={styles.address_info_error}>
          {errors[field.name]}
        </div>
      )}
    </div>
      
      {/* Snackbar for pincode validation messages */}
      {field.name === "pincode" && (
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
          duration={4000}
          position="top-right"
        />
      )}
    </>
  );
};

export default memo(AddressFormField);
