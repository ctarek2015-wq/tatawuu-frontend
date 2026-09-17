import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";

const ParticipantRow = ({
  participant,
  canRecord,
  completed,
  granted,
  busy,
  onSave,
  onGrant,
  onRemove,
}) => {
  const { t } = useContext(LanguageContext);
  const [attendance, setAttendance] = useState(participant.attendance);
  const volunteer = participant.volunteerId;
  const attendanceClass = `attendance-badge attendance-${participant.attendance.toLowerCase()}`;

  return (
    <li className="participant-row">
      <div className="participant-info">
        <h3 className="participant-name">
          <bdi>{volunteer.name || volunteer.username}</bdi>
        </h3>
        <div className="participant-badges">
          <span
            className={`status-badge status-${participant.status.toLowerCase()}`}
          >
            {t(participant.status)}
          </span>
          <span className={attendanceClass}>{t(participant.attendance)}</span>
        </div>
      </div>

      <div className="participant-actions">
        {participant.status === "Registered" && canRecord && !granted && (
          <div className="attendance-picker">
            <label className="field field-attendance">
              <span className="field-label">{t("Attendance")}</span>
              <select
                value={attendance}
                onChange={(evt) => setAttendance(evt.target.value)}
                disabled={busy}
              >
                <option value="Unmarked" disabled>
                  {t("Choose attendance")}
                </option>
                <option value="Attended">{t("Attended")}</option>
                <option value="Absent">{t("Absent")}</option>
              </select>
            </label>
            <button
              disabled={busy || attendance === "Unmarked"}
              onClick={() => onSave(volunteer._id, attendance)}
              className="btn-primary btn-sm"
            >
              {t("Save attendance")}
            </button>
          </div>
        )}

        {granted && (
          <p className="manager-notice manager-notice-sm">
            {t(
              "Certificate granted. Remove the certificate before changing attendance.",
            )}
          </p>
        )}

        {completed &&
          participant.status === "Registered" &&
          participant.attendance === "Attended" &&
          !granted && (
            <button
              disabled={busy}
              onClick={() => onGrant(volunteer._id)}
              className="btn-primary btn-sm"
            >
              {t("Grant certificate")}
            </button>
          )}

        {granted && (
          <button
            disabled={busy}
            onClick={() => onRemove(volunteer._id)}
            className="btn-danger-outline btn-sm"
          >
            {t("Remove certificate")}
          </button>
        )}
      </div>
    </li>
  );
};

const CampaignParticipants = () => {
  const { t, tError, language } = useContext(LanguageContext);
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      setCampaign(null);
      setMessage("");
      try {
        const data = await campaignService.participants(id);
        setCampaign(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [id]);

  const handleAttendance = async (volunteerId, attendance) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.markAttendance(
        id,
        volunteerId,
        attendance,
      );
      setCampaign(updated);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleComplete = async () => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.complete(id);
      setCampaign(updated);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleGrant = async (volunteerId) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.grantCertificate(id, volunteerId);
      setCampaign(updated);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (volunteerId) => {
    setBusy(true);
    setMessage("");
    try {
      const updated = await campaignService.removeCertificate(id, volunteerId);
      setCampaign(updated);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <p className="state-msg page-state" role="status">
        {t("Loading participants...")}
      </p>
    );

  if (!campaign) {
    return (
      <main className="participants-page">
        <p className="state-msg state-error" role="alert">
          {tError(message)}
        </p>
        <Link to="/organizer/campaigns" className="btn-primary">
          {t("My campaigns")}
        </Link>
      </main>
    );
  }

  const ended = new Date(campaign.endsAt) <= new Date();
  const canRecord =
    ended && ["Approved", "Completed"].includes(campaign.status);
  const registered = campaign.participants.filter(
    (participant) => participant.status === "Registered",
  );
  const allMarked = registered.every(
    (participant) => participant.attendance !== "Unmarked",
  );
  const statusClass = `status-badge status-${campaign.status.toLowerCase()}`;

  return (
    <main className="participants-page">
      <div className="manager-header">
        <div className="sec-heading" style={{ margin: 0, textAlign: "start" }}>
          <h1 className="sec-title">{t("Participants and certificates")}</h1>
          <p className="sec-desc">
            <bdi>{campaign.title}</bdi>
            <br />
            {t("Ends")}: {formatDateTime(campaign.endsAt, language)} (
            {t("Bahrain time")})
          </p>
        </div>
        <Link to="/organizer/campaigns" className="btn-link manager-back-link">
          {t("My campaigns")}
        </Link>
      </div>

      <div className="participants-status-row">
        <span className={statusClass}>{t(campaign.status)}</span>
      </div>

      <div className="participants-map-wrap">
        <LocationMap location={campaign} />
      </div>

      {message && (
        <p className="state-msg state-error" role="alert">
          {tError(message)}
        </p>
      )}

      {!ended && (
        <p className="manager-notice">
          {t("Attendance can be recorded after the activity ends.")}
        </p>
      )}
      {canRecord && !allMarked && (
        <p className="manager-notice">
          {t(
            "Record attendance for every registered participant before completing the campaign.",
          )}
        </p>
      )}

      {ended && campaign.status === "Approved" && (
        <button
          disabled={busy || !allMarked}
          onClick={handleComplete}
          className="btn-primary"
        >
          {t("Complete campaign")}
        </button>
      )}

      {campaign.status === "Completed" && (
        <p className="manager-notice">
          {t("Grant certificates to attendees below.")}
        </p>
      )}

      {campaign.participants.length === 0 && (
        <p className="state-msg">{t("No participants yet.")}</p>
      )}

      <ul className="participants-list">
        {campaign.participants.map((participant) => (
          <ParticipantRow
            key={`${participant.volunteerId._id}-${participant.attendance}`}
            participant={participant}
            canRecord={canRecord}
            completed={campaign.status === "Completed"}
            granted={campaign.certificates.includes(
              participant.volunteerId._id,
            )}
            busy={busy}
            onSave={handleAttendance}
            onGrant={handleGrant}
            onRemove={handleRemove}
          />
        ))}
      </ul>
    </main>
  );
};

export default CampaignParticipants;
