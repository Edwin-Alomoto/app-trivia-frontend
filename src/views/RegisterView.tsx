import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function RegisterView(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </Pressable>

        <View style={styles.linksRow}>
          <Text>¿Ya tienes cuenta?</Text>
          <Pressable>
            <Text style={styles.linkText}>Inicia sesión</Text>
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
    gap: 6,
  },
  linkText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
});


