import { useState, useEffect } from 'react';
import LoadCard from '../components/LoadCard.jsx';
import { getLoads } from '../services/loads';

import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
} from '@mui/material';

import Nav from '../components/Nav.jsx';
import '../components/LoadList.css';

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchLoads = async () => {
      const loadsData = await getLoads();
      setLoads(loadsData);
    };
    fetchLoads();
  }, []);

  const filteredLoads = loads.filter((load) => {
    const query = searchText.toLowerCase();
    return (
      load.company_name?.toLowerCase().includes(query) ||
      load.pickup_city?.toLowerCase().includes(query) ||
      load.pickup_state?.toLowerCase().includes(query) ||
      load.delivery_city?.toLowerCase().includes(query) ||
      load.delivery_state?.toLowerCase().includes(query) ||
      load.equipment_requirements?.toLowerCase().includes(query) ||
      load.rate?.toString().includes(query)
    );
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align='center'>
        Available Loads
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search Loads (e.g. Atlanta, Dry Van, UberFreight)"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredLoads.length > 0 ? (
          filteredLoads.map((load) => (
            <Grid item xs={12} sm={6} md={4} key={load.id}>
              <LoadCard load={load} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ ml: 2 }}>
            No loads found matching your search.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Loads;