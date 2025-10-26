import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";
import {
  useGetAcademicYears,
  useGetCities,
  useGetZoneByCity,
  useGetCampusByZone,
  useGetMobileNo,
  useGetAppNumberRange,
  useGetProsByCampus,
} from "../../../queries/application-distribution/dropdownqueries";


// label/id helpers for your backend shapes
const yearLabel = (y) =>
  y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;
const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;
const zoneLabel = (z) => z?.zoneName ?? z?.name ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;
const campusLabel = (cm) => cm?.name ?? null;
const campusId = (cm) => cm?.id ?? null;
const empLabel = (e) => e?.name ?? null;
const empId = (e) => e?.id ?? null;
const asArray = (v) => (Array.isArray(v) ? v : []);

// DgmForm Component
const DgmForm = ({ initialValues = {}, onSubmit, setIsInsertClicked, isUpdate=false, editId }) => {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [customAcademicYear, setCustomAcademicYear] = useState(null);
  const [employees, setEmployees] = useState(null);

  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
    // issuedToId: initialValues?.issuedToId ?? null,
  });


  const didSeedRef = useRef({ year: false, state: false });

  // API hooks
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: citiesRaw = [] } = useGetCities();
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: campusesRaw = [] } = useGetCampusByZone(selectedZoneId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);
  const { data: employess = [] } = useGetProsByCampus(selectedCampusId);

  // Fetch app number range
  const {
    data: appNumberRange,
    error,
    isLoading,
  } = useGetAppNumberRange(selectedAcademicYearId, 4079);

  // Normalize arrays
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const zonesData = useMemo(() => asArray(zonesRaw), [zonesRaw]);
  const campusesData = useMemo(() => asArray(campusesRaw), [campusesRaw]);
  const employeeData = useMemo(() => asArray(employess), [employess]);
  // Options for dropdowns
  const academicYearNames = useMemo(() => {
    const allowedYears = [
      "2026-27",
      "2025-26",
      "2024-25",
    ];
    const apiYears = yearsData.map(yearLabel).filter(Boolean);
    const filteredYears = allowedYears
      .filter((year) => apiYears.includes(year))
      .sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]));
    return filteredYears;
  }, [yearsData]);

  const cityNames = useMemo(
    () => citiesData.map(cityLabel).filter(Boolean),
    [citiesData]
  );
  const zoneNames = useMemo(
    () => zonesData.map(zoneLabel).filter(Boolean),
    [zonesData]
  );
  const issuedToNames = useMemo(
    () => employeeData.map(empLabel).filter(Boolean),
    [employeeData]
  );

  // Reverse maps for easier lookup
  const academicYearNameToId = useMemo(
    () => new Map(yearsData.map((y) => [yearLabel(y), yearId(y)])),
    [yearsData]
  );
  const cityNameToId = useMemo(
    () => new Map(citiesData.map((c) => [cityLabel(c), cityId(c)])),
    [citiesData]
  );
  const zoneNameToId = useMemo(
    () => new Map(zonesData.map((z) => [zoneLabel(z), zoneId(z)])),
    [zonesData]
  );
  const campusNameToId = useMemo(
    () => new Map(campusesData.map((cm) => [campusLabel(cm), campusId(cm)])),
    [campusesData]
  );
  const empNameToId = useMemo(
    () => new Map(employeeData.map((e) => [empLabel(e), empId(e)])),
    [employeeData]
  );
  

  // Handle default academic year (2025-26) selection
  useEffect(() => {
    if (didSeedRef.current.year) return;
    if (!yearsData.length) return;
    const defaultYear = yearsData.find((y) => yearLabel(y) === "2025-26");
    if (defaultYear) {
      setSelectedAcademicYearId(yearId(defaultYear));
      didSeedRef.current.year = true;
    }
  }, [yearsData]);

  // Handle data when appNumberRange is fetched
  useEffect(() => {
    if(isUpdate) return;
    if (appNumberRange && appNumberRange.length > 0) {
      const { id, appFrom, appTo } = appNumberRange[0]; // Extract from first item
      setSeedInitialValues((prevValues) => {
        return {
          ...prevValues,
          availableAppNoFrom: String(appFrom),
          availableAppNoTo: String(appTo),
          applicationNoFrom: String(appFrom),
          // selectedBalanceTrackId: Number(id),
        };
      });
    }
  }, [appNumberRange, isUpdate]);

  // Reflect user selections and update fields dynamically
  const handleValuesChange = (values) => {
    if (values.academicYear && academicYearNameToId.has(values.academicYear)) {
      const ayId = academicYearNameToId.get(values.academicYear);
      if (ayId !== selectedAcademicYearId) setSelectedAcademicYearId(ayId);
    }
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const newCityId = cityNameToId.get(values.cityName);
      if (newCityId !== selectedCityId) {
        setSelectedCityId(newCityId);
        setSelectedZoneId(null); // Reset zone when city changes
        setSelectedCampusId(null); // Reset campus when city changes
        setIssuedToId(null); // Reset employee when city changes
      }
    }
    if (values.zoneName && zoneNameToId.has(values.zoneName)) {
      const newZoneId = zoneNameToId.get(values.zoneName);
      if (newZoneId !== selectedZoneId) {
        setSelectedZoneId(newZoneId);
        setSelectedCampusId(null); // Reset campus when zone changes
        setIssuedToId(null); // Reset employee when zone changes
      }
    }
    if (values.campusName && campusNameToId.has(values.campusName)) {
      const cmId = campusNameToId.get(values.campusName);
      if (cmId !== selectedCampusId) {
        setSelectedCampusId(cmId);
        setIssuedToId(null); // Reset employee when campus changes
      }
    }
    if (values.issuedTo && empNameToId.has(values.issuedTo)) {
      const empId = empNameToId.get(values.issuedTo);
      if (empId !== issuedToId) {
        setIssuedToId(empId);
      }
    }
  };

  // Backend-only fields
  const backendValues = useMemo(() => {
    const obj = {};
    if (mobileNo != null) obj.mobileNumber = String(mobileNo);
    // Add application number range to backend values if available
    if (appNumberRange?.length) {
    const { id, appFrom, appTo } = appNumberRange[0];
    obj.selectedBalanceTrackId = Number(id);        // ✅ always
    if (!isUpdate) {                                // insert-only UX fields
      obj.availableAppNoFrom = String(appFrom);
      obj.availableAppNoTo   = String(appTo);
      obj.applicationNoFrom  = String(appFrom);
    }
  }
    // Include IDs in backend values
    if (selectedAcademicYearId != null)
      obj.academicYearId = Number(selectedAcademicYearId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedZoneId != null) obj.zoneId = Number(selectedZoneId);
    if (selectedCampusId != null) obj.campusId = Number(selectedCampusId);
    if (issuedToId != null) {
    obj.issuedToEmpId = Number(issuedToId);  // Changed: Use issuedToEmpId to match BackendPatcher and validation
    obj.issuedToId = Number(issuedToId);     // Added: For compatibility with dgmFormDTO
  }
    return obj;
  }, [
    mobileNo,
    appNumberRange, // Ensure dependency includes appNumberRange
    selectedAcademicYearId,
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    isUpdate,
  ]);

  // Prepare dynamic options
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      cityName: cityNames,
      zoneName: zoneNames,
      campusName: campusesData.map(campusLabel).filter(Boolean),
      issuedTo: issuedToNames,
    }),
    [academicYearNames, cityNames, zoneNames, campusesData, issuedToNames]
  );

  return (
    <DistributeForm
      formType="DGM"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions} /* Pass dynamic options here */
      backendValues={backendValues}
      onValuesChange={handleValuesChange}
      isUpdate={isUpdate}
      editId={editId}
      skipAppNoPatch={isUpdate}
    />
  );
};

export default DgmForm;
