export interface Appointment {
  _id?: string;
  patientName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'planifié' | 'confirmé' | 'annulé' | 'terminé';  // Adaptés aux valeurs du backend
  user?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentResponse {
  success: boolean;
  message?: string;
  data?: Appointment | Appointment[];
  count?: number;
}