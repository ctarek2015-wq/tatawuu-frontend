import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "../../../../contexts/UserContext.js";
import * as campaignService from "../../../../services/campaignService.js";
import { formatDateTime } from "../../../../utils/dates.js";

const VolunteerDashboard = () => {
  const { t, tError, language } = useContext(LanguageContext);
  const { user } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setCampaigns(await campaignService.activities());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const handleCancel = async (id) => {
    setBusy(id);
    setError("");
    try {
      const updated = await campaignService.leave(id);
      setCampaigns(campaigns.map((campaign) => campaign._id === id ? updated : campaign));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const visibleCampaigns = campaigns.filter((campaign) => {
    const past = new Date(campaign.endsAt) <= new Date();
    return tab === "past" ? past : !past;
  });

  return <main>
    <h1>{t("My activities")}</h1>
    <button type="button" disabled={tab === "upcoming"} onClick={() => setTab("upcoming")}>{t("Upcoming / in progress")}</button>
    <button type="button" disabled={tab === "past"} onClick={() => setTab("past")}>{t("Past")}</button>
    {loading && <p>{t("Loading activities...")}</p>}
    {error && <p role="alert">{tError(error)}</p>}
    {!loading && !error && visibleCampaigns.length === 0 && <p>{t(tab === "past" ? "No past activities." : "No upcoming activities.")}</p>}
    {visibleCampaigns.map((campaign) => {
      const participant = campaign.participants.find((person) => person.volunteerId === user._id || person.volunteerId?._id === user._id);
      const isPublic = campaign.status === "Approved" && campaign.organizationId?.status === "Approved";
      return <article key={campaign._id}>
        <h2><bdi>{campaign.title}</bdi></h2>
        <p>{campaign.organizationId?.name}</p>
        <p>{formatDateTime(campaign.startsAt, language)} — {formatDateTime(campaign.endsAt, language)} ({t("Bahrain time")})</p>
        <p>{campaign.venue}, {campaign.address}, {campaign.area}, {t(campaign.governorate)}</p>
        <LocationMap location={campaign} />
        <p>{t("Campaign")}: {t(campaign.status)}</p>
        <p>{t("Registration")}: {t(participant?.status)} · {t("Attendance")}: {t(participant?.attendance)}</p>
        {isPublic && <p><Link to={`/campaigns/${campaign._id}`}>{t("View activity")}</Link></p>}
        {campaign.status === "Cancelled" && <p>{t("This activity will not take place.")}</p>}
        {participant?.status === "Registered" && new Date(campaign.startsAt) > new Date() && <button type="button" disabled={busy !== ""} onClick={() => handleCancel(campaign._id)}>
          {t(busy === campaign._id ? "Cancelling..." : "Cancel registration")}
        </button>}
        {campaign.certificates.includes(user._id) && <p><Link to="/my/certificates">{t("View my certificate")}</Link></p>}
      </article>;
    })}
  </main>;
};

export default VolunteerDashboard;
