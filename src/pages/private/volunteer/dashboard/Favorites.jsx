import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import * as campaignService from "../../../../services/campaignService.js";
import CampaignCard from "../../../../components/CampaignCard/CampaignCard.jsx";

const Favorites = () => {
  const { t, tError } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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

  const handleRemove = async (id) => {
    setBusy(true);
    setError("");
    try {
      await campaignService.unfavorite(id);
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return <main>
    <h1>{t("My favorites")}</h1>
    {loading && <p>{t("Loading favorites...")}</p>}
    {error && <p role="alert">{tError(error)}</p>}
    {!loading && !error && campaigns.length === 0 && <p>{t("Explore activities to save your first favorite.")}</p>}
    {campaigns.map((campaign) => <section key={campaign._id}>
      {campaign.unavailable ? <p>{t("Activity no longer available.")}</p> : <CampaignCard campaign={campaign} />}
      <button type="button" disabled={busy} onClick={() => handleRemove(campaign._id)}>{t("Remove from favorites")}</button>
    </section>)}
  </main>;
};

export default Favorites;
