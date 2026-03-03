import { DraggableTabCard } from "@/components/ui/draggable-tab-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function DmsScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <DraggableTabCard>
        <ThemedText type="title">DMs</ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Drag this card up and down from the handle.
        </ThemedText>
        <ThemedText style={{ marginTop: 16 }} type="subtitle">
          Recent conversations
        </ThemedText>
        <ThemedText style={{ marginTop: 10 }}>• Alex</ThemedText>
        <ThemedText style={{ marginTop: 10 }}>• Sam</ThemedText>
        <ThemedText style={{ marginTop: 10 }}>• Taylor</ThemedText>
      </DraggableTabCard>
    </ThemedView>
  );
}
