// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./ApplicationNavLinks.module.css";
// import { tabs } from "./links";

// const ApplicationNavLinks = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Function to handle tab click and navigation
//   const handleTabClick = (path) => {
//     navigate(path); // Navigate to the corresponding path
//   };

//   return (
//     <ul className={styles.all_nav_tabs}>
//       {tabs.map((tab) => {
//         const isActive = location.pathname.includes(tab.path); // Check if the tab is active
//         return (
//           <li
//             key={tab.label}
//             className={`${styles.nav_tabs} ${isActive ? styles.active_tab : ""}`}
//             onClick={() => handleTabClick(tab.path)} 
//           >
//             <a
//               // className={`${styles.tab} ${isActive ? styles.activeTabText : ""}`}
//             >
//               {tab.label}
//             </a>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// export default ApplicationNavLinks;




import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ApplicationNavLinks.module.css";
import { tabs } from "./links";

const ApplicationNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleTabClick = (path) => {
    
    navigate(`/scopes/application/${path}`);
  };

  return (
    <ul className={styles.all_nav_tabs}>
      {tabs.map((tab) => {
        const isActive = location.pathname.includes(tab.path);
        return (
          <li
            key={tab.label}
            className={`${styles.nav_tabs} ${isActive ? styles.active_tab : ""}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <a>{tab.label}</a>
          </li>
        );
      })}
    </ul>
  );
};

export default ApplicationNavLinks;

