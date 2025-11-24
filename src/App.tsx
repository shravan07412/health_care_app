"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "./constants/colors"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebase"

// Screens - Auth
import { LoginScreen } from "./screens/auth/LoginScreen"
import { SignupScreen } from "./screens/auth/SignupScreen"

// Screens - Main
import { HomeScreen } from "./screens/home/HomeScreen"
import { AppointmentsScreen } from "./screens/appointments/AppointmentsScreen"
import { MedicinesScreen } from "./screens/medicines/MedicinesScreen"
import { ProfileScreen } from "./screens/profile/ProfileScreen"

// Screens - Modals
import { BookAppointmentScreen } from "./screens/appointments/BookAppointmentScreen"
import { AddMedicineScreen } from "./screens/medicines/AddMedicineScreen"
import { DoctorDetailsScreen } from "./screens/doctors/DoctorDetailsScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: "#FFF",
      headerTitleStyle: {
        fontWeight: "600",
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: "#E0E6ED",
      },
      tabBarIcon: ({ color, size }) => {
        let iconName: any
        if (route.name === "Home") {
          iconName = "home"
        } else if (route.name === "Appointments") {
          iconName = "calendar"
        } else if (route.name === "Medicines") {
          iconName = "medical"
        } else if (route.name === "Profile") {
          iconName = "person"
        }
        return <Ionicons name={iconName} size={size} color={color} />
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
    <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: "Appointments" }} />
    <Tab.Screen name="Medicines" component={MedicinesScreen} options={{ title: "My Medicines" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
  </Tab.Navigator>
)

const RootNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    {isLoggedIn ? (
      <>
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="BookAppointment"
            component={BookAppointmentScreen}
            options={{ title: "Book Appointment" }}
          />
          <Stack.Screen name="AddMedicine" component={AddMedicineScreen} options={{ title: "Add Medicine" }} />
          <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} options={{ title: "Doctor Details" }} />
        </Stack.Group>
      </>
    ) : (
      <Stack.Screen name="Auth" component={AuthStack} />
    )}
  </Stack.Navigator>
)

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  if (isLoading) {
    return null // Or a splash screen
  }

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  )
}
