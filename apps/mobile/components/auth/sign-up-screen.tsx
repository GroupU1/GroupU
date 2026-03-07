import { useAuth, useSignUp, useSSO } from '@clerk/clerk-expo';
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
} from './auth-ui';
import { formatClerkError, useWarmUpBrowser } from '../../lib/clerk-auth';

export default function SignUpScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded, signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);

  useWarmUpBrowser();

  if (!authLoaded || !isLoaded || !signUp) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/map" />;
  }

  const signUpResource = signUp;

  async function onSignUpPress() {
    setSubmitting(true);
    setError(null);

    try {
      await signUpResource.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUpResource.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: emailAddress.trim() },
      });
    } catch (err) {
      setError(formatClerkError(err, 'Unable to create your account.'));
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
        'Google sign-up did not complete. Make sure the Google connection and the mobile redirect URL are allowed in Clerk.',
      );
    } catch (err) {
      setError(formatClerkError(err, 'Unable to sign up with Google.'));
    } finally {
      setSocialSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Create account"
      subtitle="Start with email and password, then confirm your email with a verification code from Clerk.">
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
        autoComplete="new-password"
        onChangeText={setPassword}
        placeholder="Create a password"
        secureTextEntry
        value={password}
      />

      {error ? <AuthNotice message={error} /> : null}

      <AuthButton label="Continue" loading={submitting} onPress={onSignUpPress} />

      <AuthDivider />
      <AuthSocialButton
        label="Continue with Google"
        loading={socialSubmitting}
        onPress={onGooglePress}
      />

      <AuthFooterLink
        prompt="Already have an account?"
        actionLabel="Sign in"
        onPress={() => router.navigate('/(auth)/sign-in')}
      />
    </AuthScreen>
  );
}
