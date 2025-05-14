import { Link } from 'react-router-dom';
import './LoadCard.css';

const LoadCard = ({ load, user }) => {
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
      <button className="bid-button" onClick={() => alert('Bid feature coming soon!')}>
          Bid
      </button>
    </div>
  );
};

export default LoadCard; 