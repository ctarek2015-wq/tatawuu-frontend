const CampaignReview = ({ campaigns, setCampaigns }) => (
  <section aria-labelledby="campaign-queue-heading">
    <h2 id="campaign-queue-heading">Submitted items</h2>
    {campaigns.length === 0 ? (
      <p>No campaigns match this status.</p>
    ) : (
      <ul>
        {campaigns.map((campaign) => {
          const id = campaign._id || campaign.id;

          return (
            <li key={id}>
              <h3>{campaign.title || "Untitled campaign"}</h3>
              <p>{campaign.status || "Unknown status"}</p>
              <button
                type="button"
                onClick={() =>
                  setCampaigns(campaigns.filter((c) => (c._id || c.id) !== id))
                }
              >
                Review
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);

export default CampaignReview;
