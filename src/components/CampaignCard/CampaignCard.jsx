import { useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import { formatDateTime } from "../../utils/dates.js";

const CampaignCard = ({ campaign }) => {
  const { language, t } = useContext(LanguageContext);

  return (
    <article className="campaign-card">
      {campaign.coverImage && (
        <img
          className="campaign-card-image"
          src={campaign.coverImage}
          alt={campaign.title}
        />
      )}

      <div className="campaign-card-content">
        <span className="campaign-card-category">{t(campaign.category)}</span>

        <h3 className="campaign-card-title">
          <Link to={`/campaigns/${campaign._id}`}>{campaign.title}</Link>
        </h3>

        <p className="campaign-card-organization">
          {campaign.organizationId?.name}
        </p>

        <p className="campaign-card-location">
          {campaign.area}, {t(campaign.governorate)}, {t("Bahrain")}
        </p>

        <p className="campaign-card-date">
          {formatDateTime(campaign.startsAt, language)}
          {" — "}
          {formatDateTime(campaign.endsAt, language)}
        </p>

        <p className="campaign-card-time">{t("Bahrain time")}</p>

        <p className="campaign-card-places">
          {t("{count} places available", {
            count: campaign.availablePlaces,
          })}
        </p>

        <Link
          to={`/campaigns/${campaign._id}`}
          className="campaign-card-button"
        >
          {t("View activity")}
        </Link>
      </div>
    </article>
  );
};

export default CampaignCard;
