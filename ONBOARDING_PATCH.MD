#### AI features left to add to this 

Enhance the "Budget Vibes" React Native (Expo) app with a multi-step onboarding flow.

Requirements:
- Onboarding flow should run before the main app screens (Home, Presets, Profile, Settings).
- Use React Navigation stack for onboarding screens.
- Collect user details via a quick survey:
  - Income range (slider or dropdown)
  - Lifestyle (student, professional, family, retiree)
  - Savings goal (short-term, long-term, emergency fund)
  - Family size / dependents (numeric input)
  - Currency preference (dropdown: USD, EUR, NGN, etc.)
  - Optional profile picture upload from device
- Store all onboarding data in AsyncStorage for offline-first use.
- Provide "Skip" option to bypass onboarding and load default presets.
- After completion, show a Lottie animation with success feedback ("You're all set!").
- Automatically navigate user to the Home screen after onboarding.
- Ensure onboarding only runs once unless user resets app data.
- Apply the app’s color palette:
  - Primary: #7286A0
  - Secondary: #7D6F86
  - Background: #FFF4E9
  - Accent: #F9564F
  - Text: #0A0908
####