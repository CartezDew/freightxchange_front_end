import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/users.js";

function Register({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "carrier", // Default is carrier
    isError: false,
    errorMsg: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRoleToggle = () => {
    setForm((prevForm) => ({
      ...prevForm,
      role: prevForm.role === "carrier" ? "broker" : "carrier",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await signUp(form);
      setUser(userData);

      navigate(form.role === "broker" ? "/loads" : "/carrier-profiles");
    } catch (error) {
      console.error(error);
      setForm((prevForm) => ({
        ...prevForm,
        isError: true,
        errorMsg: "Invalid Credentials",
        password: "",
      }));
    }
  };

  const renderError = () => {
    const toggleForm = form.isError ? "danger" : "";
    return (
      <button type="submit" className={toggleForm}>
        {form.isError ? form.errorMsg : "Register"}
      </button>
    );
  };

  return (
    <div className="home-container">
      <form className="home-form" onSubmit={handleSubmit}>
        <h1>Register for FreightXchange</h1>

        <input
          type="text"
          name="username"
          value={form.username}
          placeholder="Enter Username"
          onChange={handleChange}
          required
          autoComplete="off"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Enter Email"
          onChange={handleChange}
          required
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Enter Password"
          onChange={handleChange}
          required
          autoComplete="off"
        />

        <div className="role-toggle" style={{ margin: "1rem 0" }}>
          <label style={{ marginRight: "1rem" }}>
            <strong>Role:</strong>
          </label>
          <button
            type="button"
            onClick={handleRoleToggle}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            {form.role === "carrier" ? "Carrier (Click to switch to Broker)" : "Broker (Click to switch to Carrier)"}
          </button>
        </div>

        {renderError()}
      </form>
    </div>
  );
}

export default Register;
