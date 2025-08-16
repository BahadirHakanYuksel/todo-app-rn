export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoCategory = 'work' | 'personal' | 'health' | 'shopping' | 'leisure' | 'urgent';
export type TodoStatus = 'pending' | 'completed' | 'cancelled';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: TodoCategory;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  subtasks?: Subtask[];
  reminder?: Date;
  estimatedDuration?: number; // in minutes
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFilter {
  category?: TodoCategory;
  priority?: TodoPriority;
  status?: TodoStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  categoryStats: Record<TodoCategory, {
    total: number;
    completed: number;
  }>;
  priorityStats: Record<TodoPriority, {
    total: number;
    completed: number;
  }>;
  weeklyProgress: {
    week: string;
    completed: number;
    created: number;
  }[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  reminderSound: boolean;
  defaultCategory: TodoCategory;
  defaultPriority: TodoPriority;
  workingHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}
