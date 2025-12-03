import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5005/api", timeout: 8000 });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

API.interceptors.response.use((res) => res, (err) => {
  if (err.response && err.response.status === 401) {
    localStorage.removeItem("token");
  }
  return Promise.reject(err);
});

export const signupUser = (body) => API.post("/signup", body).then(r => r.data);
export const loginUser = (body) => API.post("/login", body).then(r => r.data);
export const resetPassword = (body) => API.post("/reset-password", body).then(r => r.data);
export const getDashboardData = () => API.get("/dashboard").then(r => r.data);
export const getSystemStats = () => API.get("/system-stats").then(r => r.data);
export const getInventory = () => API.get("/inventory").then(r => r.data);
export const getOptimizationTips = () => API.get("/optimization-tips").then(r => r.data);
export const getPrediction = (body) => API.post("/predict", body).then(r => r.data);
export const startBenchmark = (body) => API.post("/benchmark/start", body).then(r => r.data);
export const getBenchmarkResults = () => API.get("/benchmark/results").then(r => r.data);
