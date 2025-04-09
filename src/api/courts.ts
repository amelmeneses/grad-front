import api from "./api";
import { Court } from "../interfaces/Court";

export const getCourts = async () => (await api.get("/courts")).data;
export const createCourt = async (court: Court) => (await api.post("/courts", court)).data;
export const updateCourt = async (id: number, court: Court) => (await api.put(`/courts/${id}`, court)).data;
export const deleteCourt = async (id: number) => (await api.delete(`/courts/${id}`)).data;
export const getCourtsByCompany = async (companyId: number) => (await api.get(`/courts/company/${companyId}`)).data;
