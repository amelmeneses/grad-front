import axios from "axios";

const API_URL = "http://localhost:5001"; // Cambia la URL si es necesario

// Función para hacer login
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data; // Asegúrate de que la respuesta del backend tenga el token
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData: { nombre: string; apellido: string; email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userData);
  return response.data; // Asegúrate de que la respuesta del backend tenga el token
};
