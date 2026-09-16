import { useEffect, useState } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";

const CampaignReviewItem = ({ campaign, busy, onReview }) => {
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
      <h3>{campaign.title}</h3>
      <p>Status: {campaign.status}</p>
      {campaign.coverImage && <img src={campaign.coverImage} alt={campaign.title} width="320" />}
      <p>{campaign.description}</p>
      <p>Category: {campaign.category}</p>
      <p>Venue: {campaign.venue}</p>
      <p>{campaign.address}, {campaign.area}, {campaign.governorate}, Bahrain</p>
      <p>Starts: {formatDateTime(campaign.startsAt)} (Bahrain time)</p>
      <p>Ends: {formatDateTime(campaign.endsAt)} (Bahrain time)</p>
      <p>Capacity: {campaign.capacity}</p>
      <p>Registered participants: {campaign.registeredCount}</p>
      {organization ? <>
        <h4>Organization: {organization.name}</h4>
        <p>Organization status: {organization.status}</p>
        {organization.logo && <img src={organization.logo} alt={`${organization.name} logo`} width="160" />}
        <p>{organization.description}</p>
        <p>{organization.address}, {organization.area}, {organization.governorate}</p>
        <OrganizationContacts organization={organization} />
      </> : <p>Organization unavailable.</p>}
      {campaign.reviewReason && <p>Previous feedback: {campaign.reviewReason}</p>}
      {(campaign.status === "Pending" || canRemove) && (
        <>
          <label>
            Review feedback
            <textarea value={reason} onChange={(evt) => setReason(evt.target.value)} />
          </label>
          <p>{message}</p>
          {campaign.status === "Pending" && (
            <>
              <button disabled={busy || !organization} onClick={() => handleReview("Approved")}>Approve</button>
              <button disabled={busy} onClick={() => handleReview("Rejected")}>Reject</button>
            </>
          )}
          {canRemove && <button disabled={busy} onClick={() => handleReview("Removed")}>Remove</button>}
        </>
      )}
    </article>
  );
};

const CampaignReview = () => {
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
      <h2>Review campaigns</h2>
      <label>
        Status
        <select value={status} onChange={(evt) => setStatus(evt.target.value)}>
          {["Pending", "Approved", "Rejected", "Removed", "Completed", "Cancelled", "Draft", "All"].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <p>{message}</p>
      {loading ? <p>Loading campaigns...</p> : filteredCampaigns.length === 0 && <p>No campaigns match this status.</p>}
      {filteredCampaigns.map((campaign) => <CampaignReviewItem key={campaign._id} campaign={campaign} busy={busy} onReview={handleReview} />)}
    </section>
  );
};

export default CampaignReview;
