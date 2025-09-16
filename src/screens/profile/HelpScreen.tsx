import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { featureFlags } from '../../config/featureFlags';
import { useProfileViewModel } from '../../viewmodels/profile/useProfileViewModel';
import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  color: [string, string];
  description: string;
  onPress: () => void;
}

export const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const useMVVM = featureFlags.useMVVMHelp;
  const vm = useMVVM ? useProfileViewModel() : null;


  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;



  const helpSections: HelpSection[] = [
    {
      id: 'contact',
      title: 'Contactar Soporte',
      icon: 'chatbubble-ellipses',
      color: ['#667eea', '#764ba2'],
      description: 'Habla directamente con nuestro equipo de soporte',
      onPress: () => {
        const message = 'Hola, necesito ayuda con TriviaMaster.';
        const whatsappUrl = `whatsapp://send?phone=+1234567890&text=${encodeURIComponent(message)}`;
        
        Linking.canOpenURL(whatsappUrl).then(supported => {
          if (supported) {
            Linking.openURL(whatsappUrl);
          } else {
            Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo');
          }
        });
      },
    },
    {
      id: 'email',
      title: 'Enviar Email',
      icon: 'mail',
      color: ['#10b981', '#059669'],
      description: 'Envíanos un email con tu consulta',
      onPress: () => {
        const subject = 'Consulta TriviaMaster';
        const body = 'Hola equipo de TriviaMaster,\n\nTengo la siguiente consulta:\n\n';
        const mailtoUrl = `mailto:soporte@triviamaster.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.canOpenURL(mailtoUrl).then(supported => {
          if (supported) {
            Linking.openURL(mailtoUrl);
          } else {
            Alert.alert('Error', 'No se pudo abrir la aplicación de email');
          }
        });
      },
    },
    {
      id: 'community',
      title: 'Comunidad',
      icon: 'people',
      color: ['#8b5cf6', '#7c3aed'],
      description: 'Únete a nuestra comunidad de usuarios',
      onPress: () => {
        Alert.alert('Comunidad', 'Grupo de comunidad próximamente');
      },
    },
  ];



  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);





  const renderHelpSection = (section: HelpSection) => (
    <Animated.View
      key={section.id}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity onPress={section.onPress}>
        <Card style={styles.helpCard}>
          <LinearGradient
            colors={section.color}
            style={styles.helpCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.helpCardContent}>
              <View style={styles.helpCardIcon}>
                <Ionicons name={section.icon as any} size={32} color="#fff" />
              </View>
              <View style={styles.helpCardInfo}>
                <Text style={styles.helpCardTitle}>{section.title}</Text>
                <Text style={styles.helpCardDescription}>{section.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons name="help-circle" size={32} color="#fff" />
              <Text style={styles.title}>Ayuda y Soporte</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerSubtitle}>¿Necesitas ayuda?</Text>
            </View>
          </View>
        </Animated.View>

        {/* Secciones de Ayuda */}
        <Animated.View
          style={[
            styles.helpSectionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>¿Cómo podemos ayudarte?</Text>
          {helpSections.map(renderHelpSection)}
        </Animated.View>

        

        {/* Información de Contacto */}
        <Animated.View
          style={[
            styles.contactInfoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.contactInfoCard}>
            <View style={styles.contactInfoHeader}>
              <Ionicons name="information-circle" size={24} color="#667eea" />
              <Text style={styles.contactInfoTitle}>Información de Contacto</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <Ionicons name="mail" size={16} color="#6b7280" />
              <Text style={styles.contactInfoText}>soporte@triviamaster.com</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <Ionicons name="time" size={16} color="#6b7280" />
              <Text style={styles.contactInfoText}>Soporte 24/7</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <Ionicons name="globe" size={16} color="#6b7280" />
              <Text style={styles.contactInfoText}>www.triviamaster.com</Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  helpSectionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  helpCard: {
    marginBottom: 16,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  helpCardGradient: {
    padding: 20,
  },
  helpCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpCardInfo: {
    flex: 1,
  },
  helpCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  helpCardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },

  contactInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contactInfoCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contactInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactInfoText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
});
