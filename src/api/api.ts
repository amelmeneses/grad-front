import axios from "axios";

const api = axios.create({
  baseURL: "", // Update if you use a different port
});

export default api;
