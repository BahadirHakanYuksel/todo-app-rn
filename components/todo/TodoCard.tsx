import { format, isPast, isToday } from "date-fns";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, Shadows } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Todo } from "../../types/todo";
import { IconSymbol } from "../ui/IconSymbol";
import CategoryPill from "./CategoryPill";
import PriorityIndicator from "./PriorityIndicator";

interface TodoCardProps {
  todo: Todo;
  onPress: () => void;
  onToggle: () => void;
  onLongPress?: () => void;
  style?: any;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function TodoCard({
  todo,
  onPress,
  onToggle,
  onLongPress,
  style,
}: TodoCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const completed = todo.status === "completed";
  const isOverdue = todo.dueDate ? isPast(todo.dueDate) && !completed : false;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleToggle = () => {
    runOnJS(onToggle)();
  };

  const getSubtaskProgress = () => {
    if (!todo.subtasks || todo.subtasks.length === 0) return null;
    const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
    return { completed: completedSubtasks, total: todo.subtasks.length };
  };

  const subtaskProgress = getSubtaskProgress();

  const styles = createStyles(colors, isOverdue);

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, style, animatedCardStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.card,
          completed && {
            backgroundColor: colors.backgroundSecondary,
            opacity: 0.7,
          },
        ]}
      >
        {/* Priority Indicator */}
        <PriorityIndicator priority={todo.priority} size="small" />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={handleToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View
                style={[
                  styles.checkboxInner,
                  completed && styles.checkboxCompleted,
                  completed && { backgroundColor: colors.primary },
                ]}
              >
                {completed && (
                  <IconSymbol
                    name="checkmark"
                    size={14}
                    color={colors.surface}
                  />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text
                style={[styles.title, completed && styles.titleCompleted]}
                numberOfLines={2}
              >
                {todo.title}
              </Text>
              {todo.description && (
                <Text
                  style={[
                    styles.description,
                    completed && styles.descriptionCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {todo.description}
                </Text>
              )}
            </View>

            <CategoryPill category={todo.category} size="small" />
          </View>

          {/* Subtasks Progress */}
          {subtaskProgress && (
            <View style={styles.subtaskProgress}>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${
                          (subtaskProgress.completed / subtaskProgress.total) *
                          100
                        }%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.subtaskText}>
                {subtaskProgress.completed}/{subtaskProgress.total} subtasks
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {todo.dueDate && (
                <View
                  style={[
                    styles.dueDateContainer,
                    isOverdue && styles.dueDateOverdue,
                  ]}
                >
                  <IconSymbol
                    name="calendar"
                    size={12}
                    color={isOverdue ? colors.error : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dueDateText,
                      isOverdue && styles.dueDateTextOverdue,
                    ]}
                  >
                    {isToday(todo.dueDate)
                      ? "Today"
                      : format(todo.dueDate, "MMM d")}
                  </Text>
                </View>
              )}

              {todo.tags && todo.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {todo.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                  {todo.tags.length > 2 && (
                    <Text style={styles.tagText}>+{todo.tags.length - 2}</Text>
                  )}
                </View>
              )}
            </View>

            {todo.estimatedDuration && (
              <View style={styles.durationContainer}>
                <IconSymbol
                  name="clock"
                  size={12}
                  color={colors.textSecondary}
                />
                <Text style={styles.durationText}>
                  {todo.estimatedDuration}min
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
}

function createStyles(colors: any, isOverdue: boolean) {
  return StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginVertical: 6,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadows.small,
    },
    content: {
      flex: 1,
      marginLeft: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    checkbox: {
      marginTop: 2,
    },
    checkboxInner: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    checkboxCompleted: {
      borderColor: colors.primary,
    },
    titleContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      lineHeight: 22,
    },
    titleCompleted: {
      textDecorationLine: "line-through",
      color: colors.textMuted,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    descriptionCompleted: {
      color: colors.textMuted,
    },
    subtaskProgress: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    progressBarContainer: {
      flex: 1,
      marginRight: 8,
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: colors.borderLight,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 2,
    },
    subtaskText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    dueDateContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
    },
    dueDateOverdue: {
      backgroundColor: colors.error + "20",
    },
    dueDateText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
      fontWeight: "500",
    },
    dueDateTextOverdue: {
      color: colors.error,
    },
    tagsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    tag: {
      backgroundColor: colors.backgroundTertiary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 4,
    },
    tagText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    durationContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
    },
    durationText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginLeft: 3,
      fontWeight: "500",
    },
  });
}
