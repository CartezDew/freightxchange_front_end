import api from './apiConfig';

export const signUp = async (credentials) => {
  try {
    const resp = await api.post('/register/', credentials);
    localStorage.setItem('access', resp.data.access);
    localStorage.setItem('refresh', resp.data.refresh);
    localStorage.setItem("role", resp.data.role);
    localStorage.setItem("profileId", resp.data.profile_id);
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const resp = await api.post("/login/", credentials);
    const { access, refresh, role, profile_id } = resp.data;

    if (!role || !profile_id) {
      throw new Error("Login response missing role or profile_id");
    }

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("role", role);
    localStorage.setItem("profileId", profile_id);

    const profileRes = await api.get(`/${role}-profiles/${profile_id}/`);
    return profileRes.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signOut = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('role');
  localStorage.removeItem('profileId');
};

export const verifyUser = async () => {
  const role = localStorage.getItem("role");
  const profileId = localStorage.getItem("profileId");

  if (!role || !profileId) return false;

  try {
    const res = await api.get(`/${role}-profiles/${profileId}/`);
    return res.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};