import React from "react";
import styles from "../zone-rate-container/ZoneRateContainer.module.css";
import DropRateZone from "../../../components/application-analytics/rate-zone-components/rated-zone-component/DropRateZone";
const ZoneRateContainer = () => {
  const dropRatedZones = [
    { name: "Zone Name 1", rate: 99 },
    { name: "Zone Name 2", rate: 80 },
    { name: "Zone Name 3", rate: 28 },
    { name: "Zone Name 4", rate: 24 }
  ];


   const TopRatedZones = [
    { name: "Zone Name 1", rate: 99 },
    { name: "Zone Name 2", rate: 80 },
    { name: "Zone Name 3", rate: 28 },
    { name: "Zone Name 4", rate: 24 }
  ];

  return (
    <div className={styles.zones_rates_container}>
      <div className={styles.drop_rate_zone_wrapper}>
        <DropRateZone
          title="Application Drop Rate Zone Wise"
          zoneData={dropRatedZones}
          progressBarClass={styles.progress_red}
        />
      </div>
      <div className={styles.top_dated_zone_wrapper}>
        <DropRateZone title="Top Dated Zones"  zoneData={TopRatedZones} progressBarClass={styles.progress_green}/>
      </div>
    </div>
  );
};

export default ZoneRateContainer;
