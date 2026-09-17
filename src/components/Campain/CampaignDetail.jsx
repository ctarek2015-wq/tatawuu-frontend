import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.js";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import * as campaignUpdateService from "../../services/campaignUpdateService.js";
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
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState("");

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

  useEffect(() => {
    let active = true;
    const loadUpdates = async () => {
      setUpdatesLoading(true);
      setUpdates([]);
      setUpdatesError("");
      try {
        const data = await campaignUpdateService.index(id);
        if (active) setUpdates(data);
      } catch (err) {
        if (active) setUpdatesError(err.message);
      } finally {
        if (active) setUpdatesLoading(false);
      }
    };
    loadUpdates();
    return () => {
      active = false;
    };
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

  if (loading)
    return (
      <main className="campaign-detail-state">
        <p className="state-msg">{t("Loading activity...")}</p>
      </main>
    );

  if (!campaign)
    return (
      <main className="campaign-detail-state">
        <p role="alert" className="state-msg state-error">
          {error ? tError(error) : t("Activity unavailable.")}
        </p>
        <Link to="/activities" className="btn-primary-dark">
          {t("Explore activities")}
        </Link>
      </main>
    );

  const organization = campaign.organizationId;
  const participant = campaign.participants.find(
    (person) =>
      person.volunteerId === user?._id || person.volunteerId?._id === user?._id,
  );
  const joined = participant?.status === "Registered";
  const saved = campaign.favorites.includes(user?._id);
  const started = new Date(campaign.startsAt) <= new Date();
  const approved =
    campaign.status === "Approved" && organization?.status === "Approved";

  return (
    <main className="campaign-detail-page">
      <div className="campaign-detail-card">
        {campaign.coverImage && (
          <img
            className="campaign-detail-cover"
            src={campaign.coverImage}
            alt={campaign.title}
          />
        )}

        <div className="campaign-detail-body">
          {/* Header: category pill + title */}
          <div className="campaign-detail-header">
            <span className="campaign-detail-category">
              {t(campaign.category)}
            </span>
            <h1 className="campaign-detail-title">
              <bdi>{campaign.title}</bdi>
            </h1>
          </div>

          {/* Description */}
          <p className="campaign-detail-description" dir="auto">
            {campaign.description}
          </p>

          {/* Structured meta rows */}
          <dl className="campaign-detail-meta">
            <div className="campaign-detail-meta-row">
              <dt className="campaign-detail-meta-label">{t("Date")}</dt>
              <dd className="campaign-detail-meta-value">
                {formatDateTime(campaign.startsAt, language)}
                {" — "}
                {formatDateTime(campaign.endsAt, language)}
                <span className="campaign-detail-timezone">
                  {" "}
                  ({t("Bahrain time")})
                </span>
              </dd>
            </div>

            <div className="campaign-detail-meta-row">
              <dt className="campaign-detail-meta-label">{t("Venue")}</dt>
              <dd className="campaign-detail-meta-value">
                <bdi>{campaign.venue}</bdi> — <bdi>{campaign.address}</bdi>
              </dd>
            </div>

            <div className="campaign-detail-meta-row">
              <dt className="campaign-detail-meta-label">{t("Location")}</dt>
              <dd className="campaign-detail-meta-value">
                <bdi>{campaign.area}</bdi>, {t(campaign.governorate)},{" "}
                {t("Bahrain")}
              </dd>
            </div>

            <div className="campaign-detail-meta-row">
              <dt className="campaign-detail-meta-label">{t("Places")}</dt>
              <dd className="campaign-detail-meta-value">
                {t("{available} of {capacity} places available", {
                  available: campaign.availablePlaces,
                  capacity: campaign.capacity,
                })}
              </dd>
            </div>

            <div className="campaign-detail-meta-row">
              <dt className="campaign-detail-meta-label">{t("Status")}</dt>
              <dd className="campaign-detail-meta-value">
                <span
                  className={`campaign-detail-status-badge ${
                    campaign.status === "Approved"
                      ? "campaign-detail-status-approved"
                      : campaign.status === "Pending"
                        ? "campaign-detail-status-pending"
                        : "campaign-detail-status-rejected"
                  }`}
                >
                  {t(campaign.status)}
                </span>
              </dd>
            </div>
          </dl>

          {/* Unavailable notice */}
          {!approved && (
            <p className="campaign-detail-notice">
              {t("This activity is currently unavailable for registration.")}
            </p>
          )}

          {/* Map */}
          <div className="campaign-detail-map">
            <LocationMap location={campaign} />
          </div>

          {/* Organization section */}
          {organization && (
            <section className="campaign-detail-org">
              <div className="campaign-detail-org-header">
                {organization.logo ? (
                  <img
                    className="campaign-detail-org-logo"
                    src={organization.logo}
                    alt={organization.name}
                  />
                ) : (
                  <div className="campaign-detail-org-logo campaign-detail-org-logo-placeholder">
                    {organization.name?.[0]}
                  </div>
                )}
                <h2 className="campaign-detail-org-name">
                  <Link to={`/organizations/${organization._id}`}>
                    <bdi>{organization.name}</bdi>
                  </Link>
                </h2>
              </div>
              <OrganizationContacts organization={organization} />
            </section>
          )}

          <section
            className="campaign-updates-section"
            aria-labelledby="campaign-updates-title"
          >
            <h2 id="campaign-updates-title">{t("Campaign updates")}</h2>
            {updatesLoading && (
              <p className="state-msg">{t("Loading updates...")}</p>
            )}
            {updatesError && (
              <p className="state-msg state-error" role="alert">
                {tError(updatesError)}
              </p>
            )}
            {!updatesLoading && !updatesError && updates.length === 0 && (
              <p>{t("No updates yet.")}</p>
            )}
            {updates.map((update) => (
              <article key={update._id} className="campaign-update-card">
                <p>
                  <time dateTime={update.createdAt}>
                    {formatDateTime(update.createdAt, language)}
                  </time>{" "}
                  ({t("Bahrain time")})
                </p>
                <p dir="auto" style={{ whiteSpace: "pre-wrap" }}>
                  {update.text}
                </p>
              </article>
            ))}
          </section>

          {/* Inline error / message feedback */}
          {error && (
            <p role="alert" className="campaign-detail-alert">
              {tError(error)}
            </p>
          )}
          {message && (
            <p className="campaign-detail-message">
              {t(message)}
              {message === "Copy this link" && (
                <>
                  :{" "}
                  <bdi dir="ltr" className="campaign-detail-copied-url">
                    {window.location.href}
                  </bdi>
                </>
              )}
            </p>
          )}

          {/* Volunteer action buttons */}
          {user?.role === "Volunteer" && (
            <div className="campaign-detail-actions">
              {joined ? (
                <div className="campaign-detail-registered">
                  <p className="campaign-detail-registered-status">
                    ✓ {t("Registered")} ·{" "}
                    <span>
                      {t("Attendance")}: {t(participant.attendance)}
                    </span>
                  </p>
                  <button
                    type="button"
                    className="btn-soft"
                    disabled={busy || started}
                    onClick={() => handleAction(campaignService.leave)}
                  >
                    {t("Cancel registration")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-primary-dark campaign-detail-join-btn"
                  disabled={
                    busy ||
                    !approved ||
                    started ||
                    campaign.availablePlaces === 0
                  }
                  onClick={() => handleAction(campaignService.join)}
                >
                  {t(
                    !approved
                      ? "Unavailable"
                      : started
                        ? "Registration closed"
                        : campaign.availablePlaces === 0
                          ? "Full"
                          : "Register for activity",
                  )}
                </button>
              )}

              <button
                type="button"
                className={`campaign-detail-save-btn${saved ? " is-saved" : ""}`}
                disabled={busy || (!approved && !saved)}
                onClick={() =>
                  handleAction(
                    saved
                      ? campaignService.unfavorite
                      : campaignService.favorite,
                  )
                }
              >
                {t(saved ? "Remove from favorites" : "Save to favorites")}
              </button>
            </div>
          )}

          {/* Guest sign-in prompt */}
          {!user && (
            <p className="campaign-detail-signin">
              <Link to="/sign-in">
                {t("Sign in to join or save this activity")}
              </Link>
            </p>
          )}

          {/* Footer: share + back */}
          <div className="campaign-detail-footer">
            <button
              type="button"
              className="btn-soft btn-sm"
              onClick={handleShare}
            >
              {t("Copy activity link")}
            </button>
            <Link to="/activities" className="btn-link">
              {t("Back to activities")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CampaignDetail;
