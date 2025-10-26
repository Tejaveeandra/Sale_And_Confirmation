
import React, { useState, useEffect } from "react";
import ApplicationSearchHeader from "../../../components/application-analytics/application-search-components/application-search-header-component/ApplicationSearchHeader";
import ApplicationSearchBar from "../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchCards from "../../../components/application-status/ApplicationComponent/SearchComponent/SearchCards";
import styles from "../application-search-container/ApplicationSearchContainer.module.css";

const ApplicationSearchContainer = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Sample data
  const data = [
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "B456", displayStatus: "Damaged", campus: "Campus B", zone: "Zone 2" },
    { applicationNo: "C789", displayStatus: "Confirmed", campus: "Campus C", zone: "Zone 3" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
    { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },

  ];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) =>
        String(item.applicationNo ?? "").toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search]);

  return (
    <>
      <div id="application_search_container" className={styles.application_search_container}>
        <ApplicationSearchHeader />
        <ApplicationSearchBar
          placeholderText="Search for Application"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Popup cards: outside the container */}
      {search.trim() !== "" && filteredData.length > 0 && (
        <div
          className={styles.search_list_container}
        >
          <SearchCards
            data={filteredData}
            maxResults={5}
            onCardClick={(item) => console.log("Card clicked:", item)}
          />
        </div>
      )}
    </>
  );
};

export default ApplicationSearchContainer;




