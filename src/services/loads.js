import api from './apiConfig';


// Get all loads

export const getLoads = async () => {
  try {
    const response = await api.get('/loads/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get one load by ID
export const getLoad = async (id) => {
  try {
    const response = await api.get(`/loads/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Create a new load (broker only)
export const createNewLoad = async (loadData) => {
  try {
    const response = await api.post('/loads/', loadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing load
export const updateLoad = async (id, loadData) => {
  try {
    const response = await api.put(`/loads/${id}/`, loadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a load
export const deleteLoad = async (id) => {
  try {
    const response = await api.delete(`/loads/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
  };
