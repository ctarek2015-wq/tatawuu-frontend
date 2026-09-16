import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { UserContext } from "../../../../contexts/UserContext.js";
import * as campaignService from "../../../../services/campaignService.js";
import { formatDateTime } from "../../../../utils/dates.js";
import "./Certificates.css";

const Certificates = () => {
  const { user } = useContext(UserContext);
  const { language, t, tError } = useContext(LanguageContext);
  const [campaigns, setCampaigns] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setCampaigns(await campaignService.certificates());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  const handleCertificate = async (campaign, download) => {
    setBusy(true);
    setError("");
    try {
      const blob = await campaignService.certificate(campaign._id);
      const url = URL.createObjectURL(blob);
      setPreview({ url, campaign });
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `tatawwu-certificate-${campaign._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return <main>
    <h1>{t("My certificates")}</h1>
    {loading && <p>{t("Loading certificates...")}</p>}
    {error && <p role="alert">{tError(error)}</p>}
    {!loading && !error && campaigns.length === 0 && <p>{t("No certificates granted yet.")}</p>}
    {campaigns.map((campaign) => <article key={campaign._id}>
      <h2><bdi>{campaign.title}</bdi></h2>
      <p>{campaign.organizationId?.name} — {formatDateTime(campaign.startsAt, language)} ({t("Bahrain time")})</p>
      <button type="button" disabled={busy} onClick={() => handleCertificate(campaign, false)}>{t("Preview PDF")}</button>
      <button type="button" disabled={busy} onClick={() => handleCertificate(campaign, true)}>{t("Download PDF")}</button>
    </article>)}
    {busy && <p>{t("Loading PDF...")}</p>}
    {preview && <section>
      <article className="certificate-preview" lang="en" dir="ltr">
        <div className="certificate-flag certificate-flag-left" aria-hidden="true" />
        <div className="certificate-flag certificate-flag-right" aria-hidden="true" />
        <img className="certificate-emblem" src="/bahrain-coat-of-arms.png" alt="Coat of arms of Bahrain" />
        <h2>CERTIFICATE OF PARTICIPATION</h2>
        <p className="certificate-label">Presented to</p>
        <p className="certificate-recipient"><bdi>{user.name || user.username}</bdi></p>
        <p className="certificate-label">For participating in</p>
        <p className="certificate-activity"><bdi>{preview.campaign.title}</bdi></p>
        {preview.campaign.organizationId && <>
          <p className="certificate-label">Organized by</p>
          <p className="certificate-organization"><bdi>{preview.campaign.organizationId.name}</bdi></p>
        </>}
        <p className="certificate-date">Completed on {new Date(preview.campaign.endsAt).toLocaleDateString("en-GB", { timeZone: "Asia/Bahrain", day: "numeric", month: "long", year: "numeric" })} (Bahrain time)</p>
        <p className="certificate-footer">Tatawwu' - Volunteering in Bahrain</p>
      </article>
      <iframe title={t("Certificate preview")} src={preview.url} width="600" height="500" />
      <p><a href={preview.url} target="_blank" rel="noreferrer">{t("Open PDF")}</a></p>
      <button type="button" onClick={() => setPreview(null)}>{t("Close preview")}</button>
    </section>}
  </main>;
};

export default Certificates;
