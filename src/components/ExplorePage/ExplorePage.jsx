import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import CampaignGrid from "../CampaignGrid/CampaignGrid.jsx";
import { categories, governorates } from "../../utils/options.js";
import { dateOnly } from "../../utils/dates.js";

const emptyFilters = { search: "", governorate: "", area: "", category: "", from: "", to: "" };

const ExplorePage = () => {
  const { orgId } = useParams();
  const { t, tError } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setCampaigns(await campaignService.index());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const text = `${campaign.title} ${campaign.organizationId?.name || ""}`.toLowerCase();
    const date = dateOnly(campaign.startsAt);
    return new Date(campaign.startsAt) > new Date()
      && (!orgId || campaign.organizationId?._id === orgId)
      && text.includes(filters.search.toLowerCase())
      && (!filters.governorate || campaign.governorate === filters.governorate)
      && campaign.area.toLowerCase().includes(filters.area.toLowerCase())
      && (!filters.category || campaign.category === filters.category)
      && (!filters.from || date >= filters.from)
      && (!filters.to || date <= filters.to);
  });
  const pages = Math.max(1, Math.ceil(filteredCampaigns.length / 6));
  const shownPage = Math.min(page, pages);
  const visibleCampaigns = filteredCampaigns.slice((shownPage - 1) * 6, shownPage * 6);
  const hasFilters = filters.governorate || filters.area || filters.category || filters.from || filters.to;

  return (
    <main>
      <h1>{t("Volunteer in Bahrain")}</h1>
      <p>{t("Find a local activity and make time for your community.")}</p>
      <label>{t("Search")} <input name="search" value={filters.search} onChange={handleChange} placeholder={t("Activity or organization")} /></label>
      <button type="button" aria-expanded={showFilters} aria-controls="campaign-filters" onClick={() => setShowFilters(!showFilters)}>
        {t(showFilters ? "Hide filters" : "Show filters")}
      </button>
      {!showFilters && hasFilters && <span>{t("Filters applied")}</span>}
      <div id="campaign-filters" hidden={!showFilters}>
        <label>{t("Governorate")} <select name="governorate" value={filters.governorate} onChange={handleChange}>
          <option value="">{t("All governorates")}</option>
          {governorates.map((governorate) => <option key={governorate} value={governorate}>{t(governorate)}</option>)}
        </select></label>
        <label>{t("Area")} <input name="area" value={filters.area} onChange={handleChange} /></label>
        <label>{t("Category")} <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">{t("All categories")}</option>
          {categories.map((category) => <option key={category} value={category}>{t(category)}</option>)}
        </select></label>
        <label>{t("From date")} <input type="date" dir="ltr" name="from" value={filters.from} onChange={handleChange} /></label>
        <label>{t("To date")} <input type="date" dir="ltr" name="to" value={filters.to} onChange={handleChange} /></label>
      </div>
      <button type="button" onClick={() => { setFilters(emptyFilters); setPage(1); }}>{t("Clear filters")}</button>
      <h2>{t("Upcoming activities")}</h2>
      {loading && <p>{t("Loading activities...")}</p>}
      {error && <p role="alert">{tError(error)}</p>}
      {!loading && !error && <>
        <CampaignGrid campaigns={visibleCampaigns} />
        <button type="button" disabled={shownPage === 1} onClick={() => setPage(shownPage - 1)}>{t("Previous")}</button>
        <span> {t("Page {page} of {pages}", { page: shownPage, pages })} </span>
        <button type="button" disabled={shownPage === pages} onClick={() => setPage(shownPage + 1)}>{t("Next")}</button>
      </>}
    </main>
  );
};

export default ExplorePage;
