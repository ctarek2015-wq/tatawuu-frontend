import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LanguageContext } from "../../../contexts/LanguageContext.js";
import * as organizationService from "../../../services/organizationService.js";
import * as campaignService from "../../../services/campaignService.js";
import OrganizationContacts from "../../../components/OrganizationContacts/OrganizationContacts.jsx";
import CampaignGrid from "../../../components/CampaignGrid/CampaignGrid.jsx";
import LocationMap from "../../../components/LocationMap/LocationMap.jsx";

const OrganizationDetail = () => {
  const { id } = useParams();
  const { t, tError } = useContext(LanguageContext);
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrganization = async () => {
      setLoading(true);
      setError("");
      try {
        const org = await organizationService.show(id);
        const allCampaigns = await campaignService.index();
        setOrganization(org);
        setCampaigns(
          allCampaigns.filter(
            (campaign) =>
              campaign.organizationId?._id === id &&
              new Date(campaign.startsAt) > new Date(),
          ),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrganization();
  }, [id]);

  const handleFavoriteChange = (campaignId, _isFavorite, updated) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign._id === campaignId ? updated : campaign,
      ),
    );
  };

  if (loading) {
    return (
      <main className="org-detail-page">
        <p className="state-msg">{t("Loading organization...")}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="org-detail-page">
        <p className="state-msg state-error" role="alert">
          {tError(error)}
        </p>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="org-detail-page">
        <p className="state-msg">{t("Organization unavailable.")}</p>
      </main>
    );
  }

  return (
    <main className="org-detail-page">
      <section className="org-detail-card">
        <div className="org-detail-header">
          {organization.logo ? (
            <img
              className="org-detail-logo"
              src={organization.logo}
              alt={organization.name}
            />
          ) : (
            <div className="org-detail-logo org-detail-logo-placeholder">
              {organization.name.charAt(0)}
            </div>
          )}
          <div className="org-detail-heading">
            <h1 className="org-detail-name">
              <bdi>{organization.name}</bdi>
            </h1>
            <p className="org-detail-address">
              <bdi>{organization.address}</bdi> — <bdi>{organization.area}</bdi>
              , {t(organization.governorate)}, {t("Bahrain")}
            </p>
          </div>
        </div>

        <p className="org-detail-description" dir="auto">
          {organization.description}
        </p>

        <div className="org-detail-map">
          <LocationMap location={organization} />
        </div>

        <div className="org-detail-contacts">
          <OrganizationContacts organization={organization} />
        </div>
      </section>

      <section className="org-detail-campaigns">
        <h2 className="sec-title org-detail-campaigns-title">
          {t("Upcoming activities")}
        </h2>
        <CampaignGrid
          campaigns={campaigns}
          onFavoriteChange={handleFavoriteChange}
        />
        <Link className="btn-link" to={`/organizations/${id}/campaigns`}>
          {t("Browse all activities")}
        </Link>
      </section>
    </main>
  );
};

export default OrganizationDetail;
