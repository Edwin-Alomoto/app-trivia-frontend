import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

type Props = {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder?: string;
  containerStyle?: ViewStyle;
};

const InlineDropdown: React.FC<Props> = ({ value, onSelect, options, placeholder = 'Selecciona una opción', containerStyle }) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.pickerContainer, containerStyle]}
        onPress={() => setOpen(prev => !prev)}
      >
        <Text style={[getVariantStyle('body'), styles.pickerText, !value && styles.pickerPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownPanel}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <Text style={[getVariantStyle('body'), { color: colors.textPrimary }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 16,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

export default InlineDropdown;


