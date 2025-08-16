import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TodoPriority } from '../../types/todo';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface PriorityIndicatorProps {
  priority: TodoPriority;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function PriorityIndicator({ 
  priority, 
  size = 'medium',
  style 
}: PriorityIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const priorityColor = colors.priority[priority];

  const dimensions = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const borderRadius = dimensions / 2;

  return (
    <View style={[
      styles.indicator,
      {
        width: dimensions,
        height: dimensions,
        borderRadius,
        backgroundColor: priorityColor,
      },
      style
    ]} />
  );
}

const styles = StyleSheet.create({
  indicator: {
    marginTop: 2,
  },
});
