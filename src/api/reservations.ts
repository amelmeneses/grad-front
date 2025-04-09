import api from "./api";
import { Reservation } from "../interfaces/ Reservation";

export const getReservations = async () => (await api.get("/reservations")).data;
export const createReservation = async (reservation: Reservation) => (await api.post("/reservations", reservation)).data;
export const updateReservation = async (id: number, reservation: Reservation) => (await api.put(`/reservations/${id}`, reservation)).data;
export const deleteReservation = async (id: number) => (await api.delete(`/reservations/${id}`)).data;
export const getReservationsByUser = async (userId: number) => (await api.get(`/reservations/user/${userId}`)).data;
