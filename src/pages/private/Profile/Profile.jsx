import { LanguageContext } from "../../../contexts/LanguageContext.js";
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext.js";
import * as authService from "../../../services/authService.js";

const Profile = () => {
  const { t, tError } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: user.name, city: user.city || "" });
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

  return <main>
    <h1>{t("My profile")}</h1>
    <p>{t("Username")}: <bdi>{user.username}</bdi></p>
    <p>{t("Account type")}: {t(user.role)}</p>
    {error && <p role="alert">{tError(error)}</p>}
    {message && <p>{t(message)}</p>}
    <form onSubmit={handleSubmit}>
      <label>
          {t("Name")}
          <input dir="auto" name="name" value={formData.name} onChange={handleChange} required /></label>
      <label>
          {t("City (optional)")}
          <input dir="auto" name="city" value={formData.city} onChange={handleChange} /></label>
      <button disabled={saving}>{t(saving ? "Saving..." : "Save changes")}</button>
    </form>
  </main>;
};

export default Profile;
