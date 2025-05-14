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
} from '@mui/material';

function NewLoad() {
  const navigate = useNavigate();

  const [load, setLoad] = useState({
    name: "",
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
    try {
      await createNewLoad(load);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to create load:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Load
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Name"
          name="name"
          value={load.name}
          onChange={handleChange}
          required
        />

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
        <input
          className="pickup-city"
          placeholder="Pickup City"
          name="pickup-city"
          value={load.pickupCity}
          onChange={handleChange}
          required
        />
        <input
          className="pickup-state"
          placeholder="Pickup State"
          name="pickup-state"
          value={load.pickupState}
        />
        <input
          className="destination-city"
          placeholder="Destination City"
          name="destination-city"
          value={load.destinationCity}
          onChange={handleChange}
          required
        />
        <input
          className="destination-state"
          placeholder="Destination State"
          name="destination-state"
          value={load.destinationState}
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

        <select
          className="equipment"
          placeholder="Equipment Requirements"
          name="equipment"
          value={load.equipment}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Equipment --</option>
          <option value="Box Truck">Box Truck</option>
          <option value="Car Hauler">Car Hauler</option>
          <option value="Conestoga">Conestoga</option>
          <option value="Container Chassis">Container Chassis</option>
          <option value="Dry Van">Dry Van</option>
          <option value="Dumptruck">Dumptruck</option>
          <option value="Flatbed">Flatbed</option>
          <option value="Gooseneck">Gooseneck</option>
          <option value="Hotshot">Hotshot</option>
          <option value="Livestock">Livestock Trailer</option>
          <option value="Logging">Logging</option>
          <option value="Lowboy">Lowboy</option>
          <option value="Power Only">Power Only</option>
          <option value="Reefer">Reefer</option>
          <option value="Step Deck">Step Deck</option>  
          <option value="Tanker">Tanker</option>
          <option value="Walking Floor">Walking Floor</option>
          </select>
        
        <input
          className="commodity"
          placeholder="Commodity"
          name="commodity"
          value={load.commodity}

          onChange={handleChange}
          select
          required

        >
          {[
            "Box Truck", "Car Hauler", "Conestoga", "Container Chassis",
            "Dry Van", "Dumptruck", "Flatbed", "Gooseneck", "Hotshot",
            "Livestock Trailer", "Logging", "Lowboy", "Power Only",
            "Reefer", "Step Deck", "Tanker", "Walking Floor"
          ].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Commodity"

        />
        <input

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

          value={load.deliveryDate}

          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default NewLoad;
