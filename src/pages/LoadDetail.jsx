import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLoad, deleteLoad } from "../services/loads.js";
import { updateOffer, deleteOffer } from "../services/offers.js";

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

  if (!load) return <p>Loading load details...</p>;

  return (
    <div className="load-detail-container">
      <h1>Load Detail</h1>
      <p><strong>Broker Company Name:</strong> {load.company_name}</p>
      <p><strong>Pickup Location:</strong> {load.pickup_city}, {load.pickup_state}</p>
      <p><strong>Delivery Location:</strong> {load.delivery_city}, {load.delivery_state}</p>
      <p><strong>Pickup Date:</strong> {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : "Not Provided"}</p>
      <p><strong>Delivery Date:</strong> {load.delivery_date ? new Date(load.delivery_date).toLocaleDateString() : "Not Provided"}</p>
      <p><strong>Equipment Requirements:</strong> {load.equipment_requirements}</p>
      <p><strong>Commodity:</strong> {load.commodity}</p>
      <p><strong>Rate:</strong> ${load.rate}</p>

      {isOwner && (
        <div className="button-group">
          <Link to={`/loads/${loadId}/edit`}>
            <button>Edit Load</button>
          </Link>
          <button onClick={handleDeleteLoad}>Delete Load</button>
        </div>
      )}

      {load.offers && load.offers.length > 0 && (
        <div className="bids-section">
          <h2>Submitted Bids</h2>
          <ul>
            {load.offers.map((offer) => {
              const isCarrierOwner = localStorage.getItem("profileId") === String(offer.carrier);
              return (
                <li key={offer.id}>
                  <strong>Amount:</strong> ${offer.amount} <br />
                  <strong>Carrier:</strong> {offer.carrier_name} <br />
                  <strong>Date:</strong> {new Date(offer.submitted_at).toLocaleDateString()} <br />
                  {isCarrierOwner && (
                    <>
                      <button onClick={() => handleEdit(offer.id)}>Edit</button>
                      <button onClick={() => handleDelete(offer.id)}>Delete</button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LoadDetail;