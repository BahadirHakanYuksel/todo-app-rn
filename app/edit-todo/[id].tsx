import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryPill from "@/components/todo/CategoryPill";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors, Gradients, Shadows } from "@/constants/Colors";
import { useTodos } from "@/contexts/TodoContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TodoCategory, TodoPriority } from "@/types/todo";

export default function EditTodoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, updateTodo } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TodoCategory>("personal");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todoFound, setTodoFound] = useState(true);

  const categories: TodoCategory[] = [
    "work",
    "personal",
    "health",
    "shopping",
    "leisure",
    "urgent",
  ];
  const priorities: TodoPriority[] = ["low", "medium", "high"];

  useEffect(() => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setCategory(todo.category);
      setPriority(todo.priority);
      setTodoFound(true);
    } else {
      setTodoFound(false);
    }
  }, [id, state.todos]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your todo");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTodo(id!, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });

      // Navigate back to the todo detail screen
      router.back();
    } catch (error) {
      console.error("Error updating todo:", error);
      Alert.alert("Error", "Failed to update todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getPriorityColor = (p: TodoPriority) => {
    return colors.priority[p];
  };

  if (!todoFound) {
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
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            style={styles.backButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Todo</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to do?"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add some details (optional)"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    category === cat && {
                      backgroundColor: colors.primaryLight + "20",
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <CategoryPill category={cat} size="small" showIcon={true} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityOption,
                  {
                    backgroundColor:
                      priority === p
                        ? getPriorityColor(p) + "20"
                        : colors.surface,
                    borderColor:
                      priority === p ? getPriorityColor(p) : colors.border,
                  },
                ]}
                onPress={() => setPriority(p)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(p) },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: priority === p ? getPriorityColor(p) : colors.text,
                      fontWeight: priority === p ? "600" : "500",
                    },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[styles.actionContainer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: colors.backgroundTertiary },
          ]}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.cancelButtonText, { color: colors.textSecondary }]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: colors.primary,
              opacity: isSubmitting ? 0.6 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Updating..." : "Update Todo"}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    ...Shadows.small,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  categoryOption: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    padding: 4,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...Shadows.medium,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
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
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
