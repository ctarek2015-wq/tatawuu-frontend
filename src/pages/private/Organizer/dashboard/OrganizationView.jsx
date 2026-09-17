import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext } from "react";
import OrganizationContacts from "../../../../components/OrganizationContacts/OrganizationContacts.jsx";

const OrganizationView = ({ organization, onEdit }) => {
  const { t } = useContext(LanguageContext);

  const statusClass = `org-view-status org-view-status-${organization.status?.toLowerCase() || "pending"}`;

  return (
    <section className="org-view-card">
      <div className="org-view-header">
        {organization.logo ? (
          <img
            className="org-view-logo"
            src={organization.logo}
            alt={t("{name} logo", { name: organization.name })}
          />
        ) : (
          <div className="org-view-logo org-view-logo-placeholder">
            {organization.name.charAt(0)}
          </div>
        )}

        <div className="org-view-heading">
          <h2 className="org-view-name">
            <bdi>{organization.name}</bdi>
          </h2>
          <span className={statusClass}>{t(organization.status)}</span>
        </div>
      </div>

      {organization.reviewReason && (
        <p className="org-view-review">
          <strong>{t("Review feedback")}:</strong>{" "}
          <bdi>{organization.reviewReason}</bdi>
        </p>
      )}

      <p className="org-view-description" dir="auto">
        {organization.description}
      </p>

      <p className="org-view-address">
        <bdi>{organization.address}</bdi>, <bdi>{organization.area}</bdi>,{" "}
        {t(organization.governorate)}, {t("Bahrain")}
      </p>

      <div className="org-view-map">
        <LocationMap location={organization} />
      </div>

      <div className="org-view-contacts">
        <OrganizationContacts organization={organization} />
      </div>

      <div className="org-view-actions">
        <button className="btn-primary-dark" onClick={onEdit}>
          {t("Edit organization")}
        </button>
      </div>
    </section>
  );
};

export default OrganizationView;
