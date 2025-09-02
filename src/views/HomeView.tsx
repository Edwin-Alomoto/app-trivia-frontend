import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useCounterViewModel } from '../viewmodels/CounterViewModel';

export default function HomeView(): JSX.Element {
  const { value, increase, decrease, reset } = useCounterViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MVVM + Zustand</Text>
      <Text style={styles.counter}>Contador: {value}</Text>

      <View style={styles.row}>
        <Pressable style={styles.button} onPress={decrease}>
          <Text style={styles.buttonText}>-1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={increase}>
          <Text style={styles.buttonText}>+1</Text>
        </Pressable>
      </View>

      <Pressable style={[styles.button, styles.reset]} onPress={reset}>
        <Text style={styles.buttonText}>Reiniciar</Text>
      </Pressable>
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
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  counter: {
    fontSize: 32,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reset: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});


