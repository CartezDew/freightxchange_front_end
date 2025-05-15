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
    const { access, refresh, role, profile_id, user } = resp.data;

    if (!role || !profile_id || !user) {
      throw new Error("Login response missing user, role or profile_id");
    }

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("role", role);
    localStorage.setItem("profileId", profile_id);
    localStorage.setItem("username", user.username); // ✅ store username

    return {
      username: user.username,
      role,
      profile_id,
      user
    };
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
  const access = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const profileId = localStorage.getItem("profileId");
  const username = localStorage.getItem("username"); // ✅ retrieve username

  if (!access || !role || !profileId || !username) return false;

  try {
    const profileRes = await api.get(`/${role}-profiles/${profileId}/`);
    const profile = profileRes.data;

    return {
      username,
      role,
      profile_id: profileId,
      user: { username }
    };
  } catch (err) {
    console.error("verifyUser failed:", err);
    return false;
  }
};
