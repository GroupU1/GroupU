import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabPlaceholderScreenProps = {
  title: string;
};

export function TabPlaceholderScreen({ title }: TabPlaceholderScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-semibold text-foreground">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
