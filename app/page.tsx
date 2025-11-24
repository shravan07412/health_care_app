"use client"

import type React from "react"

export default function Page() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>React Native Healthcare App</h1>
        <p style={styles.subtitle}>Powered by Expo</p>

        <div style={styles.content}>
          <h2 style={styles.heading}>Setup Instructions</h2>

          <p style={styles.text}>
            This is a React Native app built with Expo. It's designed to run on mobile devices, not in a web browser.
          </p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>To run this app:</h3>
            <ol style={styles.list}>
              <li style={styles.listItem}>Install Node.js and npm</li>
              <li style={styles.listItem}>
                Install Expo CLI: <code style={styles.code}>npm install -g expo-cli</code>
              </li>
              <li style={styles.listItem}>Download the ZIP file or clone the repository</li>
              <li style={styles.listItem}>Navigate to the project folder</li>
              <li style={styles.listItem}>
                Run: <code style={styles.code}>expo start</code>
              </li>
              <li style={styles.listItem}>
                Scan the QR code with Expo Go app or press 'i' for iOS simulator or 'a' for Android emulator
              </li>
            </ol>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>App Features:</h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>✓ Authentication (Login/Signup)</li>
              <li style={styles.featureItem}>✓ Home Dashboard</li>
              <li style={styles.featureItem}>✓ Appointment Management</li>
              <li style={styles.featureItem}>✓ Medicine Tracking</li>
              <li style={styles.featureItem}>✓ Doctor Directory</li>
              <li style={styles.featureItem}>✓ User Profile</li>
            </ul>
          </div>

          <div style={styles.warning}>
            <p style={styles.warningText}>
              <strong>Note:</strong> This preview is a placeholder. To experience the full React Native app, please use
              Expo Go or an emulator.
            </p>
          </div>
        </div>

        <a href="https://expo.dev" target="_blank" rel="noopener noreferrer" style={styles.link}>
          Learn more about Expo →
        </a>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
  } as React.CSSProperties,
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1E272E",
    marginBottom: "8px",
  } as React.CSSProperties,
  subtitle: {
    fontSize: "16px",
    color: "#8395A7",
    marginBottom: "32px",
  } as React.CSSProperties,
  content: {
    marginBottom: "32px",
  } as React.CSSProperties,
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1E272E",
    marginBottom: "16px",
    marginTop: "0px",
  } as React.CSSProperties,
  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#8395A7",
    marginBottom: "24px",
  } as React.CSSProperties,
  section: {
    marginBottom: "24px",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1E272E",
    marginBottom: "12px",
    marginTop: "0px",
  } as React.CSSProperties,
  list: {
    paddingLeft: "20px",
    margin: "0px",
    fontSize: "14px",
  } as React.CSSProperties,
  listItem: {
    marginBottom: "8px",
    color: "#1E272E",
    lineHeight: "1.6",
  } as React.CSSProperties,
  code: {
    backgroundColor: "#F0F0F0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
  } as React.CSSProperties,
  featureList: {
    paddingLeft: "0px",
    margin: "0px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  } as React.CSSProperties,
  featureItem: {
    fontSize: "14px",
    color: "#1E272E",
    margin: "0px",
  } as React.CSSProperties,
  warning: {
    backgroundColor: "#FEF3C7",
    borderLeft: "4px solid #F59E0B",
    padding: "16px",
    borderRadius: "4px",
    marginTop: "24px",
  } as React.CSSProperties,
  warningText: {
    fontSize: "14px",
    color: "#92400E",
    margin: "0px",
  } as React.CSSProperties,
  link: {
    display: "inline-block",
    color: "#2E86DE",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  } as React.CSSProperties,
}
