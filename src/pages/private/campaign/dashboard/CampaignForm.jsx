import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ImagePicker from "../../../../components/ImagePicker/ImagePicker.jsx";
import { categories, governorates } from "../../../../utils/options.js";
import { toDateInput, toUTC } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";
import * as organizationService from "../../../../services/organizationService.js";
import * as uploadService from "../../../../services/uploadService.js";

const emptyCampaign = {
  title: "",
  description: "",
  category: categories[0],
  governorate: governorates[0],
  area: "",
  venue: "",
  address: "",
  startsAt: "",
  endsAt: "",
  capacity: "",
  coverImage: "",
  coverImagePublicId: "",
};

const CampaignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyCampaign);
  const [campaign, setCampaign] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setMessage("");
      setFile(null);
      setCampaign(null);
      try {
        const organizationData = await organizationService.showMine();
        setOrganization(organizationData);
        if (id) {
          const data = await campaignService.showOwn(id);
          setCampaign(data);
          setFormData({
            title: data.title,
            description: data.description,
            category: data.category,
            governorate: data.governorate,
            area: data.area,
            venue: data.venue,
            address: data.address,
            startsAt: toDateInput(data.startsAt),
            endsAt: toDateInput(data.endsAt),
            capacity: data.capacity,
            coverImage: data.coverImage || "",
            coverImagePublicId: data.coverImagePublicId || "",
          });
        } else {
          setCampaign(null);
          setFormData(emptyCampaign);
        }
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormData({ ...formData, coverImage: "", coverImagePublicId: "" });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setMessage("");
    const startsAt = toUTC(formData.startsAt);
    const endsAt = toUTC(formData.endsAt);
    if (new Date(startsAt) <= new Date()) {
      setMessage("Choose a start date in the future.");
      return;
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      setMessage("The end date must be after the start date.");
      return;
    }
    setSubmitting(true);
    try {
      const data = { ...formData, startsAt, endsAt, capacity: Number(formData.capacity) };
      if (file) {
        const image = await uploadService.upload(file);
        data.coverImage = image.url;
        data.coverImagePublicId = image.publicId;
      }
      if (id) {
        await campaignService.update(id, data);
      } else {
        await campaignService.create(data);
      }
      navigate("/organizer/campaigns");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading campaign form...</p>;
  if (!organization) {
    return <main><p>{message || "Create an organization before adding a campaign."}</p><Link to="/organizer/organization">My organization</Link></main>;
  }
  if (id && !campaign) return <main><p>{message}</p><Link to="/organizer/campaigns">My campaigns</Link></main>;
  if (campaign && (new Date(campaign.startsAt) <= new Date() || ["Cancelled", "Completed", "Removed"].includes(campaign.status))) {
    return <main><p>This campaign can no longer be edited.</p><Link to="/organizer/campaigns">My campaigns</Link></main>;
  }

  return (
    <main>
      <h1>{id ? "Edit campaign" : "New campaign"}</h1>
      <p>Country: Bahrain</p>
      <p>All dates and times are in Bahrain time.</p>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input required name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea required name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Governorate
          <select name="governorate" value={formData.governorate} onChange={handleChange}>
            {governorates.map((governorate) => <option key={governorate} value={governorate}>{governorate}</option>)}
          </select>
        </label>
        <label>
          Area
          <input required name="area" value={formData.area} onChange={handleChange} />
        </label>
        <label>
          Venue
          <input required name="venue" value={formData.venue} onChange={handleChange} />
        </label>
        <label>
          Address
          <input required name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          Starts at (Bahrain time)
          <input required type="datetime-local" name="startsAt" value={formData.startsAt} onChange={handleChange} />
        </label>
        <label>
          Ends at (Bahrain time)
          <input required type="datetime-local" name="endsAt" value={formData.endsAt} onChange={handleChange} />
        </label>
        <label>
          Capacity
          <input required min="1" step="1" type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
        </label>
        <ImagePicker label="Campaign cover" url={formData.coverImage} onFileChange={setFile} onRemove={handleRemoveImage} />
        {!id && <p>Your campaign is saved as a draft. Submit it for review from My campaigns.</p>}
        {campaign?.status === "Approved" && <p>Editing this campaign sends it for review again.</p>}
        <button disabled={submitting} type="submit">{submitting ? "Saving..." : "Save campaign"}</button>
        <Link to="/organizer/campaigns">Cancel</Link>
      </form>
    </main>
  );
};

export default CampaignForm;
