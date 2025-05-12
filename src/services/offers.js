import api from './apiConfig';

// Get all offers
export const getOffers = async () => {
  try {
    const response = await api.get('/offers/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get one offer by ID
export const getOffer = async (id) => {
  try {
    const response = await api.get(`/offers/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new offer
export const createOffer = async (offerData) => {
  try {
    const response = await api.post('/offers/', offerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an offer
export const updateOffer = async (id, offerData) => {
  try {
    const response = await api.put(`/offers/${id}/`, offerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an offer
export const deleteOffer = async (id) => {
  try {
    const response = await api.delete(`/offers/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
