import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryPill from "@/components/todo/CategoryPill";
import PriorityIndicator from "@/components/todo/PriorityIndicator";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors, Gradients, Shadows } from "@/constants/Colors";
import { useTodos } from "@/contexts/TodoContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Todo } from "@/types/todo";

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, toggleTodo, deleteTodo } = useTodos();

  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const foundTodo = state.todos.find((t) => t.id === id);
    setTodo(foundTodo || null);
  }, [id, state.todos]);

  const handleBack = () => {
    router.back();
  };

  const handleToggle = async () => {
    if (!todo) return;

    try {
      await toggleTodo(todo.id);
      // Update local state
      setTodo((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "pending" ? "completed" : "pending",
            }
          : null
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      Alert.alert("Error", "Failed to update todo status");
    }
  };

  const handleDelete = () => {
    if (!todo) return;

    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTodo(todo.id);
              router.back();
            } catch (error) {
              console.error("Error deleting todo:", error);
              Alert.alert("Error", "Failed to delete todo");
            }
          },
        },
      ]
    );
  };

  if (!todo) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={60}
            color={colors.textMuted}
          />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Todo Not Found
          </Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            This todo might have been deleted or doesn't exist.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = todo.status === "completed";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <LinearGradient
        colors={Gradients.primary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Todo Details</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <IconSymbol name="trash" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompleted
                  ? colors.success + "20"
                  : colors.warning + "20",
                borderColor: isCompleted ? colors.success : colors.warning,
              },
            ]}
          >
            <IconSymbol
              name={isCompleted ? "checkmark.circle.fill" : "clock"}
              size={16}
              color={isCompleted ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.statusText,
                { color: isCompleted ? colors.success : colors.warning },
              ]}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>
            {todo.title}
          </Text>
        </View>

        {/* Description */}
        {todo.description && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Description
            </Text>
            <Text style={[styles.description, { color: colors.text }]}>
              {todo.description}
            </Text>
          </View>
        )}

        {/* Category and Priority */}
        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Category
            </Text>
            <CategoryPill
              category={todo.category}
              size="medium"
              showIcon={true}
            />
          </View>

          <View style={styles.metaItem}>
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Priority
            </Text>
            <PriorityIndicator priority={todo.priority} size="medium" />
          </View>
        </View>

        {/* Timestamps */}
        <View
          style={[
            styles.timestampSection,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.timestampItem}>
            <IconSymbol
              name="calendar"
              size={16}
              color={colors.textSecondary}
            />
            <View style={styles.timestampContent}>
              <Text
                style={[styles.timestampLabel, { color: colors.textSecondary }]}
              >
                Created
              </Text>
              <Text style={[styles.timestampValue, { color: colors.text }]}>
                {format(new Date(todo.createdAt), "PPp")}
              </Text>
            </View>
          </View>

          {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
            <View style={styles.timestampItem}>
              <IconSymbol name="clock" size={16} color={colors.textSecondary} />
              <View style={styles.timestampContent}>
                <Text
                  style={[
                    styles.timestampLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Last Updated
                </Text>
                <Text style={[styles.timestampValue, { color: colors.text }]}>
                  {format(new Date(todo.updatedAt), "PPp")}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View
        style={[styles.actionContainer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: isCompleted ? colors.warning : colors.success,
            },
          ]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <IconSymbol
            name={isCompleted ? "arrow.clockwise" : "checkmark"}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.toggleButtonText}>
            {isCompleted ? "Mark as Pending" : "Mark as Complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  metaSection: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 20,
  },
  metaItem: {
    flex: 1,
  },
  timestampSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  timestampItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  timestampContent: {
    marginLeft: 12,
    flex: 1,
  },
  timestampLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timestampValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    ...Shadows.medium,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    ...Shadows.medium,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
