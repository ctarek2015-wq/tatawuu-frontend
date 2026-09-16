import { useContext } from "react";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { formatDateTime } from "../../../../utils/dates.js";

const Certificate = ({
  volunteerName,
  campaignTitle,
  organizationName,
  issuedAt,
}) => {
  const { t, language } = useContext(LanguageContext);
  const dateLabel = formatDateTime(issuedAt || new Date(), language);

  return (
    <div className="certificate-wrap">
      <div className="certificate-card">
        <div className="cert-corner cert-corner-tl">
          <span className="cert-tri cert-tri-pink" />
          <span className="cert-tri cert-tri-maroon" />
          <span className="cert-tri-gold-line" />
        </div>
        <div className="cert-corner cert-corner-br">
          <span className="cert-tri cert-tri-pink" />
          <span className="cert-tri cert-tri-maroon" />
          <span className="cert-tri-gold-line" />
        </div>

        <div className="cert-medal">
          <span className="cert-medal-star">★</span>
          <span className="cert-ribbon cert-ribbon-left" />
          <span className="cert-ribbon cert-ribbon-right" />
        </div>

        <div className="cert-content">
          <h1 className="cert-title">{t("CERTIFICATE")}</h1>
          <p className="cert-subtitle">{t("OF ACHIEVEMENT")}</p>

          <p className="cert-presented">
            {t("This certificate is presented to")}
          </p>
          <h2 className="cert-name">
            <bdi>{volunteerName || "—"}</bdi>
          </h2>
          <hr className="cert-name-line" />

          <p className="cert-desc">
            {t(
              'For dedicating time and effort to "{campaignTitle}", organized by {organizationName}, and completing it with distinction.',
              {
                campaignTitle: campaignTitle || "—",
                organizationName: organizationName || "—",
              },
            )}
          </p>

          <div className="cert-footer">
            <div className="cert-sig">
              <p className="cert-sig-value cert-brand-signature">Tatawwu'</p>
              <p className="cert-sig-label">{t("Signature")}</p>
            </div>
            <div className="cert-sig cert-sig-date">
              <p className="cert-sig-value">{dateLabel}</p>
              <p className="cert-sig-label">{t("Date")}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary certificate-print-btn"
        onClick={() => window.print()}
      >
        {t("Download / Print certificate")}
      </button>
    </div>
  );
};

export default Certificate;
