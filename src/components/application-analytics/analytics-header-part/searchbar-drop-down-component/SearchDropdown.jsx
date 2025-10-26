// import { useEffect, useMemo, useState } from "react";
// import ZoneNameDropdown from "../zone-name-dropdown/ZoneNameDropdown";
// import styles from "./SearchDropdown.module.css";


// const SearchDropdown = ({ userRole = "CEO", onTabChange }) => {
//   // Master order (for consistent rendering)
//   const TAB_ORDER = ["Zone", "DGM", "Campus"];

//   // Visibility rules per role
//   const allowedTabsByRole = {
//     CEO:["Zone", "DGM","Campus"],
//     Zone: ["DGM","Campus"],
//     DGM: [ "Campus"],
//     Campus: [],
//   };

//   // Compute visible tabs for the current role
//   const visibleTabs = useMemo(
//     () => allowedTabsByRole[userRole] ?? [],
//     [userRole]
//   );

//   // Active tab defaults to the first allowed tab
//   const [activeTab, setActiveTab] = useState(visibleTabs[0]);

//   // If role changes, reset the active tab to a valid one
//   useEffect(() => {
//     if (!visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//       onTabChange?.(visibleTabs[0]);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userRole, visibleTabs]);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     onTabChange?.(tab); // parent can fetch analytics for this tab
//   };

//   return (
//     <div
//       id="search_dropdown_wrapper"
//       className={styles.search_dropdown_wrapper}
//     >
//       <label className={styles.dropdown_header}>Filter Category</label>

//       <ul
//         className={styles.all_tabs}
//         role="tablist"
//         aria-label="Filter Category"
//       >
//         {TAB_ORDER.filter((t) => visibleTabs.includes(t)).map((tab) => (
//           <li
//             key={tab}
//             role="tab"
//             aria-selected={activeTab === tab}
//             tabIndex={0}
//             className={`${styles.tabs_dropdown} ${
//               activeTab === tab ? styles.active_tab : ""
//             }`}
//             onClick={() => handleTabClick(tab)}
//             onKeyDown={(e) =>
//               (e.key === "Enter" || e.key === " ") && handleTabClick(tab)
//             }
//           >
//             <a
//               className={`${styles.tab_dropdown} ${
//                 activeTab === tab ? styles.active_tab : ""
//               }`}
//             >
//               {tab}
//             </a>
//           </li>
//         ))}
//       </ul>

//       <ZoneNameDropdown />
//     </div>
//   );
// };

// export default SearchDropdown;









import { useEffect, useMemo, useState } from "react";
import ZoneNameDropdown from "../zone-name-dropdown/ZoneNameDropdown";
import styles from "./SearchDropdown.module.css";

const SearchDropdown = ({ userRole = "CEO", onTabChange }) => {
  const TAB_ORDER = ["Zone", "DGM", "Campus"];

  const allowedTabsByRole = {
    CEO: ["Zone", "DGM", "Campus"],
    Zone: ["DGM", "Campus"],
    DGM: ["Campus"],
    Campus: [],
  };

  const visibleTabs = useMemo(
    () => allowedTabsByRole[userRole] ?? [],
    [userRole]
  );

  const [activeTab, setActiveTab] = useState(visibleTabs[0]);

  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
      onTabChange?.(visibleTabs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, visibleTabs]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div
      id="search_dropdown_wrapper"
      className={styles.search_dropdown_wrapper}
    >
      <label className={styles.dropdown_header}>Filter Category</label>

      <ul
        className={styles.all_tabs}
        role="tablist"
        aria-label="Filter Category"
      >
        {TAB_ORDER.filter((t) => visibleTabs.includes(t)).map((tab) => (
          <li
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={0}
            className={`${styles.tabs_dropdown} ${
              activeTab === tab ? styles.active_tab : ""
            }`}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleTabClick(tab)
            }
          >
            <a
              className={`${styles.tab_dropdown} ${
                activeTab === tab ? styles.active_tab : ""
              }`}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>

      {/* 🔥 Pass the activeTab as prop */}
      <ZoneNameDropdown activeTab={activeTab} />
    </div>
  );
};

export default SearchDropdown;
