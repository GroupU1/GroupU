import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-4">
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText>Your profile screen goes here.</ThemedText>
    </ThemedView>
  );
}
