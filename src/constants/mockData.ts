import type { Doctor, Appointment, Medicine } from "../types/index"

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://via.placeholder.com/80?text=Dr+Sarah",
    rating: 4.8,
    available: ["10:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image: "https://via.placeholder.com/80?text=Dr+Michael",
    rating: 4.9,
    available: ["11:00 AM", "3:00 PM", "5:00 PM"],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    image: "https://via.placeholder.com/80?text=Dr+Emily",
    rating: 4.7,
    available: ["9:00 AM", "1:00 PM", "3:00 PM"],
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "upcoming",
    symptoms: "Chest pain",
  },
  {
    id: "2",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Neurology",
    date: "2024-01-10",
    time: "2:00 PM",
    status: "completed",
    symptoms: "Headaches",
  },
]

export const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "1 tablet",
    schedule: ["morning", "evening"],
    startDate: "2024-01-01",
    endDate: "2024-02-01",
    status: "taken",
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "1 tablet",
    schedule: ["morning"],
    startDate: "2023-12-01",
    endDate: "2025-12-01",
    status: "pending",
  },
]
