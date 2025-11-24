"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { Card } from "../../components/common/Card"
import { StatusBadge } from "../../components/common/StatusBadge"
import { CustomButton } from "../../components/common/CustomButton"
import { EmptyState } from "../../components/common/EmptyState"
import { mockAppointments } from "../../constants/mockData"
import type { Appointment } from "../../types/index"

export const AppointmentsScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert("Cancel Appointment", "Are you sure you want to cancel this appointment?", [
      { text: "No", onPress: () => {}, style: "cancel" },
      {
        text: "Yes, Cancel",
        onPress: () => {
          setAppointments((prev) =>
            prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt)),
          )
          Alert.alert("Success", "Appointment cancelled")
        },
        style: "destructive",
      },
    ])
  }

  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <Card>
      <View style={styles.appointmentHeader}>
        <View>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="medical-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.symptoms}</Text>
        </View>
      </View>

      {item.status === "upcoming" && (
        <View style={styles.actions}>
          <CustomButton
            title="Cancel"
            variant="secondary"
            onPress={() => handleCancelAppointment(item.id)}
            style={styles.cancelButton}
          />
        </View>
      )}
    </Card>
  )

  return (
    <View style={styles.container}>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <EmptyState title="No Appointments" description="You don't have any appointments scheduled yet." />
      )}

      <View style={styles.floatingButton}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("BookAppointment")}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E0E6ED",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  actions: {
    marginTop: spacing.md,
  },
  cancelButton: {
    width: "100%",
  },
  floatingButton: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
})
