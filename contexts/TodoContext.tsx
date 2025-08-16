import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  endOfWeek,
  format,
  isPast,
  isWithinInterval,
  startOfWeek,
} from "date-fns";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import {
  AppSettings,
  Subtask,
  Todo,
  TodoCategory,
  TodoFilter,
  TodoPriority,
  TodoStats,
} from "../types/todo";

// Storage keys
const TODOS_STORAGE_KEY = "@todos";
const SETTINGS_STORAGE_KEY = "@settings";

// Default settings
const defaultSettings: AppSettings = {
  theme: "system",
  notifications: true,
  reminderSound: true,
  defaultCategory: "personal",
  defaultPriority: "medium",
  workingHours: {
    start: "09:00",
    end: "17:00",
  },
};

// Action types
type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<Todo> } }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "SET_FILTER"; payload: TodoFilter }
  | { type: "CLEAR_FILTER" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SETTINGS"; payload: AppSettings }
  | { type: "SET_LOADING"; payload: boolean };

// State interface
interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  settings: AppSettings;
  loading: boolean;
}

// Initial state
const initialState: TodoState = {
  todos: [],
  filter: {},
  searchQuery: "",
  settings: defaultSettings,
  loading: true,
};

// Reducer
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload, loading: false };

    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
      };

    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? {
                ...todo,
                status: todo.status === "completed" ? "pending" : "completed",
                completedDate:
                  todo.status === "completed" ? undefined : new Date(),
                updatedAt: new Date(),
              }
            : todo
        ),
      };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "CLEAR_FILTER":
      return { ...state, filter: {} };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_SETTINGS":
      return { ...state, settings: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}

// Context interface
interface TodoContextType {
  state: TodoState;
  // Todo operations
  addTodo: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">
  ) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  addSubtask: (todoId: string, title: string) => Promise<void>;
  toggleSubtask: (todoId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (todoId: string, subtaskId: string) => Promise<void>;

  // Filter and search
  setFilter: (filter: TodoFilter) => void;
  clearFilter: () => void;
  setSearchQuery: (query: string) => void;

  // Data helpers
  getFilteredTodos: () => Todo[];
  getTodoStats: () => TodoStats;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // Data management
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Export the context for advanced usage
export { TodoContext };

// Provider component
interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save todos to storage whenever todos change
  useEffect(() => {
    if (!state.loading) {
      saveTodos();
    }
  }, [state.todos, state.loading]);

  // Save settings whenever settings change
  useEffect(() => {
    if (!state.loading) {
      saveSettings();
    }
  }, [state.settings, state.loading]);

  // Load data from storage
  const loadData = async () => {
    try {
      const [todosData, settingsData] = await Promise.all([
        AsyncStorage.getItem(TODOS_STORAGE_KEY),
        AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
      ]);

      if (todosData) {
        const todos = JSON.parse(todosData).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedDate: todo.completedDate
            ? new Date(todo.completedDate)
            : undefined,
          reminder: todo.reminder ? new Date(todo.reminder) : undefined,
        }));
        dispatch({ type: "SET_TODOS", payload: todos });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }

      if (settingsData) {
        const settings = JSON.parse(settingsData);
        dispatch({
          type: "SET_SETTINGS",
          payload: { ...defaultSettings, ...settings },
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Save todos to storage
  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(
        TODOS_STORAGE_KEY,
        JSON.stringify(state.todos)
      );
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // Save settings to storage
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(state.settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Add todo
  const addTodo = async (
    todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">
  ) => {
    const todo: Todo = {
      ...todoData,
      id: uuidv4(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: "ADD_TODO", payload: todo });
  };

  // Update todo
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, updates } });
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  // Add subtask
  const addSubtask = async (todoId: string, title: string) => {
    const todo = state.todos.find((t) => t.id === todoId);
    if (!todo) return;

    const subtask: Subtask = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    const updatedSubtasks = [...(todo.subtasks || []), subtask];
    await updateTodo(todoId, { subtasks: updatedSubtasks });
  };

  // Toggle subtask
  const toggleSubtask = async (todoId: string, subtaskId: string) => {
    const todo = state.todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    const updatedSubtasks = todo.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    await updateTodo(todoId, { subtasks: updatedSubtasks });
  };

  // Delete subtask
  const deleteSubtask = async (todoId: string, subtaskId: string) => {
    const todo = state.todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    const updatedSubtasks = todo.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    await updateTodo(todoId, { subtasks: updatedSubtasks });
  };

  // Set filter
  const setFilter = (filter: TodoFilter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: "CLEAR_FILTER" });
  };

  // Set search query
  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  // Get filtered todos
  const getFilteredTodos = (): Todo[] => {
    let filteredTodos = state.todos;

    // Apply filters
    if (state.filter.category) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.category === state.filter.category
      );
    }

    if (state.filter.priority) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.priority === state.filter.priority
      );
    }

    if (state.filter.status) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.status === state.filter.status
      );
    }

    if (state.filter.dateRange) {
      filteredTodos = filteredTodos.filter((todo) => {
        if (!todo.dueDate) return false;
        return isWithinInterval(todo.dueDate, {
          start: state.filter.dateRange!.start,
          end: state.filter.dateRange!.end,
        });
      });
    }

    if (state.filter.tags && state.filter.tags.length > 0) {
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.tags && todo.tags.some((tag) => state.filter.tags!.includes(tag))
      );
    }

    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description &&
            todo.description.toLowerCase().includes(query)) ||
          (todo.tags &&
            todo.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    return filteredTodos;
  };

  // Get todo statistics
  const getTodoStats = (): TodoStats => {
    const todos = state.todos;
    const completed = todos.filter((t) => t.status === "completed");
    const pending = todos.filter((t) => t.status === "pending");
    const overdue = pending.filter((t) => t.dueDate && isPast(t.dueDate));

    // Category stats
    const categoryStats: Record<
      TodoCategory,
      { total: number; completed: number }
    > = {
      work: { total: 0, completed: 0 },
      personal: { total: 0, completed: 0 },
      health: { total: 0, completed: 0 },
      shopping: { total: 0, completed: 0 },
      leisure: { total: 0, completed: 0 },
      urgent: { total: 0, completed: 0 },
    };

    todos.forEach((todo) => {
      categoryStats[todo.category].total++;
      if (todo.status === "completed") {
        categoryStats[todo.category].completed++;
      }
    });

    // Priority stats
    const priorityStats: Record<
      TodoPriority,
      { total: number; completed: number }
    > = {
      low: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      high: { total: 0, completed: 0 },
    };

    todos.forEach((todo) => {
      priorityStats[todo.priority].total++;
      if (todo.status === "completed") {
        priorityStats[todo.priority].completed++;
      }
    });

    // Weekly progress (last 4 weeks)
    const weeklyProgress = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(
        new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
      );
      const weekEnd = endOfWeek(weekStart);

      const weekCompleted = completed.filter(
        (todo) =>
          todo.completedDate &&
          isWithinInterval(todo.completedDate, {
            start: weekStart,
            end: weekEnd,
          })
      ).length;

      const weekCreated = todos.filter((todo) =>
        isWithinInterval(todo.createdAt, { start: weekStart, end: weekEnd })
      ).length;

      weeklyProgress.push({
        week: format(weekStart, "MMM d"),
        completed: weekCompleted,
        created: weekCreated,
      });
    }

    return {
      total: todos.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate:
        todos.length > 0 ? (completed.length / todos.length) * 100 : 0,
      categoryStats,
      priorityStats,
      weeklyProgress,
    };
  };

  // Update settings
  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...state.settings, ...updates };
    dispatch({ type: "SET_SETTINGS", payload: newSettings });
  };

  // Export data
  const exportData = async (): Promise<string> => {
    const data = {
      todos: state.todos,
      settings: state.settings,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  // Import data
  const importData = async (data: string) => {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData.todos && Array.isArray(parsedData.todos)) {
        const todos = parsedData.todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedDate: todo.completedDate
            ? new Date(todo.completedDate)
            : undefined,
          reminder: todo.reminder ? new Date(todo.reminder) : undefined,
        }));
        dispatch({ type: "SET_TODOS", payload: todos });
      }

      if (parsedData.settings) {
        dispatch({
          type: "SET_SETTINGS",
          payload: { ...defaultSettings, ...parsedData.settings },
        });
      }
    } catch (error) {
      throw new Error("Invalid data format");
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TODOS_STORAGE_KEY),
        AsyncStorage.removeItem(SETTINGS_STORAGE_KEY),
      ]);
      dispatch({ type: "SET_TODOS", payload: [] });
      dispatch({ type: "SET_SETTINGS", payload: defaultSettings });
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const contextValue: TodoContextType = {
    state,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    setFilter,
    clearFilter,
    setSearchQuery,
    getFilteredTodos,
    getTodoStats,
    updateSettings,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}

// Custom hook to use todo context
export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
