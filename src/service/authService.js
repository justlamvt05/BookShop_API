import axios from "axios";

export const login = async (username, password) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/login",
    { username, password }
  );
  return response.data; // ApiResponse
};
export const register = async (payload) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/register",
    payload
  );
  return response.data; // ApiResponse
};


export const logout = () => {
  localStorage.removeItem("token");
};
