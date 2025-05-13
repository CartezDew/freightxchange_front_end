import { useState, useEffect } from 'react';
import LoadCard from '../components/LoadCard.jsx';
import { getLoads } from '../services/loads';
import Nav from '../components/Nav.jsx';
import './Loads.css';

const Loads = () => {
    const [loads, setLoads] = useState([])

    const fetchLoads = async () => {
        const loadsData = await getLoads()
        setLoads(loadsData)
    }

    useEffect(()=>{
        fetchLoads()
    }, [])

    return (
        <div className="load-list-container">
            {loads.map((load) => (
                <LoadCard key={load.id} load={load} />
            ))}
        </div>
    );
};

export default Loads;