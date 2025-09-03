import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authStyles } from '../../shared/styles/auth.styles';

interface DateInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onDateChange?: (date: Date) => void;
}

export default function DateInput({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  onDateChange 
}: DateInputProps): React.JSX.Element {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    
    if (date && event.type !== 'dismissed') {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      onChangeText(formattedDate);
      onDateChange?.(date);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={authStyles.inputContainer}>
      <Text style={authStyles.inputLabel}>{label}</Text>
      <View style={authStyles.dateInputContainer}>
        <TextInput
          style={authStyles.dateInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          maxLength={10}
        />
        <TouchableOpacity
          style={authStyles.calendarButton}
          onPress={openDatePicker}
        >
          <Text style={authStyles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );
}
