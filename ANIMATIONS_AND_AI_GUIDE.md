# Budget Vibes - Enhanced with Animations and AI

## New Features Added

### 1. Smooth Screen Transitions
- **Fade transitions** between main tabs (Home, Presets, Profile, Settings)
- **Slide-right transitions** in nested navigation (Settings → FAQ)
- Uses React Navigation with custom `cardStyleInterpolator`
- All transitions use Reanimated for smooth 60fps animations

**Location:** `src/navigation/screenTransitions.ts`

### 2. Animated Charts
Two new chart components with Victory Native:

#### AnimatedPieChart
- Fade-in + scale effect when rendering
- Interactive legend showing category percentages
- Donut-style pie chart with padding and rounded corners
- Uses Victory Native for smooth animations
- File: `src/components/AnimatedPieChart.tsx`

**Usage:**
```tsx
import { AnimatedPieChart } from '../components/AnimatedPieChart';

<AnimatedPieChart 
  data={breakdown} 
  size={300}
  animationDuration={800}
/>
```

#### AnimatedBarChart
- Fade-in effect with staggered animation
- Interactive bars with hover/press feedback
- Uses Victory Native bar chart
- File: `src/components/AnimatedBarChart.tsx`

**Usage:**
```tsx
import { AnimatedBarChart } from '../components/AnimatedBarChart';

<AnimatedBarChart 
  data={breakdown}
  width={320}
  height={300}
  animationDuration={800}
/>
```

### 3. Micro-Interactions

#### AnimatedButton
- Multiple animation types: pulse, bounce, fadeIn, zoomIn, slideInUp
- Three variants: primary, secondary, tertiary
- Three sizes: small, medium, large
- Press feedback with scale down effect
- File: `src/components/AnimatedButton.tsx`

**Usage:**
```tsx
import { AnimatedButton } from '../components/AnimatedButton';

<AnimatedButton
  label="Generate Budget"
  onPress={handlePress}
  variant="primary"
  size="large"
  animationType="bounce"
  icon={<Ionicons name="sparkles" size={20} color="white" />}
/>
```

#### AnimatedCard
- Fade-in animation with optional slide and scale effects
- Animation types: fadeIn, slideUp, slideDown, slideLeft, slideRight, scaleIn
- Customizable delay and duration
- File: `src/components/AnimatedCard.tsx`

**Usage:**
```tsx
import { AnimatedCard } from '../components/AnimatedCard';

<AnimatedCard animationType="slideUp" delay={100}>
  {/* Card content */}
</AnimatedCard>
```

#### SuccessAnimationModal
- Lottie animation for success feedback
- Fallback icon if animation file is not available
- Auto-dismisses after 2.5 seconds
- File: `src/components/SuccessAnimationModal.tsx`

**Usage:**
```tsx
import { SuccessAnimationModal } from '../components/SuccessAnimationModal';

const [showSuccess, setShowSuccess] = useState(false);

<SuccessAnimationModal
  visible={showSuccess}
  title="Budget Created!"
  message="Your budget preset is ready"
  onDismiss={() => setShowSuccess(false)}
  autoCloseDuration={2500}
/>
```

### 4. AI Budget Scaffolding

#### AIBudgetScaffoldingService
- Generates personalized budget presets from user profile
- Supports OpenAI and Anthropic Claude APIs
- Offline-first: falls back to default presets if API fails or offline
- File: `src/services/ai.ts`

**Features:**
- Accepts user income, lifestyle, goals, dependents, currency
- Returns categories with percentages and descriptions
- Validates percentage sums (must equal 100%)
- Automatic fallback to default presets

**Usage:**
```tsx
import { aiBudgetService } from '../services/ai';

// Configure API key
aiBudgetService.setOpenAIKey('sk-...');
// OR
aiBudgetService.setClaudeKey('sk-ant-...');

// Generate preset
const preset = await aiBudgetService.generateBudgetPreset(userProfile, isOnline);

// Test connection
const isConnected = await aiBudgetService.testOpenAIConnection();
```

#### useAIBudgetGenerator Hook
- React hook for managing AI preset generation
- Handles loading states, errors, and offline fallback
- File: `src/hooks/useAIBudgetGenerator.ts`

**Usage:**
```tsx
import { useAIBudgetGenerator, useAIConfiguration } from '../hooks/useAIBudgetGenerator';

function MyComponent() {
  const { 
    isLoading, 
    error, 
    generatedPreset, 
    generatePreset,
    clearError 
  } = useAIBudgetGenerator();

  const { configureOpenAI } = useAIConfiguration();

  const handleGenerateBudget = async () => {
    await generatePreset(userProfile);
  };

  return (
    <>
      {error && <Text>{error}</Text>}
      {isLoading && <ActivityIndicator />}
      {generatedPreset && <Text>{generatedPreset.name}</Text>}
    </>
  );
}
```

### 5. Dependencies Added

```json
{
  "lottie-react-native": "~6.4.0",
  "react-native-animatable": "^1.4.1",
  "victory-native": "^36.6.8"
}
```

### 6. Color Palette (Already Configured)

```
Primary: #7286A0 (Slate Blue)
Secondary: #7D6F86 (Mauve)
Background: #FFF4E9 (Cream)
Accent: #F9564F (Red)
Text: #0A0908 (Almost Black)
```

## Integration Examples

### Add Animated Chart to HomeScreen

Update `src/screens/HomeScreen.tsx`:

```tsx
import { AnimatedPieChart } from '../components/AnimatedPieChart';

// In the render method, replace BudgetChart with:
{breakdown.length > 0 && (
  <AnimatedCard animationType="fadeIn" delay={200}>
    <AnimatedPieChart
      data={breakdown}
      animationDuration={800}
    />
  </AnimatedCard>
)}
```

### Add AI Suggestion Button to PresetsScreen

```tsx
import { useAIBudgetGenerator } from '../hooks/useAIBudgetGenerator';
import { AnimatedButton } from '../components/AnimatedButton';

function PresetsScreen() {
  const { profile } = useApp();
  const { 
    isLoading, 
    generatePreset, 
    generatedPreset 
  } = useAIBudgetGenerator();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAISuggestion = async () => {
    await generatePreset(profile);
    setShowSuccess(true);
  };

  return (
    <>
      <AnimatedButton
        label={isLoading ? "Generating..." : "AI Suggestion"}
        onPress={handleAISuggestion}
        disabled={isLoading}
        animationType="bounce"
        variant="primary"
      />
      
      <SuccessAnimationModal
        visible={showSuccess && !!generatedPreset}
        title="AI Generated Budget"
        message={generatedPreset?.name}
        onDismiss={() => setShowSuccess(false)}
      />
    </>
  );
}
```

### Setup API Keys (in Settings or Profile Screen)

```tsx
import { useAIConfiguration } from '../hooks/useAIBudgetGenerator';

function SettingsScreen() {
  const [openaiKey, setOpenaiKey] = useState('');
  const { configureOpenAI, testOpenAIConnection } = useAIConfiguration();

  const handleSaveKey = async () => {
    configureOpenAI(openaiKey);
    const isConnected = await testOpenAIConnection();
    if (isConnected) {
      // Show success message
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter OpenAI API Key"
        value={openaiKey}
        onChangeText={setOpenaiKey}
        secureTextEntry
      />
      <AnimatedButton
        label="Save & Test"
        onPress={handleSaveKey}
        variant="primary"
      />
    </View>
  );
}
```

## Installation

After adding the dependencies in `package.json`, run:

```bash
npm install
# or
yarn install
```

Then restart the app:

```bash
expo start
```

## Offline-First Design

The app maintains full offline functionality:

1. **Animated Charts** - Work completely offline
2. **Screen Transitions** - All animations are local, work offline
3. **Micro-interactions** - All local animations
4. **AI Scaffolding** - Falls back to default presets when:
   - No internet connection
   - API keys not configured
   - API request fails
   - API response parsing fails

## API Configuration

### OpenAI

1. Get API key from https://platform.openai.com/api-keys
2. Configure in app:
   ```tsx
   aiBudgetService.setOpenAIKey('sk-...');
   ```

**Model:** gpt-3.5-turbo (cost-effective)

### Anthropic Claude

1. Get API key from https://console.anthropic.com/
2. Configure in app:
   ```tsx
   aiBudgetService.setClaudeKey('sk-ant-...');
   ```

**Model:** claude-3-haiku-20240307 (fastest, cheapest)

## Best Practices

1. **Never hardcode API keys** - Store securely or use environment variables
2. **Check connectivity** before making API calls
3. **Always provide fallbacks** for failed AI requests
4. **Test animations** on actual devices (emulator animations can differ)
5. **Use appropriate animation durations** (200-800ms recommended)
6. **Batch multiple animations** to prevent performance issues

## Troubleshooting

### Animations not smooth?
- Check React Native version compatibility
- Disable reanimated worklets if having issues
- Test on actual device (emulators can be slow)

### Lottie animation not showing?
- Check that `assets/success-animation.json` exists
- Verify file permissions
- Component has fallback icon, so UI won't break

### AI request failing?
- Check API key is valid and not expired
- Verify internet connection
- Check API rate limits
- Review error message in console logs

### Victory charts not rendering?
- Ensure `victory-native` is installed
- Import from `victory-native` not `victory`
- Check data format matches chart requirements

## Performance Considerations

- Animated charts re-render on data change
- Reanimated handles GPU acceleration automatically
- Lottie animations are self-contained
- React Navigation transitions are optimized
- Consider memoization for heavy computations

## Future Enhancements

1. Add more animation presets
2. Create custom Lottie animations
3. Add voice-based budget suggestions
4. Implement budget comparison analytics
5. Add gesture-based interactions
6. Create animation preferences in settings
