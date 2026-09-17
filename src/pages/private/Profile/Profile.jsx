import { LanguageContext } from "../../../contexts/LanguageContext.js";
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext.js";
import * as authService from "../../../services/authService.js";

const Profile = () => {
  const { t, tError } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user.name,
    city: user.city || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      setUser(await authService.updateProfile(formData));
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <main className="profile-page">
      <div className="profile-card">
        {/* Avatar initials */}
        <div className="profile-avatar">
          {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
        </div>

        {/* Page title */}
        <h1 className="profile-title">{t("My profile")}</h1>

        {/* Read-only info */}
        <div className="profile-meta">
          <div className="profile-meta-row">
            <span className="profile-meta-label">{t("Username")}</span>
            <bdi className="profile-meta-value">{user.username}</bdi>
          </div>
          <div className="profile-meta-row">
            <span className="profile-meta-label">{t("Account type")}</span>
            <span className="profile-meta-value">{t(user.role)}</span>
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <p role="alert" className="profile-alert">
            {tError(error)}
          </p>
        )}
        {message && (
          <p className="profile-success" role="status">
            {t(message)}
          </p>
        )}

        {/* Edit form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="profile-name" className="field-label">
              {t("Name")}
            </label>
            <input
              dir="auto"
              id="profile-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="profile-city" className="field-label">
              {t("City (optional)")}
            </label>
            <input
              dir="auto"
              id="profile-city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-dark profile-submit-btn"
            disabled={saving}
          >
            {t(saving ? "Saving..." : "Save changes")}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
