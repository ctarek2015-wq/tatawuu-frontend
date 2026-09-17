import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import CampaignGrid from "../CampaignGrid/CampaignGrid.jsx";
import { categories, governorates } from "../../utils/options.js";
import { dateOnly } from "../../utils/dates.js";
import Footer from "../Footer/Footer.jsx";

const emptyFilters = {
  search: "",
  governorate: "",
  area: "",
  category: "",
  from: "",
  to: "",
};

const CampaignsPage = () => {
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

  const handleFavoriteChange = (id, _isFavorite, updated) => {
    setCampaigns((current) =>
      current.map((campaign) => (campaign._id === id ? updated : campaign)),
    );
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const text =
      `${campaign.title} ${campaign.organizationId?.name || ""}`.toLowerCase();
    const date = dateOnly(campaign.startsAt);
    return (
      new Date(campaign.startsAt) > new Date() &&
      (!orgId || campaign.organizationId?._id === orgId) &&
      text.includes(filters.search.toLowerCase()) &&
      (!filters.governorate || campaign.governorate === filters.governorate) &&
      (campaign.area || "")
        .toLowerCase()
        .includes(filters.area.toLowerCase()) &&
      (!filters.category || campaign.category === filters.category) &&
      (!filters.from || date >= filters.from) &&
      (!filters.to || date <= filters.to)
    );
  });
  const pages = Math.max(1, Math.ceil(filteredCampaigns.length / 6));
  const shownPage = Math.min(page, pages);
  const visibleCampaigns = filteredCampaigns.slice(
    (shownPage - 1) * 6,
    shownPage * 6,
  );
  const hasFilters =
    filters.search ||
    filters.governorate ||
    filters.area ||
    filters.category ||
    filters.from ||
    filters.to;

  return (
    <>
      <main className="campaigns-page">
        <div className="campaigns-page-header">
          <div
            className="sec-heading"
            style={{ margin: 0, textAlign: "start" }}
          >
            <h1 className="sec-title">{t("Volunteer in Bahrain")}</h1>
            <p className="sec-desc">
              {t("Find a local activity and make time for your community.")}
            </p>
          </div>
        </div>
        <div className="filter-bar">
          <div className="filter-bar-inline">
            <label className="field field-search">
              <span className="field-label">{t("Search")}</span>
              <input
                name="search"
                dir="auto"
                value={filters.search}
                onChange={handleChange}
                placeholder={t("Activity or organization")}
              />
            </label>
            <button
              type="button"
              className="btn-soft"
              aria-expanded={showFilters}
              aria-controls="campaign-filters"
              onClick={() => setShowFilters(!showFilters)}
            >
              {t(showFilters ? "Hide filters" : "Show filters")}
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setFilters(emptyFilters);
                setPage(1);
              }}
            >
              {t("Clear filters")}
            </button>
          </div>
          {showFilters && (
            <div className="filter-panel-inline" id="campaign-filters">
              <label className="field">
                <span className="field-label">{t("Category")}</span>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                >
                  <option value="">{t("All categories")}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {t(category)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">{t("Governorate")}</span>
                <select
                  name="governorate"
                  value={filters.governorate}
                  onChange={handleChange}
                >
                  <option value="">{t("All governorates")}</option>
                  {governorates.map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {t(governorate)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">{t("Area")}</span>
                <input
                  name="area"
                  dir="auto"
                  value={filters.area}
                  onChange={handleChange}
                />
              </label>
              <label className="field">
                <span className="field-label">{t("From date")}</span>
                <input
                  type="date"
                  dir="ltr"
                  name="from"
                  value={filters.from}
                  onChange={handleChange}
                />
              </label>
              <label className="field">
                <span className="field-label">{t("To date")}</span>
                <input
                  type="date"
                  dir="ltr"
                  name="to"
                  value={filters.to}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}
          {hasFilters && (
            <span className="filter-chip">{t("Filters applied")}</span>
          )}
        </div>
        <div className="campaigns-page-results">
          <h2 className="results-title">
            {t(hasFilters ? "Filtered activities" : "Upcoming activities")}
          </h2>
          {loading && <p className="state-msg">{t("Loading activities...")}</p>}
          {error && (
            <p className="state-msg state-error" role="alert">
              {tError(error)}
            </p>
          )}
          {!loading && !error && (
            <>
              <CampaignGrid
                campaigns={visibleCampaigns}
                onFavoriteChange={handleFavoriteChange}
              />
              <div className="pagination">
                <button
                  type="button"
                  className="btn-soft"
                  disabled={shownPage === 1}
                  onClick={() => setPage(shownPage - 1)}
                >
                  {t("Previous")}
                </button>
                <span className="pagination-count">
                  {t("Page {page} of {pages}", { page: shownPage, pages })}
                </span>
                <button
                  type="button"
                  className="btn-soft"
                  disabled={shownPage === pages}
                  onClick={() => setPage(shownPage + 1)}
                >
                  {t("Next")}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CampaignsPage;
