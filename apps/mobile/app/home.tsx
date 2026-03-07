import { useAuth, useClerk } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../../backend/convex/_generated/api';

export default function HomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const currentUser = useQuery(api.users.getCurrentUser, isSignedIn ? {} : 'skip');
  const upsertUser = useMutation(api.users.upsertUser);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  async function handleCreateProfile() {
    await upsertUser({
      firstName: 'Mobile',
      lastName: 'User',
      nickname: 'phone',
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Text className="text-3xl font-bold text-slate-900">Convex connected</Text>
        <Text className="text-center text-base text-slate-600">
          {currentUser === undefined
            ? 'Loading your Convex profile...'
            : currentUser
              ? `Profile found for ${currentUser.firstName} ${currentUser.lastName}.`
              : 'No Convex user row exists yet for this Clerk account.'}
        </Text>
        <Pressable className="mt-2 rounded-xl bg-slate-900 px-5 py-3" onPress={handleCreateProfile}>
          <Text className="text-base font-semibold text-white">Create test Convex profile</Text>
        </Pressable>
        <Pressable className="rounded-xl border border-slate-300 px-5 py-3" onPress={() => signOut()}>
          <Text className="text-base font-semibold text-slate-900">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
