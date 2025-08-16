import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TodoCategory } from '../../types/todo';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { IconSymbol } from '../ui/IconSymbol';

interface CategoryPillProps {
  category: TodoCategory;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

const CATEGORY_ICONS: Record<TodoCategory, string> = {
  work: 'briefcase.fill',
  personal: 'person.fill',
  health: 'heart.fill',
  shopping: 'cart.fill',
  leisure: 'gamecontroller.fill',
  urgent: 'exclamationmark.triangle.fill',
};

const CATEGORY_LABELS: Record<TodoCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  shopping: 'Shopping',
  leisure: 'Leisure',
  urgent: 'Urgent',
};

export default function CategoryPill({ 
  category, 
  size = 'medium',
  showIcon = true 
}: CategoryPillProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const categoryColor = colors.categories[category];

  const styles = createStyles(colors, categoryColor, size);

  const iconSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;

  return (
    <View style={styles.container}>
      {showIcon && (
        <IconSymbol
          name={CATEGORY_ICONS[category]}
          size={iconSize}
          color={categoryColor}
        />
      )}
      <Text style={[styles.text, { fontSize }]}>
        {CATEGORY_LABELS[category]}
      </Text>
    </View>
  );
}

function createStyles(colors: any, categoryColor: string, size: string) {
  const padding = size === 'small' ? { paddingHorizontal: 6, paddingVertical: 2 } :
                  size === 'medium' ? { paddingHorizontal: 8, paddingVertical: 4 } :
                  { paddingHorizontal: 10, paddingVertical: 6 };

  return StyleSheet.create({
    container: {
      backgroundColor: categoryColor + '20',
      borderRadius: size === 'small' ? 6 : size === 'medium' ? 8 : 10,
      flexDirection: 'row',
      alignItems: 'center',
      ...padding,
    },
    text: {
      color: categoryColor,
      fontWeight: '600',
      marginLeft: 4,
    },
  });
}
