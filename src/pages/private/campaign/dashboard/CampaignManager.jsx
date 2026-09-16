import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";
import * as organizationService from "../../../../services/organizationService.js";

const CampaignManager = () => {
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
      setCampaigns(campaigns.map((campaign) => campaign._id === id ? updated : campaign));
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
      setCampaigns(campaigns.map((campaign) => campaign._id === id ? updated : campaign));
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

  if (loading) return <p>Loading campaigns...</p>;
  const filteredCampaigns = campaigns.filter((campaign) => status === "All" || campaign.status === status);

  return (
    <main>
      <h1>My campaigns</h1>
      <Link to="/organizer">Organizer dashboard</Link>
      <p>{message}</p>
      {organization ? <Link to="/organizer/campaigns/new">Create campaign</Link> : <Link to="/organizer/organization">Create your organization first</Link>}
      {organization && organization.status !== "Approved" && <p>Your organization needs approval before you can submit campaigns.</p>}
      <label>
        Status
        <select value={status} onChange={(evt) => setStatus(evt.target.value)}>
          {["All", "Draft", "Pending", "Approved", "Rejected", "Removed", "Completed", "Cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      {filteredCampaigns.length === 0 && <p>No campaigns match this status.</p>}
      {filteredCampaigns.map((campaign) => {
        const started = new Date(campaign.startsAt) <= new Date();
        const terminal = ["Cancelled", "Completed", "Removed"].includes(campaign.status);
        const canSubmit = !started && ["Draft", "Rejected"].includes(campaign.status) && organization?.status === "Approved";
        return (
          <article key={campaign._id}>
            <h2>{campaign.title}</h2>
            <p>Status: {campaign.status}</p>
            <p>{formatDateTime(campaign.startsAt)} to {formatDateTime(campaign.endsAt)} (Bahrain time)</p>
            <p>{campaign.registeredCount} participants; {campaign.availablePlaces} places available</p>
            {campaign.reviewReason && <p>Review feedback: {campaign.reviewReason}</p>}
            {!started && !terminal && <Link to={`/organizer/campaigns/${campaign._id}/edit`}>Edit</Link>}
            <Link to={`/organizer/campaigns/${campaign._id}/participants`}>Participants and certificates</Link>
            {canSubmit && <button disabled={busy} onClick={() => handleSubmit(campaign._id)}>Submit for review</button>}
            {!campaign.wasPublished && campaign.participants.length === 0 && <button disabled={busy} onClick={() => handleDelete(campaign._id)}>Delete</button>}
            {campaign.wasPublished && !terminal && <button disabled={busy} onClick={() => handleCancel(campaign._id)}>Cancel campaign</button>}
          </article>
        );
      })}
    </main>
  );
};

export default CampaignManager;
