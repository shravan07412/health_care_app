"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing } from "../../constants/colors"
import { Card } from "../../components/common/Card"
import { CustomButton } from "../../components/common/CustomButton"

import { signOut, updateProfile } from "firebase/auth"
import { auth, db } from "../../../lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { CustomInput } from "../../components/common/CustomInput"

export const ProfileScreen = ({ navigation }: any) => {
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Editable fields (for edit mode)
  const [editName, setEditName] = useState("")
  const [editBloodType, setEditBloodType] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editHeight, setEditHeight] = useState("")
  const [editWeight, setEditWeight] = useState("")
  const [editEmergencyName, setEditEmergencyName] = useState("")
  const [editEmergencyRelation, setEditEmergencyRelation] = useState("")
  const [editEmergencyPhone, setEditEmergencyPhone] = useState("")

  // Health info
  const [bloodType, setBloodType] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyRelation, setEmergencyRelation] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      // nothing to load
      return
    }

    const userDoc = doc(db, "users", user.uid)
    const unsubscribe = onSnapshot(userDoc, (snap) => {
      if (snap.exists()) {
        const data: any = snap.data()
        setName(data.displayName || user.displayName || user.email?.split("@")[0] || "")
        setEmail(data.email || user.email || "")

        setBloodType(data.bloodType || "")
        setAge(data.age ? `${data.age} years` : "")
        setHeight(data.height || "")
        setWeight(data.weight ? `${data.weight} kg` : "")

        if (data.emergencyContact) {
          setEmergencyName(data.emergencyContact.name || "")
          setEmergencyRelation(data.emergencyContact.relation || "")
          setEmergencyPhone(data.emergencyContact.phone || "")
        }
      } else {
        // fallback to auth profile
        setName(user.displayName || user.email?.split("@")[0] || "")
        setEmail(user.email || "")
      }
    }, (err) => {
      console.error("Profile snapshot error:", err)
    })

    return () => unsubscribe()
  }, [])

  // populate edit fields when entering edit mode
  useEffect(() => {
    if (editMode) {
      setEditName(name)
      setEditBloodType(bloodType)
      // strip formatting like "28 years" -> "28"
      setEditAge(age ? String(age).replace(/[^0-9]/g, "") : "")
      setEditHeight(height || "")
      setEditWeight(weight ? String(weight).replace(/[^0-9.]/g, "") : "")
      setEditEmergencyName(emergencyName)
      setEditEmergencyRelation(emergencyRelation)
      setEditEmergencyPhone(emergencyPhone)
    }
  }, [editMode])

  const handleSaveProfile = async () => {
    const user = auth.currentUser
    if (!user) {
      Alert.alert("Error", "User not authenticated")
      return
    }

    setLoading(true)
    try {
      const userRef = doc(db, "users", user.uid)

      const updates: any = {}
      if (editName) updates.displayName = editName
      if (editBloodType) updates.bloodType = editBloodType
      if (editHeight) updates.height = editHeight
      const ageNum = parseInt(editAge)
      if (!Number.isNaN(ageNum)) updates.age = ageNum
      const weightNum = parseFloat(editWeight)
      if (!Number.isNaN(weightNum)) updates.weight = weightNum

      updates.emergencyContact = {
        name: editEmergencyName || null,
        relation: editEmergencyRelation || null,
        phone: editEmergencyPhone || null,
      }

      await setDoc(userRef, updates, { merge: true })

      // Update auth profile displayName
      if (editName && user.displayName !== editName) {
        await updateProfile(user, { displayName: editName })
      }

      // update local state
      setName(editName)
      setBloodType(editBloodType)
      setAge(editAge ? `${editAge} years` : "")
      setHeight(editHeight)
      setWeight(editWeight ? `${editWeight} kg` : "")
      setEmergencyName(editEmergencyName)
      setEmergencyRelation(editEmergencyRelation)
      setEmergencyPhone(editEmergencyPhone)

      setEditMode(false)
      setLoading(false)
      Alert.alert("Success", "Profile updated")
    } catch (err) {
      setLoading(false)
      console.error("Failed to save profile:", err)
      Alert.alert("Error", `Failed to save profile: ${err}`)
    }
  }

  const handleCancelEdit = () => {
    setEditMode(false)
  }

  const handleLogout = async () => {
    try {
      // For web, Alert.alert callbacks sometimes don't run; use window.confirm
      let confirmed = true
      if (Platform.OS === "web") {
        confirmed = window.confirm("Are you sure you want to logout?")
      } else {
        // On native, show the Alert and wait via callback
        confirmed = await new Promise((resolve) => {
          Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
              { text: "Logout", onPress: () => resolve(true), style: "destructive" },
            ],
            { cancelable: true }
          )
        })
      }

      if (!confirmed) return

      setLoading(true)
      console.log("Logging out...")
      await signOut(auth)
      setLoading(false)
      Alert.alert("Logged out", "You have been logged out successfully")
      // Navigation will update automatically via the auth state listener in App.tsx.
      // Avoid sending a RESET to a navigator that may not currently include the `Auth` route
      // (this caused the development-only warning). The root listener will switch stacks.
    } catch (error) {
      setLoading(false)
     
      console.error("Logout error:", error)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color={colors.primary} />
        </View>
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.headerName}>{name || "Your name"}</Text>
        <Text style={styles.headerEmail}>{email || "your.email@example.com"}</Text>
      </View>

      <Card>
        <View style={styles.infoSection}>
          {editMode ? (
            <>
              <CustomInput label="Name" value={editName} onChangeText={setEditName} />
              <CustomInput label="Email" value={email} onChangeText={() => {}} />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{name || "-"}</Text>
              </View>
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{email || "-"}</Text>
              </View>
            </>
          )}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Health Information</Text>
        <View style={styles.healthInfo}>
          {editMode ? (
            <>
              <CustomInput label="Blood Type" value={editBloodType} onChangeText={setEditBloodType} />
              <CustomInput label="Age" placeholder="Years" value={editAge} onChangeText={setEditAge} />
              <CustomInput label="Height" value={editHeight} onChangeText={setEditHeight} />
              <CustomInput label="Weight (kg)" placeholder="kg" value={editWeight} onChangeText={setEditWeight} />
            </>
          ) : (
            <>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Blood Type</Text>
                <Text style={styles.healthValue}>{bloodType || "-"}</Text>
              </View>
              <View style={[styles.healthItem, styles.healthItemBorder]}>
                <Text style={styles.healthLabel}>Age</Text>
                <Text style={styles.healthValue}>{age || "-"}</Text>
              </View>
              <View style={[styles.healthItem, styles.healthItemBorder]}>
                <Text style={styles.healthLabel}>Height</Text>
                <Text style={styles.healthValue}>{height || "-"}</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Weight</Text>
                <Text style={styles.healthValue}>{weight || "-"}</Text>
              </View>
            </>
          )}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Emergency Contact</Text>
        <View style={styles.emergencyInfo}>
          {editMode ? (
            <>
              <CustomInput label="Contact Name" value={editEmergencyName} onChangeText={setEditEmergencyName} />
              <CustomInput label="Relation" value={editEmergencyRelation} onChangeText={setEditEmergencyRelation} />
              <CustomInput label="Phone" value={editEmergencyPhone} onChangeText={setEditEmergencyPhone} />
            </>
          ) : (
            <>
              <View style={styles.emergencyRow}>
                <Text style={styles.emergencyLabel}>Name</Text>
                <Text style={styles.emergencyValue}>{emergencyName || "-"}</Text>
              </View>
              <View style={[styles.emergencyRow, styles.emergencyRowBorder]}>
                <Text style={styles.emergencyLabel}>Relation</Text>
                <Text style={styles.emergencyValue}>{emergencyRelation || "-"}</Text>
              </View>
              <View style={styles.emergencyRow}>
                <Text style={styles.emergencyLabel}>Phone</Text>
                <Text style={styles.emergencyValue}>{emergencyPhone || "-"}</Text>
              </View>
            </>
          )}
        </View>
      </Card>

      <View style={styles.actions}>
        {editMode ? (
          <>
            <CustomButton title="Save" onPress={handleSaveProfile} loading={loading} style={styles.editButton} />
            <CustomButton title="Cancel" variant="secondary" onPress={handleCancelEdit} style={styles.logoutButton} />
          </>
        ) : (
          <>
            <CustomButton title="Edit Profile" onPress={() => setEditMode(true)} style={styles.editButton} />
            <CustomButton title="Logout" variant="secondary" onPress={handleLogout} loading={loading} style={styles.logoutButton} />
          </>
        )}
      </View>
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6ED",
    paddingBottom: spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  healthInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  healthItem: {
    flex: 1,
    minWidth: "45%",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E6ED",
  },
  healthItemBorder: {
    borderColor: "#E0E6ED",
  },
  healthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  emergencyInfo: {
    gap: spacing.md,
  },
  emergencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  emergencyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6ED",
    paddingBottom: spacing.md,
  },
  emergencyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  emergencyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  editButton: {
    marginTop: spacing.md,
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
})
