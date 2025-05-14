import { useEffect, useState } from 'react';
import { getOffers } from '../services/offers';

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

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="offers-page">
      <h2>Submitted Offers</h2>
      {offers.length === 0 ? (
        <p>No offers submitted yet.</p>
      ) : (
        <ul className="offers-list">
          {offers.map((offer) => (
            <li key={offer.id} className="offer-item">
              <p><strong>Offer ID:</strong> {offer.id}</p>
              <p><strong>Load ID:</strong> {offer.load}</p>
              <p><strong>Offer Amount:</strong> ${offer.offer_amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Offers;
