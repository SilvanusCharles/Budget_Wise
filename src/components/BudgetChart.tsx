import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { formatCurrency } from '../constants/currencies';
import { getCardShadow } from '../constants/colors';
import { BudgetBreakdownItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface BudgetChartProps {
  data: BudgetBreakdownItem[];
  chartType: 'pie' | 'bar';
  currencySymbol: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

function PieChart({ data, size }: { data: BudgetBreakdownItem[]; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  let angle = 0;

  return (
    <Svg width={size} height={size}>
      <G>
        {data.map((item) => {
          const sliceAngle = (item.percentage / 100) * 360;
          const path = describeArc(cx, cy, r, angle, angle + sliceAngle);
          angle += sliceAngle;
          return <Path key={item.categoryId} d={path} fill={item.color} />;
        })}
      </G>
    </Svg>
  );
}

function BarChart({
  data,
  width,
  height,
}: {
  data: BudgetBreakdownItem[];
  width: number;
  height: number;
}) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const barWidth = (width - 40) / data.length - 8;
  const chartHeight = height - 40;

  return (
    <Svg width={width} height={height}>
      {data.map((item, index) => {
        const barHeight = (item.amount / maxAmount) * chartHeight;
        const x = 20 + index * (barWidth + 8);
        const y = height - 30 - barHeight;
        return (
          <G key={item.categoryId}>
            <Rect x={x} y={y} width={barWidth} height={barHeight} fill={item.color} rx={4} />
            <SvgText
              x={x + barWidth / 2}
              y={height - 8}
              fontSize={10}
              fill="#6B6560"
              textAnchor="middle"
            >
              {item.name.slice(0, 6)}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

export function BudgetChart({ data, chartType, currencySymbol }: BudgetChartProps) {
  const { colors, isDark } = useTheme();
  const cardShadow = getCardShadow(isDark);
  const { scaled, buttonA11y } = useAccessibility();
  const viewShotRef = useRef<ViewShot>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = 0;
    scale.value = 0.85;
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
  }, [data, chartType, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        Alert.alert('Export failed', 'Could not capture the chart.');
        return;
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Sharing not available', 'Sharing is not supported on this device.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Budget Vibes breakdown',
      });
    } catch {
      Alert.alert('Share failed', 'Something went wrong while sharing.');
    }
  };

  if (data.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          cardShadow,
          { backgroundColor: colors.white, borderColor: colors.border },
        ]}
        accessibilityLabel="No chart data. Enter an amount and select a preset."
      >
        <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}18` }]}>
          <Ionicons name="analytics-outline" size={scaled(28)} color={colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text, fontSize: scaled(15) }]}>
          Your chart awaits
        </Text>
        <Text style={{ color: colors.muted, fontSize: scaled(13), textAlign: 'center', lineHeight: 19 }}>
          Enter an amount and select a preset to see your colorful breakdown.
        </Text>
      </View>
    );
  }

  const chartSummary = data
    .map((d) => `${d.name} ${d.percentage}%`)
    .join(', ');

  return (
    <View>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <Animated.View
          style={[
            styles.chartCard,
            cardShadow,
            animatedStyle,
            { backgroundColor: colors.white, borderColor: colors.border },
          ]}
          accessibilityLabel={`Budget chart showing ${chartSummary}`}
          accessibilityRole="image"
        >
          {chartType === 'pie' ? (
            <PieChart data={data} size={220} />
          ) : (
            <BarChart data={data} width={300} height={200} />
          )}

          <View style={styles.legend}>
            {data.map((item) => (
              <View key={item.categoryId} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendText, { color: colors.text, fontSize: scaled(13) }]}>
                  {item.name}: {formatCurrency(item.amount, currencySymbol)} ({item.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ViewShot>

      <Pressable
        onPress={handleShare}
        style={[styles.shareBtn, { backgroundColor: colors.secondary }]}
        {...buttonA11y('Share chart as image', 'Exports the chart and opens the share sheet')}
      >
        <Text style={{ color: colors.white, fontSize: scaled(15), fontWeight: '600' }}>
          Share chart
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  legend: {
    width: '100%',
    marginTop: 16,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
  },
  shareBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
});
