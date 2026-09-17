import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const Footer = () => {
  const { t } = useContext(LanguageContext);

  return (
    <footer>
      <span className="footer-copy">
        &copy; {new Date().getFullYear()} <bdi>{t("Tatawwu")}</bdi>.{" "}
        {t("All rights reserved.")}
      </span>
    </footer>
  );
};

export default Footer;
