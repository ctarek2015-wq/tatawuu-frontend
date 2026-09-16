const OrganizationContacts = ({ organization }) => {
  if (!organization) return null;

  return (
    <div>
      {organization.contactEmail && <p><a href={`mailto:${organization.contactEmail}`}>Email organization</a></p>}
      {organization.contactPhone && <p><a href={`tel:${organization.contactPhone}`}>Call organization</a></p>}
      {organization.whatsappNumber && <p><a href={`https://wa.me/${organization.whatsappNumber.replace(/[^0-9]/g, "")}`}>WhatsApp organization</a></p>}
      {organization.website && <p><a href={organization.website}>Organization website</a></p>}
    </div>
  );
};

export default OrganizationContacts;
