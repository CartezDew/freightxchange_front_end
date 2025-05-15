import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoadCard.css';
import { createOffer } from '../services/offers';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';

const LoadCard = ({ load }) => {
  const role = localStorage.getItem("role");

  // Modal + bid state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [modalStage, setModalStage] = useState('input'); // 'input' | 'success' | 'error'
  const [modalMessage, setModalMessage] = useState('');

  const openModal = () => {
    setModalStage('input');
    setModalMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setBidAmount('');
    setModalStage('input');
    setModalMessage('');
    setIsModalOpen(false);
  };

  const handleSubmitBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setModalStage('error');
      setModalMessage('Please enter a valid number.');
      return;
    }

    try {
      const offerData = {
        load: load.id,
        amount: parseFloat(bidAmount),
      };

      const response = await createOffer(offerData);
      setModalStage('success');
      setModalMessage("Your offer was submitted!");
      console.log("Created offer:", response);
    } catch (error) {
      setModalStage('error');
      setModalMessage(
        error.response?.data?.error || "Something went wrong submitting your bid."
      );
      console.error("Failed to create offer:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 300,
          m: 2,
          p: 1,
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent component={Link} to={`/loads/${load.id}`} sx={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={{ color: '#5d4037' }} gutterBottom>
            {load.company_name}
          </Typography>

          <Typography variant="body2" sx={{ color: '#191970' }}>
            <strong>Pick-up Location:</strong> {load.pickupCity}, {load.pickupState}
          </Typography>

          <Typography variant="body2" sx={{ color: '#191970' }}>
            <strong>Rate:</strong> ${load.rate}
          </Typography>
        </CardContent>

        {role?.toLowerCase() === 'carrier' && (
          <Box sx={{ px: 2, pb: 2, pt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={openModal}
              sx={{
                backgroundColor: '#a0522d', 
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: '#8b4513',
                }
              }}
            >
              Bid
            </Button>
          </Box>
        )}
      </Card>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {modalStage === 'input' && (
              <>
                <h3>Enter your bid amount</h3>
                <input
                  type="number"
                  placeholder="e.g. 900"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <div className="modal-actions">
                  <button className="bid-button" onClick={handleSubmitBid}>Submit Bid</button>
                  <button className="bid-button" onClick={closeModal}>Cancel</button>
                </div>
              </>
            )}

            {modalStage === 'success' && (
              <>
                <h3>{modalMessage}</h3>
                <div className="modal-actions">
                  <button className="bid-button" onClick={closeModal}>Close</button>
                </div>
              </>
            )}

            {modalStage === 'error' && (
              <>
                <h3>Error</h3>
                <p>{modalMessage}</p>
                <div className="modal-actions">
                  <button className="bid-button" onClick={closeModal}>Try Again</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoadCard;


