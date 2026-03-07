import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  AuthButton,
  AuthFooterLink,
  AuthInput,
  AuthLoadingScreen,
  AuthNotice,
  AuthScreen,
} from './auth-ui';
import { formatClerkError } from '../../lib/clerk-auth';

export default function ForgotPasswordScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoaded || !isLoaded || !signIn) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  const signInResource = signIn;

  async function onRequestResetPress() {
    setSubmitting(true);
    setError(null);

    try {
      await signInResource.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress.trim(),
      });

      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: emailAddress.trim() },
      });
    } catch (err) {
      setError(formatClerkError(err, 'Unable to start the password reset flow.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Forgot password"
      subtitle="Enter your account email and Clerk will send a verification code so you can reset your password.">
      <AuthInput
        label="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmailAddress}
        placeholder="you@example.com"
        value={emailAddress}
      />

      {error ? <AuthNotice message={error} /> : null}

      <AuthButton label="Reset your password" loading={submitting} onPress={onRequestResetPress} />

      <AuthFooterLink
        prompt="Remembered it?"
        actionLabel="Sign in"
        onPress={() => router.navigate('/(auth)/sign-in')}
      />
    </AuthScreen>
  );
}
