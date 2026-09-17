import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../../../contexts/UserContext.js";
import { LanguageContext } from "../../../contexts/LanguageContext.js";
import * as authService from "../../../services/authService.js";

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);
  const { t, tError } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConf: "",
    city: "",
    role: "Volunteer",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (formData.password !== formData.passwordConf) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const user = await authService.signUp(formData);
      setUser(user);
      navigate(user.role === "Organizer" ? "/organizer/organization" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t("Create an account")}</h1>
        {error && (
          <p className="state-msg state-error" role="alert">
            {tError(error)}
          </p>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">{t("Name")}</span>
            <input
              name="name"
              dir="auto"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{t("Username")}</span>
            <input
              name="username"
              dir="auto"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{t("Password")}</span>
            <input
              type="password"
              name="password"
              dir="ltr"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{t("Confirm password")}</span>
            <input
              type="password"
              name="passwordConf"
              dir="ltr"
              autoComplete="new-password"
              value={formData.passwordConf}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">{t("City (optional)")}</span>
            <input
              name="city"
              dir="auto"
              value={formData.city}
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span className="field-label">{t("Account type")}</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Volunteer">{t("Volunteer")}</option>
              <option value="Organizer">{t("Organizer")}</option>
            </select>
          </label>
          <div className="auth-form-actions">
            <button className="btn-primary-dark" disabled={saving}>
              {t(saving ? "Creating account..." : "Create account")}
            </button>
            <button
              className="btn-soft"
              type="button"
              onClick={() => navigate("/")}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
        <p className="auth-switch">
          <Link to="/sign-in">{t("Already have an account? Sign in")}</Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpForm;
