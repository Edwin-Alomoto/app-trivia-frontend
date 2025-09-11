import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, TextInput } from 'react-native';
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
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  if (Text.defaultProps == null) Text.defaultProps = {};
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  Text.defaultProps.style = [Text.defaultProps.style, { fontFamily: 'Inter_400Regular' }];
  TextInput.defaultProps.style = [TextInput.defaultProps.style, { fontFamily: 'Inter_400Regular' }];

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
