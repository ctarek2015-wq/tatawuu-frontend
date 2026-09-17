import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useState } from "react";
import CampaignReview from "./CampaignReview.jsx";
import OrganizationReview from "./OrganizationReview.jsx";

const AdminDashboard = () => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("organizations");

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">{t("Moderation")}</h1>
      </div>

      <div className="admin-tab-bar">
        <button
          type="button"
          className={`admin-tab-btn${activeTab === "organizations" ? " is-active" : ""}`}
          aria-pressed={activeTab === "organizations"}
          onClick={() => setActiveTab("organizations")}
        >
          {t("Organizations")}
        </button>
        <button
          type="button"
          className={`admin-tab-btn${activeTab === "campaigns" ? " is-active" : ""}`}
          aria-pressed={activeTab === "campaigns"}
          onClick={() => setActiveTab("campaigns")}
        >
          {t("Campaigns")}
        </button>
      </div>

      <div className="admin-tab-content">
        {activeTab === "organizations" ? (
          <OrganizationReview />
        ) : (
          <CampaignReview />
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
