import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function HomeView(): React.JSX.Element {
  const handleNotifications = () => {
    // TODO: Abrir notificaciones
    console.log("Abrir notificaciones");
  };

  const handleAvatar = () => {
    // TODO: Abrir perfil de usuario
    console.log("Abrir perfil");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header con saludo y notificaciones */}
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            {/* Línea curva izquierda */}
            <View style={styles.curvedLineLeft} />

            {/* Línea curva derecha */}
            <View style={styles.curvedLineRight} />

            {/* Líneas adicionales para mayor visibilidad */}
            <View style={styles.decorativeLine1} />
            <View style={styles.decorativeLine2} />

            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>¡Hola, Edwin!</Text>
              <Text style={styles.greetingSubtitle}>¿Listo para jugar?</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={styles.notificationButton}
                onPress={handleNotifications}
              >
                <MaterialIcons name="notifications" size={24} color="white" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>2</Text>
                </View>
              </Pressable>
              <Pressable style={styles.avatarButton} onPress={handleAvatar}>
                <MaterialIcons name="account-circle" size={28} color="white" />
              </Pressable>
            </View>
          </LinearGradient>

          {/* Sección de Puntos Acumulados */}
          <View style={styles.pointsCard}>
            {/* Header de la tarjeta */}
            <View style={styles.pointsHeader}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsTitle}>Mis puntos acumulados</Text>
                <Text style={styles.pointsNumber}>2,500</Text>
                <Text style={styles.pointsLabel}>puntos</Text>
                <Text style={styles.levelText}>Nivel 6</Text>

                {/* Barra de progreso */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                  <Text style={styles.progressText}>100%</Text>
                </View>
              </View>

              {/* Icono de billetera */}
              <View style={styles.walletIconContainer}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={32}
                  color="white"
                />
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
              <Pressable style={styles.buyButton}>
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.buttonText}>Comprar</Text>
              </Pressable>

              <Pressable style={styles.historyButton}>
                <MaterialIcons name="schedule" size={20} color="white" />
                <Text style={styles.buttonText}>Historial</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerCard: {
    borderRadius: 20,
    paddingHorizontal: 24,
    marginTop: 25,
    paddingVertical: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // Línea curva izquierda
  curvedLineLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 60,
    height: 60,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopLeftRadius: 20,
    opacity: 0.8,
  },
  // Línea curva derecha
  curvedLineRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderBottomRightRadius: 20,
    opacity: 0.8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    marginRight: 8,
    padding: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#E53E3E",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 22,
  },
  avatarButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  // Líneas adicionales para mayor visibilidad
  decorativeLine1: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderTopLeftRadius: 5,
    opacity: 0.9,
  },
  decorativeLine2: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderBottomRightRadius: 5,
    opacity: 0.9,
  },
  pointsCard: {
    backgroundColor: "#374151",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  pointsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsInfo: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pointsLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  levelText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#4B5563",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 4,
    width: "100%",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    color: "#F97316",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  walletIconContainer: {
    padding: 12,
    borderRadius: 28,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
