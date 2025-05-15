import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import JokeDisplay from "../components/JokeDisplay";
import { signIn } from "../services/users.js";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Paper,
  Divider,
} from "@mui/material";
import "../pages/Home.css";

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
    <>
      <Container maxWidth="sm" className="home-container">
        <Paper elevation={3} className="home-paper">
          <Typography variant="h3" align="center" gutterBottom>
            Welcome to FreightXchange
          </Typography>

          <Typography variant="subtitle1" align="center" className="home-subtitle">
            Built for carriers. Backed by brokers.
          </Typography>

          <Box className="home-about" sx={{ my: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              FreightXchange was created to give small carriers a level playing field in the freight
              world. We believe in transparency, accessibility, and empowering owner-operators and
              brokers to build trust through better tools — not middlemen.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box component="form" onSubmit={handleSubmit} className="home-form">
            <Typography variant="h5" gutterBottom>
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
              sx={{
                '& label': { color: '#5D3A00' },
                '& label.Mui-focused': { color: '#5D3A00' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#5D3A00' },
                  '&:hover fieldset': { borderColor: '#5D3A00' },
                  '&.Mui-focused fieldset': { borderColor: '#5D3A00' },
                },
              }}
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
              sx={{
                mt: 2,
                '& label': { color: '#5D3A00' },
                '& label.Mui-focused': { color: '#5D3A00' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#5D3A00' },
                  '&:hover fieldset': { borderColor: '#5D3A00' },
                  '&.Mui-focused fieldset': { borderColor: '#5D3A00' },
                },
              }}
            />

            {form.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {form.errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: '#5D3A00',
                '&:hover': { backgroundColor: '#3e2600' },
              }}
            >
              Log In
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              No account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ color: '#191970', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Sign up here!
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Box className="home-joke-banner">
        <JokeDisplay />
      </Box>
    </>
  );
}

export default Home;
