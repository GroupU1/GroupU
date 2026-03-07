import { useAuth, useSignIn, useSSO } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  AuthButton,
  AuthDivider,
  AuthFooterLink,
  AuthInput,
  AuthLoadingScreen,
  AuthNotice,
  AuthScreen,
  AuthSocialButton,
  AuthTextLink,
} from './auth-ui';
import { activateSession, formatClerkError, useWarmUpBrowser } from '../../lib/clerk-auth';

export default function SignInScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);

  useWarmUpBrowser();

  if (!authLoaded || !isLoaded || !signIn || !setActive) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  const signInResource = signIn;
  const activate = setActive;

  async function onSignInPress() {
    setSubmitting(true);
    setError(null);

    try {
      await signInResource.create({ identifier: emailAddress.trim() });
      const result = await signInResource.attemptFirstFactor({
        strategy: 'password',
        password,
      });

      if (await activateSession(result.createdSessionId, activate, router)) {
        return;
      }

      setError('This account needs an additional sign-in step that is not part of this password screen.');
    } catch (err) {
      setError(formatClerkError(err, 'Unable to sign in.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onGooglePress() {
    setSocialSubmitting(true);
    setError(null);

    try {
      const redirectUrl = Linking.createURL('/sso-callback');
      const { createdSessionId, setActive: setActiveFromSSO } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (createdSessionId && setActiveFromSSO) {
        await setActiveFromSSO({ session: createdSessionId });
        router.replace('/(tabs)/map');
        return;
      }

      setError(
        'Google sign-in did not complete. Make sure the Google connection and the mobile redirect URL are allowed in Clerk.',
      );
    } catch (err) {
      setError(formatClerkError(err, 'Unable to sign in with Google.'));
    } finally {
      setSocialSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Sign in"
      subtitle="Use your email and password to continue, or choose Google if you prefer a social sign-in.">
      <AuthInput
        label="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmailAddress}
        placeholder="you@example.com"
        value={emailAddress}
      />
      <AuthInput
        label="Password"
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
      />

      <AuthTextLink label="Forgot password?" onPress={() => router.push('/(auth)/forgot-password')} />

      {error ? <AuthNotice message={error} /> : null}

      <AuthButton label="Continue" loading={submitting} onPress={onSignInPress} />

      <AuthDivider />
      <AuthSocialButton
        label="Continue with Google"
        loading={socialSubmitting}
        onPress={onGooglePress}
      />

      <AuthFooterLink
        prompt="Don't have an account?"
        actionLabel="Sign up"
        onPress={() => router.push('/(auth)/sign-up')}
      />
    </AuthScreen>
  );
}
