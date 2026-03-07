import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, type TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

type AuthInputProps = TextInputProps & {
  label: string;
};

type AuthFooterLinkProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

type AuthNoticeProps = {
  message: string;
  tone?: 'error' | 'info';
};

export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled">
        <View className="rounded-3xl border border-border bg-card p-6">
          <Badge
            variant="outline"
            className="mb-3"
            textClassName="font-semibold uppercase tracking-[2px] text-muted-foreground">
            GroupU
          </Badge>
          <Text className="text-3xl font-semibold text-card-foreground">{title}</Text>
          <Text className="mt-2 text-base leading-6 text-muted-foreground">{subtitle}</Text>
          <View className="mt-8 gap-4">{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Input {...props} />
    </View>
  );
}

export function AuthButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: AuthButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      variant={variant === 'primary' ? 'primary' : 'secondary'}>
      {loading ? 'Working...' : label}
    </Button>
  );
}

export function AuthDivider({ label = 'or continue with' }: { label?: string }) {
  return (
    <View className="flex-row items-center gap-3 py-1">
      <Separator className="flex-1" />
      <Text className="text-xs uppercase tracking-[2px] text-muted-foreground">{label}</Text>
      <Separator className="flex-1" />
    </View>
  );
}

export function AuthSocialButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: AuthButtonProps) {
  return (
    <Button onPress={onPress} disabled={disabled || loading} variant="outline">
      {loading ? 'Working...' : label}
    </Button>
  );
}

export function AuthTextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="self-start">
      <Text className="text-sm font-medium text-primary">{label}</Text>
    </Pressable>
  );
}

export function AuthFooterLink({ prompt, actionLabel, onPress }: AuthFooterLinkProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 pt-1">
      <Text className="text-sm text-muted-foreground">{prompt}</Text>
      <Pressable onPress={onPress}>
        <Text className="text-sm font-medium text-primary">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

export function AuthNotice({ message, tone = 'error' }: AuthNoticeProps) {
  const containerClassName =
    tone === 'error' ? 'border-destructive bg-destructive' : 'border-border bg-muted';
  const textClassName = tone === 'error' ? 'text-destructive-foreground' : 'text-muted-foreground';

  return (
    <View className={`rounded-2xl border px-4 py-3 ${containerClassName}`}>
      <Text className={`text-sm leading-5 ${textClassName}`}>{message}</Text>
    </View>
  );
}

export function AuthLoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-base text-muted-foreground">Loading...</Text>
    </SafeAreaView>
  );
}
