import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, TextInput, StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppInitializer } from './src/components/AppInitializer';
import { TypographyProvider } from './src/components/typography/TypographyProvider';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={styles.centered}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  const RNText = Text as any;
  const RNTextInput = TextInput as any;
  if (RNText.defaultProps == null) RNText.defaultProps = {};
  if (RNTextInput.defaultProps == null) RNTextInput.defaultProps = {};
  RNText.defaultProps.style = [RNText.defaultProps.style, { fontFamily: 'Inter_400Regular' }];
  RNTextInput.defaultProps.style = [RNTextInput.defaultProps.style, { fontFamily: 'Inter_400Regular' }];

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <AppInitializer>
            <TypographyProvider>
              <ErrorBoundary>
                <AppNavigator />
              </ErrorBoundary>
            </TypographyProvider>
          </AppInitializer>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  root: { flex: 1 },
});
