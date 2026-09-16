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

  if (loading) return <p>{t("Loading organization...")}</p>;

  return (
    <main>
      <h1>{t("My organization")}</h1>
      <Link to="/organizer">{t("Organizer dashboard")}</Link>
      <p>{tError(message)}</p>
      {editing ? (
        <OrganizationForm organization={organization} onSubmit={handleSubmit} onCancel={() => setEditing(false)} />
      ) : organization ? (
        <OrganizationView organization={organization} onEdit={() => setEditing(true)} />
      ) : (
        <button onClick={() => setEditing(true)}>{t("Create organization")}</button>
      )}
    </main>
  );
};

export default OrganizationProfile;
