import { useContext, useState } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import { formatDateTime } from "../../utils/dates.js";
import * as campaignService from "../../services/campaignService.js";

const CampaignCard = ({ campaign, onFavoriteChange }) => {
  const { language, t } = useContext(LanguageContext);
  const [isFavorite, setIsFavorite] = useState(Boolean(campaign.isFavorited));
  const [busy, setBusy] = useState(false);

  const handleToggleFavorite = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (isFavorite) {
        await campaignService.unfavorite(campaign._id);
        setIsFavorite(false);
        onFavoriteChange?.(campaign._id, false);
      } else {
        await campaignService.favorite(campaign._id);
        setIsFavorite(true);
        onFavoriteChange?.(campaign._id, true);
      }
    } catch (err) {
      // fail silently on card; page-level error state (if any) can surface this
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="campaign-card">
      <div className="campaign-card-image-wrap">
        {campaign.coverImage && (
          <img
            className="campaign-card-image"
            src={campaign.coverImage}
            alt={campaign.title}
          />
        )}

        <button
          type="button"
          className={`campaign-card-favorite${isFavorite ? " is-favorite" : ""}`}
          onClick={handleToggleFavorite}
          disabled={busy}
          aria-pressed={isFavorite}
          aria-label={t(
            isFavorite ? "Remove from favorites" : "Add to favorites",
          )}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M12 21s-6.7-4.35-9.33-8.05C.86 10.36 1.4 6.6 4.3 5.06c2.2-1.18 4.9-.5 6.3 1.5l1.4 2 1.4-2c1.4-2 4.1-2.68 6.3-1.5 2.9 1.54 3.44 5.3 1.63 7.89C18.7 16.65 12 21 12 21z"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

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
