import type { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { cn } from './utils';

const badgeVariants = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border bg-background',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
} as const;

const badgeTextVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive-foreground',
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

type BadgeProps = ViewProps & {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
};

export function Badge({
  children,
  variant = 'primary',
  className,
  textClassName,
  ...props
}: BadgeProps) {
  const content =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text
        className={cn(
          'text-xs font-medium tracking-[0.4px]',
          badgeTextVariants[variant],
          textClassName,
        )}>
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <View
      className={cn('self-start rounded-full px-3 py-1.5', badgeVariants[variant], className)}
      {...props}>
      {content}
    </View>
  );
}
