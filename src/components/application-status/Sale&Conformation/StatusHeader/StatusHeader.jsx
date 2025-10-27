import React, { useState, useEffect } from "react";
import styles from "./StatusHeader.module.css"; 

const StatusHeader = ({ applicationNo, campusName, zoneName, academicYear, applicationFee, category }) => {
  const [fetchedData, setFetchedData] = useState({
    campusName: campusName || "-",
    zoneName: zoneName || "-",
    academicYear: academicYear || "-",
    applicationFee: applicationFee || "-"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API service functions
  const fetchSchoolData = async (applicationNo) => {
    try {
      const url = `http://localhost:8080/api/student-admissions-sale/school/campus-zone-year-fee/${applicationNo}`;
      console.log('🌐 Making SCHOOL API request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('📡 SCHOOL API Response Status:', response.status);
      console.log('📡 SCHOOL API Response Content-Type:', contentType);
      console.log('📡 SCHOOL API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get as text
        const textResponse = await response.text();
        console.log('📄 SCHOOL API Non-JSON Response Text:', textResponse);
        console.log('📄 SCHOOL API Response Length:', textResponse.length);
        
        // Return empty data if no content
        if (!textResponse || textResponse.trim() === '') {
          console.log('⚠️ SCHOOL API returned empty response');
          return {};
        }
        
        // Try to parse as JSON if it looks like JSON
        try {
          const parsedData = JSON.parse(textResponse);
          console.log('🎯 SCHOOL API SUCCESS - Parsed from Text:', parsedData);
          return parsedData;
        } catch (parseError) {
          console.warn('❌ Could not parse SCHOOL response as JSON:', textResponse);
          console.warn('❌ Parse Error:', parseError.message);
          return {};
        }
      }
      
      const data = await response.json();
      console.log('🎯 SCHOOL API SUCCESS - Raw Response Data:', data);
      console.log('📊 School Data Keys:', Object.keys(data));
      console.log('📋 School Data Values:', Object.values(data));
      console.log('🔍 School Data Details:', {
        campusName: data.campusName,
        campus: data.campus,
        zoneName: data.zoneName,
        zone: data.zone,
        academicYear: data.academicYear,
        year: data.year,
        applicationFee: data.applicationFee,
        fee: data.fee
      });
      return data;
    } catch (error) {
      console.error('Error fetching school data:', error);
      throw error;
    }
  };

  const fetchCollegeData = async (applicationNo) => {
    try {
      const url = `http://localhost:8080/api/student-admissions-sale/college/campus-zone-year-fee/${applicationNo}`;
      console.log('🌐 Making COLLEGE API request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('📡 COLLEGE API Response Status:', response.status);
      console.log('📡 COLLEGE API Response Content-Type:', contentType);
      console.log('📡 COLLEGE API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get as text
        const textResponse = await response.text();
        console.log('📄 COLLEGE API Non-JSON Response Text:', textResponse);
        console.log('📄 COLLEGE API Response Length:', textResponse.length);
        
        // Return empty data if no content
        if (!textResponse || textResponse.trim() === '') {
          console.log('⚠️ COLLEGE API returned empty response');
          return {};
        }
        
        // Try to parse as JSON if it looks like JSON
        try {
          const parsedData = JSON.parse(textResponse);
          console.log('🎯 COLLEGE API SUCCESS - Parsed from Text:', parsedData);
          return parsedData;
        } catch (parseError) {
          console.warn('❌ Could not parse COLLEGE response as JSON:', textResponse);
          console.warn('❌ Parse Error:', parseError.message);
          return {};
        }
      }
      
      const data = await response.json();
      console.log('🎯 COLLEGE API SUCCESS - Raw Response Data:', data);
      console.log('📊 College Data Keys:', Object.keys(data));
      console.log('📋 College Data Values:', Object.values(data));
      console.log('🔍 College Data Details:', {
        campusName: data.campusName,
        campus: data.campus,
        zoneName: data.zoneName,
        zone: data.zone,
        academicYear: data.academicYear,
        year: data.year,
        applicationFee: data.applicationFee,
        fee: data.fee
      });
      return data;
    } catch (error) {
      console.error('Error fetching college data:', error);
      throw error;
    }
  };

  // Fetch data based on category when applicationNo changes
  useEffect(() => {
    const fetchData = async () => {
      if (!applicationNo || !category) return;
      
      console.log('🚀 === STATUS HEADER API CALL STARTED === 🚀');
      console.log('📋 Application No:', applicationNo);
      console.log('📋 Category:', category);
      console.log('📋 Props Data:', { campusName, zoneName, academicYear, applicationFee });
      
      setLoading(true);
      setError(null);
      
      try {
        let data;
        if (category.toLowerCase() === 'college') {
          console.log('🎓 Calling COLLEGE API...');
          data = await fetchCollegeData(applicationNo);
        } else if (category.toLowerCase() === 'school') {
          console.log('🏫 Calling SCHOOL API...');
          data = await fetchSchoolData(applicationNo);
        } else {
          console.warn('❌ Unknown category:', category);
          setError(`Unknown category: ${category}`);
          return;
        }
        
        console.log('✅ API Call Successful!');
        console.log('📊 Raw Backend Data:', data);
        console.log('📊 Raw Backend Data Type:', typeof data);
        console.log('📊 Raw Backend Data Length:', data ? Object.keys(data).length : 'N/A');
        
        // Log each field individually for better debugging
        console.log('🔍 === INDIVIDUAL FIELD ANALYSIS === 🔍');
        console.log('🏫 Campus Name Fields:', {
          'data.campusName': data.campusName,
          'data.campus': data.campus,
          'props.campusName': campusName
        });
        console.log('🌍 Zone Name Fields:', {
          'data.zoneName': data.zoneName,
          'data.zone': data.zone,
          'props.zoneName': zoneName
        });
        console.log('📅 Academic Year Fields:', {
          'data.academicYear': data.academicYear,
          'data.year': data.year,
          'props.academicYear': academicYear
        });
        console.log('💰 Application Fee Fields:', {
          'data.applicationFee': data.applicationFee,
          'data.fee': data.fee,
          'props.applicationFee': applicationFee
        });
        
        // Update state with fetched data (use fallback values if API returns empty)
        const processedData = {
          campusName: data.campusName || data.campus || campusName || "-",
          zoneName: data.zoneName || data.zone || zoneName || "-",
          academicYear: data.academicYear || data.year || academicYear || "-",
          applicationFee: data.applicationFee || data.fee || applicationFee || "-"
        };
        
        console.log('🔄 Processed Data for Display:', processedData);
        console.log('📋 Data Mapping Logic:', {
          'campusName': `${processedData.campusName} (from: ${data.campusName ? 'data.campusName' : data.campus ? 'data.campus' : campusName ? 'props.campusName' : 'default'})`,
          'zoneName': `${processedData.zoneName} (from: ${data.zoneName ? 'data.zoneName' : data.zone ? 'data.zone' : zoneName ? 'props.zoneName' : 'default'})`,
          'academicYear': `${processedData.academicYear} (from: ${data.academicYear ? 'data.academicYear' : data.year ? 'data.year' : academicYear ? 'props.academicYear' : 'default'})`,
          'applicationFee': `${processedData.applicationFee} (from: ${data.applicationFee ? 'data.applicationFee' : data.fee ? 'data.fee' : applicationFee ? 'props.applicationFee' : 'default'})`
        });
        
        setFetchedData(processedData);
        
        console.log('🎯 === STATUS HEADER API CALL COMPLETED === 🎯');
        console.log('📋 === FINAL STATE SUMMARY === 📋');
        console.log('🎯 Final Display Values:', {
          'Academic Year': processedData.academicYear,
          'Application No': applicationNo,
          'Branch (Campus)': processedData.campusName,
          'Zone': processedData.zoneName,
          'Application Fee': processedData.applicationFee
        });
        console.log('📊 === BACKEND DATA CONSOLE LOGGING COMPLETE === 📊');
        
        // Clear any previous errors if successful
        setError(null);
      } catch (err) {
        // Only show error if it's not a network issue or empty response
        if (err.message.includes('JSON') || err.message.includes('Unexpected end')) {
          console.warn('API returned empty or invalid response, using fallback data');
          setError(null); // Don't show error for empty responses
          
          // Use fallback data
          setFetchedData({
            campusName: campusName || "-",
            zoneName: zoneName || "-",
            academicYear: academicYear || "-",
            applicationFee: applicationFee || "-"
          });
        } else {
          setError(err.message);
          console.error('Failed to fetch data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationNo, category]);

  const headerItems = [
    { label: "Academic Year", value: fetchedData.academicYear },
    { label: "Application No", value: applicationNo || "-" },
    { label: "Branch", value: fetchedData.campusName },
    { label: "Zone", value: fetchedData.zoneName },
    { label: "Application Fee", value: fetchedData.applicationFee },
  ];

  return (
    <div className={styles.status_info_header}>
      <div className={styles.status_text_header}>
        {headerItems.map((item) => (
          <div key={item.label} className={styles.status_info_item}>
            <div className={styles.status_label}>{item.label}</div>
            <div className={styles.status_value}>
              {loading ? "Loading..." : item.value}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className={styles.error_message}>
          Error loading data: {error}
        </div>
      )}
    </div>
  );
};

export default StatusHeader;