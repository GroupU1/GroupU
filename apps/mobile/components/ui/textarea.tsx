import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from './utils';

type TextareaProps = TextInputProps & {
  className?: string;
};

export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea(
  { className, multiline = true, textAlignVertical = 'top', ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      multiline={multiline}
      textAlignVertical={textAlignVertical}
      className={cn(
        'min-h-32 rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
});
