import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLoad, deleteLoad } from "../services/loads.js";

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

        // Compare current user's profile ID with broker ID on the load
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

  const handleDelete = async () => {
    try {
      await deleteLoad(loadId);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  if (!load) return <p>Loading load details...</p>;

  return (
    <div className="load-detail-container">
      <h1>Load Detail</h1>
      <p><strong>Pickup Location:</strong> {load.pickup_location}</p>
      <p><strong>Delivery Location:</strong> {load.delivery_location}</p>
      <p><strong>Rate:</strong> ${load.rate}</p>
      <p><strong>Equipment Requirements:</strong> {load.equipment_requirements}</p>
      <p><strong>Pickup Date:</strong> {new Date(load.pickup_date).toLocaleDateString()}</p>
      <p><strong>Location Date:</strong> {new Date(load.location_date).toLocaleDateString()}</p>
      <p><strong>Commodity:</strong> {load.commodity}</p>

      {isOwner && (
        <div className="button-group">
          <Link to={`/loads/${loadId}/edit`}>
            <button>Edit Load</button>
          </Link>
          <button onClick={handleDelete}>Delete Load</button>
        </div>
      )}
    </div>
  );
}

export default LoadDetail;
