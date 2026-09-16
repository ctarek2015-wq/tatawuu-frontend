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
  const [showMoreFilters, setShowMoreFilters] = useState(false);
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
    const text =
      `${campaign.title} ${campaign.organizationId?.name || ""}`.toLowerCase();
    const date = dateOnly(campaign.startsAt);
    return (
      new Date(campaign.startsAt) > new Date() &&
      (!orgId || campaign.organizationId?._id === orgId) &&
      text.includes(filters.search.toLowerCase()) &&
      (!filters.governorate || campaign.governorate === filters.governorate) &&
      campaign.area.toLowerCase().includes(filters.area.toLowerCase()) &&
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
    filters.governorate ||
    filters.area ||
    filters.category ||
    filters.from ||
    filters.to;
  const hasMoreFilters = filters.area || filters.from || filters.to;

  return (
    <>
      <main className="campaigns-page">
        {/* Page header */}
        <div className="campaigns-page-header">
          <div className="sec-heading" style={{ margin: 0, textAlign: "left" }}>
            <h1 className="sec-title">
              {t("Volunteer in")} <em>{t("Bahrain")}</em>
            </h1>
            <p className="sec-desc">
              {t("Find a local activity and make time for your community.")}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-bar-inline">
            <label className="field field-search">
              <span className="field-label">
                {t("Activity or Organization")}
              </span>
              <input
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder={t("e.g. Beach Cleanup or Red Crescent")}
              />
            </label>

            <label className="field field-category">
              <span className="field-label">{t("Category")}</span>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
              >
                <option value="">{t("Any category")}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t(c)}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-governorate">
              <span className="field-label">{t("Governorate")}</span>
              <select
                name="governorate"
                value={filters.governorate}
                onChange={handleChange}
              >
                <option value="">{t("Any governorate")}</option>
                {governorates.map((g) => (
                  <option key={g} value={g}>
                    {t(g)}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="btn-search"
              onClick={() => setPage(1)}
            >
              {t("Search")}
            </button>
          </div>

          <button
            type="button"
            className="filter-more-toggle"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {showMoreFilters ? t("Hide more filters") : t("More filters")}
            {hasMoreFilters && !showMoreFilters ? " •" : ""}
          </button>

          {showMoreFilters && (
            <div className="filter-panel-inline">
              <label className="field">
                <span className="field-label">{t("Area")}</span>
                <input
                  name="area"
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

              <div className="filter-panel-actions">
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
            </div>
          )}

          {hasFilters && (
            <span className="filter-chip">{t("Filters applied")}</span>
          )}
        </div>

        {/* Results */}
        <div className="campaigns-page-results">
          <h2 className="results-title">
            {hasFilters ? t("Filtered activities") : t("Upcoming activities")}
          </h2>

          {loading && <p className="state-msg">{t("Loading activities...")}</p>}
          {error && (
            <p className="state-msg state-error" role="alert">
              {tError(error)}
            </p>
          )}

          {!loading && !error && (
            <>
              <CampaignGrid campaigns={visibleCampaigns} />

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
