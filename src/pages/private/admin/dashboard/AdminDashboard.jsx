import { useEffect, useState, useContext, act } from "react";
import { DataContext, UserContext } from "../../../../contexts/UserContext.jsx";
import CampaignReviewQueue from "./CampaignReview.jsx";
import OrganizationReviewQueue from "./OrganizationReview.jsx";
import * as campaignService from "../../../../services/campaignService.js";
import * as organizationService from "../../../../services/organizationService.js";

const getId = (item) => item?._id || item?.id;
const isPending = (item) => item?.status?.toLowerCase() === "pending";

const AdminDashboard = () => {
  const { campaigns, setCampaigns, organizations, setOrganizations } =
    useContext(DataContext);
  const { loading, setLoading } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("organizations");

  useEffect(() => {
    const loadReviewItems = async () => {
      setLoading(true);

      try {
        const campaignData = await campaignService.index();
        const organizationData = await organizationService.index();

        setCampaigns(campaignData.filter(isPending));
        setOrganizations(organizationData.filter(isPending));
      } catch (loadError) {
        console.log(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadReviewItems();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main>
      <h1>Moderation</h1>
      <div>
        <button type="button" onClick={() => handleTabChange("organizations")}>
          Organizations
        </button>
        <button type="button" onClick={() => handleTabChange("campaigns")}>
          Campaigns
        </button>
      </div>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <>
          {activeTab === "organizations" ? (
            <OrganizationReviewQueue
              organizations={organizations}
              setOrganizations={setOrganizations}
            />
          ) : (
            <CampaignReviewQueue
              campaigns={campaigns}
              setCampaigns={setCampaigns}
            />
          )}
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
