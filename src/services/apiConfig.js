import axios from 'axios';

const getAccessToken = () => localStorage.getItem('access');
const getRefreshToken = () => localStorage.getItem('refresh');

// Axios instance
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-deployed-app.herokuapp.com'
      : 'http://localhost:8000',
});



export const updateOffer = async (id, offerData) => {
  const res = await api.put(`/offers/${id}/`, offerData);
  return res.data;
};

export const deleteOffer = async (id) => {
  await api.delete(`/offers/${id}/`);
};
// Request Interceptor: Add Authorization Header
api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token on 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     // Prevent infinite loop
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       const refreshToken = getRefreshToken();
//       if (refreshToken) {
//         try {
//           const res = await axios.post('/api/token/refresh/', {
//             refresh: refreshToken,
//           });
//
//           const newAccessToken = res.data.access;
//           localStorage.setItem('access', newAccessToken);
//
//           // Update header and retry original request
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           // Clear tokens if refresh also fails
//           localStorage.removeItem('access');
//           localStorage.removeItem('refresh');
//           window.location.href = '/sign-in'; // Redirect to login
//           return Promise.reject(refreshError);
//         }
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );

export default api;
