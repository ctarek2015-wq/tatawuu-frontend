import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";

const OrganizationView = ({ organization, onEdit }) => {
  return (
    <section>
      <h2>{organization.name}</h2>
      <p>Status: {organization.status}</p>
      {organization.reviewReason && <p>Review feedback: {organization.reviewReason}</p>}
      {organization.logo && <img src={organization.logo} alt={`${organization.name} logo`} width="160" />}
      <p>{organization.description}</p>
      <p>{organization.address}, {organization.area}, {organization.governorate}, Bahrain</p>
      <OrganizationContacts organization={organization} />
      <button onClick={onEdit}>Edit organization</button>
    </section>
  );
};

export default OrganizationView;
