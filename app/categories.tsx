import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryPill from "@/components/todo/CategoryPill";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors, Gradients, Shadows } from "@/constants/Colors";
import { useTodos } from "@/contexts/TodoContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TodoCategory } from "@/types/todo";

export default function CategoryManagementScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, updateTodo } = useTodos();

  // Default categories that cannot be deleted
  const defaultCategories: TodoCategory[] = [
    "work",
    "personal",
    "health",
    "shopping",
    "leisure",
    "urgent",
  ];

  // Get all categories currently in use
  const getUsedCategories = (): TodoCategory[] => {
    const categoriesInUse = new Set<TodoCategory>();
    state.todos.forEach((todo) => {
      categoriesInUse.add(todo.category);
    });
    return Array.from(categoriesInUse);
  };

  const usedCategories = getUsedCategories();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleBack = () => {
    router.back();
  };

  const getCategoryStats = (category: TodoCategory) => {
    const categoryTodos = state.todos.filter(
      (todo) => todo.category === category
    );
    const completed = categoryTodos.filter(
      (todo) => todo.status === "completed"
    ).length;
    return {
      total: categoryTodos.length,
      completed,
      pending: categoryTodos.length - completed,
    };
  };

  const handleDeleteCategory = (category: TodoCategory) => {
    if (defaultCategories.includes(category)) {
      Alert.alert(
        "Cannot Delete",
        "This is a default category and cannot be deleted."
      );
      return;
    }

    const stats = getCategoryStats(category);
    if (stats.total > 0) {
      Alert.alert(
        "Category In Use",
        `This category has ${stats.total} todo(s). Please reassign or delete these todos first.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reassign to Personal",
            onPress: () => reassignTodos(category, "personal"),
          },
        ]
      );
    } else {
      Alert.alert(
        "Delete Category",
        `Are you sure you want to delete the "${category}" category?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteCategory(category),
          },
        ]
      );
    }
  };

  const reassignTodos = async (
    fromCategory: TodoCategory,
    toCategory: TodoCategory
  ) => {
    try {
      const todosToUpdate = state.todos.filter(
        (todo) => todo.category === fromCategory
      );
      for (const todo of todosToUpdate) {
        await updateTodo(todo.id, { category: toCategory });
      }
      Alert.alert(
        "Success",
        `All todos have been reassigned to "${toCategory}".`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to reassign todos. Please try again.");
    }
  };

  const deleteCategory = (category: TodoCategory) => {
    // Note: In a real implementation, you would remove this from a categories list
    // For now, we'll just show a success message since categories are derived from todos
    Alert.alert("Success", `Category "${category}" has been deleted.`);
  };

  const renderCategoryItem = ({ item }: { item: TodoCategory }) => {
    const stats = getCategoryStats(item);
    const isDefault = defaultCategories.includes(item);

    return (
      <View
        style={[
          styles.categoryCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.categoryHeader}>
          <CategoryPill category={item} size="medium" showIcon={true} />
          <View style={styles.categoryInfo}>
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
            <Text
              style={[styles.categoryStats, { color: colors.textSecondary }]}
            >
              {stats.total} todo{stats.total !== 1 ? "s" : ""} •{" "}
              {stats.completed} completed
            </Text>
          </View>
          {!isDefault && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCategory(item)}
              activeOpacity={0.7}
            >
              <IconSymbol name="trash" size={18} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {isDefault && (
          <View
            style={[
              styles.defaultBadge,
              { backgroundColor: colors.primaryLight + "20" },
            ]}
          >
            <Text style={[styles.defaultBadgeText, { color: colors.primary }]}>
              Default Category
            </Text>
          </View>
        )}
      </View>
    );
  };

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
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Categories</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Info Section */}
        <View
          style={[
            styles.infoSection,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <IconSymbol name="info.circle" size={20} color={colors.primary} />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Category Management
            </Text>
            <Text
              style={[styles.infoSubtitle, { color: colors.textSecondary }]}
            >
              Manage your todo categories. Default categories cannot be deleted.
            </Text>
          </View>
        </View>

        {/* Categories List */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories ({usedCategories.length})
          </Text>

          <FlatList
            data={usedCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <IconSymbol name="folder" size={60} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No Categories Found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Create some todos to see categories here
                </Text>
              </View>
            }
          />
        </View>
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
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  categoryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...Shadows.small,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryStats: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
