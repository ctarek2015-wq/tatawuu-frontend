import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";

const OrganizationView = ({ organization, onEdit }) => {
  const { t } = useContext(LanguageContext);
  return (
    <section>
      <h2><bdi>{organization.name}</bdi></h2>
      <p>{t("Status")}: {t(organization.status)}</p>
      {organization.reviewReason && <p>{t("Review feedback")}: <bdi>{organization.reviewReason}</bdi></p>}
      {organization.logo && <img src={organization.logo} alt={t("{name} logo", { name: organization.name })} width="160" />}
      <p dir="auto">{organization.description}</p>
      <p>{organization.address}, {organization.area}, {t(organization.governorate)}, {t("Bahrain")}</p>
      <LocationMap location={organization} />
      <OrganizationContacts organization={organization} />
      <button onClick={onEdit}>{t("Edit organization")}</button>
    </section>
  );
};

export default OrganizationView;
