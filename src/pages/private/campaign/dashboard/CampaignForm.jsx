import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import MapPicker from "../../../../components/MapPicker/MapPicker.jsx";
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
  latitude: null,
  longitude: null,
  startsAt: "",
  endsAt: "",
  capacity: "",
  coverImage: "",
  coverImagePublicId: "",
};

const CampaignForm = () => {
  const { t, tError } = useContext(LanguageContext);
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
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
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

  if (loading) return <p>{t("Loading campaign form...")}</p>;
  if (!organization) {
    return <main><p>{tError(message || "Create an organization before adding a campaign.")}</p><Link to="/organizer/organization">{t("My organization")}</Link></main>;
  }
  if (id && !campaign) return <main><p>{tError(message)}</p><Link to="/organizer/campaigns">{t("My campaigns")}</Link></main>;
  if (campaign && (new Date(campaign.startsAt) <= new Date() || ["Cancelled", "Completed", "Removed"].includes(campaign.status))) {
    return <main><p>{t("This campaign can no longer be edited.")}</p><Link to="/organizer/campaigns">{t("My campaigns")}</Link></main>;
  }

  return (
    <main>
      <h1>{t(id ? "Edit campaign" : "New campaign")}</h1>
      <p>{t("Country: Bahrain")}</p>
      <p>{t("All dates and times are in Bahrain time.")}</p>
      <p>{tError(message)}</p>
      <form onSubmit={handleSubmit}>
        <label>
          {t("Title")}
          <input required dir="auto" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          {t("Description")}
          <textarea required dir="auto" name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
          {t("Category")}
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((category) => <option key={category} value={category}>{t(category)}</option>)}
          </select>
        </label>
        <label>
          {t("Governorate")}
          <select name="governorate" value={formData.governorate} onChange={handleChange}>
            {governorates.map((governorate) => <option key={governorate} value={governorate}>{t(governorate)}</option>)}
          </select>
        </label>
        <label>
          {t("Area")}
          <input required dir="auto" name="area" value={formData.area} onChange={handleChange} />
        </label>
        <label>
          {t("Venue")}
          <input required dir="auto" name="venue" value={formData.venue} onChange={handleChange} />
        </label>
        <label>
          {t("Address")}
          <input required dir="auto" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          {t("Starts at (Bahrain time)")}
          <input required type="datetime-local" dir="ltr" name="startsAt" value={formData.startsAt} onChange={handleChange} />
        </label>
        <label>
          {t("Ends at (Bahrain time)")}
          <input required type="datetime-local" dir="ltr" name="endsAt" value={formData.endsAt} onChange={handleChange} />
        </label>
        <label>
          {t("Capacity")}
          <input required min="1" step="1" type="number" dir="ltr" name="capacity" value={formData.capacity} onChange={handleChange} />
        </label>
        {Number.isFinite(organization.latitude) && Number.isFinite(organization.longitude) && <button type="button" onClick={() => setFormData({ ...formData, latitude: organization.latitude, longitude: organization.longitude })}>
          {t("Use organization location")}
        </button>}
        <MapPicker latitude={formData.latitude} longitude={formData.longitude} onChange={({ latitude, longitude }) => setFormData({ ...formData, latitude, longitude })} />
        <ImagePicker label={t("Campaign cover")} url={formData.coverImage} onFileChange={setFile} onRemove={handleRemoveImage} />
        {!id && <p>{t("Your campaign is saved as a draft. Submit it for review from My campaigns.")}</p>}
        {campaign?.status === "Approved" && <p>{t("Editing this campaign sends it for review again.")}</p>}
        <button disabled={submitting} type="submit">{t(submitting ? "Saving..." : "Save campaign")}</button>
        <Link to="/organizer/campaigns">{t("Cancel")}</Link>
      </form>
    </main>
  );
};

export default CampaignForm;
