import { useLocation } from "react-router-dom";
import Button from "../../widgets/Button/Button";
import uparrow from "../../assets/application-distribution/uparrow";
import CampusTable from "./CampusComponent/CampusTable";
import DgmTable from "./DGMComponent/DgmTable";
import styles from "./DistributeTable.module.css";
import ZoneTable from "./ZoneComponent/ZoneTable";

const DistributeTable = () => {
  const { pathname } = useLocation(); // Get pathname from useLocation

  

  // Determine subtitle text based on path
  const getSubtitleText = () => {
    if (pathname.includes("zone")) {
      return "List of all the distributed application to Zone";
    } else if (pathname.includes("dgm")) {
      return "List of all the distributed application to DGM";
    } else if (pathname.includes("campus")) {
      return "List of all the distributed application to Campus";
    }
    return null; // Fallback
  };

  // Render the appropriate table based on path
  const renderTable = () => {
    if (pathname.includes("zone")) {
      return <ZoneTable />;
    } else if (pathname.includes("dgm")) {
      return <DgmTable />;
    } else if (pathname.includes("campus")) {
      return <CampusTable />;
    }
    return null; // Fallback if no matching path
  };



  return (
    <>
      <div className={styles.distribute_table_top}>
        <div className={styles.distribute_table_left}>
          <p className={styles.distribute_table_heading}>Distributed Applications</p>
          <p className={styles.distribute_table_sub}>{getSubtitleText()}</p>
        </div>
        <div className={styles.distribute_table_searchbox}>
          <Button buttonname={"Export"} variant={"primary"} type="button" lefticon={uparrow}/>
        </div>
      </div>
      {renderTable()}
    </>
  );
};

export default DistributeTable;