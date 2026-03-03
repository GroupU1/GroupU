import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PlansScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-4">
      <ThemedText type="title">Plans</ThemedText>
      <ThemedText>Your plans screen goes here.</ThemedText>
    </ThemedView>
  );
}
