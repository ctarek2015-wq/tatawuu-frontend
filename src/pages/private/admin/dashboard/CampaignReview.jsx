import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";

const CampaignReviewItem = ({ campaign, busy, onReview }) => {
  const { t, tError, language } = useContext(LanguageContext);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const organization = campaign.organizationId;
  const canRemove =
    campaign.wasPublished &&
    !["Cancelled", "Removed"].includes(campaign.status);

  const handleReview = (status) => {
    if (status !== "Approved" && !reason.trim()) {
      setMessage("Enter feedback before rejecting or removing a campaign.");
      return;
    }
    setMessage("");
    onReview(campaign._id, status, status === "Approved" ? "" : reason);
  };

  return (
    <article className="review-item">
      {/* Cover image */}
      {campaign.coverImage && (
        <img
          className="review-item-cover"
          src={campaign.coverImage}
          alt={campaign.title}
        />
      )}

      <div className="review-item-body">
        {/* Title + status */}
        <div className="review-item-header">
          <h3 className="review-item-title">
            <bdi>{campaign.title}</bdi>
          </h3>
          <span
            className={`review-status-badge review-status-${campaign.status.toLowerCase()}`}
          >
            {t(campaign.status)}
          </span>
        </div>

        {/* Description */}
        <p className="review-item-description" dir="auto">
          {campaign.description}
        </p>

        {/* Meta grid */}
        <dl className="review-meta">
          <div className="review-meta-row">
            <dt>{t("Category")}</dt>
            <dd>{t(campaign.category)}</dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Venue")}</dt>
            <dd>{campaign.venue}</dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Address")}</dt>
            <dd>
              {campaign.address}, {campaign.area}, {t(campaign.governorate)},{" "}
              {t("Bahrain")}
            </dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Starts")}</dt>
            <dd>
              {formatDateTime(campaign.startsAt, language)}{" "}
              <span className="review-meta-tz">({t("Bahrain time")})</span>
            </dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Ends")}</dt>
            <dd>
              {formatDateTime(campaign.endsAt, language)}{" "}
              <span className="review-meta-tz">({t("Bahrain time")})</span>
            </dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Capacity")}</dt>
            <dd>{campaign.capacity}</dd>
          </div>
          <div className="review-meta-row">
            <dt>{t("Registered participants")}</dt>
            <dd>{campaign.registeredCount}</dd>
          </div>
        </dl>

        {/* Map */}
        <div className="review-item-map">
          <LocationMap location={campaign} />
        </div>

        {/* Organization block */}
        {organization ? (
          <div className="review-org-block">
            <div className="review-org-header">
              {organization.logo && (
                <img
                  className="review-org-logo"
                  src={organization.logo}
                  alt={t("{name} logo", { name: organization.name })}
                />
              )}
              <div>
                <h4 className="review-org-name">{organization.name}</h4>
                <span
                  className={`review-status-badge review-status-${organization.status.toLowerCase()}`}
                >
                  {t(organization.status)}
                </span>
              </div>
            </div>
            <p className="review-org-description" dir="auto">
              {organization.description}
            </p>
            <p className="review-org-address">
              {organization.address}, {organization.area},{" "}
              {t(organization.governorate)}
            </p>
            <div className="review-item-map">
              <LocationMap location={organization} />
            </div>
            <OrganizationContacts organization={organization} />
          </div>
        ) : (
          <p className="state-msg">{t("Organization unavailable.")}</p>
        )}

        {/* Previous feedback */}
        {campaign.reviewReason && (
          <div className="review-prev-feedback">
            <span className="review-prev-feedback-label">
              {t("Previous feedback")}
            </span>
            <bdi>{campaign.reviewReason}</bdi>
          </div>
        )}

        {/* Review actions */}
        {(campaign.status === "Pending" || canRemove) && (
          <div className="review-actions">
            <div className="field">
              <label className="field-label">{t("Review feedback")}</label>
              <textarea
                className="review-textarea"
                value={reason}
                onChange={(evt) => setReason(evt.target.value)}
                rows={3}
              />
            </div>
            {message && (
              <p className="review-action-error">{tError(message)}</p>
            )}
            <div className="review-action-btns">
              {campaign.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="btn-review-approve"
                    disabled={busy || !organization}
                    onClick={() => handleReview("Approved")}
                  >
                    {t("Approve")}
                  </button>
                  <button
                    type="button"
                    className="btn-review-reject"
                    disabled={busy}
                    onClick={() => handleReview("Rejected")}
                  >
                    {t("Reject")}
                  </button>
                </>
              )}
              {canRemove && (
                <button
                  type="button"
                  className="btn-review-remove"
                  disabled={busy}
                  onClick={() => handleReview("Removed")}
                >
                  {t("Remove")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

const CampaignReview = () => {
  const { t, tError } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.reviewList();
        setCampaigns(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleReview = async (id, status, reviewReason) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.review(id, {
        status,
        reviewReason,
      });
      setCampaigns(campaigns.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) => status === "All" || c.status === status,
  );

  return (
    <section className="review-section">
      <div className="review-section-header">
        <h2 className="review-section-title">{t("Review campaigns")}</h2>
        <div className="field">
          <label className="field-label">{t("Status")}</label>
          <select
            className="review-status-select"
            value={status}
            onChange={(evt) => setStatus(evt.target.value)}
          >
            {[
              "Pending",
              "Approved",
              "Rejected",
              "Removed",
              "Completed",
              "Cancelled",
              "Draft",
              "All",
            ].map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && <p className="state-msg state-error">{tError(message)}</p>}
      {loading && <p className="state-msg">{t("Loading campaigns...")}</p>}
      {!loading && filteredCampaigns.length === 0 && (
        <p className="state-msg">{t("No campaigns match this status.")}</p>
      )}

      <div className="review-list">
        {filteredCampaigns.map((campaign) => (
          <CampaignReviewItem
            key={campaign._id}
            campaign={campaign}
            busy={busy}
            onReview={handleReview}
          />
        ))}
      </div>
    </section>
  );
};

export default CampaignReview;
