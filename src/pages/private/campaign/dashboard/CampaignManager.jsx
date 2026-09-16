import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";
import * as organizationService from "../../../../services/organizationService.js";

const statusOptions = [
  "All",
  "Draft",
  "Pending",
  "Approved",
  "Rejected",
  "Removed",
  "Completed",
  "Cancelled",
];

const CampaignManager = () => {
  const { t, tError, language } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const [campaignData, organizationData] = await Promise.all([
          campaignService.showMine(),
          organizationService.showMine(),
        ]);
        setCampaigns(campaignData);
        setOrganization(organizationData);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleSubmit = async (id) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.submit(id);
      setCampaigns(
        campaigns.map((campaign) => (campaign._id === id ? updated : campaign)),
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async (id) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.cancel(id);
      setCampaigns(
        campaigns.map((campaign) => (campaign._id === id ? updated : campaign)),
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusy(true);
    setMessage("");
    try {
      await campaignService.remove(id);
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="state-msg">{t("Loading campaigns...")}</p>;
  const filteredCampaigns = campaigns.filter(
    (campaign) => status === "All" || campaign.status === status,
  );

  return (
    <main className="campaign-manager-page">
      <div className="manager-header">
        <div className="sec-heading" style={{ margin: 0, textAlign: "left" }}>
          <h1 className="sec-title">
            {t("My")} <em>{t("campaigns")}</em>
          </h1>
          <p className="sec-desc">
            {organization
              ? t("Manage, submit, and track your organization's activities.")
              : t("Set up your organization to start creating activities.")}
          </p>
        </div>
        <Link to="/organizer" className="btn-link manager-back-link">
          {t("Organizer dashboard")}
        </Link>
      </div>

      {message && (
        <p className="state-msg state-error" role="alert">
          {tError(message)}
        </p>
      )}

      <div className="manager-actions-row">
        {organization ? (
          <Link to="/organizer/campaigns/new" className="btn-primary">
            {t("Create campaign")}
          </Link>
        ) : (
          <Link to="/organizer/organization" className="btn-primary">
            {t("Create your organization first")}
          </Link>
        )}

        <label className="field field-status">
          <span className="field-label">{t("Status")}</span>
          <select
            value={status}
            onChange={(evt) => setStatus(evt.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {organization && organization.status !== "Approved" && (
        <p className="manager-notice">
          {t(
            "Your organization needs approval before you can submit campaigns.",
          )}
        </p>
      )}

      <div className="manager-campaign-list">
        {filteredCampaigns.length === 0 && (
          <p className="state-msg">{t("No campaigns match this status.")}</p>
        )}

        {filteredCampaigns.map((campaign) => {
          const started = new Date(campaign.startsAt) <= new Date();
          const terminal = ["Cancelled", "Completed", "Removed"].includes(
            campaign.status,
          );
          const canSubmit =
            !started &&
            ["Draft", "Rejected"].includes(campaign.status) &&
            organization?.status === "Approved";
          const statusClass = `status-badge status-${campaign.status.toLowerCase()}`;

          return (
            <article key={campaign._id} className="manager-campaign-card">
              <div className="manager-campaign-top">
                <h2 className="manager-campaign-title">
                  <bdi>{campaign.title}</bdi>
                </h2>
                <span className={statusClass}>{t(campaign.status)}</span>
              </div>

              <p className="manager-campaign-dates">
                {formatDateTime(campaign.startsAt, language)} —{" "}
                {formatDateTime(campaign.endsAt, language)}{" "}
                <span className="manager-tz">({t("Bahrain time")})</span>
              </p>

              <p className="manager-campaign-meta">
                {t("{count} participants; {places} places available", {
                  count: campaign.registeredCount,
                  places: campaign.availablePlaces,
                })}
              </p>

              {campaign.reviewReason && (
                <p className="manager-review-reason">
                  <strong>{t("Review feedback")}:</strong>{" "}
                  <bdi>{campaign.reviewReason}</bdi>
                </p>
              )}

              <div className="manager-campaign-actions">
                {!started && !terminal && (
                  <Link
                    to={`/organizer/campaigns/${campaign._id}/edit`}
                    className="btn-soft btn-sm"
                  >
                    {t("Edit")}
                  </Link>
                )}

                <Link
                  to={`/organizer/campaigns/${campaign._id}/participants`}
                  className="btn-soft btn-sm"
                >
                  {t("Participants and certificates")}
                </Link>

                {canSubmit && (
                  <button
                    disabled={busy}
                    onClick={() => handleSubmit(campaign._id)}
                    className="btn-primary btn-sm"
                  >
                    {t("Submit for review")}
                  </button>
                )}

                {!campaign.wasPublished &&
                  campaign.participants.length === 0 && (
                    <button
                      disabled={busy}
                      onClick={() => handleDelete(campaign._id)}
                      className="btn-danger btn-sm"
                    >
                      {t("Delete")}
                    </button>
                  )}

                {campaign.wasPublished && !terminal && (
                  <button
                    disabled={busy}
                    onClick={() => handleCancel(campaign._id)}
                    className="btn-danger-outline btn-sm"
                  >
                    {t("Cancel campaign")}
                  </button>
                )}
              </div>
            </article>
          );
          a;
        })}
      </div>
    </main>
  );
};

export default CampaignManager;
