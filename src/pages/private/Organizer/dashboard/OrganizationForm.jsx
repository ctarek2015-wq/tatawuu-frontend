import { useState } from "react";
import ImagePicker from "../../../../components/ImagePicker/ImagePicker.jsx";
import { governorates } from "../../../../utils/options.js";
import * as uploadService from "../../../../services/uploadService.js";

const OrganizationForm = ({ organization, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    description: organization?.description || "",
    governorate: organization?.governorate || governorates[0],
    area: organization?.area || "",
    address: organization?.address || "",
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
      <p>{message}</p>
      <label>
        Organization name
        <input required name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea required name="description" value={formData.description} onChange={handleChange} />
      </label>
      <p>Country: Bahrain</p>
      <label>
        Governorate
        <select name="governorate" value={formData.governorate} onChange={handleChange}>
          {governorates.map((governorate) => (
            <option key={governorate} value={governorate}>{governorate}</option>
          ))}
        </select>
      </label>
      <label>
        Area
        <input required name="area" value={formData.area} onChange={handleChange} />
      </label>
      <label>
        Address
        <input required name="address" value={formData.address} onChange={handleChange} />
      </label>
      <label>
        Public email
        <input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
      </label>
      <label>
        Public phone (optional)
        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
      </label>
      <label>
        Public WhatsApp number (optional)
        <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
      </label>
      <label>
        Website (optional)
        <input type="url" name="website" value={formData.website} onChange={handleChange} />
      </label>
      <ImagePicker label="Organization logo" url={formData.logo} onFileChange={setFile} onRemove={handleRemoveImage} />
      <p>Saving submits your organization for review.</p>
      <button disabled={submitting} type="submit">{submitting ? "Saving..." : "Save and submit"}</button>
      <button disabled={submitting} type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default OrganizationForm;
