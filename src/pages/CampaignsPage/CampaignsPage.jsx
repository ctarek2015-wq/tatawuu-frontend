import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import CampaignGrid from "../CampaignGrid/CampaignGrid.jsx";
import { categories, governorates } from "../../utils/options.js";
import { dateOnly } from "../../utils/dates.js";

const emptyFilters = {
  search: "",
  governorate: "",
  area: "",
  category: "",
  from: "",
  to: "",
};

const CampaignsPage = () => {
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
        const data = await campaignService.index();
        setCampaigns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    setPage(1);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const text = `${campaign.title} ${
      campaign.organizationId?.name || ""
    }`.toLowerCase();

    const date = dateOnly(campaign.startsAt);

    return (
      new Date(campaign.startsAt) > new Date() &&
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
    filters.governorate ||
    filters.area ||
    filters.category ||
    filters.from ||
    filters.to;

  return (
    <>
      <main className="campaigns-page">
        <section className="explore-section">
          <div className="sec-heading">
            <h1 className="sec-title">
              {t("Find")} <em>{t("activities")}</em>
            </h1>

            <p className="sec-desc">
              {t("Find a local activity and make time for your community.")}
            </p>
          </div>

          <div className="filter-bar">
            <div className="filter-bar-top">
              <label className="field field-search">
                <span className="field-label">{t("Search")}</span>

                <input
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder={t("Activity or organization")}
                />
              </label>

              <div className="filter-toggle-wrap">
                <button
                  type="button"
                  className={`filter-toggle ${showFilters ? "is-open" : ""}`}
                  aria-expanded={showFilters}
                  aria-controls="campaign-filters"
                  onClick={() => setShowFilters((open) => !open)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" />

                    <circle
                      cx="9"
                      cy="6"
                      r="2"
                      fill="currentColor"
                      stroke="none"
                    />

                    <line x1="4" y1="12" x2="20" y2="12" />

                    <circle
                      cx="15"
                      cy="12"
                      r="2"
                      fill="currentColor"
                      stroke="none"
                    />

                    <line x1="4" y1="18" x2="20" y2="18" />

                    <circle
                      cx="11"
                      cy="18"
                      r="2"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>

                  {t("Filters")}

                  {hasFilters && <span className="filter-toggle-dot" />}
                </button>

                {showFilters && (
                  <div id="campaign-filters" className="filter-panel">
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
                        value={filters.area}
                        onChange={handleChange}
                      />
                    </label>

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

                      <button
                        type="button"
                        className="btn-soft btn-sm"
                        onClick={() => setShowFilters(false)}
                      >
                        {t("Done")}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {hasFilters && (
                <span className="filter-chip">{t("Filters applied")}</span>
              )}
            </div>
          </div>

          <h2 className="results-title">{t("Upcoming activities")}</h2>

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
                  {t("Page {page} of {pages}", {
                    page: shownPage,
                    pages,
                  })}
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
        </section>
      </main>
    </>
  );
};

export default CampaignsPage;
