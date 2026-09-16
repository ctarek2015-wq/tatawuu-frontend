import LocationMap from "../../../../components/LocationMap/LocationMap.jsx";
import { LanguageContext } from "../../../../contexts/LanguageContext.js";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { formatDateTime } from "../../../../utils/dates.js";
import * as campaignService from "../../../../services/campaignService.js";

const ParticipantRow = ({ participant, canRecord, completed, granted, busy, onSave, onGrant, onRemove }) => {
  const { t } = useContext(LanguageContext);
  const [attendance, setAttendance] = useState(participant.attendance);
  const volunteer = participant.volunteerId;
  return (
    <li>
      <h3><bdi>{volunteer.name || volunteer.username}</bdi></h3>
      <p>{t("Registration")}: {t(participant.status)}</p>
      <p>{t("Attendance")}: {t(participant.attendance)}</p>
      {participant.status === "Registered" && canRecord && !granted && (
        <>
          <label>
          {t("Attendance")}
          <select value={attendance} onChange={(evt) => setAttendance(evt.target.value)} disabled={busy}>
              <option value="Unmarked" disabled>{t("Choose attendance")}</option>
              <option value="Attended">{t("Attended")}</option>
              <option value="Absent">{t("Absent")}</option>
            </select>
          </label>
          <button disabled={busy || attendance === "Unmarked"} onClick={() => onSave(volunteer._id, attendance)}>{t("Save attendance")}</button>
        </>
      )}
      {granted && <p>{t("Certificate granted. Remove the certificate before changing attendance.")}</p>}
      {completed && participant.status === "Registered" && participant.attendance === "Attended" && !granted && (
        <button disabled={busy} onClick={() => onGrant(volunteer._id)}>{t("Grant certificate")}</button>
      )}
      {granted && <button disabled={busy} onClick={() => onRemove(volunteer._id)}>{t("Remove certificate")}</button>}
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
      const updated = await campaignService.markAttendance(id, volunteerId, attendance);
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

  if (loading) return <p>{t("Loading participants...")}</p>;
  if (!campaign) return <main><p>{tError(message)}</p><Link to="/organizer/campaigns">{t("My campaigns")}</Link></main>;

  const ended = new Date(campaign.endsAt) <= new Date();
  const canRecord = ended && ["Approved", "Completed"].includes(campaign.status);
  const registered = campaign.participants.filter((participant) => participant.status === "Registered");
  const allMarked = registered.every((participant) => participant.attendance !== "Unmarked");

  return (
    <main>
      <h1>{t("{title}: participants", { title: campaign.title })}</h1>
      <Link to="/organizer/campaigns">{t("My campaigns")}</Link>
      <p>{t("Status")}: {t(campaign.status)}</p>
      <p>{t("Ends")}: {formatDateTime(campaign.endsAt, language)} ({t("Bahrain time")})</p>
      <LocationMap location={campaign} />
      <p>{tError(message)}</p>
      {!ended && <p>{t("Attendance can be recorded after the activity ends.")}</p>}
      {canRecord && !allMarked && <p>{t("Record attendance for every registered participant before completing the campaign.")}</p>}
      {ended && campaign.status === "Approved" && <button disabled={busy || !allMarked} onClick={handleComplete}>{t("Complete campaign")}</button>}
      {campaign.status === "Completed" && <p>{t("Grant certificates to attendees below.")}</p>}
      {campaign.participants.length === 0 && <p>{t("No participants yet.")}</p>}
      <ul>
        {campaign.participants.map((participant) => (
          <ParticipantRow
            key={`${participant.volunteerId._id}-${participant.attendance}`}
            participant={participant}
            canRecord={canRecord}
            completed={campaign.status === "Completed"}
            granted={campaign.certificates.includes(participant.volunteerId._id)}
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
