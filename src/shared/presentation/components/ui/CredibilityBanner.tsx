import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch } from '../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/domain/hooks/useAppSelector';
import { fetchTestimonials, markAsViewed } from '../../store/slices/testimonialsSlice';

const { width } = Dimensions.get('window');

interface CredibilityBannerProps {
  type?: 'testimonial' | 'winner' | 'milestone';
  maxItems?: number;
  showViewAll?: boolean;
}

export const CredibilityBanner: React.FC<CredibilityBannerProps> = ({
  type = 'testimonial',
  maxItems = 3,
  showViewAll = true,
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { credibilityContent, isLoading } = useAppSelector((state: any) => state.testimonials);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonios cada 5 segundos
    const interval = setInterval(() => {
      if (filteredContent.length > 1) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        setCurrentIndex((prev) => (prev + 1) % filteredContent.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [credibilityContent]);

  const loadTestimonials = async () => {
    try {
      await dispatch(fetchTestimonials()).unwrap();
    } catch (error) {
      console.error('Error cargando testimonios:', error);
    }
  };

  const filteredContent = credibilityContent
    .filter((content: any) => {
      if (type === 'testimonial') {
        return content.type === 'testimonial';
      } else if (type === 'winner') {
        return content.type === 'winner';
      } else if (type === 'milestone') {
        return content.type === 'testimonial' && content.data.type === 'milestone';
      }
      return true;
    })
    .slice(0, maxItems);

  const handleContentPress = async (content: any) => {
    if (content.type === 'testimonial') {
      await dispatch(markAsViewed(content.data.id));
    }
    // Navegar a la pantalla de testimonios
    navigation.navigate('Testimonials' as never);
  };

  const handleViewAll = () => {
    navigation.navigate('Testimonials' as never);
  };

  if (isLoading || filteredContent.length === 0) {
    return null;
  }

  const currentContent = filteredContent[currentIndex];
  const isTestimonial = currentContent.type === 'testimonial';
  const data = currentContent.data;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'winner':
        return 'trophy';
      case 'delivery':
        return 'checkmark-circle';
      case 'milestone':
        return 'star';
      case 'brand':
        return 'shield-checkmark';
      default:
        return 'chatbubbles';
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'winner':
        return ['#fbbf24', '#f59e0b'];
      case 'delivery':
        return ['#10b981', '#34d399'];
      case 'milestone':
        return ['#8b5cf6', '#a855f7'];
      case 'brand':
        return ['#3b82f6', '#1d4ed8'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleContentPress(currentContent)}>
        <LinearGradient
          colors={getContentColor(isTestimonial ? data.type : 'winner') as [string, string]}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerHeader}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={getContentIcon(isTestimonial ? data.type : 'winner') as any} 
                  size={20} 
                  color="#fff" 
                />
              </View>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle} numberOfLines={1}>
                  {data.title || `${data.name} ganó ${data.prize}`}
                </Text>
                <Text style={styles.bannerSubtitle} numberOfLines={1}>
                  {isTestimonial ? data.author : data.name}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
              </View>
            </View>
            
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.bannerText} numberOfLines={2}>
                {isTestimonial ? data.content : data.testimonial || `Ganó ${data.prize} en el sorteo ${data.raffleName}`}
              </Text>
            </Animated.View>
            
            <View style={styles.bannerFooter}>
              <View style={styles.bannerMeta}>
                <Ionicons name="eye" size={12} color="#fff" />
                <Text style={styles.bannerMetaText}>
                  {isTestimonial ? data.viewCount : 'Verificado'}
                </Text>
              </View>
              <View style={styles.bannerAction}>
                <Text style={styles.bannerActionText}>Ver más</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {showViewAll && filteredContent.length > 1 && (
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>Ver todos los testimonios</Text>
          <Ionicons name="chevron-forward" size={16} color="#667eea" />
        </TouchableOpacity>
      )}
      
      {filteredContent.length > 1 && (
        <View style={styles.indicators}>
          {filteredContent.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  banner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    padding: 16,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  verifiedBadge: {
    padding: 2,
  },
  bannerText: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 18,
    marginBottom: 12,
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerMetaText: {
    fontSize: 11,
    color: '#fff',
    marginLeft: 4,
  },
  bannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerActionText: {
    fontSize: 12,
    color: '#fff',
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 3,
  },
  indicatorActive: {
    backgroundColor: '#667eea',
  },
});
