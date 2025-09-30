import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownInputProps {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  error?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  placeholder,
  value,
  onValueChange,
  options,
  error,
  isFocused = false,
  onFocus,
  onBlur,
  isOpen,
  onToggle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    onFocus?.();
    onToggle();
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

  const handleOptionSelect = (optionValue: string) => {
    onValueChange(optionValue);
    onToggle();
    handleBlur();
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
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={colors.muted} 
          />
        </TouchableOpacity>
      </Animated.View>

      {isOpen && (
        <View style={styles.dropdownPanel}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownOption}
              onPress={() => handleOptionSelect(option.value)}
            >
              <Text style={[getVariantStyle('body'), styles.optionText]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    borderColor: colors.gold,
    backgroundColor: colors.surface,
  },
  dropdownPanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.gold,
    marginTop: 6,
    marginLeft: 4,
  },
});
