import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Photo'>;

export function OnboardingPhotoScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setAvatarUri } = useOnboarding();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <OnboardingShell
      step={7}
      totalSteps={7}
      title="Add a profile photo"
      subtitle="Optional — you can skip and add one later."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: false })}
      onNext={() => navigation.navigate('Success', { skipped: false })}
      nextLabel="Finish setup"
    >
      <Pressable
        onPress={pickImage}
        style={[styles.avatarBtn, { borderColor: colors.primary }]}
        {...buttonA11y('Upload profile photo')}
      >
        {draft.avatarUri ? (
          <Image source={{ uri: draft.avatarUri }} style={styles.avatar} accessibilityIgnoresInvertColors />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: `${colors.primary}18` }]}>
            <Ionicons name="camera-outline" size={scaled(36)} color={colors.primary} />
          </View>
        )}
      </Pressable>

      <Text style={[styles.hint, { color: colors.muted, fontSize: scaled(14) }]}>
        Tap to choose from your photo library
      </Text>

      {draft.avatarUri ? (
        <Pressable onPress={() => setAvatarUri(null)} {...buttonA11y('Remove photo')}>
          <Text style={{ color: colors.accent, fontSize: scaled(14), fontWeight: '600', marginTop: 12 }}>
            Remove photo
          </Text>
        </Pressable>
      ) : null}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  avatarBtn: {
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 60,
    padding: 4,
    marginBottom: 12,
  },
  avatar: { width: 112, height: 112, borderRadius: 56 },
  placeholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { textAlign: 'center' },
});
