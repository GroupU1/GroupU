import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-2xl font-semibold">Home</Text>
      <Text>Simple Expo Router tabs app.</Text>
    </View>
  );
}
