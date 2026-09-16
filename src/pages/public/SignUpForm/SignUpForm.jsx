import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../../../contexts/UserContext.js";
import * as authService from "../../../services/authService.js";

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", username: "", password: "", passwordConf: "", city: "", role: "Volunteer" });
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

  return <main>
    <h1>Create an account</h1>
    {error && <p role="alert">{error}</p>}
    <form onSubmit={handleSubmit}>
      <label>Name <input name="name" value={formData.name} onChange={handleChange} required /></label>
      <label>Username <input name="username" autoComplete="username" value={formData.username} onChange={handleChange} required /></label>
      <label>Password <input type="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required /></label>
      <label>Confirm password <input type="password" name="passwordConf" autoComplete="new-password" value={formData.passwordConf} onChange={handleChange} required /></label>
      <label>City (optional) <input name="city" value={formData.city} onChange={handleChange} /></label>
      <label>Account type <select name="role" value={formData.role} onChange={handleChange}>
        <option>Volunteer</option><option>Organizer</option>
      </select></label>
      <button disabled={saving}>{saving ? "Creating account..." : "Create account"}</button>
      <button type="button" onClick={() => navigate("/")}>Cancel</button>
    </form>
    <p><Link to="/sign-in">Already have an account? Sign in</Link></p>
  </main>;
};

export default SignUpForm;
