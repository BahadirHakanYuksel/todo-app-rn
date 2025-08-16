import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Gradients, Shadows } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  style?: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function FloatingActionButton({ 
  onPress, 
  icon = 'plus',
  size = 56,
  style 
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    rotation.value = withSequence(
      withSpring(15, { duration: 100 }),
      withSpring(0, { duration: 100 })
    );
    onPress();
  };

  const styles = createStyles(size);

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, style, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <AnimatedLinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <IconSymbol
          name={icon}
          size={size * 0.4}
          color={colors.surface}
        />
      </AnimatedLinearGradient>
    </AnimatedTouchableOpacity>
  );
}

function createStyles(size: number) {
  return StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      ...Shadows.large,
    },
    gradient: {
      width: '100%',
      height: '100%',
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
