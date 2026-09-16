import CampaignCard from "../CampaignCard/CampaignCard";

const CampaignGrid = ({ campaigns }) => {
  return (
    <div>
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign._id} campaign={campaign} />
      ))}
    </div>
  );
};

export default CampaignGrid;