import * as Yup from "yup";

// Validation schema
export const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  surname: Yup.string().required("Surname is required"),
  gender: Yup.string().required("Gender is required"),
  aaparNo: Yup.string().required("Aapar No is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  aadharCardNo: Yup.string().required("Aadhar Card No is required"),
  proReceiptNo: Yup.string().required("PRO Receipt No is required"),
  admissionReferredBy: Yup.string().required("Admission Referred By is required"),
  quota: Yup.string().required("Quota is required"),
  fatherName: Yup.string().required("Father Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  profilePhoto: Yup.mixed().required("Profile photo is required")
});
