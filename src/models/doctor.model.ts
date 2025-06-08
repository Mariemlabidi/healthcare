export interface Doctor {
    id?: number;
    name: string;
    title: string;
    image: string;
    address: string;
    appointmentsPerDay?: { date: string; count: number }[];
  }
  