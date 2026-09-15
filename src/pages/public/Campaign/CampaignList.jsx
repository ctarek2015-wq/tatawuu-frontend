function CampaignList({ campaigns }) {
  return (
    <div>
      <h1>Campaign List</h1>
      <div>
        <ul>
          {campaigns.map((c) => (
            <li key={c._id}>{c.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default CampaignList;
