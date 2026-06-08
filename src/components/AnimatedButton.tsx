import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

type AnimationType = 'pulse' | 'bounce' | 'fadeIn' | 'zoomIn' | 'slideInUp';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  animationType?: AnimationType;
  icon?: React.ReactNode;
  testID?: string;
}

export function AnimatedButton({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  animationType = 'pulse',
  icon,
  testID,
}: AnimatedButtonProps) {
  const { colors } = useTheme();
  const { scaled } = useAccessibility();
  const buttonRef = useRef<Animatable.View>(null);
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'tertiary':
        return `${colors.primary}15`;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'tertiary') return colors.primary;
    return colors.white;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: scaled(8), paddingHorizontal: scaled(16) };
      case 'large':
        return { paddingVertical: scaled(16), paddingHorizontal: scaled(32) };
      default:
        return { paddingVertical: scaled(12), paddingHorizontal: scaled(24) };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return scaled(12);
      case 'large':
        return scaled(18);
      default:
        return scaled(16);
    }
  };

  const handlePress = () => {
    if (disabled) return;

    // Trigger animation
    if (buttonRef.current && animationType) {
      buttonRef.current.animate({
        0: { scale: 1 },
        0.5: { scale: 0.95 },
        1: { scale: 1 },
      });
    }

    onPress();
  };

  return (
    <Animatable.View
      ref={buttonRef}
      animation={animationType}
      duration={300}
      iterationCount={1}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled}
        testID={testID}
        style={({ pressed }) => [
          styles.button,
          getPadding(),
          {
            backgroundColor: getBackgroundColor(),
            opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: '600',
              },
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
  },
});
