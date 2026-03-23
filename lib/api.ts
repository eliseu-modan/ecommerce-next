// lib/api.ts
import axios from "axios";

// Cria uma instância configurada do Axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); // ou pegar do AuthContext
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Usuário não autenticado ou token expirado.");
      // Aqui você pode redirecionar para o login, por exemplo
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
