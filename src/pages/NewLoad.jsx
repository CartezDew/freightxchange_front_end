import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewLoad } from '../services/loads.js';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
} from '@mui/material';

function NewLoad() {
  const navigate = useNavigate();

  const [load, setLoad] = useState({
    pickup_city: "",
    pickup_state: "",
    delivery_city: "",
    delivery_state: "",
    rate: "",
    equipment_requirements: "",
    pickup_date: "",
    delivery_date: "",
    commodity: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoad((prevLoad) => ({
      ...prevLoad,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loadWithBroker = {
      ...load,
      broker: localStorage.getItem("profileId"),
    };

    try {
      await createNewLoad(loadWithBroker);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to create load:", error);
    }
  };

  const equipmentOptions = [
    "Box Truck", "Car Hauler", "Conestoga", "Container Chassis",
    "Dry Van", "Dumptruck", "Flatbed", "Gooseneck", "Hotshot",
    "Livestock Trailer", "Logging", "Lowboy", "Power Only",
    "Reefer", "Step Deck", "Tanker", "Walking Floor"
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Load
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Pickup City"
            name="pickup_city"
            value={load.pickup_city}
            onChange={handleChange}
            required
          />
          <TextField
            label="Pickup State"
            name="pickup_state"
            value={load.pickup_state}
            onChange={handleChange}
            required
          />
          <TextField
            label="Delivery City"
            name="delivery_city"
            value={load.delivery_city}
            onChange={handleChange}
            required
          />
          <TextField
            label="Delivery State"
            name="delivery_state"
            value={load.delivery_state}
            onChange={handleChange}
            required
          />
          <TextField
            label="Rate"
            name="rate"
            type="number"
            value={load.rate}
            onChange={handleChange}
            required
          />
          <TextField
            label="Equipment Requirements"
            name="equipment_requirements"
            value={load.equipment_requirements}
            onChange={handleChange}
            select
            required
          >
            {equipmentOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Commodity"
            name="commodity"
            value={load.commodity}
            onChange={handleChange}
            required
          />
          <TextField
            label="Pickup Date"
            name="pickup_date"
            type="date"
            value={load.pickup_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Delivery Date"
            name="delivery_date"
            type="date"
            value={load.delivery_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: '#191970',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#000080'
              }
            }}
          >
            Submit Load
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default NewLoad;
