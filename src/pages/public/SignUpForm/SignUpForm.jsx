import { useState, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext.jsx";
import { useNavigate } from "react-router";
import { signUp } from "../../../services/authService";

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    role: "",
  });

  const { username, password, passwordConf, role } = formData;

  const handleChange = ({ target: { name, value } }) => {
    setMessage("");
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    try {
      const newUser = await signUp(formData);
      console.log(newUser);
      setUser(newUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf && role);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <input
            type="radio"
            id="Admin"
            name="role"
            value="Admin"
            onChange={handleChange}
            required
          />
          <label htmlFor="Admin">Admin</label>
          <input
            type="radio"
            id="Volunteer"
            name="role"
            value="Volunteer"
            onChange={handleChange}
            required
          />
          <label htmlFor="Volunteer">Volunteer</label>
          <input
            type="radio"
            id="Organizer"
            name="role"
            value="Organizer"
            onChange={handleChange}
            required
          />
          <label htmlFor="Organizer">Organizer</label>
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
