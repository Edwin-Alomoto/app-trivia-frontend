import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    // Aquí podrías enviar a un servicio de logging
    console.warn('UI ErrorBoundary:', error.message);
  }

  handleRetry = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ha ocurrido un problema</Text>
          <Text style={styles.message}>{this.state.message ?? 'Error inesperado'}</Text>
          <Button title="Reintentar" onPress={this.handleRetry} />
        </View>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  message: { fontSize: 14, color: '#64748b', marginBottom: 16, textAlign: 'center' },
});


