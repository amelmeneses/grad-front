// src/interfaces/OpenHour.ts

export interface OpenHour {
  id?: number;
  cancha_id: number;
  dia_semana: string | null;
  hora_apertura: string;
  hora_cierre: string;
}
