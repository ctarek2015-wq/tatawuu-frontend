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

  return (
    <main className="org-list-page">
      <div className="sec-heading" style={{ margin: 0, textAlign: "left" }}>
        <h1 className="sec-title">
          {t("Discover")} <em>{t("Organizations")}</em>
        </h1>
        <p className="sec-desc">
          {t(
            "Browse verified organizations making a difference in your community.",
          )}
        </p>
      </div>

      {loading && <p className="state-msg">{t("Loading organizations...")}</p>}

      {error && (
        <p className="state-msg state-error" role="alert">
          {tError(error)}
        </p>
      )}

      {!loading && !error && organizations.length === 0 && (
        <p className="state-msg">{t("No approved organizations yet.")}</p>
      )}

      {!loading && !error && organizations.length > 0 && (
        <div className="org-grid">
          {organizations.map((organization) => (
            <article key={organization._id} className="org-card">
              <div className="org-card-img-wrap">
                {organization.logo ? (
                  <img
                    src={organization.logo}
                    alt={organization.name}
                    className="org-card-img"
                  />
                ) : (
                  <div className="org-card-img org-card-img-placeholder">
                    {organization.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="org-card-body">
                <h2 className="org-card-title">
                  <Link to={`/organizations/${organization._id}`}>
                    {organization.name}
                  </Link>
                </h2>
                <p className="org-card-meta">
                  {organization.area}, {t(organization.governorate)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrganizationList;
