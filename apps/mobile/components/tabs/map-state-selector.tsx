import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, HatGlasses, UsersRound } from 'lucide-react-native';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSemanticTheme } from '../../lib/theme';

type MapState = 'global' | 'group' | 'incognito';

const BUTTON_SIZE = 48;
const BUTTON_GAP = 8;
const OPTION_COUNT = 3;
const EXPANDED_HEIGHT = BUTTON_SIZE * OPTION_COUNT + BUTTON_GAP * (OPTION_COUNT - 1);

const STATE_OPTIONS = [
  {
    value: 'global' as const,
    accessibilityLabel: 'Global',
    Icon: Globe,
  },
  {
    value: 'group' as const,
    accessibilityLabel: 'Group',
    Icon: UsersRound,
  },
  {
    value: 'incognito' as const,
    accessibilityLabel: 'Incognito',
    Icon: HatGlasses,
  },
] satisfies Array<{
  value: MapState;
  accessibilityLabel: string;
  Icon: typeof Globe;
}>;

export function MapStateSelector() {
  const insets = useSafeAreaInsets();
  const { colors } = useSemanticTheme();
  const [currentState, setCurrentState] = useState<MapState>('global');
  const [isOpen, setIsOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isOpen, progress]);

  const activeOption = STATE_OPTIONS.find((option) => option.value === currentState) ?? STATE_OPTIONS[0];
  const inactiveOptions = STATE_OPTIONS.filter((option) => option.value !== currentState);
  const orderedOptions = useMemo(
    () => [activeOption, ...inactiveOptions],
    [activeOption, inactiveOptions],
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {isOpen ? <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} /> : null}
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            height: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [BUTTON_SIZE, EXPANDED_HEIGHT],
            }),
            right: 16,
            top: insets.top + 8,
          },
        ]}>
        {orderedOptions.map(({ accessibilityLabel, Icon, value }, index) => {
          const animatedChildStyle =
            index === 0
              ? undefined
              : {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.35, 1],
                    outputRange: [0, 0, 1],
                  }),
                  transform: [
                    {
                      translateY: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                };

          return (
            <Animated.View
              key={value}
              style={[
                styles.optionWrapper,
                index > 0 ? { marginTop: BUTTON_GAP } : null,
                animatedChildStyle,
              ]}>
              <Pressable
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                onPress={() => {
                  if (index === 0) {
                    setIsOpen((open) => !open);
                    return;
                  }

                  if (value !== currentState) {
                    setCurrentState(value);
                  }
                  setIsOpen(false);
                }}
                style={styles.optionPressable}>
                <Icon absoluteStrokeWidth color={colors.foreground} size={22} strokeWidth={2.2} />
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    borderWidth: 1,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  optionWrapper: {
    height: BUTTON_SIZE,
  },
  optionPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
