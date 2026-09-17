const CertificatePreview = ({ volunteer, campaign }) => {
  const completionDate = new Date(campaign.endsAt).toLocaleDateString("en-GB", {
    timeZone: "Asia/Bahrain",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="certificate-preview" lang="en" dir="ltr">
      <div
        className="certificate-flag certificate-flag-left"
        aria-hidden="true"
      />
      <div
        className="certificate-flag certificate-flag-right"
        aria-hidden="true"
      />
      <img
        className="certificate-emblem"
        src="/bahrain-coat-of-arms.png"
        alt="Coat of arms of Bahrain"
      />
      <h2>CERTIFICATE OF PARTICIPATION</h2>
      <p className="certificate-label">Presented to</p>
      <p className="certificate-recipient">
        <bdi>{volunteer.name || volunteer.username}</bdi>
      </p>
      <p className="certificate-label">For participating in</p>
      <p className="certificate-activity">
        <bdi>{campaign.title}</bdi>
      </p>
      {campaign.organizationId && (
        <>
          <p className="certificate-label">Organized by</p>
          <p className="certificate-organization">
            <bdi>{campaign.organizationId.name}</bdi>
          </p>
        </>
      )}
      <p className="certificate-date">
        Completed on {completionDate} (Bahrain time)
      </p>
      <p className="certificate-footer">Tatawwu' - Volunteering in Bahrain</p>
    </article>
  );
};

export default CertificatePreview;
