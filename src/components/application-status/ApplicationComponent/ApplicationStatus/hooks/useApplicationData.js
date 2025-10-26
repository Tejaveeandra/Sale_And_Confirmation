import { useState, useEffect } from 'react';
import { getApplicationStatus } from '../../../../../queries/application-status/apis';
import { normalizeApiResponse } from '../utils/dataNormalization';

export const useApplicationData = (selectedCampus) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Skip fetching if selectedCampus is invalid
      if (!selectedCampus) {
        setData([]);
        setError("Please select a valid campus to view application status.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Since we're using employee-based API, we don't need campus ID
        // The employee-based API will return applications for the logged-in employee regardless of campus
        const empId = localStorage.getItem('empId');
        const result = await getApplicationStatus(null, empId); // Pass null for campusId since employee-based API doesn't need it
       
        // Handle nested API response structure
        let actualData = result;
        if (Array.isArray(result) && result.length === 2 && result[0] === "java.util.ArrayList") {
          actualData = result[1];
        } else if (Array.isArray(result) && result.length > 0 && typeof result[0] === "string") {
          // If first element is a string, the actual data is likely in the second element
          actualData = result[1] || result;
        }
       
        const normalized = normalizeApiResponse(Array.isArray(actualData) ? actualData : []);
        
        if (normalized.length === 0) {
          console.warn("No data found! This might be because:");
          console.warn("1. The employee has no applications assigned");
          console.warn("2. The new API endpoint is not working");
          console.warn("3. The data format has changed");
        }
        
        setData(normalized);
      } catch (err) {
        console.error("Error fetching application status:", err);
        setError(err.message || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCampus]);

  return { data, loading, error };
};
