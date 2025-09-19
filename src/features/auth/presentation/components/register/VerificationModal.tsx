import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { VerificationHeader } from './VerificationHeader';
import { VerificationSteps } from './VerificationSteps';
import { ResendButton } from './ResendButton';
import { AuthButton } from '../AuthButton';

interface VerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: () => void;
  onResend: () => void;
  resendTimer: number;
  style?: any;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
  resendTimer,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, style]}>
        <View style={styles.modal}>
          <VerificationHeader email={email} />
          
          <View style={styles.content}>
            <VerificationSteps />
            
            <View style={styles.actions}>
              <AuthButton
                title="Ya verifiqué mi cuenta"
                onPress={onVerify}
                variant="primary"
                style={styles.verifyButton}
              />

              <ResendButton
                onPress={onResend}
                disabled={resendTimer > 0}
                timer={resendTimer}
                style={styles.resendButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    padding: 28,
  },
  actions: {
    gap: 16,
  },
  verifyButton: {
    backgroundColor: colors.primary600,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  resendButton: {
    marginTop: 8,
  },
});
