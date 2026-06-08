import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { VictoryPie, VictoryChart } from 'victory-native';
import { Svg } from 'react-native-svg';
import { BudgetBreakdownItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface AnimatedPieChartProps {
  data: BudgetBreakdownItem[];
  size?: number;
  animationDuration?: number;
}

const chartSize = Dimensions.get('window').width - 40;

export function AnimatedPieChart({
  data,
  size = chartSize,
  animationDuration = 800,
}: AnimatedPieChartProps) {
  const { colors } = useTheme();
  const { currencyRates, profile } = useApp();
  const { scaled } = useAccessibility();
  const currency = currencyRates.find((c) => c.code === profile.currencyCode) ?? currencyRates[0];
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [data, animationDuration, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const chartData = data.map((item) => ({
    x: item.name,
    y: item.percentage,
    color: item.color,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <VictoryChart
          width={size}
          height={size}
          style={{
            parent: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <VictoryPie
            data={chartData}
            innerRadius={size / 6}
            labels={({ datum }) => `${datum.y}%`}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
              labels: {
                fontSize: scaled(10),
                fill: colors.white,
                fontWeight: '600',
              },
            }}
            colorScale={data.map((d) => d.color)}
            cornerRadius={8}
            padAngle={2}
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
                          opacity: 0.8,
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
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={item.categoryId} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: item.color,
                  width: scaled(12),
                  height: scaled(12),
                },
              ]}
            />
            <Text
              style={[
                styles.legendLabel,
                {
                  color: colors.text,
                  fontSize: scaled(13),
                  marginLeft: scaled(8),
                },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.legendAmount,
                {
                  color: colors.primary,
                  fontSize: scaled(13),
                  marginLeft: 'auto',
                  fontWeight: '700',
                },
              ]}
            >
              {currency.symbol}{item.amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    width: '100%',
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  legendColor: {
    borderRadius: 2,
  },
  legendLabel: {
    flex: 1,
    fontWeight: '500',
  },
  legendAmount: {
    fontWeight: '600',
  },
});
