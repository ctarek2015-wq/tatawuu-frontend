import { Link } from "react-router";
import RegisterButton from "../../pages/public/RegisterButton/RegisterButton";

const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="campaign-card">
      <div className="campaign-cover">
        {campaign.coverImage ? (
          <img src={campaign.coverImage} alt={campaign.title} />
        ) : (
          <span>Campaign cover</span>
        )}
      </div>

      <h3>{campaign.title}</h3>

      <p>{campaign.organization?.name}</p>

      <p>
        {campaign.area} - {campaign.governorate}
      </p>

      <p>
        {formatDate(campaign.startDate)} • {campaign.startTime} -{" "}
        {campaign.endTime} Bahrain time
      </p>

      <span>
        {campaign.capacity - campaign.registeredCount} places available
      </span>

      <RegisterButton campaign={campaign} />

      <Link to={`/campaigns/${campaign._id}`}>View activity</Link>
    </div>
  );
};

export default CampaignCard;