import React, { useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type DraggableTabCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bottomOffset?: number;
  minHeight?: number;
  midHeight?: number;
  maxHeight?: number;
};

export function DraggableTabCard({
  children,
  style,
  bottomOffset = 88,
  minHeight = 132,
  midHeight = 360,
  maxHeight,
}: DraggableTabCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const { height: windowHeight } = useWindowDimensions();

  const resolvedMaxHeight = useMemo(() => {
    const safeMax = Math.max(minHeight + 80, windowHeight * 0.84);
    return maxHeight ? Math.max(maxHeight, minHeight + 80) : safeMax;
  }, [maxHeight, minHeight, windowHeight]);

  const resolvedMidHeight = Math.min(
    Math.max(midHeight, minHeight),
    resolvedMaxHeight,
  );

  const minPosition = resolvedMaxHeight - minHeight;
  const midPosition = resolvedMaxHeight - resolvedMidHeight;
  const maxPosition = 0;

  const initialPosition = minPosition;
  const translateY = useRef(new Animated.Value(initialPosition)).current;
  const offsetRef = useRef(initialPosition);

  const animateTo = (position: number) => {
    offsetRef.current = position;
    Animated.spring(translateY, {
      toValue: position,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((currentValue) => {
          offsetRef.current = currentValue;
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        const next = Math.min(
          minPosition,
          Math.max(maxPosition, offsetRef.current + gestureState.dy),
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const releasedAt = Math.min(
          minPosition,
          Math.max(maxPosition, offsetRef.current + gestureState.dy),
        );

        const snapPoints = [maxPosition, midPosition, minPosition];
        let nearest = snapPoints[0];

        for (const point of snapPoints) {
          if (Math.abs(releasedAt - point) < Math.abs(releasedAt - nearest)) {
            nearest = point;
          }
        }

        if (gestureState.vy < -0.6) {
          nearest = Math.max(
            maxPosition,
            nearest - (minPosition - midPosition),
          );
        } else if (gestureState.vy > 0.6) {
          nearest = Math.min(
            minPosition,
            nearest + (minPosition - midPosition),
          );
        }

        animateTo(nearest);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          height: resolvedMaxHeight,
          bottom: bottomOffset,
          backgroundColor: Colors[colorScheme].background,
          borderColor: Colors[colorScheme].icon,
          shadowColor: Colors[colorScheme].text,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <Animated.View style={styles.handleArea} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.handle,
            {
              backgroundColor: Colors[colorScheme].icon,
            },
          ]}
        />
      </Animated.View>
      <Animated.View style={styles.content}>{children}</Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 50,
    elevation: 12,
    shadowOpacity: Platform.OS === "ios" ? 0.16 : 0,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  handleArea: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
