import axios from "axios";

const baseURL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_SERVER_API ?? "http://localhost:5000/api/")
    : process.env.NEXT_PUBLIC_SERVER_API ?? "http://localhost:5000/api/";

/** Axios instance for backend API. Base URL from NEXT_PUBLIC_SERVER_API (e.g. http://localhost:5000/api/) */
export const api = axios.create({
  baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
