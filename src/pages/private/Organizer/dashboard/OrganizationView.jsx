const statusLabels = {
  Draft: "Draft",
  Pending: "Pending approval",
  Approved: "Approved",
  Rejected: "Rejected",
  Removed: "Removed",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export default function OrganizationView({ organization, onEdit }) {
  const statusLabel = statusLabels[organization.status] || organization.status;

  return (
    <div>
      <div>
        <span>{statusLabel}</span>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>

      <h3>{organization.name}</h3>
      <p>{organization.description}</p>

      <dl>
        <dt>Country</dt>
        <dd>Bahrain</dd>
        <dt>Governorate</dt>
        <dd>{organization.governorate}</dd>
        <dt>Area</dt>
        <dd>{organization.area}</dd>
        <dt>Address</dt>
        <dd>{organization.address}</dd>
        <dt>Contact email</dt>
        <dd>{organization.contactEmail}</dd>
        {organization.website && (
          <>
            <dt>Website</dt>
            <dd>{organization.website}</dd>
          </>
        )}
        {organization.contactPhone && (
          <>
            <dt>Phone</dt>
            <dd>{organization.contactPhone}</dd>
          </>
        )}
        {organization.whatsappNumber && (
          <>
            <dt>WhatsApp</dt>
            <dd>{organization.whatsappNumber}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
