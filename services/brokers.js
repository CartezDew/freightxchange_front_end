import api from './apiConfig';

// Get one broker profile by ID
export const getBrokerProfile = async (id) => {
  try {
    const response = await api.get(`/broker-profiles/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update broker profile
export const updateBrokerProfile = async (id, profileData) => {
  try {
    const response = await api.put(`/broker-profiles/${id}/`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
