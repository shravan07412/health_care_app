export interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  available: string[]
}

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  symptoms: string
}

export interface Medicine {
  id: string
  name: string
  dosage: string
  schedule: string[]
  startDate: string
  endDate: string
  status: "taken" | "pending"
}
