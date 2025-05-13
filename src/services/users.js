import api from './apiConfig';

export const signUp = async (credentials) => {
  try {
    const resp = await api.post('/register/', credentials);
    localStorage.setItem('access', resp.data.access);
    localStorage.setItem('refresh', resp.data.refresh);
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    // Clear any old data first
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("profileId");

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
};

export const verifyUser = async () => {
  const access = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const profileId = localStorage.getItem("profileId");

  console.log("[verifyUser] localStorage:", { access, role, profileId });

  if (!access || !role || !profileId) return false;

  try {
    await api.post('/api/token/verify/', { token: access });
    const res = await api.get(`/${role}-profiles/${profileId}/`);
    console.log("[verifyUser] profile fetched:", res.data);
    return res.data;
  } catch (err) {
    const refresh = localStorage.getItem("refresh");
    console.warn("[verifyUser] token expired, attempting refresh");

    if (refresh) {
      try {
        const resp = await api.post('/api/token/refresh/', { refresh });
        localStorage.setItem("access", resp.data.access);

        const profileRes = await api.get(`/${role}-profiles/${profileId}/`);
        console.log("[verifyUser] profile after refresh:", profileRes.data);
        return profileRes.data;
      } catch (refreshError) {
        // signOut(); // TODO fix this signout logic
        return false;
      }
    } else {
      console.warn("[verifyUser] no refresh token");
      signOut();
      return false;
    }
  }
};


