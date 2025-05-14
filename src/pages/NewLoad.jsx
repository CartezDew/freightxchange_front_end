import { useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { createNewLoad } from '../services/loads.js';

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
      await createNewLoad(load);
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
          className="load-name"
          placeholder="Name"
          name="name"
          value={load.name}
          onChange={handleChange}
          required
          autoFocus
        />
        <input
          className="pickup-city"
          placeholder="Pickup City"
          name="pickup-city"
          value={load.pickupCity}
          onChange={handleChange}
          required
        />
        <input
          className="pickup-state"
          placeholder="Pickup State"
          name="pickup-state"
          value={load.pickupState}
        />
        <input
          className="destination-city"
          placeholder="Destination City"
          name="destination-city"
          value={load.destinationCity}
          onChange={handleChange}
          required
        />
        <input
          className="destination-state"
          placeholder="Destination State"
          name="destination-state"
          value={load.destinationState}
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
        <select
          className="equipment"
          placeholder="Equipment Requirements"
          name="equipment"
          value={load.equipment}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Equipment --</option>
          <option value="Box Truck">Box Truck</option>
          <option value="Car Hauler">Car Hauler</option>
          <option value="Conestoga">Conestoga</option>
          <option value="Container Chassis">Container Chassis</option>
          <option value="Dry Van">Dry Van</option>
          <option value="Dumptruck">Dumptruck</option>
          <option value="Flatbed">Flatbed</option>
          <option value="Gooseneck">Gooseneck</option>
          <option value="Hotshot">Hotshot</option>
          <option value="Livestock">Livestock Trailer</option>
          <option value="Logging">Logging</option>
          <option value="Lowboy">Lowboy</option>
          <option value="Power Only">Power Only</option>
          <option value="Reefer">Reefer</option>
          <option value="Step Deck">Step Deck</option>  
          <option value="Tanker">Tanker</option>
          <option value="Walking Floor">Walking Floor</option>
          </select>
        
        <input
          className="commodity"
          placeholder="Commodity"
          name="commodity"
          value={load.commodity}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          className="pickup-date"
          placeholder="Pickup Date"
          name="pickup_date"
          value={load.pickupDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          className="delivery-date"
          placeholder="Delivery Date"
          name="delivery_date"
          value={load.deliveryDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewLoad;

