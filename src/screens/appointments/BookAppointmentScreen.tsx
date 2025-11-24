"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { CustomInput } from "../../components/common/CustomInput"
import { CustomButton } from "../../components/common/CustomButton"
import { Card } from "../../components/common/Card"
import { mockDoctors } from "../../constants/mockData"

const specialties = ["Cardiology", "Neurology", "Dermatology", "General Practice"]

export const BookAppointmentScreen = ({ navigation }: any) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirmAppointment = () => {
    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime || !symptoms) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      Alert.alert("Success", "Appointment confirmed!")
      navigation.goBack()
    }, 1500)
  }

  const selectedDoctorInfo = mockDoctors.find((d) => d.id === selectedDoctor)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Select Specialty</Text>
      <View style={styles.optionsContainer}>
        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[styles.optionButton, selectedSpecialty === specialty && styles.optionButtonActive]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={[styles.optionText, selectedSpecialty === specialty && styles.optionTextActive]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Doctor</Text>
      <View style={styles.doctorsContainer}>
        {mockDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={[styles.doctorOption, selectedDoctor === doctor.id && styles.doctorOptionActive]}
            onPress={() => setSelectedDoctor(doctor.id)}
          >
            <View style={styles.doctorIcon}>
              <Ionicons name="person-circle" size={40} color={colors.primary} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorRating}>Rating: {doctor.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Date & Time</Text>
      <CustomInput
        label=""
        placeholder="Select date (DD/MM/YYYY)"
        value={selectedDate}
        onChangeText={setSelectedDate}
      />

      {selectedDoctor && selectedDoctorInfo && (
        <View>
          <Text style={styles.sublabel}>Available Times</Text>
          <View style={styles.timesContainer}>
            {selectedDoctorInfo.available.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeButton, selectedTime === time && styles.timeButtonActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <CustomInput
        label="Symptoms / Reason for Visit"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
      />

      {selectedDoctorInfo && (
        <Card>
          <Text style={styles.previewTitle}>Appointment Preview</Text>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Doctor:</Text>
            <Text style={styles.previewValue}>{selectedDoctorInfo.name}</Text>
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Specialty:</Text>
            <Text style={styles.previewValue}>{selectedDoctorInfo.specialty}</Text>
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Date & Time:</Text>
            <Text style={styles.previewValue}>
              {selectedDate} • {selectedTime}
            </Text>
          </View>
        </Card>
      )}

      <CustomButton
        title="Confirm Appointment"
        onPress={handleConfirmAppointment}
        loading={loading}
        style={styles.confirmButton}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  optionTextActive: {
    color: "#FFF",
  },
  doctorsContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  doctorOption: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E6ED",
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  doctorOptionActive: {
    borderColor: colors.primary,
    backgroundColor: "#E0F2FE",
  },
  doctorIcon: {
    marginRight: spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  doctorRating: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  timeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  timeTextActive: {
    color: "#FFF",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  previewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  previewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  confirmButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
})
