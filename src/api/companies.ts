import api from "./api";
import axios from "axios";
import { Company } from "../interfaces/Company";

export const getCompanies = async () => (await api.get("/companies")).data;
export const updateCompany = async (id: number, company: Company) => (await api.put(`/companies/${id}`, company)).data;
export const deleteCompany = async (id: number) => (await api.delete(`/companies/${id}`)).data;
export const createCompany = async (company: Company) => {
  const token = localStorage.getItem('token');
  const res = await axios.post('/api/empresas', company, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
