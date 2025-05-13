import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLoad } from '../services/loads.js';

function NewLoad() {
  const navigate = useNavigate();

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoad((prevLoad) => ({
      ...prevLoad,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLoad(load);
      navigate("/loads");
    } catch (error) {
      console.error("Failed to create load:", error);
    }
  };

  return (
    <div className="new-load-root">
      <div className="new-load-heading">
        <h2>Create a New Load</h2>
      </div>
      <form className="new-load-form" onSubmit={handleSubmit}>
        <input
          className="input-pickup-city"
          placeholder="Pickup City"
          name="pickup_city"
          value={load.pickup_city}
          onChange={handleChange}
          required
        />
        <input
          className="input-pickup-state"
          placeholder="Pickup State"
          name="pickup_state"
          value={load.pickup_state}
          onChange={handleChange}
          required
        />
        <input
          className="input-delivery-city"
          placeholder="Delivery City"
          name="delivery_city"
          value={load.delivery_city}
          onChange={handleChange}
          required
        />
        <input
          className="input-delivery-state"
          placeholder="Delivery State"
          name="delivery_state"
          value={load.delivery_state}
          onChange={handleChange}
          required
        />
        <input
          className="rate"
          placeholder="Rate"
          name="rate"
          value={load.rate}
          onChange={handleChange}
          required
        />
        <input
          className="equipment-requirement"
          placeholder="Equipment Requirements"
          name="equipment_requirements"
          value={load.equipment_requirements}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          className="pickup-date"
          placeholder="Pickup Date"
          name="pickup_date"
          value={load.pickup_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          className="delivery-date"
          placeholder="Delivery Date"
          name="delivery_date"
          value={load.delivery_date}
          onChange={handleChange}
          required
        />
        <input
          className="commodity"
          placeholder="Commodity"
          name="commodity"
          value={load.commodity}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewLoad;
