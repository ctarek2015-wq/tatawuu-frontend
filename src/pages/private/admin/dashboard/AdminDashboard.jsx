import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useState } from "react";
import CampaignReview from "./CampaignReview.jsx";
import OrganizationReview from "./OrganizationReview.jsx";

const AdminDashboard = () => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("organizations");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main>
      <h1>{t("Moderation")}</h1>
      <div>
        <button type="button" onClick={() => handleTabChange("organizations")}>{t("Organizations")}</button>
        <button type="button" onClick={() => handleTabChange("campaigns")}>{t("Campaigns")}</button>
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
