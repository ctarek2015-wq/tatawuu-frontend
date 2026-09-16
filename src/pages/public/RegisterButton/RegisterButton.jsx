import { useState, useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../../contexts/UserContext";
import { create } from "../../../services/registerationService";

const RegisterButton = ({ campaign }) => {
  const { user } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");

  const isFull = campaign.registeredCount >= campaign.capacity;

  const handleRegister = async () => {
    setSubmitting(true);
    setError("");
    try {
      await create({
        CampaignId: campaign._id,
        volunteerId: user._id || user.id,
      });
      setRegistered(true);
    } catch (err) {
      setError(err.message || "Couldn't register for this campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <Link to="/signin">Log in to register</Link>;
  }

  if (registered) {
    return <span>You're registered</span>;
  }

  if (isFull) {
    return <span>Campaign full</span>;
  }

  return (
    <div>
      <button type="button" onClick={handleRegister} disabled={submitting}>
        {submitting ? "Registering..." : "Register"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterButton;