import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface ModalAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
}

export const ModalAlert: React.FC<ModalAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  confirmText = 'Entendido',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={[getVariantStyle('h3'), styles.title]}>{title}</Text>
          <Text style={[getVariantStyle('body'), styles.message]}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={[getVariantStyle('body'), styles.buttonText]}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.primary900,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 20,
  },
  title: {
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  buttonText: {
    color: colors.gold,
    fontWeight: '600',
  },
});


