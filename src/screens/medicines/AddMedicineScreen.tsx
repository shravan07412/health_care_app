"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { colors, spacing } from "../../constants/colors"
import { CustomInput } from "../../components/common/CustomInput"
import { CustomButton } from "../../components/common/CustomButton"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase"

export const AddMedicineScreen = ({ navigation }: any) => {
  const [medicineName, setMedicineName] = useState("")
  const [dosage, setDosage] = useState("")
  const [morning, setMorning] = useState(false)
  const [afternoon, setAfternoon] = useState(false)
  const [evening, setEvening] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSaveMedicine = async () => {
    if (!medicineName || !dosage || !startDate || !endDate) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    if (!morning && !afternoon && !evening) {
      Alert.alert("Error", "Please select at least one schedule time")
      return
    }

    setLoading(true)
    try {
      const user = auth.currentUser
      if (!user) {
        Alert.alert("Error", "User not authenticated")
        setLoading(false)
        return
      }

      // Add medicine to Firestore
      await addDoc(collection(db, "users", user.uid, "medicines"), {
        name: medicineName,
        dosage: dosage,
        schedule: {
          morning,
          afternoon,
          evening,
        },
        startDate: startDate,
        endDate: endDate,
        createdAt: serverTimestamp(),
      })

      setLoading(false)
      Alert.alert("Success", "Medicine added successfully!")
      navigation.goBack()
    } catch (error) {
      setLoading(false)
      Alert.alert("Error", `Failed to add medicine: ${error}`)
      console.error("Error adding medicine:", error)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomInput
        label="Medicine Name"
        placeholder="e.g., Aspirin, Lisinopril"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <CustomInput label="Dosage" placeholder="e.g., 1 tablet, 500mg" value={dosage} onChangeText={setDosage} />

      <Text style={styles.label}>Schedule</Text>
      <View style={styles.scheduleOptions}>
        {[
          { label: "Morning", value: morning, setter: setMorning },
          { label: "Afternoon", value: afternoon, setter: setAfternoon },
          { label: "Evening", value: evening, setter: setEvening },
        ].map((option) => (
          <TouchableOpacity
            key={option.label}
            style={styles.scheduleCheckbox}
            onPress={() => option.setter(!option.value)}
          >
            <View style={[styles.checkboxBox, option.value && styles.checkboxChecked]}>
              {option.value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomInput label="Start Date" placeholder="DD/MM/YYYY" value={startDate} onChangeText={setStartDate} />

      <CustomInput label="End Date" placeholder="DD/MM/YYYY" value={endDate} onChangeText={setEndDate} />

      <View style={styles.buttonContainer}>
        <CustomButton title="Save Medicine" onPress={handleSaveMedicine} loading={loading} style={styles.saveButton} />
        <CustomButton
          title="Cancel"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        />
      </View>
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
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  scheduleOptions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  scheduleCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
})
