import { useAuth, useSignUp } from '@clerk/clerk-expo';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  AuthButton,
  AuthFooterLink,
  AuthInput,
  AuthLoadingScreen,
  AuthNotice,
  AuthScreen,
  AuthTextLink,
} from './auth-ui';
import { activateSession, formatClerkError, getRouteParam } from '../../lib/clerk-auth';

export default function VerifyEmailScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const emailAddress = getRouteParam(params.email) ?? signUp?.emailAddress ?? 'your email';
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  if (!authLoaded || !isLoaded || !signUp || !setActive) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  const signUpResource = signUp;
  const activate = setActive;

  async function onVerifyPress() {
    setSubmitting(true);
    setError(null);

    try {
      const result = await signUpResource.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (await activateSession(result.createdSessionId, activate, router)) {
        return;
      }

      setError('The email code was accepted, but the sign-up is not complete yet.');
    } catch (err) {
      setError(formatClerkError(err, 'Unable to verify your email.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onResendPress() {
    setResending(true);
    setError(null);
    setMessage(null);

    try {
      await signUpResource.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setMessage(`A new verification code was sent to ${emailAddress}.`);
    } catch (err) {
      setError(formatClerkError(err, 'Unable to resend the verification code.'));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthScreen
      title="Verify email"
      subtitle={`Enter the verification code Clerk sent to ${emailAddress} to finish creating your account.`}>
      <AuthInput
        label="Verification code"
        autoCapitalize="none"
        keyboardType="number-pad"
        onChangeText={setCode}
        placeholder="123456"
        value={code}
      />

      {error ? <AuthNotice message={error} /> : null}
      {message ? <AuthNotice message={message} tone="info" /> : null}

      <AuthButton label="Continue" loading={submitting} onPress={onVerifyPress} />
      <AuthButton
        label="Resend code"
        loading={resending}
        onPress={onResendPress}
        variant="secondary"
      />

      <AuthTextLink label="Use a different email" onPress={() => router.replace('/(auth)/sign-up')} />
      <AuthFooterLink
        prompt="Already verified?"
        actionLabel="Sign in"
        onPress={() => router.navigate('/(auth)/sign-in')}
      />
    </AuthScreen>
  );
}
