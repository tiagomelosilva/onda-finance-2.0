import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/mock-api",
  timeout: 1500,
});
