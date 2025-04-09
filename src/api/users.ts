// src/api/users.ts
import api from "./api";
import { User } from "../interfaces/User";

export const getUsers = async () => (await api.get("/users")).data;
export const createUser = async (user: User) => (await api.post("/users", user)).data;
export const updateUser = async (id: number, user: User) => (await api.put(`/users/${id}`, user)).data;
export const deleteUser = async (id: number) => (await api.delete(`/users/${id}`)).data;
