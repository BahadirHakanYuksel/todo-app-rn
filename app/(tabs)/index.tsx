import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors, Gradients, Shadows } from "@/constants/Colors";
import { useTodos } from "@/contexts/TodoContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TodoCategory } from "@/types/todo";
import { loadSampleData } from "@/utils/sampleData";

// Components
import CategoryPill from "@/components/todo/CategoryPill";
import TodoCard from "@/components/todo/TodoCard";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SearchBar from "@/components/ui/SearchBar";

export default function TodoListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const {
    state,
    getFilteredTodos,
    setSearchQuery,
    setFilter,
    clearFilter,
    toggleTodo,
    deleteTodo,
    addTodo,
  } = useTodos();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TodoCategory | null>(
    null
  );

  const filteredTodos = getFilteredTodos();
  const pendingTodos = filteredTodos.filter(
    (todo) => todo.status === "pending"
  );
  const completedTodos = filteredTodos.filter(
    (todo) => todo.status === "completed"
  );

  // Category filter options
  const categories: TodoCategory[] = [
    "work",
    "personal",
    "health",
    "shopping",
    "leisure",
    "urgent",
  ];

  const handleCategoryPress = (category: TodoCategory) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      clearFilter();
    } else {
      setSelectedCategory(category);
      setFilter({ category });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here if needed
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddTodo = () => {
    router.push("/add-todo");
  };

  const handleTodoPress = (todoId: string) => {
    router.push(`/todo/${todoId}`);
  };

  const handleTodoToggle = async (todoId: string) => {
    await toggleTodo(todoId);
  };

  const renderTodoItem = ({ item }: { item: any }) => (
    <TodoCard
      todo={item}
      onPress={() => handleTodoPress(item.id)}
      onToggle={() => handleTodoToggle(item.id)}
      onLongPress={() => deleteTodo(item.id)}
    />
  );

  const renderCategoryFilter = ({ item }: { item: TodoCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive,
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <CategoryPill category={item} size="small" showIcon={true} />
    </TouchableOpacity>
  );

  const renderHeader = () => {
    const today = new Date();
    const greeting =
      today.getHours() < 12
        ? "Good morning"
        : today.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

    return (
      <>
        {/* Header with Gradient */}
        <LinearGradient
          colors={Gradients.primary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>{greeting}!</Text>
              <Text style={styles.dateText}>
                {format(today, "EEEE, MMMM d")}
              </Text>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{pendingTodos.length}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedTodos.length}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <SearchBar
          value={state.searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your todos..."
        />

        {/* Category Filters */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryFilter}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Clear Filter Button */}
        {(selectedCategory || state.searchQuery) && (
          <TouchableOpacity
            style={[
              styles.clearFilterButton,
              { backgroundColor: colors.backgroundTertiary },
            ]}
            onPress={() => {
              setSelectedCategory(null);
              clearFilter();
              setSearchQuery("");
            }}
          >
            <IconSymbol
              name="xmark.circle"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.clearFilterText, { color: colors.textSecondary }]}
            >
              Clear filters
            </Text>
          </TouchableOpacity>
        )}

        {/* Section Title */}
        {filteredTodos.length > 0 && (
          <Text
            style={[
              styles.sectionTitle,
              styles.todosSectionTitle,
              { color: colors.text },
            ]}
          >
            {selectedCategory
              ? `${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                } Tasks`
              : "Your Tasks"}
            <Text style={{ color: colors.textSecondary }}>
              {" "}
              ({filteredTodos.length})
            </Text>
          </Text>
        )}
      </>
    );
  };

  const handleLoadSampleData = async () => {
    try {
      await loadSampleData(addTodo);
    } catch (error) {
      console.error("Error loading sample data:", error);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol
        name="checkmark.circle.fill"
        size={80}
        color={colors.textMuted}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {state.searchQuery || selectedCategory
          ? "No matching todos"
          : "No todos yet"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {state.searchQuery || selectedCategory
          ? "Try adjusting your search or filter"
          : "Tap the + button to create your first todo"}
      </Text>

      {/* Sample Data Button - only show when no todos exist at all */}
      {!state.searchQuery && !selectedCategory && state.todos.length === 0 && (
        <TouchableOpacity
          style={[styles.sampleDataButton, { backgroundColor: colors.primary }]}
          onPress={handleLoadSampleData}
        >
          <IconSymbol name="sparkles" size={16} color={colors.surface} />
          <Text style={[styles.sampleDataText, { color: colors.surface }]}>
            Load Sample Todos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (state.loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your todos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredTodos.length === 0 && styles.listContentEmpty,
        ]}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleAddTodo}
        icon="plus"
        style={styles.fab}
      />
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
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
    fontWeight: "500",
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    minWidth: 40,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 16,
  },
  categorySection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  todosSectionTitle: {
    marginTop: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    marginHorizontal: 4,
  },
  categoryButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  clearFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  sampleDataButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 24,
    ...Shadows.medium,
  },
  sampleDataText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
