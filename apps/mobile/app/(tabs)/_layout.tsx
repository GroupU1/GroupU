import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs } from 'expo-router';

import { AuthLoadingScreen } from '../../components/auth/auth-ui';
import { useSemanticTheme } from '../../lib/theme';

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useSemanticTheme();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}>
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="dms" options={{ title: 'DMs' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
