import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.js";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import OrganizationContacts from "../OrganizationContacts/OrganizationContacts.jsx";
import LocationMap from "../LocationMap/LocationMap.jsx";
import { formatDateTime } from "../../utils/dates.js";

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { language, t, tError } = useContext(LanguageContext);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCampaign = async () => {
      setLoading(true);
      setError("");
      setCampaign(null);
      try {
        setCampaign(await campaignService.show(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCampaign();
  }, [id]);

  const handleAction = async (action) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      setCampaign(await action(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copied.");
    } catch {
      setMessage("Copy this link");
    }
  };

  if (loading) return <p>{t("Loading activity...")}</p>;
  if (!campaign) return <main><p role="alert">{error ? tError(error) : t("Activity unavailable.")}</p><Link to="/">{t("Explore activities")}</Link></main>;

  const organization = campaign.organizationId;
  const participant = campaign.participants.find((person) =>
    person.volunteerId === user?._id || person.volunteerId?._id === user?._id);
  const joined = participant?.status === "Registered";
  const saved = campaign.favorites.includes(user?._id);
  const started = new Date(campaign.startsAt) <= new Date();
  const approved = campaign.status === "Approved" && organization?.status === "Approved";

  return (
    <main>
      <h1>{campaign.title}</h1>
      {campaign.coverImage && <img src={campaign.coverImage} alt={campaign.title} width="320" />}
      <p>{campaign.description}</p>
      <p>{t("Category")}: {t(campaign.category)}</p>
      <p>{formatDateTime(campaign.startsAt, language)} — {formatDateTime(campaign.endsAt, language)} ({t("Bahrain time")})</p>
      <p>{campaign.venue} — {campaign.address}</p>
      <p>{campaign.area}, {t(campaign.governorate)}, {t("Bahrain")}</p>
      <LocationMap location={campaign} />
      <p>{t("{available} of {capacity} places available", { available: campaign.availablePlaces, capacity: campaign.capacity })}</p>
      <p>{t("Status")}: {t(campaign.status)}</p>
      {!approved && <p>{t("This activity is currently unavailable for registration.")}</p>}
      {organization && <section>
        <h2><Link to={`/organizations/${organization._id}`}>{organization.name}</Link></h2>
        {organization.logo && <img src={organization.logo} alt={organization.name} width="100" />}
        <OrganizationContacts organization={organization} />
      </section>}
      {error && <p role="alert">{tError(error)}</p>}
      {message && <p>{t(message)}{message === "Copy this link" && <>: <bdi dir="ltr">{window.location.href}</bdi></>}</p>}
      {user?.role === "Volunteer" && <div>
        {joined ? <>
          <p>{t("Registered")} · {t("Attendance")}: {t(participant.attendance)}</p>
          <button type="button" disabled={busy || started} onClick={() => handleAction(campaignService.leave)}>{t("Cancel registration")}</button>
        </> : <button type="button" disabled={busy || !approved || started || campaign.availablePlaces === 0} onClick={() => handleAction(campaignService.join)}>
          {t(!approved ? "Unavailable" : started ? "Registration closed" : campaign.availablePlaces === 0 ? "Full" : "Register for activity")}
        </button>}
        <button type="button" disabled={busy || (!approved && !saved)} onClick={() => handleAction(saved ? campaignService.unfavorite : campaignService.favorite)}>
          {t(saved ? "Remove from favorites" : "Save to favorites")}
        </button>
      </div>}
      {!user && <p><Link to="/sign-in">{t("Sign in to join or save this activity")}</Link></p>}
      <button type="button" onClick={handleShare}>{t("Copy activity link")}</button>
      <p><Link to="/">{t("Back to activities")}</Link></p>
    </main>
  );
};

export default CampaignDetail;
