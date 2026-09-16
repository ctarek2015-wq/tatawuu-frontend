import CampaignCard from "../CampaignCard/CampaignCard.jsx";

const CampaignGrid = ({ campaigns }) => {
  if (campaigns.length === 0) return <p>No activities found.</p>;
  return <div>{campaigns.map((campaign) => <CampaignCard key={campaign._id} campaign={campaign} />)}</div>;
};

export default CampaignGrid;
