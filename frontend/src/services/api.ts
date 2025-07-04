import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";;

const api = axios.create({
  baseURL: baseUrl, 
  withCredentials: true,              
});

export default api;
