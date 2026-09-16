import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext } from "react";
import { Link } from "react-router";

const OrganizerDashboard = () => {
  const { t } = useContext(LanguageContext);
  return (
    <main className="dash-page">
      <div className="sec-heading">
        <h1 className="sec-title">{t("Organizer dashboard")}</h1>
      </div>
      <div className="dash-grid">
        <Link className="dash-card" to="/organizer/organization">
          <span className="dash-card-title">{t("My organization")}</span>
          <span className="dash-card-arrow">&rarr;</span>
        </Link>
        <Link className="dash-card" to="/organizer/campaigns">
          <span className="dash-card-title">{t("My campaigns")}</span>
          <span className="dash-card-arrow">&rarr;</span>
        </Link>
      </div>
    </main>
  );
};

export default OrganizerDashboard;
