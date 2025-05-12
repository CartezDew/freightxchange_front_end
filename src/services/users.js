import api from "./apiConfig";

export const signUp = async (credentials) => {
  try {
    const resp = await api.post("/register/", credentials);
    localStorage.setItem("token", resp.data.access);
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const resp = await api.post("/login/", credentials);

    const { access, user, role, profile_id } = resp.data;

    localStorage.setItem("token", access);
    localStorage.setItem("role", role); // "broker" or "carrier"
    localStorage.setItem("profileId", profile_id); // profile ID from backend

    return user;
  } catch (error) {
    throw error;
  }
};



export const signOut = async () => {
  try {
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const profileId = localStorage.getItem("profileId");

  if (token && role && profileId) {
    try {
      const resp = await api.get(`/${role}-profiles/${profileId}/`);
      return resp.data;
    } catch (error) {
      return false;
    }
  }
  return false;
};

