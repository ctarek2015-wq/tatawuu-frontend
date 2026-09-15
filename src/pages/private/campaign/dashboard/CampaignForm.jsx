import { useState } from "react";

const categories = [
  "Health",
  "Education",
  "Environment",
  "Culture",
  "Community Support",
  "Food Support",
];
const governorates = ["Capital", "Northern", "Southern", "Muharraq", "Riffa"];

const emptyCampaign = {
  title: "",
  description: "",
  category: categories[0],
  governorate: governorates[0],
  address: "",
  startDate: "",
  endDate: "",
  startsAt: "",
  endsAt: "",
  capacity: "",
};

export default function CampaignForm({
  initialData,
  onCancel,
  onSubmit,
  submitting,
}) {
  const [formData, setFormData] = useState({
    ...emptyCampaign,
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = "Title is required.";
    if (!formData.description.trim())
      next.description = "Description is required.";
    if (!formData.address.trim()) next.address = "Address is required.";
    if (!formData.startDate) next.startDate = "Start date is required.";
    if (!formData.endDate) next.endDate = "End date is required.";
    if (!formData.startsAt) next.startsAt = "Start time is required.";
    if (!formData.endsAt) next.endsAt = "End time is required.";
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      next.capacity = "Capacity must be a positive number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, capacity: Number(formData.capacity) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <span>{errors.title}</span>}
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

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
        Address
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span>{errors.address}</span>}
      </label>

      <label>
        Start date
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        {errors.startDate && <span>{errors.startDate}</span>}
      </label>

      <label>
        End date
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        {errors.endDate && <span>{errors.endDate}</span>}
      </label>

      <label>
        Starts at
        <input
          type="datetime-local"
          name="startsAt"
          value={formData.startsAt}
          onChange={handleChange}
        />
        {errors.startsAt && <span>{errors.startsAt}</span>}
      </label>

      <label>
        Ends at
        <input
          type="datetime-local"
          name="endsAt"
          value={formData.endsAt}
          onChange={handleChange}
        />
        {errors.endsAt && <span>{errors.endsAt}</span>}
      </label>

      <label>
        Capacity
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />
        {errors.capacity && <span>{errors.capacity}</span>}
      </label>

      <div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save campaign"}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
