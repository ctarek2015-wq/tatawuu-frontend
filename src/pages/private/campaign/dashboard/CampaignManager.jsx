import { useState, useEffect } from "react";
import CampaignForm from "./CampaignForm";
import {
  showMine,
  create,
  update,
  remove,
} from "../../../../services/campaignService";

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
            {c.title} - {c.status}
            <button type="button" onClick={() => handleEdit(c)}>
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
