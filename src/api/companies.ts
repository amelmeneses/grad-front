import api from "./api";
import { Company } from "../interfaces/Company";

export const getCompanies = async () => (await api.get("/companies")).data;
export const createCompany = async (company: Company) => (await api.post("/companies", company)).data;
export const updateCompany = async (id: number, company: Company) => (await api.put(`/companies/${id}`, company)).data;
export const deleteCompany = async (id: number) => (await api.delete(`/companies/${id}`)).data;

