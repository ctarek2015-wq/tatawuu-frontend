import { useNavigate } from "react-router";
import { useContext } from "react";
import { DataContext } from "../../../contexts/UserContext";
function CampaignList() {
  const navigate = useNavigate();
  const { campaigns, organizations } = useContext(DataContext);
  const handleViewCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div>
      <h1>Campaign List</h1>
      <div>
        <ul>
          {campaigns.map((c) => (
            <li key={c._id}>
              {c.title}
              <button onClick={() => handleViewCampaign(c._id)}>View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default CampaignList;
