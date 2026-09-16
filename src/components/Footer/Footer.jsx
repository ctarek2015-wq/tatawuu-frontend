import { Link } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const Footer = () => {
  const { t } = useContext(LanguageContext);

  return (
    <footer>
      <span className="footer-logo">Tatawwu&rsquo;</span>

      <nav className="footer-links">
        <a href="#about">{t("About us")}</a>
        <a href="#campaigns">{t("Explore")}</a>
        <Link to="/organizations">{t("Organizations")}</Link>
        <Link to="/sign-up">{t("Sign up")}</Link>
      </nav>

      <span className="footer-copy">
        &copy; {new Date().getFullYear()} Tatawwu&rsquo;.{" "}
        {t("All rights reserved.")}
      </span>
    </footer>
  );
};

export default Footer;
