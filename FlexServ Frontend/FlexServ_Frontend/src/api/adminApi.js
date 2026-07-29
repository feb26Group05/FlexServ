import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8082/api",
  withCredentials: true,
});

export default adminApi;
