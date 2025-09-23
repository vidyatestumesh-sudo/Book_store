// src/api/axiosClient.js
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: baseUrl,
});

export default axiosClient;
