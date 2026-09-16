import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";
import * as organizationService from "../../../../services/organizationService.js";

const OrganizationReviewItem = ({ organization, busy, onReview }) => {
  const { t, tError } = useContext(LanguageContext);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleReview = (status) => {
    if (status !== "Approved" && !reason.trim()) {
      setMessage(
        "Enter feedback before rejecting or removing an organization.",
      );
      return;
    }
    setMessage("");
    onReview(organization._id, status, status === "Approved" ? "" : reason);
  };

  return (
    <article className="review-item">
      <div className="review-item-body">
        {/* Header: logo + name + status */}
        <div className="review-item-header">
          {organization.logo ? (
            <img
              className="review-org-logo"
              src={organization.logo}
              alt={t("{name} logo", { name: organization.name })}
            />
          ) : (
            <div className="review-org-logo review-org-logo-placeholder">
              {organization.name?.[0]}
            </div>
          )}
          <div>
            <h3 className="review-item-title">
              <bdi>{organization.name}</bdi>
            </h3>
            <span
              className={`review-status-badge review-status-${organization.status.toLowerCase()}`}
            >
              {t(organization.status)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="review-item-description" dir="auto">
          {organization.description}
        </p>

        {/* Address */}
        <dl className="review-meta">
          <div className="review-meta-row">
            <dt>{t("Address")}</dt>
            <dd>
              {organization.address}, {organization.area},{" "}
              {t(organization.governorate)}, {t("Bahrain")}
            </dd>
          </div>
        </dl>

        {/* Map */}
        <div className="review-item-map">
          <LocationMap location={organization} />
        </div>

        {/* Contacts */}
        <OrganizationContacts organization={organization} />

        {/* Previous feedback */}
        {organization.reviewReason && (
          <div className="review-prev-feedback">
            <span className="review-prev-feedback-label">
              {t("Previous feedback")}
            </span>
            <bdi>{organization.reviewReason}</bdi>
          </div>
        )}

        {/* Review actions */}
        {["Pending", "Approved"].includes(organization.status) && (
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
              {organization.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="btn-review-approve"
                    disabled={busy}
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
              {organization.status === "Approved" && (
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

const OrganizationReview = () => {
  const { t, tError } = useContext(LanguageContext);
  const [organizations, setOrganizations] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await organizationService.reviewList();
        setOrganizations(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleReview = async (id, status, reviewReason) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await organizationService.review(id, {
        status,
        reviewReason,
      });
      setOrganizations(organizations.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredOrganizations = organizations.filter(
    (o) => status === "All" || o.status === status,
  );

  return (
    <section className="review-section">
      <div className="review-section-header">
        <h2 className="review-section-title">{t("Review organizations")}</h2>
        <div className="field">
          <label className="field-label">{t("Status")}</label>
          <select
            className="review-status-select"
            value={status}
            onChange={(evt) => setStatus(evt.target.value)}
          >
            {["Pending", "Approved", "Rejected", "Removed", "All"].map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && <p className="state-msg state-error">{tError(message)}</p>}
      {loading && <p className="state-msg">{t("Loading organizations...")}</p>}
      {!loading && filteredOrganizations.length === 0 && (
        <p className="state-msg">{t("No organizations match this status.")}</p>
      )}

      <div className="review-list">
        {filteredOrganizations.map((organization) => (
          <OrganizationReviewItem
            key={organization._id}
            organization={organization}
            busy={busy}
            onReview={handleReview}
          />
        ))}
      </div>
    </section>
  );
};

export default OrganizationReview;
