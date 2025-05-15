import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoad, updateLoad } from "../services/loads.js";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem
} from "@mui/material";

function EditLoad() {
  const navigate = useNavigate();
  const { loadId } = useParams();

  const [load, setLoad] = useState({
    pickup_city: "",
    pickup_state: "",
    delivery_city: "",
    delivery_state: "",
    rate: "",
    equipment_requirements: "",
    pickup_date: "",
    delivery_date: "",
    commodity: ""
  });

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const loadData = await getLoad(loadId);
        setLoad(loadData);
      } catch (error) {
        console.error("Failed to load load data:", error);
      }
    };

    fetchLoad();
  }, [loadId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoad((prevLoad) => ({
      ...prevLoad,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLoad(loadId, load);
      navigate(`/loads/${loadId}`);
    } catch (error) {
      console.error("Failed to update load:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Load
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          name="pickup_city"
          label="Pickup City"
          value={load.pickup_city}
          onChange={handleChange}
          required
        />
        <TextField
          name="pickup_state"
          label="Pickup State"
          value={load.pickup_state}
          onChange={handleChange}
          required
        />
        <TextField
          name="delivery_city"
          label="Delivery City"
          value={load.delivery_city}
          onChange={handleChange}
          required
        />
        <TextField
          name="delivery_state"
          label="Delivery State"
          value={load.delivery_state}
          onChange={handleChange}
          required
        />
        <TextField
          name="rate"
          label="Rate"
          type="number"
          value={load.rate}
          onChange={handleChange}
          required
        />
        <TextField
        name="equipment_requirements"
        label="Equipment Requirements"
        value={load.equipment_requirements}
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
          name="pickup_date"
          label="Pickup Date"
          type="date"
          value={load.pickup_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="delivery_date"
          label="Delivery Date"
          type="date"
          value={load.delivery_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="commodity"
          label="Commodity"
          value={load.commodity}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained">
          Update Load
        </Button>
      </Box>
    </Container>
  );
}

export default EditLoad;
