import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import CampaignCard from "../CampaignCard/CampaignCard.jsx";

const CampaignGrid = ({ campaigns }) => {
  const { t } = useContext(LanguageContext);
  if (campaigns.length === 0) return <p>{t("No activities found.")}</p>;
  return <div>{campaigns.map((campaign) => <CampaignCard key={campaign._id} campaign={campaign} />)}</div>;
};

export default CampaignGrid;
