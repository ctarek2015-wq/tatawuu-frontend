import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { signIn } from "../../services/authService";

import { UserContext } from "../../contexts/UserContext";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };
  console.log(formData);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <main>
      <h1>Sign In</h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Username:</label>
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
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
          <button>Sign In</button>
          <button onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
