import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import * as campaignService from "../../services/campaignService.js";
import heroVideo from "../../assets/main.mp4";
import Footer from "../Footer/Footer.jsx";

const ExplorePage = () => {
  const { t } = useContext(LanguageContext);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    campaignService
      .index()
      .then((data) => {
        setUpcoming(
          data.filter((c) => new Date(c.startsAt) > new Date()).slice(0, 10),
        );
      })
      .catch(() => {});
  }, []);

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
              <Link to="/activities" className="btn-primary-light">
                {t("Explore activities")}
              </Link>
            </div>
          </div>
          <div className="hero-scroll-cue">↓</div>
        </section>

        {/* ================= ABOUT ================= */}
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

        {/* ================= MARQUEE STRIP ================= */}
        {marqueeCampaigns.length > 0 && (
          <section className="explore-section" id="campaigns">
            <div className="sec-heading">
              <h2 className="sec-title">
                {t("Volunteer in")} <em>{t("Bahrain")}</em>
              </h2>
              <p className="sec-desc">
                {t("Find a local activity and make time for your community.")}
              </p>
            </div>

            <div className="marquee">
              <div className="marquee-track">
                {marqueeCampaigns.map((campaign, i) => (
                  <article
                    className="campaign-card"
                    key={`${campaign._id}-${i}`}
                  >
                    <img
                      className="campaign-card-img"
                      src={campaign.coverImage || "/placeholder-campaign.jpg"}
                      alt={campaign.title}
                    />
                    <div className="campaign-card-body">
                      <span className="campaign-card-tag">
                        {campaign.category}
                      </span>
                      <h3 className="campaign-card-title">{campaign.title}</h3>
                      <p className="campaign-card-meta">
                        {campaign.organizationId?.name} &middot; {campaign.area}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="explore-cta">
              <Link to="/activities" className="btn-primary-dark">
                {t("Browse all activities")}
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ExplorePage;
