import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeView(): React.JSX.Element {
  const handleNotifications = () => {
    // TODO: Abrir notificaciones
    console.log('Abrir notificaciones');
  };

  const handleAvatar = () => {
    // TODO: Abrir perfil de usuario
    console.log('Abrir perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header con saludo y notificaciones */}
          <View style={styles.headerCard}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>¡Hola, Edwin!</Text>
              <Text style={styles.greetingSubtitle}>¿Listo para jugar?</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.notificationButton} onPress={handleNotifications}>
                <MaterialIcons name="notifications" size={24} color="white" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>2</Text>
                </View>
              </Pressable>
              <Pressable style={styles.avatarButton} onPress={handleAvatar}>
                <MaterialIcons name="account-circle" size={28} color="white" />
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
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 24,
    marginTop: 25,
    paddingVertical: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 0,
    padding: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53E3E',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
});


