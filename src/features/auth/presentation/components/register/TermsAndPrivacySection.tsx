import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { CheckboxInput } from './CheckboxInput';

interface TermsAndPrivacySectionProps {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  onTermsToggle: () => void;
  onPrivacyToggle: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  style?: any;
}

export const TermsAndPrivacySection: React.FC<TermsAndPrivacySectionProps> = ({
  acceptedTerms,
  acceptedPrivacy,
  onTermsToggle,
  onPrivacyToggle,
  onTermsPress,
  onPrivacyPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <CheckboxInput
        checked={acceptedTerms}
        onToggle={onTermsToggle}
        text="Acepto los"
        linkText="Términos y Condiciones"
        onLinkPress={onTermsPress}
      />

      <CheckboxInput
        checked={acceptedPrivacy}
        onToggle={onPrivacyToggle}
        text="Acepto la"
        linkText="Política de Privacidad"
        onLinkPress={onPrivacyPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    padding: 8,
    borderRadius: 12,
    borderWidth: 0,
  },
});
