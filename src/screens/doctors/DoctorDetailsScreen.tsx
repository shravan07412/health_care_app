"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { Card } from "../../components/common/Card"
import { CustomButton } from "../../components/common/CustomButton"
import { mockDoctors } from "../../constants/mockData"

export const DoctorDetailsScreen = ({ navigation, route }: any) => {
  // Default to first doctor for demo
  const doctor = mockDoctors[0]
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot")
      return
    }
    Alert.alert("Success", `Appointment booked with ${doctor.name} at ${selectedSlot}`)
    navigation.goBack()
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.doctorImagePlaceholder}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
        </View>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.rating}>{doctor.rating}</Text>
          <Text style={styles.reviews}>(245 reviews)</Text>
        </View>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          Dr. {doctor.name.split(" ")[1]} is a highly experienced specialist in {doctor.specialty} with over 15 years of
          practice. Known for compassionate patient care and innovative treatment approaches.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Qualifications</Text>
        <View style={styles.qualificationsList}>
          {["MBBS - Medical College", "MD Specialization", "Board Certified"].map((qual, idx) => (
            <View key={idx} style={styles.qualificationItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.qualificationText}>{qual}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.slotsContainer}>
          {doctor.available.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, selectedSlot === time && styles.timeSlotActive]}
              onPress={() => setSelectedSlot(time)}
            >
              <Ionicons name="time" size={16} color={selectedSlot === time ? "#FFF" : colors.primary} />
              <Text style={[styles.timeSlotText, selectedSlot === time && styles.timeSlotTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.contactText}>Medical Center, City Hospital</Text>
        </View>
        <View style={[styles.contactItem, { marginTop: spacing.md }]}>
          <Ionicons name="call" size={16} color={colors.primary} />
          <Text style={styles.contactText}>+1-555-0123</Text>
        </View>
        <View style={[styles.contactItem, { marginTop: spacing.md }]}>
          <Ionicons name="mail" size={16} color={colors.primary} />
          <Text style={styles.contactText}>dr.name@hospital.com</Text>
        </View>
      </Card>

      <CustomButton title="Book Appointment" onPress={handleBookAppointment} style={styles.bookButton} />
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
  headerCard: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
  },
  doctorImagePlaceholder: {
    marginBottom: spacing.md,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  specialty: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  reviews: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  qualificationsList: {
    gap: spacing.md,
  },
  qualificationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  qualificationText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  timeSlot: {
    flex: 1,
    minWidth: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    gap: spacing.xs,
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  timeSlotTextActive: {
    color: "#FFF",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    flex: 1,
  },
  bookButton: {
    marginVertical: spacing.lg,
  },
})
