import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";
import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useCampaignByCityId,
  useCampusbyCampaignId,
  useGetProsByCampus,
  useGetAcademicYears,
  useGetAppNumberRange,
  useGetMobileNo,
} from "../../../queries/application-distribution/dropdownqueries";

// Utility to normalize arrays
const asArray = (v) => (Array.isArray(v) ? v : []);

// Label and ID helpers for backend data shapes
const yearLabel = (y) =>
  y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;
const campaignDistrictLabel = (d) => d?.districtName ?? d?.name ?? "";
const campaignDistrictId = (d) => d?.districtId ?? d?.id ?? null;
const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;
const campaignAreaLabel = (cp) => cp?.name ?? null;
const campaignAreaId = (cp) => cp?.id ?? null;
const campusLabel = (cm) => cm?.name ?? null;
const campusId = (cm) => cm?.id ?? null;
const empLabel = (e) => e?.name ?? null;
const empId = (e) => e?.id ?? null;

const CampusForm = ({ initialValues = {}, onSubmit, setIsInsertClicked, isUpdate= false, editId }) => {
  // State for selected IDs
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedCampaignDistrictId, setSelectedCampaignDistrictId] =
    useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampaignAreaId, setSelectedCampaignAreaId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);

  // State for form initialization and academic year
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
  });

  // Ref to track seeding status
  const didSeedRef = useRef({ year: false });

  // API hooks for fetching dropdown data
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: campaignDistrictsRaw = [] } = useGetAllDistricts();
  const { data: citiesRaw = [] } = useGetCitiesByDistrict(
    selectedCampaignDistrictId
  );
  const { data: campaignAreasRaw = [] } = useCampaignByCityId(selectedCityId);
  const { data: campusesRaw = [] } = useCampusbyCampaignId(
    selectedCampaignAreaId
  );
  const { data: employeesRaw = [] } = useGetProsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);
  const {
    data: appNumberRange,
    error,
    isLoading,
  } = useGetAppNumberRange(selectedAcademicYearId, 4178);

  // Normalize arrays
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const campaignDistrictsData = useMemo(
    () => asArray(campaignDistrictsRaw),
    [campaignDistrictsRaw]
  );
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const campaignAreasData = useMemo(
    () => asArray(campaignAreasRaw),
    [campaignAreasRaw]
  );
  const campusesData = useMemo(() => asArray(campusesRaw), [campusesRaw]);
  const employeeData = useMemo(() => asArray(employeesRaw), [employeesRaw]);

  // Options for dropdowns
  const academicYearNames = useMemo(() => {
    const allowedYears = [
      "2025-26",
      "2024-25",
      "2023-24",
      "2022-23",
      "2021-22",
      "2020-21",
    ];
    const apiYears = yearsData.map(yearLabel).filter(Boolean);
    return allowedYears
      .filter((year) => apiYears.includes(year))
      .sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]));
  }, [yearsData]);

  const campaignDistrictNames = useMemo(
    () => campaignDistrictsData.map(campaignDistrictLabel).filter(Boolean),
    [campaignDistrictsData]
  );
  const cityNames = useMemo(
    () => citiesData.map(cityLabel).filter(Boolean),
    [citiesData]
  );
  const campaignAreaNames = useMemo(
    () => campaignAreasData.map(campaignAreaLabel).filter(Boolean),
    [campaignAreasData]
  );
  const campusNames = useMemo(
    () => campusesData.map(campusLabel).filter(Boolean),
    [campusesData]
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
  const campaignDistrictNameToId = useMemo(
    () =>
      new Map(
        campaignDistrictsData.map((d) => [
          campaignDistrictLabel(d),
          campaignDistrictId(d),
        ])
      ),
    [campaignDistrictsData]
  );
  const cityNameToId = useMemo(
    () => new Map(citiesData.map((c) => [cityLabel(c), cityId(c)])),
    [citiesData]
  );
  const campaignAreaNameToId = useMemo(
    () =>
      new Map(
        campaignAreasData.map((cp) => [
          campaignAreaLabel(cp),
          campaignAreaId(cp),
        ])
      ),
    [campaignAreasData]
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
      const { id, appFrom, appTo } = appNumberRange[0];
      setSeedInitialValues((prevValues) => ({
        ...prevValues,
        availableAppNoFrom: String(appFrom),
        availableAppNoTo: String(appTo),
        applicationNoFrom: String(appFrom),
        selectedBalanceTrackId: Number(id),
      }));
    }
  }, [appNumberRange, isUpdate]);

  // Handle form value changes and update dependent fields
  const handleValuesChange = (values) => {
    if (values.academicYear && academicYearNameToId.has(values.academicYear)) {
      const ayId = academicYearNameToId.get(values.academicYear);
      if (ayId !== selectedAcademicYearId) setSelectedAcademicYearId(ayId);
    }
    if (
      values.campaignDistrictName &&
      campaignDistrictNameToId.has(values.campaignDistrictName)
    ) {
      const newCampaignDistrictId = campaignDistrictNameToId.get(
        values.campaignDistrictName
      );
      if (newCampaignDistrictId !== selectedCampaignDistrictId) {
        setSelectedCampaignDistrictId(newCampaignDistrictId);
        setSelectedCityId(null); // Reset city when campaignDistrict changes
        setSelectedCampaignAreaId(null); // Reset campaign area when campaignDistrict changes
        setSelectedCampusId(null); // Reset campus when campaignDistrict changes
        setIssuedToId(null); // Reset employee when campaignDistrict changes
      }
    }
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const newCityId = cityNameToId.get(values.cityName);
      if (newCityId !== selectedCityId) {
        setSelectedCityId(newCityId);
        setSelectedCampaignAreaId(null); // Reset campaign area when city changes
        setSelectedCampusId(null); // Reset campus when city changes
        setIssuedToId(null); // Reset employee when city changes
      }
    }
    if (
      values.campaignAreaName &&
      campaignAreaNameToId.has(values.campaignAreaName)
    ) {
      const newCampaignAreaId = campaignAreaNameToId.get(
        values.campaignAreaName
      );
      if (newCampaignAreaId !== selectedCampaignAreaId) {
        setSelectedCampaignAreaId(newCampaignAreaId);
        setSelectedCampusId(null); // Reset campus when campaign area changes
        setIssuedToId(null); // Reset employee when campaign area changes
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

  // Prepare backend-only values
  const backendValues = useMemo(() => {
    const obj = {};
    if (mobileNo != null) obj.mobileNumber = String(mobileNo);
     if (appNumberRange?.length) {
    const { id, appFrom, appTo } = appNumberRange[0];
    obj.selectedBalanceTrackId = Number(id);        // ✅ always
    if (!isUpdate) {                                // insert-only UX fields
      obj.availableAppNoFrom = String(appFrom);
      obj.availableAppNoTo   = String(appTo);
      obj.applicationNoFrom  = String(appFrom);
    }
  }
    if (selectedAcademicYearId != null)
      obj.academicYearId = Number(selectedAcademicYearId);
    if (selectedCampaignDistrictId != null)
      obj.campaignDistrictId = Number(selectedCampaignDistrictId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedCampaignAreaId != null)
      obj.campaignAreaId = Number(selectedCampaignAreaId);
    if (selectedCampusId != null) obj.campusId = Number(selectedCampusId);
    if (issuedToId != null) {
      obj.issuedToEmpId = Number(issuedToId);
      obj.issuedToId = Number(issuedToId); // For compatibility with form DTO
    }
    return obj;
  }, [
    mobileNo,
    appNumberRange,
    selectedAcademicYearId,
    selectedCampaignDistrictId,
    selectedCityId,
    selectedCampaignAreaId,
    selectedCampusId,
    issuedToId,
  ]);

  // Prepare dynamic options for dropdowns
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      campaignDistrictName: campaignDistrictNames,
      cityName: cityNames,
      campaignAreaName: campaignAreaNames,
      campusName: campusNames,
      issuedTo: issuedToNames,
    }),
    [
      academicYearNames,
      campaignDistrictNames,
      cityNames,
      campaignAreaNames,
      campusNames,
      issuedToNames,
    ]
  );

  return (
    <DistributeForm
      formType="Campus"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      onValuesChange={handleValuesChange}
      isUpdate={isUpdate}
      editId={editId}
      skipAppNoPatch={isUpdate}
    />
  );
};

export default CampusForm;
