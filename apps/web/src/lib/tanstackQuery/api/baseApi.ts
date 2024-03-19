import axios from "axios";
const apiUrl =
  process.env.NODE_ENV === "production"
    ? `http://localhost:5000/api/v1`
    : `http://localhost:5000/api/v1`;

const baseApi = axios.create({
  baseURL: apiUrl,
});

export default baseApi;
