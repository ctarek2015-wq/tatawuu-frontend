import { useState, useEffect } from "react";
import CampaignForm from "./CampaignForm";
import {
  showMine,
  create,
  update,
  remove,
} from "../../../../services/campaignService";
import { byCampaign } from "../../../../services/registerationService";

const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "");
const toDateTimeInput = (iso) => (iso ? iso.slice(0, 16) : "");

const toFormValues = (campaign) => ({
  ...campaign,
  startDate: toDateInput(campaign.startDate),
  endDate: toDateInput(campaign.endDate),
  startsAt: toDateTimeInput(campaign.startsAt),
  endsAt: toDateTimeInput(campaign.endsAt),
});

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await showMine();
      setCampaigns(data || []);
    } catch (err) {
      setError("Couldn't load your campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setMode("create");
  };

  const handleEdit = (campaign) => {
    setSelected(campaign);
    setMode("edit");
  };

  const handleCancel = () => {
    setSelected(null);
    setMode("list");
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError("Couldn't delete that campaign.");
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      if (selected) {
        const updated = await update(selected._id, formData);
        setCampaigns((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c)),
        );
      } else {
        const created = await create(formData);
        setCampaigns((prev) => [...prev, created]);
      }
      setMode("list");
      setSelected(null);
    } catch (err) {
      setError("Couldn't save that campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRoster = async (campaignId) => {
    if (expandedId === campaignId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(campaignId);
    setRosterLoading(true);
    setRosterError("");
    try {
      const data = await byCampaign(campaignId);
      setRoster(data || []);
    } catch (err) {
      setRosterError("Couldn't load volunteers for this campaign.");
    } finally {
      setRosterLoading(false);
    }
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (mode === "create" || mode === "edit") {
    return (
      <div>
        <h2>{mode === "edit" ? "Edit campaign" : "Create campaign"}</h2>
        {error && <p>{error}</p>}
        <CampaignForm
          initialData={selected ? toFormValues(selected) : undefined}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>My campaigns</h2>
      {error && <p>{error}</p>}
      <button type="button" onClick={handleCreate}>
        Create campaign
      </button>
      <ul>
        {campaigns.map((c) => (
          <li key={c._id}>
            {c.title} - {c.status} ({c.registeredCount}/{c.capacity})
            <button type="button" onClick={() => handleEdit(c)}>
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
            <button type="button" onClick={() => handleToggleRoster(c._id)}>
              {expandedId === c._id ? "Hide volunteers" : "View volunteers"}
            </button>

            {expandedId === c._id && (
              <div>
                {rosterLoading && <p>Loading volunteers...</p>}
                {rosterError && <p>{rosterError}</p>}
                {!rosterLoading && !rosterError && roster.length === 0 && (
                  <p>No one has registered yet.</p>
                )}
                {!rosterLoading && roster.length > 0 && (
                  <ul>
                    {roster.map((r) => (
                      <li key={r._id}>
                        {r.volunteerId?.name || "Unknown volunteer"}
                        {r.volunteerId?.email ? ` (${r.volunteerId.email})` : ""}
                        {" - "}
                        {r.status}
                        {" - "}
                        {r.attendance}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}