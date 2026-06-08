import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { VictoryChart, VictoryBar } from 'victory-native';
import { BudgetBreakdownItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface AnimatedBarChartProps {
  data: BudgetBreakdownItem[];
  width?: number;
  height?: number;
  animationDuration?: number;
}

const chartWidth = Dimensions.get('window').width - 40;

export function AnimatedBarChart({
  data,
  width = chartWidth,
  height = 300,
  animationDuration = 800,
}: AnimatedBarChartProps) {
  const { colors, isDark } = useTheme();
  const { currencyRates, profile } = useApp();
  const { scaled } = useAccessibility();
  const currency = currencyRates.find((c) => c.code === profile.currencyCode) ?? currencyRates[0];
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [data, animationDuration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const chartData = data.map((item) => ({
    x: item.name.slice(0, 6),
    y: item.amount,
    label: `${currency.symbol}${Math.round(item.amount).toLocaleString('en-US')}`,
    color: item.color,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <VictoryChart
        width={width}
        height={height}
        style={{
          parent: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <VictoryBar
          data={chartData}
          labels={({ datum }) => datum.label}
          style={{
            data: {
              fill: ({ datum }) => datum.color,
              stroke: ({ datum }) => datum.color,
              strokeWidth: 1,
            },
            labels: {
              fontSize: scaled(10),
              fill: colors.text,
              fontWeight: '600',
            },
          }}
          cornerRadius={6}
          animate={{
            duration: animationDuration,
            easing: 'cubicInOut',
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => [
                  {
                    target: 'data',
                    mutation: () => ({
                      style: {
                        opacity: 0.7,
                      },
                    }),
                  },
                ],
                onPressOut: () => [
                  {
                    target: 'data',
                    mutation: () => null,
                  },
                ],
              },
            },
          ]}
        />
      </VictoryChart>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
