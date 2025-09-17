import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

type Props = {
  value: string;
  onChange: (formatted: string, date: Date) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  minDate?: Date;
  maxDate?: Date;
};

const formatDateDDMMYYYY = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DatePickerField: React.FC<Props> = ({ value, onChange, placeholder = 'Fecha (DD/MM/AAAA)', containerStyle, minDate, maxDate }) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

  const handleOpen = () => {
    if (!tempDate && maxDate) setTempDate(maxDate);
    setOpen(true);
  };

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (_event.type === 'dismissed') {
      setOpen(false);
      return;
    }
    if (selectedDate) {
      setTempDate(selectedDate);
      const formatted = formatDateDDMMYYYY(selectedDate);
      onChange(formatted, selectedDate);
    }
    if (Platform.OS === 'android') setOpen(false);
  };

  return (
    <View>
      <TouchableOpacity activeOpacity={0.85} style={[styles.container, containerStyle]} onPress={handleOpen}>
        <Text style={[getVariantStyle('body'), styles.text, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar" size={18} color={colors.muted} />
      </TouchableOpacity>

      {open && (
        <DateTimePicker
          value={tempDate || maxDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          locale="es-ES"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  text: {
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.muted,
  },
});

export default DatePickerField;


