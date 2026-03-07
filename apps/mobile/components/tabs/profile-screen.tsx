import { useClerk, useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatClerkError } from '../../lib/clerk-auth';
import { AuthNotice } from '../auth/auth-ui';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const emailAddress =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? null;

  async function handleSignOut() {
    setError(null);
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (err) {
      setError(formatClerkError(err, 'Unable to log out.'));
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-10">
        <View className="rounded-3xl border border-border bg-card p-6">
          <Badge
            variant="outline"
            className="mb-4"
            textClassName="uppercase tracking-[2px] text-muted-foreground">
            Account
          </Badge>
          <Text className="text-3xl font-semibold text-card-foreground">Profile</Text>
          <Text className="mt-2 text-base leading-6 text-muted-foreground">
            Manage your current session and review the email attached to this account.
          </Text>
          {emailAddress ? (
            <Badge variant="secondary" className="mt-6" textClassName="text-secondary-foreground">
              {emailAddress}
            </Badge>
          ) : null}
          <Separator className="my-8" />
          <View className="gap-4">
            {error ? <AuthNotice message={error} /> : null}
            <Button onPress={handleSignOut} disabled={isSigningOut} variant="destructive">
              {isSigningOut ? 'Working...' : 'Log out'}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
