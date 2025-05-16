import { useEffect, useState } from 'react';
import { getOffers } from '../services/offers';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading offers...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Submitted Offers
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {offers.length === 0 ? (
        <Typography>No offers submitted yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {offers.map((offer) => (
            <Paper key={offer.id} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6">Offer ID: {offer.id}</Typography>
              <Typography><strong>Load ID:</strong> {offer.load}</Typography>
              <Typography><strong>Offer Amount:</strong> ${Number(offer.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
              <Typography><strong>Status:</strong> {offer.status}</Typography>
              {offer.status === "declined" && (
                <Typography color="error"><strong>Declined Reason:</strong> {offer.declined_reason || "Not specified"}</Typography>
              )}
              <Typography><strong>Submitted:</strong> {new Date(offer.submitted_at).toLocaleDateString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Offers;
