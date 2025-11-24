import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { colors, spacing, borderRadius } from "../../constants/colors"

interface CustomButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "text"
  disabled?: boolean
  loading?: boolean
  style?: any
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : variant === "secondary" ? styles.secondaryButton : styles.textButton

  const textStyle =
    variant === "primary" ? styles.primaryText : variant === "secondary" ? styles.secondaryText : styles.textButtonText

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyle, style, disabled && styles.disabled]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFF" : colors.primary} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
  },
  textButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  textButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
})
