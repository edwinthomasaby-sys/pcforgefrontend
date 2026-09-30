import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000
});

Api.interceptors.request.use((config) => {
  console.log("API:", config.method?.toUpperCase(), config.url);
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.friendlyMessage =
      error.response?.data?.message ||
      "Something went wrong while contacting the server.";
    return Promise.reject(error);
  }
);

export default Api;