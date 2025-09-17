import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { Button } from '@shared/presentation/components/ui/Button';
import { errorStateStyles } from './ErrorState.styles';

interface ErrorStateProps {
  title?: string;
  message?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  buttonTitle?: string;
  onRetry: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Sin conexión",
  message = "No se pudieron cargar las categorías. Verifica tu conexión a internet e intenta de nuevo.",
  iconName = "cloud-offline",
  iconSize = 80,
  iconColor = "#dc3545",
  buttonTitle = "Reintentar",
  onRetry,
  fadeAnim,
  slideAnim,
}) => {
  return (
    <View style={errorStateStyles.errorContainer}>
      <Animated.View 
        style={[
          errorStateStyles.errorContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={errorStateStyles.errorIconContainer}>
          <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </View>
        <Text style={[getVariantStyle('h2'), errorStateStyles.errorTitle]}>{title}</Text>
        <Text style={[getVariantStyle('body'), errorStateStyles.errorMessage]}>
          {message}
        </Text>
        <Button
          title={buttonTitle}
          onPress={onRetry}
          variant="primary"
          style={errorStateStyles.retryButton}
        />
      </Animated.View>
    </View>
  );
};
