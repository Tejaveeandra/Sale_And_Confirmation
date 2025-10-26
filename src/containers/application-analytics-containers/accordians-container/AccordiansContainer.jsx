import React, { useState } from "react";
import styles from "./AccordiansContainer.module.css";
import Accordian from "../../../widgets/accordian-component/Accordian";

const AccordiansContainer = () => {
  const [userRole, setUserRole] = useState("CEO");

  const accordianData = [
    {
      title: "Zone wise graph",
      graphData: [
        { label: "Issued", percent: 16 },
        { label: "Sold", percent: -12 },
      ],
      graphBarData: [
        { year: "2018-2019", issued: 60, sold: 30},
        { year: "2019-2020", issued: 100, sold: 70 },
        { year: "2021-2022", issued: 90, sold: 30 },
        { year: "2023-2024", issued: 100, sold: 60 },
      ],
    },
    {
      title: "DGM wise graph",
      graphData: [
        { label: "Issued", percent: 16 },
        { label: "Sold", percent: -12 },
      ],
      graphBarData: [
        { year: "2018-2019", issued: 60, sold: 50 },
        { year: "2019-2020", issued: 100, sold: 70 },
        { year: "2021-2022", issued: 80, sold: 30 },
        { year: "2023-2024", issued: 100, sold: 60 },
      ],
    },
    {
      title: "Campus wise graph",
      graphData: [
        { label: "Issued", percent: 16 },
        { label: "Sold", percent: -12 },
      ],
      graphBarData: [
        { year: "2018-2019", issued: 60, sold: 100 },
        { year: "2019-2020", issued: 100, sold: 70 },
        { year: "2021-2022", issued: 100, sold: 30 },
        { year: "2023-2024", issued: 100, sold: 60 },
      ],
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleChange = (index) => (_event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  const getVisibleAccordions = (data) => {
    return data.filter((accordion) => {
      if (userRole === "CEO") {
        return (
          accordion.title.includes("Zone") ||
          accordion.title.includes("DGM") ||
          accordion.title.includes("Campus")
        );
      } else if (userRole === "Zone") {
        return (
          accordion.title.includes("DGM") || accordion.title.includes("Campus")
        );
      } else if (userRole === "DGM") {
        return accordion.title.includes("Campus");
      } else if (userRole === "Campus") {
        return false;
      }
      return false;
    });
  };

  const visibleAccordions = getVisibleAccordions(accordianData);

  return (
    <div id="accordian_wrapper" className={styles.accordian_wrapper}>
      {visibleAccordions.map((item, index) => (
        <Accordian
          key={index}
          zoneTitle={item.title}
          percentageItems={item.graphData}
          graphBarData={item.graphBarData}
          expanded={expandedIndex === index}
          onChange={handleChange(index)}
        />
      ))}
    </div>
  );
};

export default AccordiansContainer;
