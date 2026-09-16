import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../contexts/UserContext.js";
import * as campaignService from "../../../../services/campaignService.js";
import { formatDateTime } from "../../../../utils/dates.js";

const Certificates = () => {
  const { user } = useContext(UserContext);
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
    <h1>My certificates</h1>
    {loading && <p>Loading certificates...</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && !error && campaigns.length === 0 && <p>No certificates granted yet.</p>}
    {campaigns.map((campaign) => <article key={campaign._id}>
      <h2>{campaign.title}</h2>
      <p>{campaign.organizationId?.name} — {formatDateTime(campaign.startsAt)} (Bahrain time)</p>
      <button type="button" disabled={busy} onClick={() => handleCertificate(campaign, false)}>Preview PDF</button>
      <button type="button" disabled={busy} onClick={() => handleCertificate(campaign, true)}>Download PDF</button>
    </article>)}
    {busy && <p>Loading PDF...</p>}
    {preview && <section>
      <h2>Certificate of Participation</h2>
      <p>Presented to {user.name || user.username}</p>
      <p>For participating in {preview.campaign.title}.</p>
      {preview.campaign.organizationId && <p>Organized by {preview.campaign.organizationId.name}.</p>}
      <p>Campaign completed on {new Date(preview.campaign.endsAt).toLocaleDateString("en-GB", { timeZone: "Asia/Bahrain", day: "numeric", month: "long", year: "numeric" })} (Bahrain time).</p>
      <p>Tatawwu' - Volunteering in Bahrain</p>
      <iframe title="Certificate preview" src={preview.url} width="600" height="500" />
      <p><a href={preview.url} target="_blank" rel="noreferrer">Open PDF</a></p>
      <button type="button" onClick={() => setPreview(null)}>Close preview</button>
    </section>}
  </main>;
};

export default Certificates;
