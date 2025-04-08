import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // Update if you use a different port
});

export default api;
