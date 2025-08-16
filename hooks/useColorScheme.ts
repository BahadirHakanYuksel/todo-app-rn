import { useContext } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { TodoContext } from "../contexts/TodoContext";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();

  // Try to get the context, but handle the case where it might not be available yet
  try {
    const context = useContext(TodoContext);

    // If context is available and has settings
    if (context && context.state && context.state.settings) {
      const appTheme = context.state.settings.theme;
      const resolvedTheme =
        appTheme === "system" ? systemColorScheme : appTheme;

      // Debug logging
      console.log("Theme Debug:", {
        appTheme,
        systemColorScheme,
        resolvedTheme,
      });

      return resolvedTheme;
    }
  } catch (error) {
    // If there's any error accessing the context, fall back to system
    console.warn(
      "Could not access TodoContext in useColorScheme, using system theme"
    );
  }

  // Fallback to system color scheme
  console.log("Using fallback theme:", systemColorScheme);
  return systemColorScheme;
}
