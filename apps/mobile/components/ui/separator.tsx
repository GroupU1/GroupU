import { View, type ViewProps } from 'react-native';

import { cn } from './utils';

type SeparatorProps = ViewProps & {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export function Separator({
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) {
  return (
    <View
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}
