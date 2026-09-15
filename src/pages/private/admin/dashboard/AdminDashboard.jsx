import { useState } from "react";
import CampaignReview from "./CampaignReview.jsx";
import OrganizationReview from "./OrganizationReview.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("organizations");

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

      {activeTab === "organizations" ? (
        <OrganizationReview />
      ) : (
        <CampaignReview />
      )}
    </main>
  );
};

export default AdminDashboard;
