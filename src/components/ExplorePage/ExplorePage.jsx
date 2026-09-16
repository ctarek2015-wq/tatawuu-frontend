import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import CampaignGrid from "../CampaignGrid/CampaignGrid.jsx";
import { categories, governorates } from "../../utils/options.js";
import { dateOnly } from "../../utils/dates.js";
import heroVideo from "../../assets/main.mp4";
import Footer from "../Footer/Footer.jsx";

const emptyFilters = {
  search: "",
  governorate: "",
  area: "",
  category: "",
  from: "",
  to: "",
};

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

  // upcoming campaigns for the auto-scrolling strip, duplicated once so the
  // CSS animation (-50% translateX) loops without a visible seam
  const upcoming = campaigns
    .filter((c) => new Date(c.startsAt) > new Date())
    .slice(0, 10);
  const marqueeCampaigns = [...upcoming, ...upcoming];

  return (
    <>
      <main>
        {/* ================= HERO ================= */}
        <section className="hero">
          <video
            className="hero-video"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <h1>
              {t("Small acts, done together,")}
              <span className="line-two">{t("move a whole community.")}</span>
            </h1>
            <div className="hero-btns">
              <a href="#about" className="btn-outline-light">
                {t("About us")}
              </a>
              <a href="#campaigns" className="btn-primary-light">
                {t("Explore")}
              </a>
            </div>
          </div>
          <span className="hero-scroll-cue">SCROLL</span>
        </section>

        {/* ================= ABOUT (hardcoded) ================= */}
        <section className="about-section" id="about">
          <div className="sec-heading">
            <h2 className="sec-title">
              {t("About")} <em>Tatawwu&rsquo;</em>
            </h2>
            <p className="sec-desc">
              {t(
                "The national platform connecting Bahrain's volunteers with the organizations that need them.",
              )}
            </p>
          </div>
          <div className="about-grid">
            <div className="about-box">
              <h3>{t("Our mission")}</h3>
              <p>
                {t(
                  "Tatawwu' brings verified charities, clubs, and civic groups onto one calendar, so anyone in Bahrain can find a cause worth an afternoon — or a career.",
                )}
              </p>
              <p>
                {t(
                  "Every campaign listed here is reviewed by our team before it goes live, and every certificate a volunteer earns is recorded against a real, completed activity.",
                )}
              </p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="about-stat-num">120+</div>
                <div className="about-stat-label">
                  {t("Active organizations")}
                </div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">4,600</div>
                <div className="about-stat-label">
                  {t("Volunteers registered")}
                </div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">38</div>
                <div className="about-stat-label">
                  {t("Governorates & areas covered")}
                </div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">9,000+</div>
                <div className="about-stat-label">
                  {t("Hours logged this year")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CAMPAIGNS: scrolling strip + full list ============ */}
        <section className="explore-section" id="campaigns">
          <div className="sec-heading">
            <h2 className="sec-title">
              {t("Volunteer in")} <em>{t("Bahrain")}</em>
            </h2>
            <p className="sec-desc">
              {t("Find a local activity and make time for your community.")}
            </p>
          </div>

          {marqueeCampaigns.length > 0 && (
            <div className="marquee">
              <div className="marquee-track">
                {marqueeCampaigns.map((campaign, i) => {
                  const text =
                    `${campaign.title} ${campaign.organizationId?.name || ""}`.toLowerCase();
                  const isMatch =
                    filters.search.trim() !== "" &&
                    text.includes(filters.search.toLowerCase());
                  return (
                    <article
                      className={`campaign-card ${isMatch ? "is-match" : ""}`}
                      key={`${campaign._id}-${i}`}
                    >
                      <img
                        className="campaign-card-img"
                        src={campaign.imageUrl || "/placeholder-campaign.jpg"}
                        alt={campaign.title}
                      />
                      <div className="campaign-card-body">
                        <span className="campaign-card-tag">
                          {campaign.category}
                        </span>
                        <h3 className="campaign-card-title">
                          {campaign.title}
                        </h3>
                        <p className="campaign-card-meta">
                          {campaign.organizationId?.name} &middot;{" "}
                          {campaign.area}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- filters + full list, same logic as before ---- */}
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
                  onClick={() => setShowFilters(!showFilters)}
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

          <h3 className="results-title">{t("Upcoming activities")}</h3>

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
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ExplorePage;
