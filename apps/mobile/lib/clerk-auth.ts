import { useEffect } from 'react';

import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

type ClerkFieldError = {
  longMessage?: string;
  message?: string;
};

type ClerkErrorShape = {
  errors?: ClerkFieldError[];
  message?: string;
};

type SetActiveLike = (params: { session: string }) => Promise<void>;

type RouterLike = {
  replace: (href: '/(tabs)/map') => void;
};

export function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export function formatClerkError(error: unknown, fallback: string) {
  const clerkError = error as ClerkErrorShape | undefined;
  const firstMessage = clerkError?.errors?.[0]?.longMessage ?? clerkError?.errors?.[0]?.message;

  if (firstMessage) {
    return firstMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof clerkError?.message === 'string' && clerkError.message.length > 0) {
    return clerkError.message;
  }

  return fallback;
}

export function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function activateSession(
  sessionId: string | null | undefined,
  setActive: SetActiveLike,
  router: RouterLike,
) {
  if (!sessionId) {
    return false;
  }

  await setActive({ session: sessionId });
  router.replace('/(tabs)/map');
  return true;
}
