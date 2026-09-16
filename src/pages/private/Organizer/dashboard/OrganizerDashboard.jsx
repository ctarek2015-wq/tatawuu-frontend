import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext } from "react";
import { Link } from "react-router";

const OrganizerDashboard = () => {
  const { t } = useContext(LanguageContext);
  return (
    <main>
      <h1>{t("Organizer dashboard")}</h1>
      <ul>
        <li><Link to="/organizer/organization">{t("My organization")}</Link></li>
        <li><Link to="/organizer/campaigns">{t("My campaigns")}</Link></li>
      </ul>
    </main>
  );
};

export default OrganizerDashboard;
