import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3000",
  headers: {
    "content-type": "application/json",
    accept: "application/json",
    // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

const userapi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  // headers: {
  //   "content-type": "application/json",
  //   accept: "application/json",
  //   // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  // },
});

// userapi.interceptors.response.use(
//   (response) => {
//       return response;
//   },
//   (err) => {
//       if (err.response.status === 401) {
//           //redirect to login

//       }

//       return Promise.reject(err);
//   }
// );

userapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // config.headers.common["authorization"] = "Bearer " + token;
  }
  return config;
});

export const userApi = userapi;
export const apis = api;
