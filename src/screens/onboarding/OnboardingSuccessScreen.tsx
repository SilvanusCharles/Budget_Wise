import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Route = RouteProp<OnboardingStackParamList, 'Success'>;

export function OnboardingSuccessScreen() {
  const route = useRoute<Route>();
  const { finishOnboarding } = useApp();
  const { draft, resetDraft } = useOnboarding();
  const { colors } = useTheme();
  const { scaled } = useAccessibility();
  const animationRef = useRef<LottieView>(null);
  const [showFallback, setShowFallback] = useState(false);
  const finishedRef = useRef(false);

  const skipped = route.params?.skipped ?? false;

  useEffect(() => {
    if (finishedRef.current) return;

    const timer = setTimeout(async () => {
      finishedRef.current = true;
      await finishOnboarding(draft, skipped);
      resetDraft();
    }, 2400);

    return () => clearTimeout(timer);
  }, [draft, finishOnboarding, resetDraft, skipped]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <View style={styles.animationWrap}>
          {showFallback ? (
            <View style={[styles.fallback, { backgroundColor: `${colors.accent}18` }]}>
              <Ionicons name="checkmark-circle" size={scaled(72)} color={colors.accent} />
            </View>
          ) : (
            <LottieView
              ref={animationRef}
              source={require('../../../assets/success-animation.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          )}
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: scaled(26) }]}>
          You're all set!
        </Text>
        <Text style={[styles.message, { color: colors.muted, fontSize: scaled(15) }]}>
          {skipped
            ? 'Welcome aboard — default presets are ready for you.'
            : 'Your preferences are saved locally. Time to plan your budget.'}
        </Text>

        <Text style={[styles.redirect, { color: colors.primary, fontSize: scaled(13) }]}>
          Taking you to Home…
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  animationWrap: {
    width: 160,
    height: 160,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: { width: '100%', height: '100%' },
  fallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  message: { textAlign: 'center', lineHeight: 22 },
  redirect: { marginTop: 20, fontWeight: '600' },
});
