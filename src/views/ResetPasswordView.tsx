import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function ResetPasswordView(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo para enviarte instrucciones de restablecimiento.
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Enviar</Text>
        </Pressable>

        <View style={styles.linksRow}>
          <Pressable>
            <Text style={styles.linkText}>Volver a iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    maxWidth: 420,
  },
  form: {
    width: '100%',
    gap: 12,
    maxWidth: 420,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
});


