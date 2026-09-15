import { useContext, useEffect } from "react";
import { DataContext, UserContext } from "../../../../contexts/UserContext";

import * as campaignService from "../../../../services/campaignService.js";

const CampaignReview = () => {
  const { campaigns, setCampaigns } = useContext(DataContext);
  const { loading, setLoading } = useContext(UserContext);

  const handleApprove = async (id) => {
    await campaignService.update(id, { status: "Approved" });
  };

  const handleReject = async (id) => {
    await campaignService.update(id, { status: "Rejected" });
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await campaignService.index();
      setCampaigns(data);
    };
    fetchCampaigns();
  }, [setCampaigns]);

  return (
    <section>
      <h2>Waiting for Review</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns match this status.</p>
      ) : (
        <ul>
          {campaigns.map((campaign) => {
            const id = campaign._id;

            return (
              <li key={id}>
                <h3>{campaign.title}</h3>
                <p>{campaign.status}</p>
                <button type="button" onClick={() => handleApprove(id)}>
                  Approve
                </button>
                <button type="button" onClick={() => handleReject(id)}>
                  Reject
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default CampaignReview;
