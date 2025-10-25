import api from "./axios";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (name, fullname, email, password, role) =>
  api.post("/auth/register", { name, fullname, email, password, role });