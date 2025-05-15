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
  Modal,
  TextField,
} from '@mui/material';

const LoadCard = ({ load }) => {
  const role = localStorage.getItem('role');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [modalStage, setModalStage] = useState('input');
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
      await createOffer(offerData);
      setModalStage('success');
      setModalMessage('Your offer was submitted!');
    } catch (error) {
      setModalStage('error');
      setModalMessage(error.response?.data?.error || 'Something went wrong submitting your bid.');
      console.error('Failed to create offer:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 300,
          m: 2,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent
          component={Link}
          to={`/loads/${load.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {/* Format rate with commas and two decimal places */}
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1a237e', mb: 2 }}
          >
            ${Number(load.rate).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {load.company_name}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Pick-up:</strong> {load.pickup_city}, {load.pickup_state}
          </Typography>

          <Typography variant="body2">
            <strong>Drop-off:</strong> {load.delivery_city}, {load.delivery_state}
          </Typography>

          <Typography variant="body2">
            <strong>Equipment:</strong> {load.equipment_requirements}
          </Typography>
        </CardContent>

        {role?.toLowerCase() === 'carrier' && (
          <Box sx={{ px: 2, pb: 2 }}>
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
                '&:hover': {
                  backgroundColor: '#8b4513',
                },
              }}
            >
              Bid
            </Button>
          </Box>
        )}
      </Card>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 300,
          }}
        >
          {modalStage === 'input' && (
            <>
              <Typography variant="h6" gutterBottom>
                Enter your bid amount
              </Typography>
              <TextField
                type="number"
                fullWidth
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="e.g. 1200"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button fullWidth variant="contained" onClick={handleSubmitBid}>
                  Submit
                </Button>
                <Button fullWidth variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
              </Box>
            </>
          )}

          {modalStage === 'success' && (
            <>
              <Typography variant="h6" gutterBottom>
                {modalMessage}
              </Typography>
              <Button fullWidth variant="contained" onClick={closeModal}>
                Close
              </Button>
            </>
          )}

          {modalStage === 'error' && (
            <>
              <Typography variant="h6" color="error" gutterBottom>
                Error
              </Typography>
              <Typography variant="body2" gutterBottom>
                {modalMessage}
              </Typography>
              <Button fullWidth variant="contained" onClick={closeModal}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default LoadCard;
