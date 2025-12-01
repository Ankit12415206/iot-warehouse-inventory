import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api",
  timeout: 7000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

export const loginUser = (body) => API.post("/login", body).then(r => r.data);
export const signupUser = (body) => API.post("/signup", body).then(r => r.data);
export const getDashboardData = () => API.get("/dashboard").then(r => r.data);
export const getSystemStats = () => API.get("/system-stats").then(r => r.data);
export const getOptimizationTips = () => API.get("/optimization-tips").then(r => r.data);
export const getInventory = () => API.get("/inventory").then(r => r.data);
export const getPrediction = (body) => API.post("/predict", body).then(r => r.data);
