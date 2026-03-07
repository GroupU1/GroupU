import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import {
  AuthButton,
  AuthFooterLink,
  AuthInput,
  AuthLoadingScreen,
  AuthNotice,
  AuthScreen,
} from './auth-ui';
import { activateSession, formatClerkError, getRouteParam } from '../../lib/clerk-auth';

export default function ResetPasswordScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const emailAddress = getRouteParam(params.email);
  const bootstrapAttempted = useRef(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    emailAddress ? `We sent a code to ${emailAddress}.` : null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isLoaded || !emailAddress || !signIn || bootstrapAttempted.current || signIn.status !== 'needs_identifier') {
      return;
    }

    bootstrapAttempted.current = true;

    void signIn
      .create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      .catch(() => {
        bootstrapAttempted.current = false;
      });
  }, [emailAddress, isLoaded, signIn]);

  if (!authLoaded || !isLoaded || !signIn || !setActive) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  const signInResource = signIn;
  const activate = setActive;

  async function onResetPress() {
    setSubmitting(true);
    setError(null);

    try {
      const result = await signInResource.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });

      if (await activateSession(result.createdSessionId, activate, router)) {
        return;
      }

      setError('The code was accepted, but the reset flow still needs another step.');
    } catch (err) {
      setError(formatClerkError(err, 'Unable to reset your password.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onResendPress() {
    if (!emailAddress) {
      return;
    }

    setResending(true);
    setError(null);
    setMessage(null);

    try {
      await signInResource.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setMessage(`A new verification code was sent to ${emailAddress}.`);
    } catch (err) {
      setError(formatClerkError(err, 'Unable to resend the reset code.'));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthScreen
      title="Reset password"
      subtitle="Enter the verification code from Clerk and set a new password to finish the reset flow.">
      <AuthInput
        label="Password"
        autoCapitalize="none"
        autoComplete="new-password"
        onChangeText={setPassword}
        placeholder="Create a new password"
        secureTextEntry
        value={password}
      />
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

      <AuthButton label="Reset password" loading={submitting} onPress={onResetPress} />
      {emailAddress ? (
        <AuthButton
          label="Resend code"
          loading={resending}
          onPress={onResendPress}
          variant="secondary"
        />
      ) : null}

      <AuthFooterLink
        prompt="Need to start over?"
        actionLabel="Back to sign in"
        onPress={() => router.navigate('/(auth)/sign-in')}
      />
    </AuthScreen>
  );
}
