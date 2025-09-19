import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface DatePickerInputProps {
  placeholder: string;
  value: string;
  onDateChange: (date: string) => void;
  error?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  showPicker: boolean;
  onTogglePicker: () => void;
  selectedDate?: Date;
  onDatePickerChange: (event: any, selectedDate?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  placeholder,
  value,
  onDateChange,
  error,
  isFocused = false,
  onFocus,
  onBlur,
  showPicker,
  onTogglePicker,
  selectedDate,
  onDatePickerChange,
  minDate,
  maxDate,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    onFocus?.();
    onTogglePicker();
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    onBlur?.();
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.View
        style={[
          styles.animatedInputWrapper,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.pickerContainer,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
          onPress={handlePress}
        >
          <Text
            style={[
              getVariantStyle('body'),
              styles.pickerText,
              !value && styles.pickerPlaceholder,
            ]}
          >
            {value || placeholder}
          </Text>
          <Ionicons name="calendar" size={18} color={colors.muted} />
        </TouchableOpacity>
      </Animated.View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDatePickerChange}
          maximumDate={maxDate}
          minimumDate={minDate}
          locale="es-ES"
        />
      )}

      {error && (
        <Text style={[getVariantStyle('caption'), styles.errorText]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  animatedInputWrapper: {
    borderRadius: 12,
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.muted,
  },
  inputFocused: {
    borderColor: colors.primary600,
    backgroundColor: colors.surface,
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
});
