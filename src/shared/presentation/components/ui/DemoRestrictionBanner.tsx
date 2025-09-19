import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface DemoRestrictionBannerProps {
  type: 'raffles' | 'rewards';
}

export const DemoRestrictionBanner: React.FC<DemoRestrictionBannerProps> = ({ type }) => {
  const navigation = useNavigation();

  const getBannerContent = () => {
    if (type === 'raffles') {
      return {
        title: '🎰 Sorteos en Modo Demo',
        message: 'Puedes ver todos los sorteos disponibles, pero necesitas suscribirte para participar.',
        icon: 'gift-outline',
        colors: ['#f093fb', '#f5576c'],
      };
    } else {
      return {
        title: '🏆 Premios en Modo Demo',
        message: 'Puedes explorar el catálogo de premios, pero necesitas suscribirte para canjearlos.',
        icon: 'star-outline',
        colors: ['#4facfe', '#00f2fe'],
      };
    }
  };

  const content = getBannerContent();

  const handleSubscribe = () => {
    navigation.navigate('ModeSelection' as never);
  };

  const colorsResolved = content.colors as unknown as Readonly<[string, string, ...string[]]>;
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colorsResolved}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={content.icon as any} size={24} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.message}>{content.message}</Text>
          </View>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Suscribirse</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  banner: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
