import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import InputBox from "../../../widgets/Inputbox/FormInputBox";
import LoginButton from "../../../widgets/Button/LoginButton";
import Checkbox from "../../../widgets/Checkbox/Checkbox";
import loginValidationSchema from "../loginValidationSchema";
import { NavLink, useNavigate } from "react-router-dom";
import { encryptAndManipulate } from "../encryptPassword";
import { loginSubmit, getScreenPermissions2 } from "../../../queries/loginquery";
import PasswordInputBox from "../../../widgets/Inputbox/PasswordInputBox";
const LoginForm = () => {
  const navigate = useNavigate();
  const loginInitialValues = {
    emailId: "",
    password: "",
  };
 
  const [serverErrors, setServerErrors] = useState({
    emailId: null,
    password: null,
    general: null,
  });
 
  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      const { emailId, password } = values;
      console.log("[Login] values →", values);
 
      const encryptedPassword = encryptAndManipulate(password, 1);
      const payload = { emailId, password: encryptedPassword };
      console.log("[Login] payload →", payload);
 
      // NOTE: Axios returns { data, status, ... }, fetch wrapper may return body directly.
      const res = await loginSubmit(payload);
      const resp = res?.data ?? res; // ← normalize
 
      // --- failure → field mapping (by backend reason) ---
      const ERROR_MAP = {
        "Password Incorrect": (prev) => ({
          ...prev,
          emailId: null,
          password: "Incorrect password",
          general: null,
        }),
        "User is not active": (prev) => ({
          ...prev,
          emailId: "User is not active",
          password: null,
          general: null,
        }),
        "Email is not existed": (prev) => ({
          ...prev,
          emailId: "Email does not exist",
          password: "Invalid credentials",
          general: null,
        }),
      };
 
      // --- success path ---
      if (resp && (resp.isLoginSuccess || resp.loginSuccess)) {
        console.log("[Login] success branch hit");
        
        // === COMPLETE BACKEND RESPONSE DEBUG ===
        console.log("=== COMPLETE BACKEND LOGIN RESPONSE ===");
        console.log("Full backend response object:", resp);
        console.log("Backend response type:", typeof resp);
        console.log("Backend response keys:", Object.keys(resp));
        console.log("Backend response structure:", JSON.stringify(resp, null, 2));
        console.log("=== END COMPLETE BACKEND RESPONSE ===");
        
        // === EMPLOYEE DETAILS DEBUG ===
        console.log("=== EMPLOYEE DETAILS FROM BACKEND ===");
        console.log("Employee Name:", resp?.empName);
        console.log("Employee ID:", resp?.empId);
        console.log("Designation:", resp?.designation);
        console.log("Role:", resp?.role);
        console.log("Employee Role:", resp?.empRole);
        console.log("User Type:", resp?.userType);
        console.log("Institution Type:", resp?.institutionType);
        console.log("Type:", resp?.type);
        console.log("All employee fields:", {
          empName: resp?.empName,
          empId: resp?.empId,
          designation: resp?.designation,
          role: resp?.role,
          empRole: resp?.empRole,
          userType: resp?.userType,
          institutionType: resp?.institutionType,
          type: resp?.type
        });
        console.log("=== END EMPLOYEE DETAILS ===");
        
        const accessToken = resp?.jwt?.accessToken;
        const exp = resp?.jwt?.expiresAtEpochSeconds;
        const type = resp?.jwt?.tokenType;
 
        if (accessToken) {
          // ⚠️ CRITICAL CHANGE: Save the token BEFORE making the next API call
          localStorage.setItem("authToken", accessToken);
          if (exp != null) localStorage.setItem("authTokenExp", String(exp));
          if (type) localStorage.setItem("authTokenType", type);
 
          // Call the simple function that relies on the interceptor
          console.log("Permissions method is called");
          const response = await getScreenPermissions2(accessToken, type);
           console.log("Screen Permissions: ", response);         // #########################################################
        } else {
          console.warn("[Login] jwt.accessToken missing in response");
        }
 
        // === STORING EMPLOYEE DATA IN LOCALSTORAGE ===
        console.log("=== STORING EMPLOYEE DATA IN LOCALSTORAGE ===");
        
        if (resp?.empName) {
          localStorage.setItem("empName", resp.empName);
          console.log("Stored empName:", resp.empName);
        }
        if (resp?.empId != null) {
          localStorage.setItem("empId", String(resp.empId));
          console.log("Stored empId:", resp.empId);
        }
        if (resp?.designation) {
          localStorage.setItem("designation", resp.designation);
          console.log("Stored designation:", resp.designation);
        }
        if (resp?.role) {
          localStorage.setItem("designation", resp.role); // Store role as designation
          console.log("Stored role as designation:", resp.role);
        }
        if (resp?.empRole) {
          localStorage.setItem("designation", resp.empRole); // Store empRole as designation
          console.log("Stored empRole as designation:", resp.empRole);
        }
        if (resp?.category) {
          localStorage.setItem("category", resp.category);
          console.log("Stored category:", resp.category);
        } else {
          console.log("Category not found in response:", resp?.category);
        }
        if (resp?.campusName) {
          localStorage.setItem("campusName", resp.campusName);
          console.log("Stored campusName:", resp.campusName);
        }
        
        console.log("=== END STORING EMPLOYEE DATA ===");
        
        console.log("[Login] navigating to /scopes");
        navigate("/scopes");
        return;
      }
      // ...
 
      // --- failure path ---
      const reason = resp?.reason || "Login failed. Please try again.";
      console.log("[Login] failure reason →", reason);
 
      const updater = ERROR_MAP[reason];
      if (updater) {
        // functional update so we don't freeze state with a plain object
        setServerErrors((prev) => updater(prev));
      } else {
        setServerErrors((prev) => ({
          ...prev,
          emailId: null,
          password: null,
          general: reason,
        }));
      }
    } catch (err) {
      console.error("[Login] exception →", err);
      setServerErrors((prev) => ({
        ...prev,
        emailId: null,
        password: null,
        general: "Something went wrong. Try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <Formik
      initialValues={loginInitialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleLoginSubmit}
      validateOnBlur={true}
      validateOnChange={false}
    >
      {({ isSubmitting, values, errors, touched }) => {
        const isEmailValid =
          values.emailId && !errors.emailId && touched.emailId;
        const isPasswordValid =
          values.password && !errors.password && touched.password;
        const isEmailTouchedWithInput =
          touched.emailId && values.emailId?.length > 0;
        const isPasswordTouchedWithInput =
          touched.password && values.password?.length > 0;
        const isFormValid =
          (isEmailValid && isPasswordTouchedWithInput) ||
          (isPasswordValid && isEmailTouchedWithInput);
        return (
          <Form className={styles.loginpageform}>
            <div className={styles.login_form_fields}>
              {/* Email (keeps InputBox) */}
              <Field
                name="emailId"
                type="email"
                placeholder="Enter Email Id"
                label="Email Id"
                component={InputBox}
              />
              <ErrorMessage
                name="emailId"
                component="div"
                className={styles.error}
              />
              {serverErrors.emailId && (
                <div className={styles.error}>{serverErrors.emailId}</div>
              )}
              {/* Password using PasswordInputBox */}
              <Field name="password">
                {({ field, meta }) => (
                  <>
                    <PasswordInputBox
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Enter Password"
                      isInputBoxTouched={meta.touched}
                      error={
                        meta.touched && (!!meta.error || serverErrors.password)
                      }
                      success={
                        meta.touched && !meta.error && !serverErrors.password
                      }
                    />
                  </>
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
              {serverErrors.password && (
                <div className={styles.error}>{serverErrors.password}</div>
              )}
            </div>
            <div className={styles.login_remember_reset}>
              <Checkbox name="rememberme" label="Remember Me" />
              <NavLink className={styles.resetRoute} to="/login/emailrequest">
                Reset Password
              </NavLink>
            </div>
            {serverErrors.general && (
              <div className={styles.login_result}>{serverErrors.general}</div>
            )}
            <LoginButton
              buttonName="Login"
              initialStage={!isFormValid && !isSubmitting}
              loadingStage={isSubmitting}
              proceedStage={isFormValid && !isSubmitting || (values.password?.length > 0)}
            />
          </Form>
        );
      }}
    </Formik>
  );
};
export default LoginForm;