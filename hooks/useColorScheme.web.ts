import { useContext, useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { TodoContext } from "../contexts/TodoContext";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Try to get the context, but handle the case where it might not be available yet
  let appTheme = systemColorScheme;
  try {
    const context = useContext(TodoContext);

    // If context is available and has settings
    if (context && context.state && context.state.settings) {
      // If app theme is set to 'system', use the system color scheme
      // Otherwise, use the app's theme setting
      appTheme =
        context.state.settings.theme === "system"
          ? systemColorScheme
          : context.state.settings.theme;
    }
  } catch (error) {
    // If there's any error accessing the context, fall back to system
    console.warn(
      "Could not access TodoContext in useColorScheme, using system theme"
    );
  }

  if (hasHydrated) {
    return appTheme;
  }

  return "light";
}
