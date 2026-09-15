import { useParams, useNavigate } from "react-router";
import { useContext } from "react";
import { DataContext } from "../../contexts/UserContext";
const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns } = useContext(DataContext);
  const campaign = campaigns.find((c) => c._id === id);
  console.log(campaigns);

  return (
    <div>
      <h1>Campaign Detail</h1>
      {campaign && (
        <div key={campaign._id}>
          <h2>{campaign.title}</h2>
          <p>{campaign.description}</p>
          <p>Category: {campaign.category}</p>
          <p>Start Date: {campaign.startDate.split("T")[0]}</p>
          <p>End Date: {campaign.endDate.split("T")[0]}</p>
          <p>Location: {campaign.governorate}</p>
          <p>Organizer: {campaign.organizer}</p>
          <p>Capacity: {campaign.capacity}</p>
          <p>Status: {campaign.status}</p>
          <p>Created At: {campaign.createdAt.split("T")[0]}</p>
          <p>Updated At: {campaign.updatedAt.split("T")[0]}</p>
        </div>
      )}
      <button onClick={() => navigate(-1)}>Back to Campaigns</button>
    </div>
  );
};

export default CampaignDetail;
