import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors, Gradients, Shadows } from "@/constants/Colors";
import { useTodos } from "@/contexts/TodoContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TodoCategory, TodoPriority } from "@/types/todo";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, updateSettings, exportData, importData, clearAllData } =
    useTodos();

  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // Debug: Log current theme state
  console.log("Settings Screen - Current theme state:", {
    theme: state.settings.theme,
    colorScheme,
    colors: colors.background,
  });

  const handleThemeChange = async (theme: "light" | "dark" | "system") => {
    setIsSaving(true);
    try {
      await updateSettings({ theme });
      // Show immediate feedback
      Alert.alert(
        "Theme Updated",
        `Theme changed to ${theme}. You should see the change immediately!`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error updating theme:", error);
      Alert.alert("Error", "Failed to update theme setting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = async (notifications: boolean) => {
    setIsSaving(true);
    try {
      await updateSettings({ notifications });
    } catch (error) {
      console.error("Error updating notifications:", error);
      Alert.alert("Error", "Failed to update notification setting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReminderSoundToggle = async (reminderSound: boolean) => {
    setIsSaving(true);
    try {
      await updateSettings({ reminderSound });
    } catch (error) {
      console.error("Error updating reminder sound:", error);
      Alert.alert("Error", "Failed to update reminder sound setting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDefaultCategoryChange = async (defaultCategory: TodoCategory) => {
    setIsSaving(true);
    try {
      await updateSettings({ defaultCategory });
    } catch (error) {
      console.error("Error updating default category:", error);
      Alert.alert("Error", "Failed to update default category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDefaultPriorityChange = async (defaultPriority: TodoPriority) => {
    setIsSaving(true);
    try {
      await updateSettings({ defaultPriority });
    } catch (error) {
      console.error("Error updating default priority:", error);
      Alert.alert("Error", "Failed to update default priority");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      // In a real app, you might use expo-sharing or expo-file-system
      // For now, we'll just show a success message
      Alert.alert(
        "Export Successful",
        "Your data has been prepared for export. In a production app, this would save to your device or share via other apps.",
        [{ text: "OK" }]
      );
      console.log("Exported data:", data);
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Error", "Failed to export data");
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your todos and reset settings to default. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const categories: TodoCategory[] = [
    "work",
    "personal",
    "health",
    "shopping",
    "leisure",
    "urgent",
  ];

  const priorities: TodoPriority[] = ["low", "medium", "high"];

  const getCategoryIcon = (category: TodoCategory) => {
    const iconMap: Record<TodoCategory, any> = {
      work: "briefcase.fill",
      personal: "person.fill",
      health: "heart.fill",
      shopping: "cart.fill",
      leisure: "gamecontroller.fill",
      urgent: "exclamationmark.triangle.fill",
    };
    return iconMap[category];
  };

  const getPriorityIcon = (priority: TodoPriority) => {
    const iconMap: Record<TodoPriority, any> = {
      low: "arrow.down.circle.fill",
      medium: "minus.circle.fill",
      high: "arrow.up.circle.fill",
    };
    return iconMap[priority];
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

          <View
            style={[styles.settingCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.settingHeader}>
              <IconSymbol
                name="paintbrush.fill"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Theme
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              {(["light", "dark", "system"] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        state.settings.theme === theme
                          ? colors.primary + "20"
                          : colors.backgroundSecondary,
                      borderColor:
                        state.settings.theme === theme
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange(theme)}
                  disabled={isSaving}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          state.settings.theme === theme
                            ? colors.primary
                            : colors.text,
                        fontWeight:
                          state.settings.theme === theme ? "600" : "500",
                      },
                    ]}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>

          <View
            style={[styles.settingCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Enable Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Get reminded about your todos
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.notifications}
                onValueChange={handleNotificationToggle}
                disabled={isSaving}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + "40",
                }}
                thumbColor={
                  state.settings.notifications
                    ? colors.primary
                    : colors.textMuted
                }
              />
            </View>
          </View>

          <View
            style={[styles.settingCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <IconSymbol
                  name="speaker.wave.2.fill"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Reminder Sound
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Play sound for reminders
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.reminderSound}
                onValueChange={handleReminderSoundToggle}
                disabled={isSaving || !state.settings.notifications}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + "40",
                }}
                thumbColor={
                  state.settings.reminderSound
                    ? colors.primary
                    : colors.textMuted
                }
              />
            </View>
          </View>
        </View>

        {/* Defaults Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Defaults
          </Text>

          <View
            style={[styles.settingCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.settingHeader}>
              <IconSymbol name="folder.fill" size={20} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Default Category
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      {
                        backgroundColor:
                          state.settings.defaultCategory === category
                            ? colors.primary + "20"
                            : colors.backgroundSecondary,
                        borderColor:
                          state.settings.defaultCategory === category
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    onPress={() => handleDefaultCategoryChange(category)}
                    disabled={isSaving}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={getCategoryIcon(category)}
                      size={16}
                      color={
                        state.settings.defaultCategory === category
                          ? colors.primary
                          : colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.categoryOptionText,
                        {
                          color:
                            state.settings.defaultCategory === category
                              ? colors.primary
                              : colors.text,
                          fontWeight:
                            state.settings.defaultCategory === category
                              ? "600"
                              : "500",
                        },
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View
            style={[styles.settingCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.settingHeader}>
              <IconSymbol name="flag.fill" size={20} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Default Priority
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor:
                        state.settings.defaultPriority === priority
                          ? colors.priority[priority] + "20"
                          : colors.backgroundSecondary,
                      borderColor:
                        state.settings.defaultPriority === priority
                          ? colors.priority[priority]
                          : colors.border,
                    },
                  ]}
                  onPress={() => handleDefaultPriorityChange(priority)}
                  disabled={isSaving}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={getPriorityIcon(priority)}
                    size={16}
                    color={
                      state.settings.defaultPriority === priority
                        ? colors.priority[priority]
                        : colors.text
                    }
                  />
                  <Text
                    style={[
                      styles.priorityOptionText,
                      {
                        color:
                          state.settings.defaultPriority === priority
                            ? colors.priority[priority]
                            : colors.text,
                        fontWeight:
                          state.settings.defaultPriority === priority
                            ? "600"
                            : "500",
                      },
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Data Management
          </Text>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.actionHeader}>
              <IconSymbol
                name="square.and.arrow.up"
                size={20}
                color={colors.primary}
              />
              <View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  Export Data
                </Text>
                <Text
                  style={[
                    styles.actionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Backup your todos and settings
                </Text>
              </View>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push("/categories")}
            activeOpacity={0.7}
          >
            <View style={styles.actionHeader}>
              <IconSymbol
                name="folder.badge.gearshape"
                size={20}
                color={colors.primary}
              />
              <View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  Manage Categories
                </Text>
                <Text
                  style={[
                    styles.actionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  View and organize your categories
                </Text>
              </View>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={[
              styles.dangerCard,
              {
                backgroundColor: colors.error + "10",
                borderColor: colors.error + "30",
              },
            ]}
            onPress={handleClearAllData}
            activeOpacity={0.7}
          >
            <View style={styles.actionHeader}>
              <IconSymbol name="trash.fill" size={20} color={colors.error} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.error }]}>
                  Clear All Data
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.error }]}>
                  Permanently delete all todos and settings
                </Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Shadows.small,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  settingSubtitle: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryOptionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityOptionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Shadows.small,
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  actionSubtitle: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  dangerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...Shadows.small,
  },
});
