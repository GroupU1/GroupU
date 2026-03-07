import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

import { cn } from './utils';

const buttonVariants = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border bg-background',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
} as const;

const buttonTextVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive-foreground',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
};

export function Button({
  children,
  variant = 'primary',
  className,
  disabled,
  textClassName,
  ...props
}: ButtonProps) {
  const content =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text
        className={cn(
          'text-base font-medium',
          buttonTextVariants[variant],
          disabled && 'opacity-70',
          textClassName,
        )}>
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <Pressable
      disabled={disabled}
      className={cn(
        'min-h-14 flex-row items-center justify-center rounded-2xl px-4',
        buttonVariants[variant],
        disabled && 'opacity-50',
        className,
      )}
      {...props}>
      {content}
    </Pressable>
  );
}
