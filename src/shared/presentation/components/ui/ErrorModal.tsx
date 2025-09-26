import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { getVariantStyle } from '../../theme/typography';



type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
};

export const ErrorModal: React.FC<Props> = ({
  visible,
  title = 'Error',
  message,
  onClose,
  primaryActionLabel = 'Entendido',
  onPrimaryAction,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={StyleSheet.absoluteFillObject} />
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <Ionicons name="alert" size={22} color="#DC2626" />
          </View>

          <Text style={[getVariantStyle('subtitle'), styles.title]}>{title}</Text>
          <Text style={[getVariantStyle('body'), styles.message]}>{message}</Text>

          <TouchableOpacity
            onPress={onPrimaryAction ? onPrimaryAction : onClose}
            style={styles.primaryBtn}
          >
            <Text style={[getVariantStyle('body'), styles.primaryBtnText]}>{primaryActionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '80%',
    maxWidth: 340,
    borderRadius: 18,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    paddingTop:30,
  },
  closeBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
    borderRadius: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  message: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginHorizontal: 6,
    marginBottom: 10,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: colors.primary600,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
});


