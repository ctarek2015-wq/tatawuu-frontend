import { useEffect, useState } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";
import * as organizationService from "../../../../services/organizationService.js";

const OrganizationReviewItem = ({ organization, busy, onReview }) => {
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
      <h3>{organization.name}</h3>
      <p>Status: {organization.status}</p>
      {organization.logo && <img src={organization.logo} alt={`${organization.name} logo`} width="160" />}
      <p>{organization.description}</p>
      <p>{organization.address}, {organization.area}, {organization.governorate}, Bahrain</p>
      <OrganizationContacts organization={organization} />
      {organization.reviewReason && <p>Previous feedback: {organization.reviewReason}</p>}
      {["Pending", "Approved"].includes(organization.status) && (
        <>
          <label>
            Review feedback
            <textarea value={reason} onChange={(evt) => setReason(evt.target.value)} />
          </label>
          <p>{message}</p>
          {organization.status === "Pending" && (
            <>
              <button disabled={busy} onClick={() => handleReview("Approved")}>Approve</button>
              <button disabled={busy} onClick={() => handleReview("Rejected")}>Reject</button>
            </>
          )}
          {organization.status === "Approved" && <button disabled={busy} onClick={() => handleReview("Removed")}>Remove</button>}
        </>
      )}
    </article>
  );
};

const OrganizationReview = () => {
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
      <h2>Review organizations</h2>
      <label>
        Status
        <select value={status} onChange={(evt) => setStatus(evt.target.value)}>
          {["Pending", "Approved", "Rejected", "Removed", "All"].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <p>{message}</p>
      {loading ? <p>Loading organizations...</p> : filteredOrganizations.length === 0 && <p>No organizations match this status.</p>}
      {filteredOrganizations.map((organization) => <OrganizationReviewItem key={organization._id} organization={organization} busy={busy} onReview={handleReview} />)}
    </section>
  );
};

export default OrganizationReview;
