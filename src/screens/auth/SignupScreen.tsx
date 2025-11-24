"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native"
import { colors, spacing } from "../../constants/colors"
import { CustomInput } from "../../components/common/CustomInput"
import { CustomButton } from "../../components/common/CustomButton"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../../../lib/firebase"

export const SignupScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }
    if (!agreedToTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions")
      return
    }

    setLoading(true)
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then(async (userCredential) => {
        // Set display name
        try {
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: fullName })
          }
        } catch (err) {
          // Non-fatal: continue even if displayName update fails
          console.warn("Failed to set display name:", err)
        }

  setLoading(false)
  Alert.alert("Success", "Account created! Welcome.")
  // Navigate to the MainTabs (default tab is Home) and reset the navigation stack
  navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] })
      })
      .catch((error) => {
        setLoading(false)
        // Map common firebase auth errors to friendly messages
        const code = error?.code || error?.message || ""
        if (code.includes("auth/email-already-in-use")) {
          Alert.alert("Error", "This email is already in use.")
        } else if (code.includes("auth/invalid-email")) {
          Alert.alert("Error", "Invalid email address.")
        } else if (code.includes("auth/weak-password")) {
          Alert.alert("Error", "Password is too weak (minimum length required).")
        } else {
          Alert.alert("Signup failed", String(error?.message || error))
        }
      })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join HealthCare Plus today</Text>
        </View>

        <View style={styles.form}>
          <CustomInput label="Full Name" placeholder="John Doe" value={fullName} onChangeText={setFullName} />
          <CustomInput label="Email" placeholder="your@email.com" value={email} onChangeText={setEmail} />
          <CustomInput
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setAgreedToTerms(!agreedToTerms)}>
              <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>I agree to Terms & Conditions</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="Create Account" onPress={handleSignup} loading={loading} style={styles.signupButton} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  termsContainer: {
    marginBottom: spacing.md,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  termsText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  signupButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})
