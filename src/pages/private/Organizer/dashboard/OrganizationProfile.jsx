import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import OrganizationForm from "./OrganizationForm.jsx";
import OrganizationView from "./OrganizationView.jsx";
import * as organizationService from "../../../../services/organizationService.js";

const OrganizationProfile = () => {
  const { t, tError } = useContext(LanguageContext);
  const [organization, setOrganization] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await organizationService.showMine();
        setOrganization(data);
        setEditing(!data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, []);

  const handleSubmit = async (formData) => {
    const savedOrganization = organization
      ? await organizationService.update(organization._id, formData)
      : await organizationService.create(formData);
    setOrganization(savedOrganization);
    setEditing(false);
  };

  if (loading) {
    return (
      <main className="org-profile-page">
        <p className="state-msg">{t("Loading organization...")}</p>
      </main>
    );
  }

  return (
    <main
      className={
        editing ? "org-profile-page org-profile-page-form" : "org-profile-page"
      }
    >
      <div className="org-profile-header">
        <h1 className="org-profile-title">{t("My organization")}</h1>
        <Link className="org-profile-back" to="/organizer">
          {t("Organizer dashboard")}
        </Link>
      </div>

      {message && (
        <p className="state-msg state-error org-profile-message" role="alert">
          {tError(message)}
        </p>
      )}

      {editing ? (
        <OrganizationForm
          organization={organization}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(false)}
        />
      ) : organization ? (
        <OrganizationView
          organization={organization}
          onEdit={() => setEditing(true)}
        />
      ) : (
        <div className="org-profile-empty">
          <p className="org-profile-empty-text">
            {t("You haven't set up your organization yet.")}
          </p>
          <button className="btn-primary-dark" onClick={() => setEditing(true)}>
            {t("Create organization")}
          </button>
        </div>
      )}
    </main>
  );
};

export default OrganizationProfile;
