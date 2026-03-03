import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-2xl font-semibold">Settings</Text>
      <Text>Add your settings here.</Text>
    </View>
  );
}
