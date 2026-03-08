import { useAuth } from '@clerk/clerk-expo';
import { CircleUserRound, Map, MessageCircle } from 'lucide-react-native';
import { Redirect, Tabs } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { AuthLoadingScreen } from '../../components/auth/auth-ui';
import { useSemanticTheme } from '../../lib/theme';

type CenteredTabBarButtonProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
};

function CenteredTabBarButton(props: CenteredTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      style={[
        props.style,
        {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        },
      ]}
    />
  );
}

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
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: (props) => <CenteredTabBarButton {...props} />,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          marginHorizontal: 16,
          marginBottom: 16,
          height: 64,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          borderWidth: 1,
          borderRadius: 999,
          overflow: 'hidden',
          paddingVertical: 0,
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          borderRadius: 18,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Map
              color={color}
              size={size}
              strokeWidth={focused ? 2.2 : 2}
              absoluteStrokeWidth
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dms"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle
              color={color}
              size={size}
              strokeWidth={focused ? 2.2 : 2}
              absoluteStrokeWidth
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <CircleUserRound
              color={color}
              size={size}
              strokeWidth={focused ? 2.2 : 2}
              absoluteStrokeWidth
            />
          ),
        }}
      />
    </Tabs>
  );
}
