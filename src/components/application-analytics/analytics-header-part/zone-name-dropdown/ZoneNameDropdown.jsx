// import { FormControl, MenuItem, Select } from "@mui/material";
// import { useState } from "react";
// import downArrow from "../../../../assets/application-analytics/down_arrow.png";
// import styles from "./ZoneNameDropdown.module.css";

// const ZoneNameDropdown = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedZone, setSelectedZone] = useState("");

//   const zones = [
//     { id: 1, zoneName: "zone1" },
//     { id: 2, zoneName: "zone2" },
//     { id: 3, zoneName: "zone3" },
//     { id: 4, zoneName: "zone4" },
//   ];

//   const handleToggle = (event) => {
//     event.stopPropagation(); 
//     setOpen((prev) => !prev);
//   };

//   const handleChange = (event) => {
//     setSelectedZone(event.target.value);
//   };

//   return (
//     <div id="zone_name_dropdown">
//       <label className={styles.dropdow_label_text}>Zone Name</label>
//       <FormControl fullWidth>
//         <Select
//           value={selectedZone}
//           onChange={handleChange}
//           open={open}
//           onClose={() => setOpen(false)}
//           onOpen={() => setOpen(true)}
//           displayEmpty
//           IconComponent={() => (
//             <figure
//               onClick={handleToggle}
//               className={styles.fig}
//             >
//               <img className={styles.down_arrow} src={downArrow} alt="toggle" />
//             </figure>
//           )}
//           sx={{
//             marginTop: 0.5,
//             borderRadius: 2,
//             height: 40,
//             fontSize: 14,
//             "& .MuiSelect-select": {
//               padding: "8px 14px",
//             },
//           }}
//           MenuProps={{
//             PaperProps: {
//               onMouseDown: (e) => e.stopPropagation(),
//             },
//           }}
//         >
//           <MenuItem disabled value="">
//             Select Zone
//           </MenuItem>
//           {zones.map((zone) => (
//             <MenuItem value={zone.zoneName} key={zone.id}>
//               {zone.zoneName}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// };

// export default ZoneNameDropdown;








import { FormControl, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import downArrow from "../../../../assets/application-analytics/down_arrow.png";
import styles from "./ZoneNameDropdown.module.css";
import {zones,dgms,campuses} from "./DropdownData"
const ZoneNameDropdown = ({ activeTab }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [dropdownData, setDropdownData] = useState([]);

  // 🔥 All data lists
  
  // 🔥 Update dropdown list whenever tab changes
  useEffect(() => {
    if (activeTab === "Zone") setDropdownData(zones);
    else if (activeTab === "DGM") setDropdownData(dgms);
    else if (activeTab === "Campus") setDropdownData(campuses);
    else setDropdownData([]);

    setSelectedValue(""); // reset selection on tab change
  }, [activeTab]);

  const handleToggle = (event) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div id="zone_name_dropdown">
      <label className={styles.dropdow_label_text}>
        {activeTab ? `${activeTab} Name` : "Select Category"}
      </label>

      <FormControl fullWidth>
        <Select
          value={selectedValue}
          onChange={handleChange}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          displayEmpty
          IconComponent={() => (
            <figure onClick={handleToggle} className={styles.fig}>
              <img className={styles.down_arrow} src={downArrow} alt="toggle" />
            </figure>
          )}
          sx={{
            marginTop: 0.5,
            borderRadius: 2,
            height: 39,
            fontSize: 14,
            "& .MuiSelect-select": {
              padding: "8px 14px",
            },
          }}
          MenuProps={{
            PaperProps: {
              onMouseDown: (e) => e.stopPropagation(),
            },
          }}
        >
          <MenuItem disabled value="">
            {`Select ${activeTab || "Option"}`}
          </MenuItem>

          {dropdownData.map((item) => (
            <MenuItem value={item.name} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ZoneNameDropdown;
