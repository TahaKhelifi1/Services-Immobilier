import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as AppThemeProvider } from '@/src/context/ThemeContext';
import { KeyboardAvoidingView, Platform, StyleSheet, useColorScheme as useSystemScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Read system color scheme before ThemeProvider mounts
  const systemScheme = useSystemScheme() ?? 'light';

  return (
    <SafeAreaProvider>
      <AppThemeProvider initialScheme={systemScheme as 'light' | 'dark'}>
        <ThemedNavigation />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedNavigation() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Platform-adaptive stack options
  const stackScreenOptions: any = {
    headerStyle: {
      backgroundColor: isDark ? '#000' : '#fff',
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTintColor: isDark ? '#fff' : '#000',
    headerTitleAlign: Platform.select({ ios: 'center', android: 'left' }),
    gestureEnabled: Platform.OS !== 'web',
    headerBackTitleVisible: false,
    contentStyle: {
      backgroundColor: isDark ? '#000' : '#fff',
    },
  };

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Stack screenOptions={stackScreenOptions}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
