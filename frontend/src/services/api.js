import axios from 'axios';
import Constants from 'expo-constants';

const defaultApiUrl = Constants?.expoConfig?.extra?.apiUrl || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: defaultApiUrl,
});

api.interceptors.request.use(async (config) => {
  try {
    // Lazy import to avoid cyclic dependency in metro
    const { getToken } = await import('../storage/auth-storage.js');
    const token = await getToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default api;
