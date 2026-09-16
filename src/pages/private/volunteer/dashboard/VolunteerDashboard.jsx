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
      setCampaigns(
        campaigns.map((campaign) => (campaign._id === id ? updated : campaign)),
      );
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

  return (
    <main className="volunteer-dashboard-page">
      <div className="sec-heading" style={{ margin: 0, textAlign: "left" }}>
        <h1 className="sec-title">
          {t("My")} <em>{t("activities")}</em>
        </h1>
        <p className="sec-desc">
          {t("Track your registrations and upcoming volunteer activities.")}
        </p>
      </div>

      <div className="dashboard-tabs">
        <button
          type="button"
          className={`dashboard-tab${tab === "upcoming" ? " is-active" : ""}`}
          disabled={tab === "upcoming"}
          onClick={() => setTab("upcoming")}
        >
          {t("Upcoming / in progress")}
        </button>
        <button
          type="button"
          className={`dashboard-tab${tab === "past" ? " is-active" : ""}`}
          disabled={tab === "past"}
          onClick={() => setTab("past")}
        >
          {t("Past")}
        </button>
      </div>

      {loading && <p className="state-msg">{t("Loading activities...")}</p>}
      {error && (
        <p className="state-msg state-error" role="alert">
          {tError(error)}
        </p>
      )}

      {!loading && !error && visibleCampaigns.length === 0 && (
        <p className="state-msg">
          {t(
            tab === "past" ? "No past activities." : "No upcoming activities.",
          )}
        </p>
      )}

      <div className="dashboard-activity-list">
        {visibleCampaigns.map((campaign) => {
          const participant = campaign.participants.find(
            (person) =>
              person.volunteerId === user._id ||
              person.volunteerId?._id === user._id,
          );
          const isPublic =
            campaign.status === "Approved" &&
            campaign.organizationId?.status === "Approved";
          const canCancel =
            participant?.status === "Registered" &&
            new Date(campaign.startsAt) > new Date();

          return (
            <article key={campaign._id} className="dashboard-activity-card">
              <div className="dashboard-activity-top">
                <div>
                  <h2 className="dashboard-activity-title">
                    <bdi>{campaign.title}</bdi>
                  </h2>
                  <p className="dashboard-activity-org">
                    {campaign.organizationId?.name}
                  </p>
                </div>
                <span
                  className={`status-badge status-${campaign.status.toLowerCase()}`}
                >
                  {t(campaign.status)}
                </span>
              </div>

              <p className="dashboard-activity-dates">
                {formatDateTime(campaign.startsAt, language)} —{" "}
                {formatDateTime(campaign.endsAt, language)}{" "}
                <span className="manager-tz">({t("Bahrain time")})</span>
              </p>

              <p className="dashboard-activity-location">
                {campaign.venue}, {campaign.address}, {campaign.area},{" "}
                {t(campaign.governorate)}
              </p>

              <div className="dashboard-activity-map">
                <LocationMap location={campaign} />
              </div>

              <div className="dashboard-activity-badges">
                <span
                  className={`status-badge status-${(participant?.status || "unmarked").toLowerCase()}`}
                >
                  {t("Registration")}: {t(participant?.status)}
                </span>
                <span
                  className={`attendance-badge attendance-${(participant?.attendance || "unmarked").toLowerCase()}`}
                >
                  {t("Attendance")}: {t(participant?.attendance)}
                </span>
              </div>

              {campaign.status === "Cancelled" && (
                <p className="manager-notice">
                  {t("This activity will not take place.")}
                </p>
              )}

              <div className="dashboard-activity-actions">
                {isPublic && (
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="btn-soft btn-sm"
                  >
                    {t("View activity")}
                  </Link>
                )}

                {canCancel && (
                  <button
                    type="button"
                    disabled={busy !== ""}
                    onClick={() => handleCancel(campaign._id)}
                    className="btn-danger-outline btn-sm"
                  >
                    {t(
                      busy === campaign._id
                        ? "Cancelling..."
                        : "Cancel registration",
                    )}
                  </button>
                )}

                {campaign.certificates.includes(user._id) && (
                  <Link to="/my/certificates" className="btn-primary btn-sm">
                    {t("View my certificate")}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default VolunteerDashboard;
