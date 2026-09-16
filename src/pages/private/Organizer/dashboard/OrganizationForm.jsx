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
    <form onSubmit={handleSubmit}>
      <p>{tError(message)}</p>
      <label>
          {t("Organization name")}
          <input required dir="auto" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
          {t("Description")}
          <textarea required dir="auto" name="description" value={formData.description} onChange={handleChange} />
      </label>
      <p>{t("Country: Bahrain")}</p>
      <label>
          {t("Governorate")}
          <select name="governorate" value={formData.governorate} onChange={handleChange}>
          {governorates.map((governorate) => (
            <option key={governorate} value={governorate}>{t(governorate)}</option>
          ))}
        </select>
      </label>
      <label>
          {t("Area")}
          <input required dir="auto" name="area" value={formData.area} onChange={handleChange} />
      </label>
      <label>
          {t("Address")}
          <input required dir="auto" name="address" value={formData.address} onChange={handleChange} />
      </label>
      <label>
          {t("Public email")}
          <input required type="email" dir="ltr" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
      </label>
      <label>
          {t("Public phone (optional)")}
          <input type="tel" dir="ltr" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
      </label>
      <label>
          {t("Public WhatsApp number (optional)")}
          <input type="tel" dir="ltr" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
      </label>
      <label>
          {t("Website (optional)")}
          <input type="url" dir="ltr" name="website" value={formData.website} onChange={handleChange} />
      </label>
      <MapPicker latitude={formData.latitude} longitude={formData.longitude} onChange={({ latitude, longitude }) => setFormData({ ...formData, latitude, longitude })} />
      <ImagePicker label={t("Organization logo")} url={formData.logo} onFileChange={setFile} onRemove={handleRemoveImage} />
      <p>{t("Saving submits your organization for review.")}</p>
      <button disabled={submitting} type="submit">{t(submitting ? "Saving..." : "Save and submit")}</button>
      <button disabled={submitting} type="button" onClick={onCancel}>{t("Cancel")}</button>
    </form>
  );
};

export default OrganizationForm;
