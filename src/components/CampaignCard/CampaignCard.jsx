import { Link } from "react-router";
import { formatDateTime } from "../../utils/dates.js";

const CampaignCard = ({ campaign }) => {
  return (
    <article>
      {campaign.coverImage && <img src={campaign.coverImage} alt={campaign.title} width="240" />}
      <h3><Link to={`/campaigns/${campaign._id}`}>{campaign.title}</Link></h3>
      <p>{campaign.organizationId?.name}</p>
      <p>{campaign.area}, {campaign.governorate}, Bahrain</p>
      <p>{formatDateTime(campaign.startsAt)} — {formatDateTime(campaign.endsAt)} (Bahrain time)</p>
      <p>{campaign.availablePlaces} places available</p>
    </article>
  );
};

export default CampaignCard;
