import { Link } from 'react-router-dom';
import './LoadCard.css';
import { createOffer } from '../services/offers';


const LoadCard = ({ load }) => {
  const handleBid = async () => {
    const amount = prompt("Enter your bid amount:");

    if (!amount) return; 

    try {
      const offerData = {
        load: load.id,
        amount: parseFloat(amount)
      };

      const response = await createOffer(offerData);
      alert("Your offer was submitted!");
      console.log("Created offer:", response);
    } catch (error) {
      console.error("Failed to create offer:", error.response?.data || error.message);
      alert("Something went wrong submitting your bid.");
    }
  };


  return (
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
      <button className="bid-button" onClick={handleBid}>
          Bid
      </button>
    </div>
  );
};

export default LoadCard; 