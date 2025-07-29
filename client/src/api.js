import axios from 'axios';

// If VITE_API_BASE_URL isn’t set (local dev), fall back to localhost:4000
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:4000/api';

const api = axios.create({ baseURL });
export default api;
