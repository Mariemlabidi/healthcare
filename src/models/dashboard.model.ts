export interface Doctor {
  id: string;
  name: string;
  appointmentsPerDay?: {
    date: string;
    count: number;
  }[];
}

export interface Patient {
  id: string;
  name: string;
  appointmentsPerMonth?: {
    month: string;
    count: number;
  }[];
}

export interface Stats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  appointmentsToday: number;
}