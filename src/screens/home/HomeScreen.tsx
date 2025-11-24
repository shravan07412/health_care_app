"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { Card } from "../../components/common/Card"
import { StatusBadge } from "../../components/common/StatusBadge"
import { mockAppointments, mockMedicines } from "../../constants/mockData"
import { auth } from "../../../lib/firebase"
import { format } from "date-fns"

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false)
  const [userName, setUserName] = useState("User")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Get current user name
    const user = auth.currentUser
    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User")
    }

    // Set current date
    setCurrentDate(format(new Date(), "EEEE, MMMM d"))
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const nextAppointment = mockAppointments[0]
  const todaysMedicines = mockMedicines.slice(0, 2)

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      <View style={styles.quickActionContainer}>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate("BookAppointment")}>
          <View style={[styles.iconBg, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Book Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate("AddMedicine")}>
          <View style={[styles.iconBg, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="medical" size={24} color={colors.success} />
          </View>
          <Text style={styles.quickActionText}>Add Medicine</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {nextAppointment ? (
          <Card>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>{nextAppointment.doctorName}</Text>
                <Text style={styles.specialty}>{nextAppointment.specialty}</Text>
                <View style={styles.dateTimeContainer}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.dateTime}>
                    {" "}
                    {nextAppointment.date} • {nextAppointment.time}
                  </Text>
                </View>
              </View>
              <StatusBadge status={nextAppointment.status} />
            </View>
          </Card>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Medicines")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {todaysMedicines.length > 0
          ? todaysMedicines.map((medicine) => (
              <Card key={medicine.id}>
                <View style={styles.medicineRow}>
                  <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                    <View style={styles.scheduleContainer}>
                      {medicine.schedule.map((time, idx) => (
                        <View key={idx} style={styles.scheduleTag}>
                          <Text style={styles.scheduleText}>{time.charAt(0).toUpperCase() + time.slice(1)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <StatusBadge status={medicine.status} />
                </View>
              </Card>
            ))
          : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickActionContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appointmentInfo: {
    flex: 1,
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
    marginBottom: spacing.xs,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  medicineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  medicineDosage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  scheduleContainer: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  scheduleTag: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scheduleText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },
})
