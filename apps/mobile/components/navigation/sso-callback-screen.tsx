import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useSemanticTheme } from '../../lib/theme';

export default function SsoCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useSemanticTheme();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? '/(tabs)/map' : '/(auth)/sign-in'} />;
}
