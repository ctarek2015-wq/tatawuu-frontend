import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../../contexts/LanguageContext.js";
import * as organizationService from "../../../services/organizationService.js";

const OrganizationList = () => {
  const { t, tError } = useContext(LanguageContext);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setOrganizations(await organizationService.index());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrganizations();
  }, []);

  return <main>
    <h1>{t("Organizations")}</h1>
    {loading && <p>{t("Loading organizations...")}</p>}
    {error && <p role="alert">{tError(error)}</p>}
    {!loading && !error && organizations.length === 0 && <p>{t("No approved organizations yet.")}</p>}
    {organizations.map((organization) => <article key={organization._id}>
      {organization.logo && <img src={organization.logo} alt={organization.name} width="100" />}
      <h2><Link to={`/organizations/${organization._id}`}>{organization.name}</Link></h2>
      <p>{organization.area}, {t(organization.governorate)}</p>
    </article>)}
  </main>;
};

export default OrganizationList;
