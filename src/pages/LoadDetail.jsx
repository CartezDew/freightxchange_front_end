import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLoad, deleteLoad } from "../services/loads.js";
import { updateOffer, deleteOffer } from "../services/offers.js";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
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

  const handleDeleteLoad = async () => {
    try {
      await deleteLoad(loadId);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  const handleEdit = async (offerId) => {
    const newAmount = prompt("Enter new bid amount:");
    if (!newAmount || isNaN(newAmount)) return alert("Invalid amount");

    try {
      await updateOffer(offerId, { amount: parseFloat(newAmount) });
      alert("Offer updated!");
      window.location.reload();
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update offer.");
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      await deleteOffer(offerId);
      alert("Offer deleted!");
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete offer.");
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
        <Typography><strong>Pickup Date:</strong> {new Date(load.pickup_date).toLocaleDateString()}</Typography>
        <Typography><strong>Delivery Date:</strong> {new Date(load.delivery_date).toLocaleDateString()}</Typography>
        <Typography><strong>Equipment Requirements:</strong> {load.equipment_requirements}</Typography>
        <Typography><strong>Commodity:</strong> {load.commodity}</Typography>
        <Typography><strong>Rate:</strong> ${load.rate}</Typography>

        {isOwner && (
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button component={Link} to={`/loads/${loadId}/edit`} variant="outlined">
              Edit Load
            </Button>
            <Button onClick={handleDeleteLoad} variant="contained" color="error">
              Delete Load
            </Button>
          </Box>
        )}

        {load.offers && load.offers.length > 0 && (
          <Box mt={4}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Submitted Bids
            </Typography>
            <List>
              {load.offers.map((offer) => {
                const isCarrierOwner = localStorage.getItem("profileId") === String(offer.carrier);
                return (
                  <ListItem key={offer.id} divider alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <ListItemText
                      primary={`$${offer.amount} from ${offer.carrier_name}`}
                      secondary={`Submitted: ${new Date(offer.submitted_at).toLocaleDateString()}`}
                    />
                    {isCarrierOwner && (
                      <Box mt={1}>
                        <Button onClick={() => handleEdit(offer.id)} size="small" variant="outlined" sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(offer.id)} size="small" variant="contained" color="error">
                          Delete
                        </Button>
                      </Box>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default LoadDetail;