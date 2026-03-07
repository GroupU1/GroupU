import { useAuth, useSSO, useSignIn } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

type VerificationState =
  | { mode: 'password' }
  | { mode: 'email_code'; emailAddress: string }
  | {
      mode: 'second_factor';
      strategy: 'email_code' | 'totp' | 'phone_code' | 'backup_code';
      emailLabel?: string;
      phoneLabel?: string;
      phoneNumberId?: string;
    };

type FactorLike = {
  strategy?: string | null;
  safeIdentifier?: string | null;
  emailAddressId?: string;
  phoneNumberId?: string;
};

type VerificationLike = {
  status?: string | null;
  strategy?: string | null;
  error?: { message?: string | null } | null;
  attempts?: number | null;
};

type SignInLike = {
  status: string | null;
  createdSessionId?: string | null;
  identifier?: string | null;
  supportedFirstFactors?: FactorLike[];
  supportedSecondFactors?: FactorLike[];
  firstFactorVerification?: VerificationLike;
  secondFactorVerification?: VerificationLike;
  create?: (params: Record<string, unknown>) => Promise<SignInLike>;
  attemptFirstFactor?: (params: Record<string, unknown>) => Promise<SignInLike>;
  prepareFirstFactor?: (params: Record<string, unknown>) => Promise<SignInLike>;
  prepareSecondFactor?: (params: Record<string, unknown>) => Promise<SignInLike>;
  attemptSecondFactor?: (params: Record<string, unknown>) => Promise<SignInLike>;
  password?: (params: Record<string, unknown>) => Promise<unknown>;
};

type DebugSnapshot = {
  label: string;
  status: string | null;
  identifier?: string | null;
  createdSessionId?: string | null;
  firstFactors: Array<{
    strategy?: string | null;
    safeIdentifier?: string | null;
    emailAddressId?: string;
    phoneNumberId?: string;
  }>;
  secondFactors: Array<{
    strategy?: string | null;
    safeIdentifier?: string | null;
    phoneNumberId?: string;
  }>;
  firstFactorVerification?: VerificationLike;
  secondFactorVerification?: VerificationLike;
};

type SecondFactorChoice =
  | {
      strategy: 'email_code';
      emailLabel: string;
    }
  | {
      strategy: 'phone_code';
      phoneLabel?: string;
      phoneNumberId?: string;
    }
  | {
      strategy: 'totp';
    }
  | {
      strategy: 'backup_code';
    };

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verification, setVerification] = useState<VerificationState>({ mode: 'password' });

  const signInResource = signIn as SignInLike | undefined;

  useEffect(() => {
    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  function takeSnapshot(label: string, resource: SignInLike | undefined): DebugSnapshot {
    return {
      label,
      status: resource?.status ?? null,
      identifier: resource?.identifier,
      createdSessionId: resource?.createdSessionId,
      firstFactors: (resource?.supportedFirstFactors ?? []).map((factor) => ({
        strategy: factor.strategy,
        safeIdentifier: factor.safeIdentifier,
        emailAddressId: factor.emailAddressId,
        phoneNumberId: factor.phoneNumberId,
      })),
      secondFactors: (resource?.supportedSecondFactors ?? []).map((factor) => ({
        strategy: factor.strategy,
        safeIdentifier: factor.safeIdentifier,
        phoneNumberId: factor.phoneNumberId,
      })),
      firstFactorVerification: resource?.firstFactorVerification,
      secondFactorVerification: resource?.secondFactorVerification,
    };
  }

  function logSnapshot(label: string, resource: SignInLike | undefined) {
    const snapshot = takeSnapshot(label, resource);
    console.log(`[mobile clerk] ${label}\n${JSON.stringify(snapshot, null, 2)}`);
  }

  async function activateCurrentSession(result: { status: string | null; createdSessionId?: string | null }) {
    if (result.status === 'complete' && result.createdSessionId && setActive) {
      await setActive({ session: result.createdSessionId });
      return true;
    }

    return false;
  }

  function getSecondFactorStrategy(resource: SignInLike): SecondFactorChoice | null {
    const factors = resource.supportedSecondFactors ?? [];

    const emailFactor = factors.find((factor) => factor.strategy === 'email_code');
    if (emailFactor) {
      return {
        strategy: 'email_code',
        emailLabel: emailFactor.safeIdentifier ?? email.trim(),
      };
    }

    const phoneFactor = factors.find((factor) => factor.strategy === 'phone_code');
    if (phoneFactor) {
      return {
        strategy: 'phone_code',
        phoneLabel: phoneFactor.safeIdentifier ?? undefined,
        phoneNumberId: phoneFactor.phoneNumberId,
      };
    }

    const totpFactor = factors.find((factor) => factor.strategy === 'totp');
    if (totpFactor) {
      return { strategy: 'totp' };
    }

    const backupFactor = factors.find((factor) => factor.strategy === 'backup_code');
    if (backupFactor) {
      return { strategy: 'backup_code' };
    }

    return null;
  }

  async function beginSecondFactor(resource: SignInLike) {
    const nextFactor = getSecondFactorStrategy(resource);

    if (!nextFactor) {
      setError('This account requires a second factor, but no supported mobile strategy was returned.');
      return;
    }

    if (nextFactor.strategy === 'email_code') {
      const prepared = resource.prepareSecondFactor
        ? await resource.prepareSecondFactor({ strategy: 'email_code' })
        : resource;
      logSnapshot('after-prepare-second-factor-email-code', prepared);
      setVerification({
        mode: 'second_factor',
        strategy: 'email_code',
        emailLabel: nextFactor.emailLabel,
      });
      return;
    }

    if (nextFactor.strategy === 'phone_code') {
      const prepared = resource.prepareSecondFactor
        ? await resource.prepareSecondFactor({
            strategy: 'phone_code',
            phoneNumberId: nextFactor.phoneNumberId,
          })
        : resource;
      logSnapshot('after-prepare-second-factor-phone-code', prepared);
      setVerification({
        mode: 'second_factor',
        strategy: 'phone_code',
        phoneLabel: nextFactor.phoneLabel,
        phoneNumberId: nextFactor.phoneNumberId,
      });
      return;
    }

    logSnapshot(`second-factor-${nextFactor.strategy}-selected`, resource);
    setVerification({ mode: 'second_factor', strategy: nextFactor.strategy });
  }

  async function handlePasswordSubmit() {
    if (!signInResource || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      logSnapshot('before-password-submit', signInResource);

      if (typeof signInResource.password === 'function') {
        await signInResource.password({
          emailAddress: email.trim(),
          password,
        });
        logSnapshot('after-password-method', signInResource);
      } else {
        const created = signInResource.create
          ? await signInResource.create({ identifier: email.trim() })
          : signInResource;
        logSnapshot('after-create', created);

        if (await activateCurrentSession(created)) {
          return;
        }

        if (created.attemptFirstFactor) {
          const passwordAttempt = await created.attemptFirstFactor({
            strategy: 'password',
            password,
          });
          logSnapshot('after-attempt-first-factor-password', passwordAttempt);

          if (await activateCurrentSession(passwordAttempt)) {
            return;
          }
        }
      }

      logSnapshot('post-password-current-resource', signInResource);

      if (await activateCurrentSession(signInResource)) {
        return;
      }

      if (signInResource.status === 'needs_second_factor' || signInResource.status === 'needs_client_trust') {
        await beginSecondFactor(signInResource);
        return;
      }

      const emailCodeFactor = signInResource.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'email_code' && factor.emailAddressId,
      );

      if (emailCodeFactor?.emailAddressId) {
        const prepared = await signInResource.prepareFirstFactor?.({
          strategy: 'email_code',
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        logSnapshot('after-prepare-first-factor-email-code', prepared ?? signInResource);

        setVerification({
          mode: 'email_code',
          emailAddress: emailCodeFactor.safeIdentifier ?? email.trim(),
        });
        return;
      }

      setError('This account cannot be completed with the current mobile sign-in flow.');
    } catch (err) {
      console.error('[mobile clerk] password-submit-error', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to sign in.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailCodeSubmit() {
    if (!signInResource || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = signInResource.attemptFirstFactor
        ? await signInResource.attemptFirstFactor({
            strategy: 'email_code',
            code: code.trim(),
          })
        : signInResource;

      logSnapshot('after-email-code-submit', result);

      if (await activateCurrentSession(result)) {
        return;
      }

      setError('The verification code was accepted, but the sign-in is still not complete.');
    } catch (err) {
      console.error('[mobile clerk] email-code-error', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to verify the code.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSecondFactorSubmit() {
    if (!signInResource || !setActive || verification.mode !== 'second_factor') {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let result = signInResource;

      if (useBackupCode) {
        result = signInResource.attemptSecondFactor
          ? await signInResource.attemptSecondFactor({
              strategy: 'backup_code',
              code: code.trim(),
            })
          : signInResource;
      } else {
        result = signInResource.attemptSecondFactor
          ? await signInResource.attemptSecondFactor({
              strategy: verification.strategy,
              code: code.trim(),
            })
          : signInResource;
      }

      logSnapshot('after-second-factor-submit', result);

      if (await activateCurrentSession(result)) {
        return;
      }

      setError('The second factor code was accepted, but the sign-in is still not complete.');
    } catch (err) {
      console.error('[mobile clerk] second-factor-error', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to verify the second factor.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setSubmitting(true);
    setError(null);

    try {
      const redirectUrl = Linking.createURL('/sso-callback');
      console.log(`[mobile clerk] google-sso-start redirectUrl=${redirectUrl}`);

      const { createdSessionId, setActive: setActiveFromSSO, signIn: ssoSignIn } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (createdSessionId && setActiveFromSSO) {
        await setActiveFromSSO({ session: createdSessionId });
        return;
      }

      console.log(
        `[mobile clerk] google-sso-incomplete ${JSON.stringify(
          {
            status: ssoSignIn?.status ?? null,
            createdSessionId,
          },
          null,
          2,
        )}`,
      );

      setError(
        'Google sign-in did not complete. Make sure Google is enabled in Clerk and the mobile SSO redirect allowlist includes your app callback URL.',
      );
    } catch (err) {
      console.error('[mobile clerk] google-sso-error', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to sign in with Google.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const showingEmailCodeStep = verification.mode === 'email_code';
  const showingSecondFactorStep = verification.mode === 'second_factor';

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled">
        <View className="gap-3 rounded-2xl bg-white p-6 shadow-sm">
          <Text className="text-3xl font-bold text-slate-900">
            {showingEmailCodeStep || showingSecondFactorStep ? 'Verify sign in' : 'Sign in'}
          </Text>
          <Text className="mb-2 text-base text-slate-600">
            {showingEmailCodeStep
              ? `Enter the verification code sent to ${verification.emailAddress}.`
              : showingSecondFactorStep
                ? useBackupCode
                  ? 'Enter one of your backup codes.'
                  : verification.strategy === 'email_code'
                    ? `Enter the verification code sent to ${verification.emailLabel ?? email.trim()}.`
                    : verification.strategy === 'phone_code'
                      ? `Enter the code sent to ${verification.phoneLabel ?? 'your phone'}.`
                      : verification.strategy === 'backup_code'
                        ? 'Enter one of your backup codes.'
                        : 'Enter the code from your authenticator app.'
                : 'Use your Clerk email and password, or continue with Google.'}
          </Text>

          {!showingEmailCodeStep && !showingSecondFactorStep ? (
            <>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#6b7280"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
                value={email}
              />
              <TextInput
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
                value={password}
              />
            </>
          ) : (
            <TextInput
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder={showingSecondFactorStep && useBackupCode ? 'Backup code' : 'Verification code'}
              placeholderTextColor="#6b7280"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
              value={code}
            />
          )}

          {showingSecondFactorStep &&
          verification.strategy !== 'email_code' &&
          verification.strategy !== 'phone_code' ? (
            <Pressable
              className="flex-row items-center gap-2 rounded-xl border border-slate-300 px-4 py-3"
              disabled={submitting}
              onPress={() => {
                setUseBackupCode((value) => !value);
                setCode('');
                setError(null);
              }}>
              <View
                className={`h-5 w-5 items-center justify-center rounded border ${
                  useBackupCode ? 'border-slate-900 bg-slate-900' : 'border-slate-400 bg-white'
                }`}>
                {useBackupCode ? <Text className="text-xs font-bold text-white">?</Text> : null}
              </View>
              <Text className="text-base text-slate-900">Use backup code</Text>
            </Pressable>
          ) : null}

          {error ? <Text className="text-sm text-red-700">{error}</Text> : null}

          <Pressable
            className="mt-2 min-h-12 items-center justify-center rounded-xl bg-slate-900"
            disabled={submitting}
            onPress={showingSecondFactorStep ? handleSecondFactorSubmit : showingEmailCodeStep ? handleEmailCodeSubmit : handlePasswordSubmit}>
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {showingEmailCodeStep || showingSecondFactorStep ? 'Verify' : 'Continue'}
              </Text>
            )}
          </Pressable>

          {!showingEmailCodeStep && !showingSecondFactorStep ? (
            <>
              <View className="my-1 flex-row items-center gap-3">
                <View className="h-px flex-1 bg-slate-200" />
                <Text className="text-sm uppercase tracking-[0.2em] text-slate-400">or</Text>
                <View className="h-px flex-1 bg-slate-200" />
              </View>

              <Pressable
                className="min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white"
                disabled={submitting}
                onPress={handleGoogleSignIn}>
                <Text className="text-base font-semibold text-slate-900">Continue with Google</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              className="items-center justify-center rounded-xl border border-slate-300 px-4 py-3"
              disabled={submitting}
              onPress={() => {
                setVerification({ mode: 'password' });
                setCode('');
                setUseBackupCode(false);
                setError(null);
              }}>
              <Text className="text-base font-semibold text-slate-900">Back to password</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
