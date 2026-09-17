import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import * as organizationService from "../../services/organizationService.js";
import heroVideo from "../../assets/main.mp4";
import fallbackImage from "../../assets/tatawwu-logo.svg";
import Footer from "../Footer/Footer.jsx";

const ExplorePage = () => {
  const { t, tError, language } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoPaused, setVideoPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [marqueePaused, setMarqueePaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const video = useRef(null);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [campaignData, organizationData] = await Promise.all([
          campaignService.index(),
          organizationService.index(),
        ]);
        setCampaigns(campaignData);
        setOrganizations(organizationData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHome();
  }, []);

  useEffect(() => {
    if (videoPaused) video.current.pause();
    else video.current.play().catch(() => setVideoPaused(true));
  }, [videoPaused]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      if (preference.matches) {
        setVideoPaused(true);
        setMarqueePaused(true);
      }
    };
    preference.addEventListener("change", handleMotionChange);
    return () => preference.removeEventListener("change", handleMotionChange);
  }, []);

  const upcoming = campaigns.filter(
    (campaign) => new Date(campaign.startsAt) > new Date(),
  );
  const featured = upcoming.slice(0, 10);
  const marqueeCampaigns = [...featured, ...featured];
  const publicLocations = [...organizations, ...upcoming];
  const governorateCount = new Set(
    publicLocations.map((item) => item.governorate).filter(Boolean),
  ).size;
  const areaCount = new Set(
    publicLocations
      .filter((item) => item.area)
      .map((item) => `${item.governorate}:${item.area.trim().toLowerCase()}`),
  ).size;
  const stats = [
    { label: "Approved organizations", count: organizations.length },
    { label: "Upcoming activities", count: upcoming.length },
    { label: "Governorates represented", count: governorateCount },
    { label: "Areas represented", count: areaCount },
  ];
  const numberFormat = new Intl.NumberFormat(
    language === "ar" ? "ar-BH" : "en-GB",
  );

  return (
    <>
      <main>
        <section className="hero">
          <video
            ref={video}
            className="hero-video"
            src={heroVideo}
            loop
            muted
            playsInline
            aria-hidden="true"
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
              <Link to="/activities" className="btn-primary-light">
                {t("Explore activities")}
              </Link>
              <button
                type="button"
                className="btn-outline-light hero-motion-toggle"
                onClick={() => setVideoPaused(!videoPaused)}
              >
                {t(
                  videoPaused
                    ? "Play background video"
                    : "Pause background video",
                )}
              </button>
            </div>
          </div>
          <div className="hero-scroll-cue" aria-hidden="true">
            ↓
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="sec-heading">
            <h2 className="sec-title">{t("About Tatawwu")}</h2>
            <p className="sec-desc">
              {t(
                "A community platform connecting volunteers with organizations in Bahrain.",
              )}
            </p>
          </div>
          <div className="about-grid">
            <div className="about-box">
              <h3>{t("Our mission")}</h3>
              <p>
                {t(
                  "Find volunteering opportunities, join activities, and follow your participation in one place.",
                )}
              </p>
              <p>
                {t(
                  "Organizations and campaigns are reviewed before publication. Certificates recognize attendance at completed activities.",
                )}
              </p>
              <p>
                {t(
                  "Listings marked Demo contain fictional activities and contacts for demonstrating the platform.",
                )}
              </p>
            </div>
            <div className="about-stats">
              {loading && (
                <p className="state-msg">{t("Loading activities...")}</p>
              )}
              {error && (
                <p className="state-msg state-error" role="alert">
                  {tError(error)}
                </p>
              )}
              {!loading &&
                !error &&
                stats.map((stat) => (
                  <div className="about-stat" key={stat.label}>
                    <div className="about-stat-num">
                      {numberFormat.format(stat.count)}
                    </div>
                    <div className="about-stat-label">{t(stat.label)}</div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="explore-section" id="campaigns">
          <div className="sec-heading">
            <h2 className="sec-title">{t("Volunteer in Bahrain")}</h2>
            <p className="sec-desc">
              {t("Find a local activity and make time for your community.")}
            </p>
          </div>
          {!loading && !error && featured.length === 0 && (
            <p className="state-msg">{t("No upcoming activities.")}</p>
          )}
          {featured.length > 0 && (
            <>
              <button
                type="button"
                className="btn-soft marquee-motion-toggle"
                onClick={() => setMarqueePaused(!marqueePaused)}
              >
                {t(
                  marqueePaused
                    ? "Resume activity animation"
                    : "Pause activity animation",
                )}
              </button>
              <div className="marquee">
                <div
                  className={`marquee-track${marqueePaused ? " is-paused" : ""}`}
                >
                  {marqueeCampaigns.map((campaign, index) => (
                    <article
                      className="campaign-card"
                      key={`${campaign._id}-${index}`}
                      aria-hidden={index >= featured.length ? true : undefined}
                    >
                      <img
                        className="campaign-card-img"
                        src={
                          campaign.coverImage ||
                          campaign.organizationId?.logo ||
                          fallbackImage
                        }
                        alt={campaign.title}
                      />
                      <div className="campaign-card-body">
                        <span className="campaign-card-tag">
                          {t(campaign.category)}
                        </span>
                        <h3 className="campaign-card-title">
                          <Link
                            to={`/campaigns/${campaign._id}`}
                            tabIndex={index >= featured.length ? -1 : undefined}
                          >
                            <bdi>{campaign.title}</bdi>
                          </Link>
                        </h3>
                        <p className="campaign-card-meta">
                          <bdi>{campaign.organizationId?.name}</bdi> &middot;{" "}
                          <bdi>{campaign.area}</bdi>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="explore-cta">
            <Link to="/activities" className="btn-primary-dark">
              {t("Browse all activities")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ExplorePage;
