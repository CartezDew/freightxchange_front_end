import { useState, useEffect } from 'react';
import LoadCard from '../components/LoadCard.jsx';
import { getLoads } from '../services/loads';

import { Container, Grid, Typography } from '@mui/material';

import Nav from '../components/Nav.jsx';
import '../components/LoadList.css';


const Loads = () => {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      const loadsData = await getLoads();
      setLoads(loadsData);
    };
    fetchLoads();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Loads
      </Typography>

      <Grid container spacing={3}>
        {loads.map((load) => (
          <Grid item xs={12} sm={6} md={4} key={load.id}>
            <LoadCard load={load} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Loads;
