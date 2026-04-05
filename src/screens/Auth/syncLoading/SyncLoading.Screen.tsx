import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground, StatusBar } from "react-native";
import { COLORS } from "../../../constants/theme";

export default function SyncLoadingScreen() {
  const BG_IMAGE = require("@assets/images/signInbackground.jpg");

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.title}>Finalizing Setup</Text>
        <Text style={styles.subtitle}>Synchronizing your profile with our servers...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 10,
    textAlign: "center",
  },
});
