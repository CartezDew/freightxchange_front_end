import api from "./apiConfig.js";

export const getLoads = async () => {
  try {
    const response = await api.get("/loads/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLoad = async (id) => {
  try {
    const response = await api.get(`/loads/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewLoad = async (loadData) => {
  try {
    const response = await api.post("/loads/", loadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLoad = async (id, loadData) => {
  try {
    const response = await api.put(`/loads/${id}/`, loadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLoad = async (id) => {
  try {
    const response = await api.delete(`/loads/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
