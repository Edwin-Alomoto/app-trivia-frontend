import React, { forwardRef } from 'react';
import { View, TextInput, TextInputProps, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

type Props = TextInputProps & {
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  renderRight?: React.ReactNode;
  renderLeft?: React.ReactNode;
};

const FormTextInput = forwardRef<TextInput, Props>(({
  error,
  containerStyle,
  inputStyle,
  renderRight,
  renderLeft,
  style,
  ...rest
}, ref) => {
  return (
    <View>
      <View style={[styles.inputWrapper, error && styles.inputError, containerStyle]}>
        {renderLeft}
        <TextInput
          ref={ref}
          style={[getVariantStyle('body'), styles.textInput, inputStyle, style]}
          placeholderTextColor={colors.muted}
          {...rest}
        />
        {renderRight}
      </View>
      {!!error && (
        <Text style={[getVariantStyle('caption'), styles.errorText]}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default FormTextInput;


