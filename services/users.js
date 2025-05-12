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
    const resp = await api.post('/login/', credentials);
    localStorage.setItem('access', resp.data.access);
    localStorage.setItem('refresh', resp.data.refresh);
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const verifyUser = async () => {
  const access = localStorage.getItem('access');
  if (!access) return false;

  try {
    // Verify token is still valid
    await api.post('/api/token/verify/', { token: access });
    return true;
  } catch (err) {
    // If access token expired, try refreshing it
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      try {
        const resp = await api.post('/api/token/refresh/', { refresh });
        localStorage.setItem('access', resp.data.access);
        return true;
      } catch (refreshError) {
        signOut();
        return false;
      }
    } else {
      signOut();
      return false;
    }
  }
};
