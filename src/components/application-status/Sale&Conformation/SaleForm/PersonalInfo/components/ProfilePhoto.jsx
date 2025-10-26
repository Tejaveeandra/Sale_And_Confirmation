import { useState } from "react";
import { Field } from "formik";
import { ReactComponent as UploadIcon } from "../../../../../../assets/application-status/Upload.svg";
import FormError from "./FormError";
import styles from "./ProfilePhoto.module.css";

const ProfilePhoto = ({ touched, errors, viewOnly = false }) => {
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  return (
    <div className={styles.profile_photo_form_field}>
        <div className={styles.profile_photo_upload_container}>
          {viewOnly ? (
            // View-only mode - just display the photo
            <div className={styles.profile_photo_upload_circle}>
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Profile Preview" className={styles.profile_photo_preview_image} />
              ) : (
                <div className={styles.profile_photo_placeholder}>
                  <span className={styles.profile_photo_upload_text}>No photo uploaded</span>
                </div>
              )}
            </div>
          ) : (
            // Edit mode - with upload functionality
            <label htmlFor="profilePhoto-input" className={styles.profile_photo_label}>
              <div className={styles.profile_photo_upload_circle}>
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} alt="Profile Preview" className={styles.profile_photo_preview_image} />
                ) : (
                  <>
                    <figure className={styles.profile_photo_upload_icon_figure}>
                      <UploadIcon className={styles.profile_photo_upload_svg} />
                    </figure>
                    <span className={styles.profile_photo_upload_text}>Upload image of student</span>
                  </>
                )}
              </div>
            </label>
          )}
          {!viewOnly && (
            <>
              <Field name="profilePhoto">
                {({ field, form }) => (
                  <input
                    id="profilePhoto-input"
                    name="profilePhoto"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      form.setFieldValue("profilePhoto", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setProfilePhotoPreview(e.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                    required
                  />
                )}
              </Field>
              <FormError
                name="profilePhoto"
                touched={touched}
                errors={errors}
                className={styles.profile_photo_error}
              />
            </>
          )}
        </div>
      </div>
  );
};

export default ProfilePhoto;
