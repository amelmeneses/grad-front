export interface Reservation {
    id?: number;
    user_id: number;
    court_id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
  }
  