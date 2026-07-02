import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export function getFadeScreenOptions(): NativeStackNavigationOptions {
  return {
    gestureEnabled: true,
    animation: 'fade',
  };
}

export function getSlideRightScreenOptions(): NativeStackNavigationOptions {
  return {
    gestureEnabled: true,
    animation: 'slide_from_right',
  };
}

export function getSlideBottomScreenOptions(): NativeStackNavigationOptions {
  return {
    gestureEnabled: true,
    gestureDirection: 'vertical',
    animation: 'slide_from_bottom',
  };
}

export function getScaleModalOptions(): NativeStackNavigationOptions {
  return {
    gestureEnabled: false,
    animation: 'fade',
  };
}
