import api from "./axios";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (name, email, password, role) =>
  api.post("/auth/register", { name, email, password, role });