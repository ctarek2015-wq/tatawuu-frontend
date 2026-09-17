import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import OrganizationForm from "./OrganizationForm.jsx";
import OrganizationView from "./OrganizationView.jsx";
import * as organizationService from "../../../../services/organizationService.js";
import * as campaignService from "../../../../services/campaignService.js";

const OrganizationProfile = () => {
  const { t, tError } = useContext(LanguageContext);
  const [organization, setOrganization] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasCampaigns, setHasCampaigns] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const [data, campaigns] = await Promise.all([
          organizationService.showMine(),
          campaignService.showMine(),
        ]);
        setOrganization(data);
        setHasCampaigns(campaigns.length > 0);
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
    setSuccess("");
  };

  const handleDelete = async () => {
    if (!window.confirm(t("Delete this organization?"))) return;
    setDeleting(true);
    setMessage("");
    try {
      await organizationService.remove(organization._id);
      setOrganization(null);
      setSuccess("Organization deleted.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setDeleting(false);
    }
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
      {success && <p role="status">{t(success)}</p>}

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
      {organization && !editing && !hasCampaigns && (
        <button
          type="button"
          className="btn-danger-outline"
          disabled={deleting}
          onClick={handleDelete}
        >
          {t("Delete organization")}
        </button>
      )}
    </main>
  );
};

export default OrganizationProfile;
