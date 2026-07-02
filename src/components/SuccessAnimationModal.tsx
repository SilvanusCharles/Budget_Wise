import React, { useRef, useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface SuccessAnimationModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onDismiss: () => void;
  autoCloseDuration?: number;
}

export function SuccessAnimationModal({
  visible,
  title = 'Success!',
  message = 'Your budget has been created.',
  onDismiss,
  autoCloseDuration = 2500,
}: SuccessAnimationModalProps) {
  const { colors } = useTheme();
  const { scaled } = useAccessibility();
  const animationRef = useRef<LottieView>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowFallback(false);
      // Auto close after animation completes
      const timer = setTimeout(() => {
        onDismiss();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [visible, autoCloseDuration, onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={[styles.backdrop, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.container, { backgroundColor: colors.white }]}>
          <View style={styles.animationContainer}>
            {showFallback ? (
              // Fallback icon if Lottie fails
              <View
                style={[
                  styles.fallbackIcon,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={scaled(64)}
                  color={colors.primary}
                />
              </View>
            ) : (
              <LottieView
                ref={animationRef}
                source={require('../../assets/success-animation.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
                onAnimationFinish={() => {
                  // Animation finished, ready to auto-close
                }}
              />
            )}
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: scaled(20),
              },
            ]}
          >
            {title}
          </Text>

          {message && (
            <Text
              style={[
                styles.message,
                {
                  color: colors.muted,
                  fontSize: scaled(14),
                },
              ]}
            >
              {message}
            </Text>
          )}

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onDismiss}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.white,
                  fontSize: scaled(16),
                },
              ]}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  animationContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
});
