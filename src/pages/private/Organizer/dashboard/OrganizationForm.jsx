import { useState } from "react";

const governorates = ["Capital", "Northern", "Southern", "Muharraq", "Riffa"];

export default function OrganizationForm({
  initialData,
  onCancel,
  onSubmit,
  submitting,
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Organization name is required.";
    if (!formData.description.trim())
      next.description = "Description is required.";
    if (!formData.area.trim()) next.area = "Area is required.";
    if (!formData.address.trim()) next.address = "Address is required.";
    if (!formData.contactEmail.trim())
      next.contactEmail = "Contact email is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Organization name
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <span>{errors.name}</span>}
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span>{errors.description}</span>}
      </label>

      <p>Country: Bahrain</p>

      <label>
        Governorate
        <select
          name="governorate"
          value={formData.governorate}
          onChange={handleChange}
        >
          {governorates.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label>
        Area
        <input name="area" value={formData.area} onChange={handleChange} />
        {errors.area && <span>{errors.area}</span>}
      </label>

      <label>
        Organization address
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span>{errors.address}</span>}
      </label>

      <label>
        Contact email (required, public)
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
        />
        {errors.contactEmail && <span>{errors.contactEmail}</span>}
      </label>

      <label>
        Website (optional)
        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </label>

      <label>
        Phone (optional, public)
        <input
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
        />
      </label>

      <label>
        WhatsApp number (optional, public)
        <input
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
        />
      </label>

      <div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Save and submit for approval"}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
