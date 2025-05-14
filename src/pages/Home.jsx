import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signIn } from "../services/users.js";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";

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
      navigate("/profile");
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

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="off"
        />

        {form.isError && <Alert severity="error">{form.errorMsg}</Alert>}

        <Button type="submit" variant="contained" fullWidth>
          Log In
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          No account?{" "}
          <Link component={RouterLink} to="/register">
            Sign up here!
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
