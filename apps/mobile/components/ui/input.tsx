import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from './utils';

type InputProps = TextInputProps & {
  className?: string;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'min-h-14 rounded-2xl border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
});
