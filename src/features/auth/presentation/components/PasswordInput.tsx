import React, { useState, forwardRef } from 'react';
import { TouchableOpacity, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import FormTextInput from './FormTextInput';

type Props = TextInputProps & {
  error?: string;
};

const PasswordInput = forwardRef<TextInput, Props>(({ error, ...rest }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormTextInput
      ref={ref}
      secureTextEntry={!visible}
      error={error}
      renderRight={(
        <TouchableOpacity onPress={() => setVisible(!visible)} style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
          <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
        </TouchableOpacity>
      )}
      {...rest}
    />
  );
});

export default PasswordInput;


