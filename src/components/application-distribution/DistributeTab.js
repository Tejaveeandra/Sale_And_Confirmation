// import React, { useState, useEffect } from "react";
// import styles from "./DistributeTab.module.css";
// import {
//   NavLink,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import applicationnavtabsicon from "../../assets/application-distribution/applicationnavtabsicon";
// import ZoneForm from "./ZoneComponent/ZoneForm";
// import DgmForm from "./DGMComponent/DgmForm";
// import CampusForm from "./CampusComponent/CampusForm";
// import DistributeTable from "./DistributeTable";
// import Button from "../../widgets/Button/Button";
// import plusicon from "../../assets/application-distribution/plusicon";
// import AccordiansContainer from "../../containers/application-analytics-containers/accordians-container/AccordiansContainer";
// import headerIon from "../../assets/application-analytics/accordians_header.png";

// const DistributeTab = () => {
//   const [isInsertClicked, setIsInsertClicked] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setIsInsertClicked(false);
//   }, [location.pathname]);

//   const distributeNavTabs = [
//     { label: "Zone", path: "scopes/application/distribute/zone" },
//     { label: "DGM", path: "scopes/application/distribute/dgm" },
//     { label: "Campus", path: "scopes/application/distribute/campus" },
//   ];
//   const buttonName = () => {
//     if (location.pathname.includes("scopes/application/distribute/zone")) {
//       return "Distribute New to Zone";
//     }
//     if (location.pathname.includes("scopes/application/distribute/zone")) {
//       return "Distribute New to DGM";
//     }
//     if (location.pathname.includes("scopes/application/distribute/zone")) {
//       return "Distribute New to Campus";
//     }
//     return "Distribute New to Zone";
//   };

//   const handleDistributeButton = () => {
//     setIsInsertClicked(false);
//   };

//   return (
//     <>
//       {isInsertClicked && (
//         <div className={styles.distribute_button}>
//           <Button
//             buttonname={buttonName()}
//             type={"button"}
//             lefticon={plusicon}
//             onClick={handleDistributeButton}
//             margin={"0"}
//             variant="primary"
//           />
//         </div>
//       )}
//       {!isInsertClicked && (
//         <div className={styles.distribute_tab_form_graph}>
//           <div className={styles.distribute_tab_form}>
//             <div className={styles.distribute_tab_top}>
//               <div className={styles.distribute_tab_top_left}>
//                 {applicationnavtabsicon}
//                 <div className={styles.distribute_content_heading}>
//                   <p className={styles.heading}>Distribute Applications</p>
//                   <p className={styles.sub}>
//                     Distribute Applications to all Zones, DGM, and Campuses
//                   </p>
//                 </div>
//               </div>
//               <nav className={styles.nav}>
//                 <ul className={styles.nav_bar}>
//                   {distributeNavTabs.map((tab) => (
//                     <li key={tab.path} className={styles.nav_list}>
//                       <NavLink
//                         to={tab.path}
//                         className={({ isActive }) =>
//                           `${styles.nav_link} ${isActive ? styles.active : ""}`
//                         }
//                       >
//                         {tab.label}
//                       </NavLink>
//                     </li>
//                   ))}
//                 </ul>
//               </nav>
//             </div>
//             <div className={styles.distribute_nav_content}>
//               <Routes>
//                 <Route path="" element={<Navigate to="zone" replace />} />
//                 <Route
//                   path="scopes/application/distribute/zone"
//                   element={<ZoneForm setIsInsertClicked={setIsInsertClicked} />}
//                 />
//                 <Route
//                   path="scopes/application/distribute/zone"
//                   element={<DgmForm setIsInsertClicked={setIsInsertClicked} />}
//                 />
//                 <Route
//                   path="scopes/application/distribute/zone"
//                   element={
//                     <CampusForm setIsInsertClicked={setIsInsertClicked} />
//                   }
//                 />
//               </Routes>
//             </div>
//           </div>
//           <div className={styles.prev_years_graphs_section}>
//             <div className={styles.accordian_header_text}>
//               <figure>
//                 <img src={headerIon} className={styles.icon} />
//               </figure>
//               <h6 className={styles.header_text}>Previous Year Graph</h6>
//             </div>
//             <AccordiansContainer />
//           </div>
//         </div>
//       )}
//       <div className={styles.distribute_tab_table}>
//         <DistributeTable />
//       </div>
//     </>
//   );
// };

// export default DistributeTab;






import React, { useState, useEffect } from "react";
import styles from "./DistributeTab.module.css";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import applicationnavtabsicon from "../../assets/application-distribution/applicationnavtabsicon";
import ZoneForm from "./ZoneComponent/ZoneForm";
import DgmForm from "./DGMComponent/DgmForm";
import CampusForm from "./CampusComponent/CampusForm";
import DistributeTable from "./DistributeTable";
import Button from "../../widgets/Button/Button";
import plusicon from "../../assets/application-distribution/plusicon";
import AccordiansContainer from "../../containers/application-analytics-containers/accordians-container/AccordiansContainer";
import headerIon from "../../assets/application-analytics/accordians_header.png";

const DistributeTab = () => {
  const [isInsertClicked, setIsInsertClicked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsInsertClicked(false);
  }, [location.pathname]);

  // ✅ Absolute paths for NavLink
  const distributeNavTabs = [
    { label: "Zone", path: "/scopes/application/distribute/zone" },
    { label: "DGM", path: "/scopes/application/distribute/dgm" },
    { label: "Campus", path: "/scopes/application/distribute/campus" },
  ];

  const buttonName = () => {
    if (location.pathname.includes("/distribute/zone")) {
      return "Distribute New to Zone";
    }
    if (location.pathname.includes("/distribute/dgm")) {
      return "Distribute New to DGM";
    }
    if (location.pathname.includes("/distribute/campus")) {
      return "Distribute New to Campus";
    }
    return "Distribute New to Zone";
  };

  const handleDistributeButton = () => {
    setIsInsertClicked(false);
  };

  return (
    <>
      {isInsertClicked && (
        <div className={styles.distribute_button}>
          <Button
            buttonname={buttonName()}
            type={"button"}
            lefticon={plusicon}
            onClick={handleDistributeButton}
            margin={"0"}
            variant="primary"
          />
        </div>
      )}

      {!isInsertClicked && (
        <div className={styles.distribute_tab_form_graph}>
          <div className={styles.distribute_tab_form}>
            <div className={styles.distribute_tab_top}>
              <div className={styles.distribute_tab_top_left}>
                {applicationnavtabsicon}
                <div className={styles.distribute_content_heading}>
                  <p className={styles.heading}>Distribute Applications</p>
                  <p className={styles.sub}>
                    Distribute Applications to all Zones, DGM, and Campuses
                  </p>
                </div>
              </div>

              {/* ✅ NavLinks with absolute paths */}
              <nav className={styles.nav}>
                <ul className={styles.nav_bar}>
                  {distributeNavTabs.map((tab) => (
                    <li key={tab.path} className={styles.nav_list}>
                      <NavLink
                        to={tab.path}
                        className={({ isActive }) =>
                          `${styles.nav_link} ${isActive ? styles.active : ""}`
                        }
                      >
                        {tab.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ✅ Routes with relative paths */}
            <div className={styles.distribute_nav_content}>
              <Routes>
                <Route index element={<Navigate to="zone" replace />} />
                <Route
                  path="zone"
                  element={<ZoneForm setIsInsertClicked={setIsInsertClicked} />}
                />
                <Route
                  path="dgm"
                  element={<DgmForm setIsInsertClicked={setIsInsertClicked} />}
                />
                <Route
                  path="campus"
                  element={<CampusForm setIsInsertClicked={setIsInsertClicked} />}
                />
              </Routes>
            </div>
          </div>

          <div className={styles.prev_years_graphs_section}>
            <div className={styles.accordian_header_text}>
              <figure>
                <img src={headerIon} className={styles.icon} alt="header" />
              </figure>
              <h6 className={styles.header_text}>Previous Year Graph</h6>
            </div>
            <AccordiansContainer />
          </div>
        </div>
      )}

      <div className={styles.distribute_tab_table}>
        <DistributeTable />
      </div>
    </>
  );
};

export default DistributeTab;
