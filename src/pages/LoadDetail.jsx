import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLoad, deleteLoad } from "../services/loads.js";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

function LoadDetail() {
  const { loadId } = useParams();
  const navigate = useNavigate();
  const [load, setLoad] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const loadData = await getLoad(loadId);
        setLoad(loadData);

        const currentProfileId = localStorage.getItem("profileId");
        if (
          loadData.broker &&
          String(loadData.broker) === String(currentProfileId)
        ) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Failed to fetch load:", error);
      }
    };

    fetchLoad();
  }, [loadId]);

  const handleDelete = async () => {
    try {
      await deleteLoad(loadId);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  if (!load) return <Typography>Loading load details...</Typography>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Load Detail
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography><strong>Company Name:</strong> {load.company_name}</Typography>
        <Typography><strong>Pickup Location:</strong> {load.pickup_city}, {load.pickup_state}</Typography>
        <Typography><strong>Delivery Location:</strong> {load.delivery_city}, {load.delivery_state}</Typography>
        <Typography><strong>Pickup Date:</strong> {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : "Not Provided"}</Typography>
        <Typography><strong>Delivery Date:</strong> {load.delivery_date ? new Date(load.delivery_date).toLocaleDateString() : "Not Provided"}</Typography>
        <Typography><strong>Equipment Requirements:</strong> {load.equipment_requirements}</Typography>
        <Typography><strong>Commodity:</strong> {load.commodity}</Typography>
        <Typography><strong>Rate:</strong> ${load.rate}</Typography>

        {isOwner && (
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button component={Link} to={`/loads/${loadId}/edit`} variant="outlined">
              Edit Load
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete Load
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default LoadDetail;

