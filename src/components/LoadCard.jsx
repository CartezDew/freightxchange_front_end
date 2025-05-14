import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoadCard.css';
import { createOffer } from '../services/offers';

const LoadCard = ({ load }) => {
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
    if (!bidAmount) return;

    try {
      const offerData = {
        load: load.id,
        amount: parseFloat(bidAmount),
      };

      const response = await createOffer(offerData);

      // Show success message in modal
      setModalStage('success');
      setModalMessage("Your offer was submitted!");
      console.log("Created offer:", response);
    } catch (error) {
      // Show error message in modal
      setModalStage('error');
      setModalMessage(
        error.response?.data?.error || "Something went wrong submitting your bid."
      );
      console.error("Failed to create offer:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="load-card">
        <Link to={`/loads/${load.id}`} className="load-card-link">
          <h1>{load.name}</h1>
          <h2>Pick-up Location: {load.pickupCity}, {load.pickupState}</h2>
          <h2>Drop-off Location: {load.dropoffCity}, {load.dropoffState}</h2>
          <h2>Rate: {load.rate}</h2>
          <h2>Equipment Requirement: {load.equipment}</h2>
          <h2>Commodity: {load.commodity}</h2>
          <h2>Delivery Date: {load.deliveryDate}</h2>
        </Link>
        <button className="bid-button" onClick={openModal}>
          Bid
        </button>
      </div>

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
