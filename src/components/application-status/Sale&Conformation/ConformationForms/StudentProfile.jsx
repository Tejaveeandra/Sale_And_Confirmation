import React, { useState } from 'react'; // Import useState
import { Formik } from 'formik';
import styles from './StudentProfile.module.css';
import ProfilePhoto from '../SaleForm/PersonalInfo/components/ProfilePhoto';
 
// Reusable component for each label-value pair
const InfoField = ({ label, value }) => (
  <div className={styles.infoField}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);
 
const StudentProfile = () => {
  const [isHovered, setIsHovered] = useState(false); // New state for hover

  return (
    <Formik
      initialValues={{
        profilePhoto: null
      }}
      onSubmit={(values) => {
        console.log('Profile form submitted:', values);
      }}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <div className={styles.profileContainer}>
     
      {/* Top section: Profile Pic + Personal Info */}
      <div className={styles.headerSection}>
        <ProfilePhoto touched={touched} errors={errors} viewOnly={true} />
 
        <div className={styles.personalInfo}>
        <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Personal Information</span>
    <div className={styles.dividerLine}></div>
  </div>
          <div className={`${styles.grid} ${styles.gridCols4}`}>
            <InfoField label="PRO Receipt No" value="0" />
            <InfoField label="First Name" value="First Name" />
            <InfoField label="Last Name" value="Last Name" />
            <InfoField label="Gender" value="Male" />
            <InfoField label="Aapar No" value="9828e77" />
            <InfoField label="Date of Birth" value="07-12-2004" />
            <InfoField label="Admission Referred by" value="Venkat Boppana" />
            <InfoField label="Quota" value="General" />
            <InfoField label="Aadhar Card No" value="8892 2898 6273" />
            <InfoField label="PRO Receipt No" value="6274528362yrts729" />
          </div>
        </div>
      </div>
{/* --- Parent Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Parent Information</span>
    <div className={styles.dividerLine}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols2}`}>
    <InfoField label="Father Name" value="Anil Londonker" />
    <InfoField label="Phone Number" value="+91-9876543210" />
  </div>
</div>
 
{/* --- Orientation Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Orientation Information</span>
    <div className={styles.dividerLine}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols4}`}>
    <InfoField label="Academic Year" value="A.Y 2025-2026" />
    <InfoField label="Branch" value="Jubilee Hills" />
    <InfoField label="Student Type" value="Day Scholar" />
    <InfoField label="Joining Class" value="Class 8" />
    <InfoField label="Orientation Name" value="Icon" />
    <InfoField label="City" value="Hyderabad" />
    <InfoField label="Branch Type" value="Jubilee Hills" />
    <InfoField label="Admission Type" value="Walk-in" />
  </div>
</div>
 
{/* --- Address Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.General_Info_Section_general_field_label}>Address Information</span>
    <div className={styles.General_Info_Section_general_line}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols4}`}>
    <InfoField label="Door No" value="12-345/A" />
    <InfoField label="Street" value="Road No 10" />
    <InfoField label="Landmark" value="Near Apollo Hospital" />
    <InfoField label="Area" value="Jubilee Hills" />
    <InfoField label="Pincode" value="500033" />
    <InfoField label="District" value="Hyderabad" />
    <InfoField label="Mandal" value="Shaikpet" />
    <InfoField label="City" value="Hyderabad" />
    <InfoField label="G-pin" value="XYZ1234" />
  </div>
  </div>
 
        </div>
      )}
    </Formik>
  );
};
 
export default StudentProfile;