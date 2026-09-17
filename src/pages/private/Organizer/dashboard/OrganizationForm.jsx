import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useState } from "react";
import MapPicker from "../../../../components/MapPicker/MapPicker.jsx";
import ImagePicker from "../../../../components/ImagePicker/ImagePicker.jsx";
import { governorates } from "../../../../utils/options.js";
import * as uploadService from "../../../../services/uploadService.js";

const OrganizationForm = ({ organization, onSubmit, onCancel }) => {
  const { t, tError } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    description: organization?.description || "",
    governorate: organization?.governorate || governorates[0],
    area: organization?.area || "",
    address: organization?.address || "",
    latitude: organization?.latitude ?? null,
    longitude: organization?.longitude ?? null,
    contactEmail: organization?.contactEmail || "",
    contactPhone: organization?.contactPhone || "",
    whatsappNumber: organization?.whatsappNumber || "",
    website: organization?.website || "",
    logo: organization?.logo || "",
    logoPublicId: organization?.logoPublicId || "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormData({ ...formData, logo: "", logoPublicId: "" });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const data = { ...formData };
      if (file) {
        const image = await uploadService.upload(file);
        data.logo = image.url;
        data.logoPublicId = image.publicId;
      }
      await onSubmit(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="org-form-page">
      <div className="org-form-card">
        <form className="org-form" onSubmit={handleSubmit}>
          {message && (
            <p className="state-msg state-error" role="alert">
              {tError(message)}
            </p>
          )}

          <div className="org-form-section">
            <h2 className="org-form-section-title">{t("Basic information")}</h2>
            <div className="org-form-grid">
              <label className="field field-span-2">
                <span className="field-label">{t("Organization name")}</span>
                <input
                  required
                  dir="auto"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label className="field field-span-2">
                <span className="field-label">{t("Description")}</span>
                <textarea
                  required
                  dir="auto"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="org-form-section">
            <h2 className="org-form-section-title">{t("Location")}</h2>
            <p className="org-form-note">{t("Country: Bahrain")}</p>
            <div className="org-form-grid">
              <label className="field">
                <span className="field-label">{t("Governorate")}</span>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                >
                  {governorates.map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {t(governorate)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">{t("Area")}</span>
                <input
                  required
                  dir="auto"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                />
              </label>

              <label className="field field-span-2">
                <span className="field-label">{t("Address")}</span>
                <input
                  required
                  dir="auto"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </label>

              <div className="field field-span-2 map-field">
                <MapPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={({ latitude, longitude }) =>
                    setFormData({ ...formData, latitude, longitude })
                  }
                />
              </div>
            </div>
          </div>

          <div className="org-form-section">
            <h2 className="org-form-section-title">{t("Contact")}</h2>
            <div className="org-form-grid">
              <label className="field">
                <span className="field-label">{t("Public email")}</span>
                <input
                  required
                  type="email"
                  dir="ltr"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span className="field-label">
                  {t("Public phone (optional)")}
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span className="field-label">
                  {t("Public WhatsApp number (optional)")}
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span className="field-label">{t("Website (optional)")}</span>
                <input
                  type="url"
                  dir="ltr"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="org-form-section">
            <h2 className="org-form-section-title">{t("Organization logo")}</h2>
            <div className="logo-field">
              <ImagePicker
                label={t("Organization logo")}
                url={formData.logo}
                onFileChange={setFile}
                onRemove={handleRemoveImage}
              />
            </div>
          </div>

          <p className="org-form-note org-form-disclaimer">
            {t("Saving submits your organization for review.")}
          </p>

          <div className="org-form-actions">
            <button
              className="btn-primary-dark"
              disabled={submitting}
              type="submit"
            >
              {t(submitting ? "Saving..." : "Save and submit")}
            </button>
            <button
              className="btn-soft"
              disabled={submitting}
              type="button"
              onClick={onCancel}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;
