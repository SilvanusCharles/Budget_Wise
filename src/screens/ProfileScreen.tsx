import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { AnimatedCard } from '../components/AnimatedCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

export function ProfileScreen() {
  const { profile, currencyRates, setProfile } = useApp();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currencyCode, setCurrencyCode] = useState(profile.currencyCode);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);

  const hasChanges =
    name !== profile.name ||
    email !== profile.email ||
    currencyCode !== profile.currencyCode ||
    avatarUri !== profile.avatarUri;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to set a profile picture.');
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

  const handleSave = async () => {
    await setProfile({ name, email, avatarUri, currencyCode });
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  return (
    <ScreenContainer>
      <Text style={[styles.heading, { color: colors.text, fontSize: scaled(22) }]}>
        Profile
      </Text>

      {/* Avatar Section with Background */}
      <AnimatedCard animationType="fadeIn" delay={0}>
        <View style={[styles.avatarSection, { backgroundColor: `${colors.primary}08` }]}>
          <Pressable
            onPress={pickImage}
            style={[styles.avatarWrap, { borderColor: colors.primary }]}
            {...buttonA11y('Change profile picture', 'Opens photo library')}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} accessibilityIgnoresInvertColors />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase() || '?'}</Text>
              </View>
            )}
          </Pressable>
          <Text style={[styles.changePhoto, { color: colors.primary, fontSize: scaled(13) }]}>
            Tap to change photo
          </Text>
          <Text style={[styles.emailPreview, { color: colors.muted, fontSize: scaled(12) }]}>
            {email || 'No email set'}
          </Text>
        </View>
      </AnimatedCard>

      {/* Form Section */}
      <AnimatedCard animationType="slideUp" delay={100}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaled(15) }]}>
          Personal Information
        </Text>

        <Text style={[styles.label, { color: colors.text, fontSize: scaled(14) }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.white },
          ]}
          accessibilityLabel="Name"
        />

        <Text style={[styles.label, { color: colors.text, fontSize: scaled(14) }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.white },
          ]}
          accessibilityLabel="Email"
        />
      </AnimatedCard>

      {/* Currency Section */}
      <AnimatedCard animationType="slideUp" delay={200}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaled(15) }]}>
          <Ionicons name="cash-outline" size={16} color={colors.primary} /> Currency
        </Text>
        <View
          style={styles.currencyGrid}
          accessibilityRole="radiogroup"
          accessibilityLabel="Select currency"
        >
          {currencyRates.map((currency) => {
            const selected = currency.code === currencyCode;
            return (
              <Pressable
                key={currency.code}
                onPress={() => setCurrencyCode(currency.code)}
                style={[
                  styles.currencyChip,
                  {
                    borderColor: selected ? colors.accent : colors.border,
                    backgroundColor: selected ? `${colors.primary}12` : 'transparent',
                  },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${currency.name}, ${currency.symbol}`}
              >
                <Text style={{ color: colors.text, fontSize: scaled(14), fontWeight: '600' }}>
                  {currency.code}
                </Text>
                <Text style={{ color: colors.muted, fontSize: scaled(11) }}>{currency.symbol}</Text>
              </Pressable>
            );
          })}
        </View>
      </AnimatedCard>

      {hasChanges && (
        <AnimatedCard animationType="slideUp" delay={300}>
          <AnimatedButton
            label="Save changes"
            onPress={handleSave}
            variant="primary"
            size="large"
            animationType="bounce"
          />
        </AnimatedCard>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderRadius: 60,
    padding: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  changePhoto: {
    fontWeight: '600',
    marginBottom: 8,
  },
  emailPreview: {
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
    marginBottom: 24,
  },
  currencyChip: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 72,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
