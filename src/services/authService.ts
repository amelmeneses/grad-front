// src/services/authService.ts
import axios from 'axios';

export const loginUsuario = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/login', { email, password });
    return response.data.token;
  } catch (error) {
    throw new Error('Correo o contraseña incorrectos');
  }
};
