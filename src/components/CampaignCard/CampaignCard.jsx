import { useContext, useState } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import { formatDateTime } from "../../utils/dates.js";
import * as campaignService from "../../services/campaignService.js";

const CampaignCard = ({ campaign, onFavoriteChange }) => {
  const { language, t, tError } = useContext(LanguageContext);
  const { user } = useContext(UserContext);
  const isFavorite = (campaign.favorites || []).includes(user?._id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleToggleFavorite = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const updated = isFavorite
        ? await campaignService.unfavorite(campaign._id)
        : await campaignService.favorite(campaign._id);
      onFavoriteChange?.(campaign._id, !isFavorite, updated);
    } catch (err) {
      setError(err.message);
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

        {user?.role === "Volunteer" && (
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
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 21s-6.7-4.35-9.33-8.05C.86 10.36 1.4 6.6 4.3 5.06c2.2-1.18 4.9-.5 6.3 1.5l1.4 2 1.4-2c1.4-2 4.1-2.68 6.3-1.5 2.9 1.54 3.44 5.3 1.63 7.89C18.7 16.65 12 21 12 21z"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="campaign-card-content">
        <span className="campaign-card-category">{t(campaign.category)}</span>

        <h3 className="campaign-card-title">
          <Link to={`/campaigns/${campaign._id}`}>
            <bdi>{campaign.title}</bdi>
          </Link>
        </h3>

        <p className="campaign-card-organization">
          <bdi>{campaign.organizationId?.name}</bdi>
        </p>

        <p className="campaign-card-location">
          <bdi>{campaign.area}</bdi>, {t(campaign.governorate)}, {t("Bahrain")}
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
        {error && (
          <p role="alert" className="state-msg state-error">
            {tError(error)}
          </p>
        )}

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
