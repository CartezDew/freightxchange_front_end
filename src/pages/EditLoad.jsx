import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoad, updateLoad } from "../services/loads.js";

function EditLoad() {
  const navigate = useNavigate();
  const { loadId } = useParams();

  const [load, setLoad] = useState({
    pickup_city: "",
    pickup_state: "",
    delivery_city: "",
    delivery_state: "",
    rate: "",
    equipment_requirements: "",
    pickup_date: "",
    delivery_date: "",
    commodity: ""
  });

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const loadData = await getLoad(loadId);
        setLoad(loadData);
      } catch (error) {
        console.error("Failed to load load data:", error);
      }
    };

    fetchLoad();
  }, [loadId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoad((prevLoad) => ({
      ...prevLoad,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLoad(loadId, load);
      navigate(`/loads/${loadId}`);
    } catch (error) {
      console.error("Failed to update load:", error);
    }
  };

  return (
    <div className="edit-load-root">
      <h2>Edit Load</h2>
      <form className="edit-load-form" onSubmit={handleSubmit}>
        <input
          name="pickup_city"
          placeholder="Pickup City"
          value={load.pickup_city}
          onChange={handleChange}
          required
        />
        <input
          name="pickup_state"
          placeholder="Pickup State"
          value={load.pickup_state}
          onChange={handleChange}
          required
        />
        <input
          name="delivery_city"
          placeholder="Delivery City"
          value={load.delivery_city}
          onChange={handleChange}
          required
        />
        <input
          name="delivery_state"
          placeholder="Delivery State"
          value={load.delivery_state}
          onChange={handleChange}
          required
        />
        <input
          name="rate"
          placeholder="Rate"
          value={load.rate}
          onChange={handleChange}
          required
        />
        <input
          name="equipment_requirements"
          placeholder="Equipment Requirements"
          value={load.equipment_requirements}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="pickup_date"
          placeholder="Pickup Date"
          value={load.pickup_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="delivery_date"
          placeholder="Delivery Date"
          value={load.delivery_date}
          onChange={handleChange}
          required
        />
        <input
          name="commodity"
          placeholder="Commodity"
          value={load.commodity}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Load</button>
      </form>
    </div>
  );
}

export default EditLoad;
