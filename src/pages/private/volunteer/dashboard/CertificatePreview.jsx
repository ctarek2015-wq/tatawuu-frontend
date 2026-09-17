import "./CertificatePreview.css";

const CertificatePreview = ({ volunteer, campaign }) => {
  const completionDate = new Date(campaign.endsAt).toLocaleDateString("en-GB", {
    timeZone: "Asia/Bahrain",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="certificate-wrap">
      <article className="certificate-card" lang="en" dir="ltr">
        <div className="cert-corner cert-corner-tl" aria-hidden="true">
          <span className="cert-tri cert-tri-pink" />
          <span className="cert-tri cert-tri-maroon" />
          <span className="cert-tri cert-tri-gold-line" />
        </div>
        <div className="cert-corner cert-corner-br" aria-hidden="true">
          <span className="cert-tri cert-tri-pink" />
          <span className="cert-tri cert-tri-maroon" />
          <span className="cert-tri cert-tri-gold-line" />
        </div>
        <div className="cert-medal" aria-hidden="true">
          <span className="cert-ribbon cert-ribbon-left" />
          <span className="cert-ribbon cert-ribbon-right" />
          <span className="cert-medal-star">★</span>
        </div>

        <div className="cert-content">
          <img
            className="cert-emblem"
            src="/bahrain-coat-of-arms.png"
            alt="Coat of arms of Bahrain"
          />
          <h2 className="cert-title">CERTIFICATE</h2>
          <p className="cert-subtitle">OF PARTICIPATION</p>
          <p className="cert-presented">This certificate is presented to</p>
          <p className="cert-name">
            <bdi>{volunteer.name || volunteer.username}</bdi>
          </p>
          <hr className="cert-name-line" />
          <p className="cert-desc">
            For volunteering in{" "}
            <strong><bdi>{campaign.title}</bdi></strong>
            {campaign.organizationId && (
              <>
                , organized by{" "}
                <strong><bdi>{campaign.organizationId.name}</bdi></strong>
              </>
            )}.
          </p>
          <div className="cert-footer">
            <div className="cert-sig">
              <p className="cert-sig-value">Tatawwu&apos;</p>
              <p className="cert-sig-label">Volunteering in Bahrain</p>
            </div>
            <div className="cert-sig cert-sig-date">
              <p className="cert-sig-value">{completionDate}</p>
              <p className="cert-sig-label">Completed on (Bahrain time)</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CertificatePreview;
