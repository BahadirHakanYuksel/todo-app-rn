import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Shadows } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: any;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SearchBar({ 
  value, 
  onChangeText,
  placeholder = 'Search todos...',
  onFocus,
  onBlur,
  style 
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [colors.border, colors.primary]
    );
    
    return {
      borderColor,
      backgroundColor: colors.surface,
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withSpring(0);
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
  };

  const styles = createStyles(colors);

  return (
    <AnimatedView style={[styles.container, animatedContainerStyle, style]}>
      <View style={styles.searchIcon}>
        <IconSymbol
          name="magnifyingglass"
          size={18}
          color={isFocused ? colors.primary : colors.textSecondary}
        />
      </View>
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor={colors.primary}
        returnKeyType="search"
      />
      
      {value.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            name="xmark.circle.fill"
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </AnimatedView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1.5,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      ...Shadows.small,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      padding: 0,
    },
    clearButton: {
      marginLeft: 8,
      padding: 2,
    },
  });
}
