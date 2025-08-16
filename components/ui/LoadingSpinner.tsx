import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface LoadingSpinnerProps {
  size?: number;
  style?: any;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function LoadingSpinner({ size = 40, style }: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const styles = createStyles(size);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.spinner, animatedStyle]}>
        <AnimatedLinearGradient
          colors={[...Gradients.primary, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

function createStyles(size: number) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinner: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    gradient: {
      width: '100%',
      height: '100%',
      borderRadius: size / 2,
    },
  });
}
