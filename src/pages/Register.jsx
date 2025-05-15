import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/users.js";
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
} from "@mui/material";

function Register({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "carrier",
    isError: false,
    errorMsg: "",
  });

  // ✅ Redirect logged-in users
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
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

  return (
    <Container maxWidth="sm">
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
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Register for FreightXchange
        </Typography>

        <TextField
          fullWidth
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required
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
          fullWidth
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          required
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
          fullWidth
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          required
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography fontWeight="bold">Role:</Typography>
          <Button
            onClick={handleRoleToggle}
            variant="outlined"
            sx={{
              borderRadius: "20px",
              px: 2,
              color: "#5D3A00",
              borderColor: "#5D3A00",
              "&:hover": {
                backgroundColor: "#f8f2ec",
                borderColor: "#5D3A00",
              },
            }}
          >
            {form.role === "carrier"
              ? "Carrier (Click to switch to Broker)"
              : "Broker (Click to switch to Carrier)"}
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: form.isError ? "#c62828" : "#5D3A00",
            color: "#fff",
            "&:hover": {
              backgroundColor: form.isError ? "#b71c1c" : "#4a2f00",
            },
          }}
        >
          {form.isError ? form.errorMsg : "Register"}
        </Button>
      </Box>
    </Container>
  );
}

export default Register;