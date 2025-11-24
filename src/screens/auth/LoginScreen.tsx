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
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../lib/firebase"

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    setLoading(true)
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        setLoading(false)
        Alert.alert("Success", "Logged in successfully!")
        // Navigation will automatically update when Firebase auth state changes
      })
      .catch((error) => {
        setLoading(false)
        const code = error?.code || error?.message || ""
        if (code.includes("auth/user-not-found")) {
          Alert.alert("Login failed", "No account found with this email.")
        } else if (code.includes("auth/wrong-password")) {
          Alert.alert("Login failed", "Incorrect password.")
        } else if (code.includes("auth/invalid-email")) {
          Alert.alert("Login failed", "Invalid email address.")
        } else if (code.includes("auth/too-many-requests")) {
          Alert.alert("Login failed", "Too many failed attempts. Try again later.")
        } else {
          Alert.alert("Login failed", String(error?.message || error))
        }
      })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>HealthCare Plus</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <CustomInput label="Email" placeholder="your@email.com" value={email} onChangeText={setEmail} />
          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.rememberMeContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="Login" onPress={handleLogin} loading={loading} style={styles.loginButton} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
    marginTop: spacing.lg,
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
  rememberMeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  rememberMeText: {
    color: colors.text,
    fontSize: 14,
  },
  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
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
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})
