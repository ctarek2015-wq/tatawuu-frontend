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
  const canRemove = campaign.wasPublished && !["Cancelled", "Removed"].includes(campaign.status);

  const handleReview = (status) => {
    if (status !== "Approved" && !reason.trim()) {
      setMessage("Enter feedback before rejecting or removing a campaign.");
      return;
    }
    setMessage("");
    onReview(campaign._id, status, status === "Approved" ? "" : reason);
  };

  return (
    <article>
      <h3><bdi>{campaign.title}</bdi></h3>
      <p>{t("Status")}: {t(campaign.status)}</p>
      {campaign.coverImage && <img src={campaign.coverImage} alt={campaign.title} width="320" />}
      <p dir="auto">{campaign.description}</p>
      <p>{t("Category")}: {t(campaign.category)}</p>
      <p>{t("Venue")}: {campaign.venue}</p>
      <p>{campaign.address}, {campaign.area}, {t(campaign.governorate)}, {t("Bahrain")}</p>
      <p>{t("Starts")}: {formatDateTime(campaign.startsAt, language)} ({t("Bahrain time")})</p>
      <p>{t("Ends")}: {formatDateTime(campaign.endsAt, language)} ({t("Bahrain time")})</p>
      <p>{t("Capacity")}: {campaign.capacity}</p>
      <LocationMap location={campaign} />
      <p>{t("Registered participants")}: {campaign.registeredCount}</p>
      {organization ? <>
        <h4>{t("Organization")}: {organization.name}</h4>
        <p>{t("Organization status")}: {t(organization.status)}</p>
        {organization.logo && <img src={organization.logo} alt={t("{name} logo", { name: organization.name })} width="160" />}
        <p dir="auto">{organization.description}</p>
        <p>{organization.address}, {organization.area}, {t(organization.governorate)}</p>
        <LocationMap location={organization} />
        <OrganizationContacts organization={organization} />
      </> : <p>{t("Organization unavailable.")}</p>}
      {campaign.reviewReason && <p>{t("Previous feedback")}: <bdi>{campaign.reviewReason}</bdi></p>}
      {(campaign.status === "Pending" || canRemove) && (
        <>
          <label>
          {t("Review feedback")}
          <textarea value={reason} onChange={(evt) => setReason(evt.target.value)} />
          </label>
          <p>{tError(message)}</p>
          {campaign.status === "Pending" && (
            <>
              <button disabled={busy || !organization} onClick={() => handleReview("Approved")}>{t("Approve")}</button>
              <button disabled={busy} onClick={() => handleReview("Rejected")}>{t("Reject")}</button>
            </>
          )}
          {canRemove && <button disabled={busy} onClick={() => handleReview("Removed")}>{t("Remove")}</button>}
        </>
      )}
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
      const updated = await campaignService.review(id, { status, reviewReason });
      setCampaigns(campaigns.map((campaign) => campaign._id === id ? updated : campaign));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => status === "All" || campaign.status === status);

  return (
    <section>
      <h2>{t("Review campaigns")}</h2>
      <label>
          {t("Status")}
          <select value={status} onChange={(evt) => setStatus(evt.target.value)}>
          {["Pending", "Approved", "Rejected", "Removed", "Completed", "Cancelled", "Draft", "All"].map((status) => <option key={status} value={status}>{t(status)}</option>)}
        </select>
      </label>
      <p>{tError(message)}</p>
      {loading ? <p>{t("Loading campaigns...")}</p> : filteredCampaigns.length === 0 && <p>{t("No campaigns match this status.")}</p>}
      {filteredCampaigns.map((campaign) => <CampaignReviewItem key={campaign._id} campaign={campaign} busy={busy} onReview={handleReview} />)}
    </section>
  );
};

export default CampaignReview;
