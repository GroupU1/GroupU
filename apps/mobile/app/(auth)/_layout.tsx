import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

import { AuthLoadingScreen } from '../../components/auth/auth-ui';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
