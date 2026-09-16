import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import * as campaignService from "../../../../services/campaignService.js";
import CampaignCard from "../../../../components/CampaignCard/CampaignCard.jsx";

const Favorites = () => {
  const { t, tError } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setCampaigns(await campaignService.favorites());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const handleFavoriteChange = (id, isFavorite) => {
    if (!isFavorite) {
      setCampaigns((prev) => prev.filter((campaign) => campaign._id !== id));
    }
  };

  return (
    <main className="favorites-page">
      <div className="sec-heading" style={{ margin: 0, textAlign: "left" }}>
        <h1 className="sec-title">
          {t("My")} <em>{t("favorites")}</em>
        </h1>
        <p className="sec-desc">{t("Activities you've saved for later.")}</p>
      </div>

      {loading && <p className="state-msg">{t("Loading favorites...")}</p>}
      {error && (
        <p className="state-msg state-error" role="alert">
          {tError(error)}
        </p>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <p className="state-msg">
          {t("Explore activities to save your first favorite.")}
        </p>
      )}

      {!loading && !error && campaigns.length > 0 && (
        <div className="favorites-grid">
          {campaigns.map((campaign) =>
            campaign.unavailable ? (
              <div key={campaign._id} className="favorites-unavailable-card">
                <p className="state-msg">
                  {t("Activity no longer available.")}
                </p>
              </div>
            ) : (
              <CampaignCard
                key={campaign._id}
                campaign={{ ...campaign, isFavorited: true }}
                onFavoriteChange={handleFavoriteChange}
              />
            ),
          )}
        </div>
      )}
    </main>
  );
};

export default Favorites;
