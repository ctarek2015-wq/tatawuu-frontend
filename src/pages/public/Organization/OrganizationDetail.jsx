import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
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
        setCampaigns(allCampaigns.filter((campaign) => campaign.organizationId?._id === id && new Date(campaign.startsAt) > new Date()));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrganization();
  }, [id]);

  if (loading) return <p>{t("Loading organization...")}</p>;
  if (error) return <p role="alert">{tError(error)}</p>;
  if (!organization) return <p>{t("Organization unavailable.")}</p>;

  return <main>
    <h1>{organization.name}</h1>
    {organization.logo && <img src={organization.logo} alt={organization.name} width="200" />}
    <p>{organization.description}</p>
    <p>{organization.address} — {organization.area}, {t(organization.governorate)}, {t("Bahrain")}</p>
    <LocationMap location={organization} />
    <OrganizationContacts organization={organization} />
    <h2>{t("Upcoming activities")}</h2>
    <CampaignGrid campaigns={campaigns} />
  </main>;
};

export default OrganizationDetail;
