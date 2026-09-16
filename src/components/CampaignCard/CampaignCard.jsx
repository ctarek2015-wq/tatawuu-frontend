import { useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import { formatDateTime } from "../../utils/dates.js";

const CampaignCard = ({ campaign }) => {
  const { language, t } = useContext(LanguageContext);
  return (
    <article>
      {campaign.coverImage && <img src={campaign.coverImage} alt={campaign.title} width="240" />}
      <h3><Link to={`/campaigns/${campaign._id}`}>{campaign.title}</Link></h3>
      <p>{campaign.organizationId?.name}</p>
      <p>{campaign.area}, {t(campaign.governorate)}, {t("Bahrain")}</p>
      <p>{formatDateTime(campaign.startsAt, language)} — {formatDateTime(campaign.endsAt, language)} ({t("Bahrain time")})</p>
      <p>{t("{count} places available", { count: campaign.availablePlaces })}</p>
    </article>
  );
};

export default CampaignCard;
