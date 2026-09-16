import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const OrganizationContacts = ({ organization }) => {
  const { t } = useContext(LanguageContext);
  if (!organization) return null;

  let whatsappNumber = (organization.whatsappNumber || "").replace(/[^0-9]/g, "");
  if (whatsappNumber.length === 8) whatsappNumber = `973${whatsappNumber}`;

  return (
    <div>
      {organization.contactEmail && <p><a href={`mailto:${organization.contactEmail}`}>{t("Email organization")}</a></p>}
      {organization.contactPhone && <p><a href={`tel:${organization.contactPhone}`}>{t("Call organization")}</a></p>}
      {whatsappNumber && <p>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" title={t("Opens in a new tab")}>
          {t("WhatsApp organization")} <bdi dir="ltr">+{whatsappNumber}</bdi>{" "}
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 3h7v7M21 3l-11 11M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
          </svg>
        </a>
      </p>}
      {organization.website && <p><a href={organization.website}>{t("Organization website")}</a></p>}
    </div>
  );
};

export default OrganizationContacts;
