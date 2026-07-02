export type RootTabParamList = {
  Home: undefined;
  Presets: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  FAQ: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Income: undefined;
  Lifestyle: undefined;
  Savings: undefined;
  Family: undefined;
  Currency: undefined;
  Photo: undefined;
  Success: { skipped?: boolean };
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};
