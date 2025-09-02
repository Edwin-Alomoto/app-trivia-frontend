import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomeView from './src/views/HomeView';

export default function App() {
  return (
    <View style={styles.container}>
      <HomeView />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
