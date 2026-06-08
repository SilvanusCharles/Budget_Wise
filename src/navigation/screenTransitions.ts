import { TransitionSpec, StackNavigationOptions } from '@react-navigation/native-stack';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/**
 * Fade transition animation
 */
export const fadeTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 400,
    useNativeDriver: true,
  },
};

/**
 * Slide from right transition animation
 */
export const slideRightTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 500,
    useNativeDriver: true,
  },
};

/**
 * Slide from bottom transition animation
 */
export const slideBottomTransition: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 500,
    useNativeDriver: true,
  },
};

/**
 * Fade screen options
 */
export function getFadeScreenOptions(): StackNavigationOptions {
  return {
    gestureEnabled: true,
    transitionSpec: {
      open: fadeTransition,
      close: fadeTransition,
    },
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
        },
      };
    },
  };
}

/**
 * Slide from right screen options
 */
export function getSlideRightScreenOptions(): StackNavigationOptions {
  return {
    gestureEnabled: true,
    transitionSpec: {
      open: slideRightTransition,
      close: slideRightTransition,
    },
    cardStyleInterpolator: ({ current, next, layouts }) => {
      const progress = Animated.add(current.progress, next ? next.progress : 0);

      return {
        cardStyle: {
          transform: [
            {
              translateX: interpolate(
                progress,
                [0, 1, 2],
                [layouts.screen.width, 0, -layouts.screen.width],
                Extrapolate.CLAMP,
              ),
            },
          ],
        },
        overlayStyle: {
          opacity: interpolate(progress, [0, 1, 2], [0, 0.3, 0.7], Extrapolate.CLAMP),
        },
      };
    },
  };
}

/**
 * Slide from bottom screen options
 */
export function getSlideBottomScreenOptions(): StackNavigationOptions {
  return {
    gestureEnabled: true,
    gestureDirection: 'vertical',
    transitionSpec: {
      open: slideBottomTransition,
      close: slideBottomTransition,
    },
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: interpolate(
                current.progress,
                [0, 1],
                [layouts.screen.height, 0],
                Extrapolate.CLAMP,
              ),
            },
          ],
        },
      };
    },
  };
}

/**
 * Scale and fade transition (for modals/overlays)
 */
export function getScaleModalOptions(): StackNavigationOptions {
  return {
    gestureEnabled: false,
    transitionSpec: {
      open: fadeTransition,
      close: fadeTransition,
    },
    cardStyleInterpolator: ({ current }) => {
      const scale = Animated.interpolate(current.progress, [0, 0.5, 1], [0.8, 0.9, 1]);
      const opacity = current.progress;

      return {
        cardStyle: {
          opacity,
          transform: [{ scale }],
        },
      };
    },
  };
}
