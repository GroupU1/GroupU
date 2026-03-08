import { Plus } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapStateSelector } from './map-state-selector';
import { Button } from '../ui/button';
import { useSemanticTheme } from '../../lib/theme';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useSemanticTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-semibold text-foreground">Map</Text>
      </View>
      <MapStateSelector />
      <Button
        variant='outline'
        accessibilityLabel="Create"
        className="absolute right-4 h-16 w-16 rounded-full px-0"
        style={{
          bottom: insets.bottom + 62,
          elevation: 4,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        }}
        >
        <Plus color={colors.foreground} size={24} strokeWidth={2.4} absoluteStrokeWidth />
      </Button>
    </SafeAreaView>
  );
}
