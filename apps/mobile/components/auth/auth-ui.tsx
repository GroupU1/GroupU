import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, type TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-muted-foreground">
            GroupU
          </Text>
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
      <TextInput
        placeholderTextColor="hsl(0 0% 40%)"
        className="min-h-14 rounded-2xl border border-input bg-background px-4 text-base text-foreground"
        {...props}
      />
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
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-14 items-center justify-center rounded-2xl px-4 ${
        primary ? 'bg-primary' : 'border border-border bg-secondary'
      }`}>
      <Text className={`text-base font-medium ${primary ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
        {loading ? 'Working...' : label}
      </Text>
    </Pressable>
  );
}

export function AuthDivider({ label = 'or continue with' }: { label?: string }) {
  return (
    <View className="flex-row items-center gap-3 py-1">
      <View className="h-px flex-1 bg-border" />
      <Text className="text-xs uppercase tracking-[2px] text-muted-foreground">{label}</Text>
      <View className="h-px flex-1 bg-border" />
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
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="min-h-14 items-center justify-center rounded-2xl border border-border bg-secondary px-4">
      <Text className="text-base font-medium text-secondary-foreground">
        {loading ? 'Working...' : label}
      </Text>
    </Pressable>
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
