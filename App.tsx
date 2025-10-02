import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, TextInput, StyleSheet, Image } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@shared/presentation/components/ErrorBoundary';
import { AppInitializer } from '@shared/presentation/components/AppInitializer';
import { TypographyProvider } from '@shared/presentation/providers/TypographyProvider';
import { LanguageProvider } from '@shared/domain/contexts/LanguageContext';

import { store } from './src/app/store';
import { AppNavigator } from './src/app/navigation/AppNavigator';

// Importación directa del logo
const SplashIcon = require('./src/assets/splash-icon.png');

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
        <Image 
          source={SplashIcon} 
          style={styles.splashLogo}
          resizeMode="contain"
        />
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
          <LanguageProvider>
            <AppInitializer>
              <TypographyProvider>
                <ErrorBoundary>
                  <AppNavigator />
                </ErrorBoundary>
              </TypographyProvider>
            </AppInitializer>
          </LanguageProvider>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  root: { flex: 1 },
  splashLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
