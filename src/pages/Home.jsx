import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/users.js";


// import "./Home.css";

function Home({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await signIn(form);
      setUser(userData);
      navigate("/profile"); // or `/profile/${userData.id}` if needed
    } catch (error) {
      console.error("Login failed:", error);
      setForm((prevForm) => ({
        ...prevForm,
        isError: true,
        errorMsg: "Invalid credentials",
        password: "",
      }));
    }
  };

  const renderError = () => {
    return form.isError ? (
      <p className="error-message">{form.errorMsg}</p>
    ) : null;
  };

  return (
    <div className="home-container">

      <div>

      <div className="home-form-container">

        <form className="home-form" onSubmit={handleSubmit}>
          <h1>Login</h1>

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
            type="password"
            name="password"
            value={form.password}
            placeholder="Enter Password"
            onChange={handleChange}
            required
            autoComplete="off"
          />

          {renderError()}

          <button type="submit">Log In</button>

          <Link to="/register">
            <p>No account? Sign up here!</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Home;
