import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-4">
      <ThemedText type="title">Home</ThemedText>
      <ThemedText>Your home screen goes here.</ThemedText>
    </ThemedView>
  );
}
