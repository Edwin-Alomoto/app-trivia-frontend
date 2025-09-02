import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginView from './src/views/LoginView';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginView />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
