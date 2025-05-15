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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert as MuiAlert,
} from "@mui/material";

function LoadDetail() {
  const { loadId } = useParams();
  const navigate = useNavigate();
  const [load, setLoad] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [editingOffer, setEditingOffer] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
        showSnackbar("Failed to load details.", "error");
      }
    };

    fetchLoad();
  }, [loadId]);

  const handleDeleteLoad = async () => {
    try {
      await deleteLoad(loadId);
      showSnackbar("Load deleted", "success");
      setTimeout(() => navigate("/loads"), 1200);
    } catch (error) {
      console.error("Failed to delete load:", error);
      showSnackbar("Failed to delete load", "error");
    }
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setEditAmount(offer.amount);
  };

  const handleSaveEdit = async () => {
    if (!editAmount || isNaN(editAmount)) {
      showSnackbar("Invalid amount entered", "error");
      return;
    }

    try {
      await updateOffer(editingOffer.id, { amount: parseFloat(editAmount) });
      showSnackbar("Offer updated!", "success");
      setEditingOffer(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Update failed", err);
      showSnackbar("Failed to update offer.", "error");
    }
  };

  const handleDelete = async (offerId) => {
    const confirmed = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmed) return;

    try {
      await deleteOffer(offerId);
      showSnackbar("Offer deleted!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Delete failed", err);
      showSnackbar("Failed to delete offer.", "error");
    }
  };

  if (!load) return <Typography>Loading load details...</Typography>;

  const formattedRate = Number(load.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Load Detail
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography><strong>Broker:</strong> {load.company_name}</Typography>
        <Typography><strong>Pickup:</strong> {load.pickup_city}, {load.pickup_state}</Typography>
        <Typography><strong>Delivery:</strong> {load.delivery_city}, {load.delivery_state}</Typography>
        <Typography><strong>Pickup Date:</strong> {new Date(load.pickup_date).toLocaleDateString()}</Typography>
        <Typography><strong>Delivery Date:</strong> {new Date(load.delivery_date).toLocaleDateString()}</Typography>
        <Typography><strong>Required Equipment:</strong> {load.equipment_requirements}</Typography>
        <Typography><strong>Commodity:</strong> {load.commodity}</Typography>
        <Typography><strong>Rate:</strong> ${formattedRate}</Typography>

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
                  <ListItem
                    key={offer.id}
                    divider
                    alignItems="flex-start"
                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <ListItemText
                      primary={`$${Number(offer.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} from ${offer.carrier_name}`}
                      secondary={`Submitted: ${new Date(offer.submitted_at).toLocaleDateString()}`}
                    />
                    {isCarrierOwner && (
                      <Box mt={1}>
                        <Button onClick={() => openEditModal(offer)} size="small" variant="outlined" sx={{ mr: 1 }}>
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

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Dialog for editing offer */}
      <Dialog open={!!editingOffer} onClose={() => setEditingOffer(null)}>
        <DialogTitle>Edit Bid</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Bid Amount"
            type="number"
            fullWidth
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingOffer(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LoadDetail;
