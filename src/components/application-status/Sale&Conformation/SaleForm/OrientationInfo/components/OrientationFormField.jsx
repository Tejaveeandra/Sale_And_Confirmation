import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import { saleApi } from '../../services/saleApi';
import styles from './OrientationFormField.module.css';

const OrientationFormField = ({ field, values, handleChange, handleBlur, errors, touched, setFieldValue }) => {
  const [branchTypeOptions, setBranchTypeOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [studentTypeOptions, setStudentTypeOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [orientationOptions, setOrientationOptions] = useState([]);
  const [campusOptions, setCampusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStudentTypes, setFilteredStudentTypes] = useState([]);
  const [studentTypeId, setStudentTypeId] = useState(null);
  const [joiningClassId, setJoiningClassId] = useState(null);
  const [orientationId, setOrientationId] = useState(null);

  // API call to fetch student types using saleApi service
  const fetchStudentTypes = async () => {
    try {
      const data = await saleApi.getStudentTypes();
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.student_type_id || item.id,
          label: item.student_type_name || item.name || item.title
        }));
        
        setStudentTypeOptions(transformedOptions);
      }
    } catch (error) {
      console.error('Error fetching student types:', error);
    }
  };

  // API call to fetch campuses by category using saleApi service
  const fetchCampusesByCategory = async () => {
    try {
      // Get category from localStorage (from login response)
      const category = localStorage.getItem("category");
      
      if (!category) {
        return;
      }
      
      // Convert category to lowercase for API parameter
      const businessType = category.toLowerCase();
      
      const data = await saleApi.getCampusesByCategory(businessType);
      
      // Check if response has nested data array
      const campusData = data?.data || data;
      
      if (campusData && Array.isArray(campusData)) {
        const transformedOptions = campusData.map(item => ({
          value: item.id || item.campusId || item.campus_id,
          label: item.name || item.campusName || item.campus_name
        }));
        
        setCampusOptions(transformedOptions);
      }
    } catch (error) {
      console.error('Error fetching campuses by category:', error);
    }
  };

  // Fetch student types on component mount
  React.useEffect(() => {
    fetchStudentTypes();
    fetchCampusesByCategory(); // Also fetch campuses
  }, []);

  // Initialize filtered student types when student types are loaded
  React.useEffect(() => {
    if (studentTypeOptions.length > 0 && filteredStudentTypes.length === 0) {
      setFilteredStudentTypes(studentTypeOptions);
    }
  }, [studentTypeOptions, filteredStudentTypes.length]);

  // Fetch classes when branch value changes
  React.useEffect(() => {
    if (values.branch && campusOptions.length > 0) {
      const selectedCampus = campusOptions.find(option => option.label === values.branch);
      if (selectedCampus) {
        fetchClassesByCampus(selectedCampus.value);
        console.log('Fetching classes for branch change, campus ID:', selectedCampus.value);
      }
    }
  }, [values.branch, campusOptions]);

  // Filter student types based on branch type
  React.useEffect(() => {
    if (field.name === "studentType" && values.branchType) {
      console.log('Branch Type selected:', values.branchType);
      console.log('Filtering student types based on branch type');
      
      // Filter student types based on branch type
      const filtered = studentTypeOptions.filter(option => {
        const optionLabel = option.label.toLowerCase();
        const branchType = values.branchType.toLowerCase();
        
        // If branch type is "day scholar" or similar, only show day scholar options
        if (branchType.includes('day') && !branchType.includes('res')) {
          return optionLabel.includes('day') || optionLabel.includes('scholar');
        }
        
        // If branch type is "DS AND RES" or "Residential", show remaining options (not day scholar)
        if (branchType.includes('ds and res') || branchType.includes('residential') || branchType.includes('res')) {
          return !optionLabel.includes('day') && !optionLabel.includes('scholar');
        }
        
        // For other branch types, show all options
        return true;
      });
      
      setFilteredStudentTypes(filtered);
      console.log('Filtered student types:', filtered);
    } else if (field.name === "studentType" && !values.branchType) {
      // If no branch type selected, show all student types
      setFilteredStudentTypes(studentTypeOptions);
    }
  }, [field.name, values.branchType, studentTypeOptions]);

  // Auto-populate branch field from localStorage when campus options are loaded
  React.useEffect(() => {
    if (campusOptions.length > 0 && field.name === "branch" && !values.branch) {
      const campusName = localStorage.getItem("campusName");
      
      if (campusName) {
        // Try to find matching option in API data
        const matchingOption = campusOptions.find(option => option.label === campusName);
        if (matchingOption) {
          setFieldValue('branch', matchingOption.label);
          setFieldValue('branchId', matchingOption.value); // Store ID alongside label
          console.log('Branch ID:', matchingOption.value);
          // Trigger API call to get branch details
          fetchBranchDetails(matchingOption.label);
        }
      }
    }
  }, [campusOptions, field.name, values.branch, setFieldValue]);

  // Auto-populate branch details when campus options are loaded and branch field has value
  React.useEffect(() => {
    if (campusOptions.length > 0 && field.name === "branch" && values.branch) {
      // Check if the current branch value matches any campus option
      const matchingCampus = campusOptions.find(option => option.label === values.branch);
      if (matchingCampus) {
        setFieldValue('branchId', matchingCampus.value); // Store ID alongside existing label
        console.log('Branch ID (on load):', matchingCampus.value);
        fetchBranchDetails(values.branch);
      }
    }
  }, [campusOptions, values.branch, field.name]);

  // Fetch classes when Joining Class field renders and branch is selected
  React.useEffect(() => {
    if (field.name === "joiningClass" && values.branch) {
      fetchClassesByCampus(921);
    }
  }, [field.name, values.branch]);

  // Fetch orientations when Orientation Name field renders and joining class is selected
  React.useEffect(() => {
    if (field.name === "orientationName" && values.joiningClass) {
      // Find the class ID from the classOptions array
      const selectedClass = classOptions.find(option => option.label === values.joiningClass);
      if (selectedClass) {
        fetchOrientationsByClass(selectedClass.value);
      } else {
        // If not found, try using the value directly (in case it's already an ID)
        fetchOrientationsByClass(values.joiningClass);
      }
    }
  }, [field.name, values.joiningClass, classOptions]);


  // API call to fetch orientations by class using saleApi service
  const fetchOrientationsByClass = async (classId) => {
    try {
      const data = await saleApi.getOrientationsByClass(classId);
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.orientationId || item.orientation_id || item.id,
          label: item.orientationName || item.orientation_name || item.name || item.title
        }));
        
        setOrientationOptions(transformedOptions);
      }
    } catch (error) {
      console.error('Error fetching orientations by class:', error);
    }
  };

  // API call to fetch classes by campus using saleApi service
  const fetchClassesByCampus = async (campusId) => {
    console.log('fetchClassesByCampus called with campusId:', campusId);
    try {
      const data = await saleApi.getClassesByCampus(campusId);
      
      console.log('API Response data:', data);
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.classId || item.class_id || item.id,
          label: item.className || item.class_name || item.name || item.title
        }));
        
        console.log('Fetched classes from API:', data);
        console.log('Transformed class options:', transformedOptions);
        setClassOptions(transformedOptions);
        console.log('classOptions state updated with:', transformedOptions);
      } else {
        console.log('No classes data received from API:', data);
        // Set empty array if no data
        setClassOptions([]);
      }
    } catch (error) {
      console.error('Error fetching classes by campus:', error);
      console.error('Error details:', error.message);
      // Set empty array on error
      setClassOptions([]);
    }
  };

  // API call to get campus type and city when branch is selected
  const fetchBranchDetails = async (branchValue) => {
    if (!branchValue) return;
    
    setLoading(true);
    try {
      // Find the campus ID from the selected branch value
      const selectedCampus = campusOptions.find(option => option.label === branchValue);
      
      if (!selectedCampus) {
        return;
      }
      
      const campusId = selectedCampus.value;
      
      const data = await saleApi.getBranchDetails(campusId);
      
      if (data) {
        const { campusType, cityName, campusTypeId, cityId } = data;
        
        console.log('API Response data:', data);
        console.log('campusType:', campusType);
        console.log('campusTypeId:', campusTypeId);
        console.log('cityName:', cityName);
        console.log('cityId:', cityId);
        
        // Update branch type options
        if (campusType) {
          const branchTypeOption = [{ value: campusTypeId || campusType.toLowerCase().replace(/\s+/g, '_'), label: campusType }];
          setBranchTypeOptions(branchTypeOption);
          setFieldValue('branchType', campusType);
          if (campusTypeId) {
            setFieldValue('branchTypeId', campusTypeId); // Store ID alongside label
            console.log('Branch Type ID (Campus Type ID):', campusTypeId);
          } else {
            console.log('Branch Type ID (Campus Type ID) is undefined or null');
          }
        }
        
        // Update city options
        if (cityName) {
          const cityOption = [{ value: cityId || cityName.toLowerCase().replace(/\s+/g, '_'), label: cityName }];
          setCityOptions(cityOption);
          setFieldValue('city', cityName);
          if (cityId) {
            setFieldValue('cityId', cityId); // Store ID alongside label
            console.log('City ID:', cityId);
          }
        }
      }
      
      // Also fetch classes for the campus using the selected campus ID
      await fetchClassesByCampus(campusId);
      
    } catch (error) {
      console.error('Error fetching branch details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOptions = (optionsKey) => {
    console.log('getOptions called with key:', optionsKey);
    console.log('Current classOptions state:', classOptions);
    
    const optionsMap = {
      "branchTypeOptions": branchTypeOptions,
      "branchOptions": (() => {
        if (campusOptions && campusOptions.length > 0) {
          return campusOptions;
        }
        
        // Fallback: Get campus name from localStorage (from login response) - PRESERVE AUTO-POPULATION
        const campusName = localStorage.getItem("campusName");
        
        if (campusName) {
          const branchOption = {
            value: campusName.toLowerCase().replace(/\s+/g, '_'),
            label: campusName
          };
          return [branchOption];
        }
        
        return [];
      })(),
      "campusOptions": campusOptions,
      "orientationOptions": orientationOptions,
      "admissionTypeOptions": [],
      "studentTypeOptions": filteredStudentTypes.length > 0 ? filteredStudentTypes : studentTypeOptions,
      "cityOptions": cityOptions,
      "classOptions": classOptions
    };
    
    const result = optionsMap[optionsKey] || [];
    console.log('getOptions returning for', optionsKey, ':', result);
    return result;
  };

  return (
    <div className={styles.orientation_info_form_field}>
      <Field name={field.name}>
        {({ field: fieldProps, meta }) => {
          const options = getOptions(field.options);
          const stringOptions = options.map(option => option.label || option.value);
          
          // Debug logging for joining class
          if (field.name === "joiningClass") {
            console.log('Joining class field options:', field.options);
            console.log('Available class options:', classOptions);
            console.log('Resolved options:', options);
            console.log('String options:', stringOptions);
          }

          // Auto-select campus for Branch field - PRESERVE AUTO-POPULATION
          let fieldValue = values[field.name] || "";
          if (field.name === "branch" && !fieldValue && options.length > 0) {
            const campusName = localStorage.getItem("campusName");
            
            if (campusName) {
              // Try to find matching option in API data first
              const matchingOption = options.find(option => 
                option.label === campusName || 
                option.value === campusName.toLowerCase().replace(/\s+/g, '_')
              );
              
              if (matchingOption) {
                fieldValue = matchingOption.label;
              } else {
                // Fallback to direct campus name
                fieldValue = campusName;
              }
              
              // Auto-set the value if not already set
              if (!values[field.name]) {
                handleChange({
                  target: {
                    name: field.name,
                    value: fieldValue
                  }
                });
                // Trigger API call to get branch details
                fetchBranchDetails(fieldValue);
                
                // Also fetch classes for the auto-populated branch
                if (matchingOption) {
                  fetchClassesByCampus(matchingOption.value);
                  console.log('Auto-fetching classes for campus ID:', matchingOption.value);
                } else {
                  // If no matching option found, try to get campus ID from localStorage or use a fallback
                  const campusId = localStorage.getItem('campusId') || localStorage.getItem('campus_id');
                  if (campusId) {
                    fetchClassesByCampus(campusId);
                    console.log('Auto-fetching classes for campus ID from localStorage:', campusId);
                  } else {
                    console.log('No campus ID available for fetching classes');
                  }
                }
              }
            }
          }

          // Handle Branch field change to trigger API call
          const handleBranchChange = (e) => {
            handleChange(e);
            if (field.name === "branch") {
              // Find the selected option to get both label and ID
              const selectedOption = campusOptions.find(option => option.label === e.target.value);
              if (selectedOption) {
                setFieldValue('branchId', selectedOption.value); // Store ID alongside label
                console.log('Branch ID (on change):', selectedOption.value);
                
                // Fetch classes for the selected campus/branch
                fetchClassesByCampus(selectedOption.value);
                console.log('Fetching classes for campus ID:', selectedOption.value);
              }
              fetchBranchDetails(e.target.value);
            }
          };

          // Handle Student Type field change to store ID
          const handleStudentTypeChange = (e) => {
            handleChange(e);
            if (field.name === "studentType") {
              // Find the selected option to get both label and ID
              const selectedOption = (filteredStudentTypes.length > 0 ? filteredStudentTypes : studentTypeOptions)
                .find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('studentTypeId', selectedOption.value);
                setStudentTypeId(selectedOption.value);
                console.log('Student Type ID:', selectedOption.value);
              } else {
                setFieldValue('studentTypeId', '');
                setStudentTypeId(null);
              }
            }
          };

          // Handle Joining Class field change to store ID
          const handleJoiningClassChange = (e) => {
            handleChange(e);
            if (field.name === "joiningClass") {
              // Find the selected option to get both label and ID
              const selectedOption = classOptions.find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('joiningClassId', selectedOption.value);
                setJoiningClassId(selectedOption.value);
                console.log('Joining Class ID:', selectedOption.value);
              } else {
                setFieldValue('joiningClassId', '');
                setJoiningClassId(null);
              }
            }
          };

          // Handle Orientation field change to store ID
          const handleOrientationChange = (e) => {
            handleChange(e);
            if (field.name === "orientationName") {
              // Find the selected option to get both label and ID
              const selectedOption = orientationOptions.find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('orientationId', selectedOption.value);
                setOrientationId(selectedOption.value);
                console.log('Orientation ID:', selectedOption.value);
              } else {
                setFieldValue('orientationId', '');
                setOrientationId(null);
              }
            }
          };


          // For Branch Type and City, render as read-only input fields instead of dropdowns
          if (field.name === "branchType" || field.name === "city") {
            return (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={fieldValue}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                error={meta.touched && meta.error}
                required={field.required}
                readOnly={true}
              />
            );
          }

          return field.type === "dropdown" ? (
            <Dropdown
              dropdownname={field.label}
              id={field.id}
              name={field.name}
              value={fieldValue}
              onChange={field.name === "branch" ? handleBranchChange : field.name === "studentType" ? handleStudentTypeChange : field.name === "joiningClass" ? handleJoiningClassChange : field.name === "orientationName" ? handleOrientationChange : handleChange}
              results={stringOptions}
              required={field.required}
              disabled={loading}
              dropdownsearch={true}
            />
          ) : (
            <Inputbox
              label={field.label}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              type={field.type}
              error={meta.touched && meta.error}
              required={field.required}
            />
          );
        }}
      </Field>
      {touched[field.name] && errors[field.name] && (
        <div className={styles.orientation_info_error}>
          {errors[field.name]}
        </div>
      )}
    </div>
  );
};

export default OrientationFormField;

