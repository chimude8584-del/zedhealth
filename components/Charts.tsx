import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Path, Circle, G, Text as SvgText } from 'react-native-svg';

const CHART_WIDTH = Dimensions.get('window').width - 32;
const CHART_HEIGHT = 180;
const PADDING = { top: 20, right: 12, bottom: 30, left: 40 };

interface Point {
  date?: string;
  label?: string;
  value: number;
  [key: string]: any;
}

export const LineChart: React.FC<{
  data: Point[];
  yKey?: string;
  color?: string;
  maxY?: number;
  minY?: number;
}> = ({ data, yKey = 'value', color = '#2E7D32', maxY, minY }) => {
  if (!data.length) return <View style={styles.empty}><Text>No data yet</Text></View>;

  const values = data.map(d => d[yKey] as number);
  const min = minY ?? Math.floor(Math.min(...values) * 0.9);
  const max = maxY ?? Math.ceil(Math.max(...values) * 1.1);
  const range = max - min || 1;

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const points = data.map((d, i) => {
    const x = PADDING.left + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = PADDING.top + innerH - ((d[yKey] - min) / range) * innerH;
    return { x, y, value: d[yKey], label: d.date || d.label };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Grid lines */}
        {[0, 0.5, 1].map(t => {
          const y = PADDING.top + innerH * (1 - t);
          const val = min + range * t;
          return (
            <G key={t}>
              <Line x1={PADDING.left} y1={y} x2={CHART_WIDTH - PADDING.right} y2={y} stroke="#eee" strokeWidth={1} />
              <SvgText x={PADDING.left - 5} y={y + 4} fontSize={10} fill="#888" textAnchor="end">
                {val.toFixed(0)}
              </SvgText>
            </G>
          );
        })}
        {/* Line path */}
        <Path d={path} stroke={color} strokeWidth={3} fill="none" />
        {/* Points */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
        ))}
      </Svg>
    </View>
  );
};

export const BarChart: React.FC<{
  data: Array<{ label: string; value: number }>;
  color?: string;
}> = ({ data, color = '#ED6C30' }) => {
  if (!data.length) return <View style={styles.empty}><Text>No data yet</Text></View>;

  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  const barWidth = (innerW: number) => Math.min(36, innerW / data.length - 10);
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {data.map((d, i) => {
          const bw = barWidth(innerW);
          const gap = (innerW - bw * data.length) / (data.length + 1);
          const x = PADDING.left + gap + i * (bw + gap);
          const barH = (d.value / maxVal) * innerH;
          const y = PADDING.top + innerH - barH;
          return (
            <G key={i}>
              <Line x1={x + bw / 2} y1={PADDING.top} x2={x + bw / 2} y2={PADDING.top + innerH} stroke="#f5f5f5" strokeWidth={1} />
              <Path d={`M${x},${y} L${x + bw},${y} L${x + bw},${PADDING.top + innerH} L${x},${PADDING.top + innerH} Z`} fill={color} opacity={0.85} rx={4} />
              <SvgText x={x + bw / 2} y={CHART_HEIGHT - 8} fontSize={9} fill="#666" textAnchor="middle">
                {d.label}
              </SvgText>
              <SvgText x={x + bw / 2} y={y - 4} fontSize={9} fill="#333" textAnchor="middle" fontWeight="bold">
                {d.value}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  empty: { padding: 24, alignItems: 'center', opacity: 0.5 },
});