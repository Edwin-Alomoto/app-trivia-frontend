import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeView(): React.JSX.Element {
  const handlePlayTrivia = () => {
    // TODO: Navegar a la pantalla de trivia
    console.log('Jugar Trivia');
  };

  const handleLeaderboard = () => {
    // TODO: Navegar al leaderboard
    console.log('Ver Leaderboard');
  };

  const handleProfile = () => {
    // TODO: Navegar al perfil
    console.log('Ver Perfil');
  };

  const handleSettings = () => {
    // TODO: Navegar a configuraciones
    console.log('Configuraciones');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🎯</Text>
            <Text style={styles.title}>Trivia Challenge</Text>
            <Text style={styles.subtitle}>¡Pon a prueba tu conocimiento!</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Partidas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
          </View>

          {/* Main Actions */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.primaryButton} onPress={handlePlayTrivia}>
              <Text style={styles.primaryButtonText}>🎮 Jugar Trivia</Text>
              <Text style={styles.primaryButtonSubtext}>¡Comienza una nueva partida!</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleLeaderboard}>
              <Text style={styles.secondaryButtonText}>🏆 Leaderboard</Text>
              <Text style={styles.secondaryButtonSubtext}>Ver los mejores jugadores</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleProfile}>
              <Text style={styles.secondaryButtonText}>👤 Mi Perfil</Text>
              <Text style={styles.secondaryButtonSubtext}>Gestiona tu cuenta</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleSettings}>
              <Text style={styles.secondaryButtonText}>⚙️ Configuración</Text>
              <Text style={styles.secondaryButtonSubtext}>Personaliza tu experiencia</Text>
            </Pressable>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <Text style={styles.quickStatsTitle}>Estadísticas Rápidas</Text>
            <View style={styles.quickStatsRow}>
              <View style={styles.quickStat}>
                <Text style={styles.quickStatLabel}>Mejor Puntuación</Text>
                <Text style={styles.quickStatValue}>0 pts</Text>
              </View>
              <View style={styles.quickStat}>
                <Text style={styles.quickStatLabel}>Tiempo Promedio</Text>
                <Text style={styles.quickStatValue}>0s</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  secondaryButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  quickStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});


