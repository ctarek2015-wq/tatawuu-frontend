import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import * as campaignService from "../../../../services/campaignService.js";
import * as campaignUpdateService from "../../../../services/campaignUpdateService.js";
import { formatDateTime } from "../../../../utils/dates.js";

const CampaignUpdates = () => {
  const { id } = useParams();
  const { t, tError, language } = useContext(LanguageContext);
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const textInput = useRef(null);

  useEffect(() => {
    let active = true;
    const loadUpdates = async () => {
      setLoading(true);
      setCampaign(null);
      setUpdates([]);
      setEditingId("");
      setText("");
      setError("");
      setMessage("");
      try {
        const [campaignData, updateData] = await Promise.all([
          campaignService.showOwn(id),
          campaignUpdateService.showMine(id),
        ]);
        if (active) {
          setCampaign(campaignData);
          setUpdates(updateData);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadUpdates();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!text.trim()) {
      setError("Write a campaign update");
      return;
    }
    setBusy(true);
    try {
      const saved = editingId
        ? await campaignUpdateService.update(id, editingId, text.trim())
        : await campaignUpdateService.create(id, text.trim());
      setUpdates(
        editingId
          ? updates.map((update) => (update._id === editingId ? saved : update))
          : [saved, ...updates],
      );
      setEditingId("");
      setText("");
      setMessage("Update saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (update) => {
    setEditingId(update._id);
    setText(update.text);
    setError("");
    setMessage("");
    textInput.current.focus();
  };

  const handleDelete = async (updateId) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await campaignUpdateService.remove(id, updateId);
      setUpdates(updates.filter((update) => update._id !== updateId));
      if (editingId === updateId) {
        setEditingId("");
        setText("");
      }
      setMessage("Update deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <main className="page-state">
        <p className="state-msg">{t("Loading updates...")}</p>
      </main>
    );

  return (
    <main className="campaign-form-page">
      <div className="sec-heading" style={{ textAlign: "start" }}>
        <h1 className="sec-title">{t("Campaign updates")}</h1>
        {campaign && (
          <p className="sec-desc">
            <bdi>{campaign.title}</bdi>
          </p>
        )}
        <Link to="/organizer/campaigns" className="btn-link">
          {t("My campaigns")}
        </Link>
      </div>
      {error && (
        <p className="state-msg state-error" role="alert">
          {tError(error)}
        </p>
      )}
      {message && (
        <p className="state-msg" role="status">
          {t(message)}
        </p>
      )}
      {campaign && (
        <>
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>{t(editingId ? "Edit update" : "Add update")}</h2>
            <label className="field">
              <span className="field-label">{t("Update text")}</span>
              <textarea
                ref={textInput}
                dir="auto"
                name="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                required
                disabled={busy}
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={busy}>
                {t(busy ? "Saving..." : "Save update")}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-soft"
                  disabled={busy}
                  onClick={() => {
                    setEditingId("");
                    setText("");
                  }}
                >
                  {t("Cancel")}
                </button>
              )}
            </div>
          </form>
          <section
            className="campaign-updates-section"
            aria-label={t("Campaign updates")}
          >
            {updates.length === 0 && (
              <p className="state-msg">{t("No updates yet.")}</p>
            )}
            {updates.map((update) => (
              <article key={update._id} className="campaign-update-card">
                <p>
                  <time dateTime={update.createdAt}>
                    {formatDateTime(update.createdAt, language)}
                  </time>{" "}
                  ({t("Bahrain time")})
                </p>
                <p dir="auto" style={{ whiteSpace: "pre-wrap" }}>
                  {update.text}
                </p>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-soft"
                    disabled={busy}
                    onClick={() => handleEdit(update)}
                  >
                    {t("Edit update")}
                  </button>
                  <button
                    type="button"
                    className="btn-danger-outline"
                    disabled={busy}
                    onClick={() => handleDelete(update._id)}
                  >
                    {t("Delete update")}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default CampaignUpdates;
