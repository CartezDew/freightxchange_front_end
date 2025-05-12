import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createNewLoad } from '../services/loads.js';


function NewLoad() {
  let navigate = useNavigate();

  const [load, setLoad] = useState({
    name: "",
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
    await createNewLoad(load);
    navigate("/loads");
  };

  return (
    <div className='new-load-root'>
      <div className="new-load-heading">
        <h2>Create a New Load</h2>
        <img />
      </div>
      <form className="new-load-form" onSubmit={handleSubmit}>
        <input
          className="input-load-name"
          placeholder="Name"
          name="name"
          value={load.name}
          onChange={handleChange}
          required
          autoFocus
        />
        <input
          className="input-pickup-city"
          placeholder="Pickup-City"
          name="pickup-city"
          value={load.pickup-city}
          onChange={handleChange}
          required
        />
        <input
          className="input-pickup-state"
          placeholder="Pickup-State"
          name="pickup-state"
          value={load.pickup-state}
          onChange={handleChange}
          required
        />
        <input
          className="input-destination-city"
          placeholder="Destination-City"
          name="destination-city"
          value={load.destination-city}
          onChange={handleChange}
          required
        />
        <input
          className="input-destination-state"
          placeholder="Destination-State"
          name="destination-state"
          value={load.destination-state}
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
          placeholder="Equipment"
          name="equipment"
          value={load.equipment}
          onChange={handleChange}
          required
        />
        <input
          className="delivery-date"
          placeholder="Delivery"
          name="delivery"
          value={load.delivery}
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
  )
}

export default NewLoad