import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const OrganizationContacts = ({ organization }) => {
  const { t } = useContext(LanguageContext);
  if (!organization) return null;

  let whatsappNumber = (organization.whatsappNumber || "").replace(
    /[^0-9]/g,
    "",
  );
  if (whatsappNumber.length === 8) whatsappNumber = `973${whatsappNumber}`;

  return (
    <div className="org-contacts">
      {organization.contactEmail && (
        <a
          href={`mailto:${organization.contactEmail}`}
          className="org-contact-btn"
          title={t("Email organization")}
          aria-label={t("Email organization")}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              x="2"
              y="4"
              width="16"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M2 7l8 5 8-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </a>
      )}

      {organization.contactPhone && (
        <a
          href={`tel:${organization.contactPhone}`}
          className="org-contact-btn"
          title={t("Call organization")}
          aria-label={t("Call organization")}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 3h3.5l1.5 4-2 1.5a11 11 0 004.5 4.5L13 11l4 1.5V16a1 1 0 01-1 1C7 17 3 10 3 4a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          className="org-contact-btn org-contact-btn--whatsapp"
          target="_blank"
          rel="noreferrer"
          title={t("Opens in a new tab")}
          aria-label={`${t("WhatsApp organization")}: +${whatsappNumber} (${t("Opens in a new tab")})`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.073-1.118l-.29-.173-3.013.858.872-2.944-.19-.302A7.95 7.95 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.884c-.241-.12-1.427-.703-1.648-.784-.221-.08-.382-.12-.543.12-.16.241-.622.784-.763.944-.14.161-.281.181-.522.06-.241-.12-1.018-.375-1.939-1.196-.716-.639-1.2-1.428-1.34-1.669-.14-.241-.015-.371.105-.491.108-.108.241-.281.362-.422.12-.14.16-.241.241-.402.08-.16.04-.301-.02-.422-.06-.12-.543-1.307-.744-1.79-.196-.47-.395-.406-.543-.414l-.462-.008c-.16 0-.422.06-.643.301-.221.241-.844.825-.844 2.012s.864 2.333.985 2.494c.12.16 1.7 2.596 4.12 3.641.576.249 1.025.397 1.375.508.577.184 1.103.158 1.518.096.463-.069 1.427-.583 1.628-1.146.2-.562.2-1.044.14-1.145-.06-.1-.221-.16-.462-.281z" />
          </svg>
          <bdi dir="ltr">+{whatsappNumber}</bdi>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M14 3h7v7M21 3l-11 11M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
          </svg>
        </a>
      )}

      {organization.website && (
        <a
          href={organization.website}
          className="org-contact-btn"
          target="_blank"
          rel="noreferrer"
          title={t("Organization website")}
          aria-label={t("Organization website")}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M2 10h16M10 2c-2 2.5-3 5-3 8s1 5.5 3 8M10 2c2 2.5 3 5 3 8s-1 5.5-3 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
};

export default OrganizationContacts;
