"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { Card } from "../../components/common/Card"
import { StatusBadge } from "../../components/common/StatusBadge"
import { EmptyState } from "../../components/common/EmptyState"
import type { Medicine } from "../../types/index"
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase"

export const MedicinesScreen = ({ navigation }: any) => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      setLoading(false)
      return
    }

    // Real-time listener for medicines
    const q = query(collection(db, "users", user.uid, "medicines"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medicinesData: Medicine[] = []
      snapshot.forEach((doc) => {
        medicinesData.push({
          id: doc.id,
          name: doc.data().name,
          dosage: doc.data().dosage,
          schedule: [
            ...(doc.data().schedule.morning ? ["morning"] : []),
            ...(doc.data().schedule.afternoon ? ["afternoon"] : []),
            ...(doc.data().schedule.evening ? ["evening"] : []),
          ],
          startDate: doc.data().startDate,
          endDate: doc.data().endDate,
          status: "pending" as const,
        })
      })
      setMedicines(medicinesData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleMarkAsTaken = (medicineId: string) => {
    setMedicines((prev) => prev.map((med) => (med.id === medicineId ? { ...med, status: "taken" as const } : med)))
  }

  const handleDeleteMedicine = async (medicineId: string) => {
    try {
      const user = auth.currentUser
      if (!user) return

      await deleteDoc(doc(db, "users", user.uid, "medicines", medicineId))
    } catch (error) {
      console.error("Error deleting medicine:", error)
    }
  }

  const renderMedicineCard = ({ item }: { item: Medicine }) => (
    <Card>
      <View style={styles.medicineHeader}>
        <View>
          <Text style={styles.medicineName}>{item.name}</Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleLabel}>Schedule:</Text>
        <View style={styles.schedules}>
          {item.schedule.map((time, idx) => (
            <View key={idx} style={styles.scheduleTag}>
              <View style={styles.timeIcon}>
                <Ionicons
                  name={time === "morning" ? "sunny" : time === "afternoon" ? "cloud" : "moon"}
                  size={12}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.scheduleText}>{time.charAt(0).toUpperCase() + time.slice(1)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.dateRange}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start</Text>
          <Text style={styles.dateValue}>{item.startDate}</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End</Text>
          <Text style={styles.dateValue}>{item.endDate}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {item.status === "pending" && (
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMarkAsTaken(item.id)}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Mark as Taken</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddMedicine")}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteMedicine(item.id)}>
          <Ionicons name="trash" size={20} color={colors.error || "#EF4444"} />
          <Text style={[styles.actionText, { color: colors.error || "#EF4444" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      {medicines.length > 0 ? (
        <FlatList
          data={medicines}
          renderItem={renderMedicineCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <EmptyState title="No Medicines" description="You don't have any medicines added yet." />
      )}

      <View style={styles.floatingButton}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddMedicine")}>
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
  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dosage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scheduleContainer: {
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E0E6ED",
  },
  scheduleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  schedules: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  scheduleTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  timeIcon: {
    marginRight: spacing.xs,
  },
  scheduleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  dateRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6ED",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    gap: spacing.xs,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
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
