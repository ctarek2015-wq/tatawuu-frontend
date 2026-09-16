import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext.js";
import * as authService from "../../../services/authService.js";

const Profile = () => {
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
    <h1>My profile</h1>
    <p>Username: {user.username}</p>
    <p>Account type: {user.role}</p>
    {error && <p role="alert">{error}</p>}
    {message && <p>{message}</p>}
    <form onSubmit={handleSubmit}>
      <label>Name <input name="name" value={formData.name} onChange={handleChange} required /></label>
      <label>City (optional) <input name="city" value={formData.city} onChange={handleChange} /></label>
      <button disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
    </form>
  </main>;
};

export default Profile;
