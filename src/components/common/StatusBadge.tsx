import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors, spacing } from "../../constants/colors"

interface StatusBadgeProps {
  status: "upcoming" | "completed" | "cancelled" | "taken" | "pending"
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
      case "pending":
        return { bg: "#E0F2FE", text: colors.primary }
      case "completed":
      case "taken":
        return { bg: "#ECFDF5", text: colors.success }
      case "cancelled":
        return { bg: "#FEE2E2", text: colors.error }
      default:
        return { bg: colors.background, text: colors.text }
    }
  }

  const { bg, text } = getStatusColor()

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
})
