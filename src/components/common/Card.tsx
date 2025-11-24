import type React from "react"
import { View, StyleSheet } from "react-native"
import { colors, spacing, borderRadius } from "../../constants/colors"

interface CardProps {
  children: React.ReactNode
  style?: any
}

export const Card: React.FC<CardProps> = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})
