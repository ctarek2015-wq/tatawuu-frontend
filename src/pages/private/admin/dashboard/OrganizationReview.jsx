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
      setMessage("Enter feedback before rejecting or removing an organization.");
      return;
    }
    setMessage("");
    onReview(organization._id, status, status === "Approved" ? "" : reason);
  };

  return (
    <article>
      <h3><bdi>{organization.name}</bdi></h3>
      <p>{t("Status")}: {t(organization.status)}</p>
      {organization.logo && <img src={organization.logo} alt={t("{name} logo", { name: organization.name })} width="160" />}
      <p dir="auto">{organization.description}</p>
      <p>{organization.address}, {organization.area}, {t(organization.governorate)}, {t("Bahrain")}</p>
      <LocationMap location={organization} />
      <OrganizationContacts organization={organization} />
      {organization.reviewReason && <p>{t("Previous feedback")}: <bdi>{organization.reviewReason}</bdi></p>}
      {["Pending", "Approved"].includes(organization.status) && (
        <>
          <label>
          {t("Review feedback")}
          <textarea value={reason} onChange={(evt) => setReason(evt.target.value)} />
          </label>
          <p>{tError(message)}</p>
          {organization.status === "Pending" && (
            <>
              <button disabled={busy} onClick={() => handleReview("Approved")}>{t("Approve")}</button>
              <button disabled={busy} onClick={() => handleReview("Rejected")}>{t("Reject")}</button>
            </>
          )}
          {organization.status === "Approved" && <button disabled={busy} onClick={() => handleReview("Removed")}>{t("Remove")}</button>}
        </>
      )}
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
      const updated = await organizationService.review(id, { status, reviewReason });
      setOrganizations(organizations.map((organization) => organization._id === id ? updated : organization));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredOrganizations = organizations.filter((organization) => status === "All" || organization.status === status);

  return (
    <section>
      <h2>{t("Review organizations")}</h2>
      <label>
          {t("Status")}
          <select value={status} onChange={(evt) => setStatus(evt.target.value)}>
          {["Pending", "Approved", "Rejected", "Removed", "All"].map((status) => <option key={status} value={status}>{t(status)}</option>)}
        </select>
      </label>
      <p>{tError(message)}</p>
      {loading ? <p>{t("Loading organizations...")}</p> : filteredOrganizations.length === 0 && <p>{t("No organizations match this status.")}</p>}
      {filteredOrganizations.map((organization) => <OrganizationReviewItem key={organization._id} organization={organization} busy={busy} onReview={handleReview} />)}
    </section>
  );
};

export default OrganizationReview;
