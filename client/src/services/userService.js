
import api from "./api.js";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateProfile = async (userData) => {
  const res = await api.put("/users/profile", userData);
  return res.data;
};

export const changePassword = async (passwordData) => {
  const res = await api.put("/users/change-password", passwordData);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/users/account");
  return res.data;
};
