import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { NewLoad } from '../../services/loads.js';


function NewLoad() {
  let navigate = useNavigate();

  const [load, setLoad] = useState({
    name: "",
    color: "",
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
    await newLoad(load);
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
          className="input-toy-color"
          placeholder="Color"
          name="color"
          value={toy.color}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default NewLoad