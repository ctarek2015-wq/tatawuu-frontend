import OrganizationProfile from "./OrganizationProfile";
import CampaignManager from "../../campaign/dashboard/CampaignManager";

const OrganizerDashboard = () => {
  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <OrganizationProfile />
      <CampaignManager />
    </div>
  );
};

export default OrganizerDashboard;
