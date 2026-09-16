import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import * as authService from "../../../services/authService.js";
import { UserContext } from "../../../contexts/UserContext.js";
import { LanguageContext } from "../../../contexts/LanguageContext.js";

const SignInForm = () => {
  const { setUser } = useContext(UserContext);
  const { t, tError } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", role: "Volunteer" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const user = await authService.signIn(formData);
      setUser(user);
      if (user.role === "Organizer") navigate("/organizer/campaigns");
      else if (user.role === "Admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return <main>
    <h1>{t("Sign in")}</h1>
    {error && <p role="alert">{tError(error)}</p>}
    <form onSubmit={handleSubmit}>
      <label>{t("Username")} <input name="username" dir="auto" autoComplete="username" value={formData.username} onChange={handleChange} required /></label>
      <label>{t("Password")} <input type="password" name="password" dir="ltr" autoComplete="current-password" value={formData.password} onChange={handleChange} required /></label>
      <label>{t("Role")} <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="Admin">{t("Admin")}</option>
        <option value="Organizer">{t("Organizer")}</option>
        <option value="Volunteer">{t("Volunteer")}</option>
      </select></label>
      <button disabled={saving}>{t(saving ? "Signing in..." : "Sign in")}</button>
      <button type="button" onClick={() => navigate("/")}>{t("Cancel")}</button>
    </form>
    <p><Link to="/sign-up">{t("Create an account")}</Link></p>
  </main>;
};

export default SignInForm;
