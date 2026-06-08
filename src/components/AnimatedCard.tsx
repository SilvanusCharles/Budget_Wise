import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn';
  delay?: number;
  duration?: number;
}

export function AnimatedCard({
  children,
  style,
  animationType = 'fadeIn',
  delay = 0,
  duration = 600,
}: AnimatedCardProps) {
  const { colors, isDark } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // Reset values based on animation type
    if (animationType === 'slideUp') {
      translateY.value = 30;
    } else if (animationType === 'slideDown') {
      translateY.value = -30;
    } else if (animationType === 'slideLeft') {
      translateX.value = 30;
    } else if (animationType === 'slideRight') {
      translateX.value = -30;
    } else if (animationType === 'scaleIn') {
      scale.value = 0.8;
    }

    // Animate in
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (delay + duration), 1);

      if (progress >= delay / (delay + duration)) {
        const animProgress = (progress - delay / (delay + duration)) / (duration / (delay + duration));

        opacity.value = withTiming(1, { duration: 1 });
        translateY.value = withTiming(0, { duration: 1 });
        translateX.value = withTiming(0, { duration: 1 });
        scale.value = withTiming(1, { duration: 1 });
      }

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [animationType, delay, duration, opacity, translateY, translateX, scale]);

  // Simplified version using immediate animation
  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });

      switch (animationType) {
        case 'slideUp':
        case 'slideDown':
          translateY.value = withTiming(0, {
            duration,
            easing: Easing.out(Easing.cubic),
          });
          break;
        case 'slideLeft':
        case 'slideRight':
          translateX.value = withTiming(0, {
            duration,
            easing: Easing.out(Easing.cubic),
          });
          break;
        case 'scaleIn':
          scale.value = withTiming(1, {
            duration,
            easing: Easing.out(Easing.cubic),
          });
          break;
        default:
          // fadeIn - opacity already animated above
          break;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animationType, delay, duration, opacity, translateY, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const cardShadow = {
    shadowColor: isDark ? '#000000' : '#7286A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.35 : 0.14,
    shadowRadius: 14,
    elevation: 5,
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.white,
          ...cardShadow,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
});
