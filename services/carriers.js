import api from './apiConfig';

// Get one carrier profile by ID
export const getCarrierProfile = async (id) => {
  try {
    const response = await api.get(`/carrier-profiles/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update carrier profile
export const updateCarrierProfile = async (id, profileData) => {
  try {
    const response = await api.put(`/carrier-profiles/${id}/`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
