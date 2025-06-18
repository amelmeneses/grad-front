// src/interfaces/Tariff.ts
export interface Tariff {
  id?: number;
  cancha_id: number;
  dia_semana?: string | null;
  default: boolean;
  hora_inicio: string;
  hora_fin: string;
  tarifa: number;
}
