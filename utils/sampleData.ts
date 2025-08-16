import 'react-native-get-random-values';
import { Todo, TodoCategory, TodoPriority } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

export const sampleTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete project proposal',
    description: 'Finish the Q4 project proposal for the new mobile app initiative',
    category: 'work' as TodoCategory,
    priority: 'high' as TodoPriority,
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    tags: ['project', 'proposal', 'urgent'],
    estimatedDuration: 120,
    subtasks: [
      {
        id: uuidv4(),
        title: 'Research market trends',
        completed: true,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: 'Create budget breakdown',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: 'Write executive summary',
        completed: false,
        createdAt: new Date(),
      },
    ],
  },
  {
    title: 'Buy groceries for the week',
    description: 'Get vegetables, fruits, and dairy products',
    category: 'shopping' as TodoCategory,
    priority: 'medium' as TodoPriority,
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    tags: ['groceries', 'weekly'],
    estimatedDuration: 45,
  },
  {
    title: 'Morning workout routine',
    description: '30 minutes cardio + 20 minutes strength training',
    category: 'health' as TodoCategory,
    priority: 'high' as TodoPriority,
    status: 'completed',
    completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    estimatedDuration: 50,
    tags: ['fitness', 'daily'],
  },
  {
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodations',
    category: 'leisure' as TodoCategory,
    priority: 'low' as TodoPriority,
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    tags: ['travel', 'vacation'],
    estimatedDuration: 90,
  },
  {
    title: 'Team meeting preparation',
    description: 'Prepare slides and agenda for Monday team meeting',
    category: 'work' as TodoCategory,
    priority: 'medium' as TodoPriority,
    status: 'completed',
    completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    estimatedDuration: 60,
    tags: ['meeting', 'presentation'],
  },
  {
    title: 'Call dentist for appointment',
    description: 'Schedule routine cleaning and checkup',
    category: 'health' as TodoCategory,
    priority: 'medium' as TodoPriority,
    status: 'pending',
    estimatedDuration: 15,
    tags: ['health', 'appointment'],
  },
  {
    title: 'Update personal website',
    description: 'Add new projects and update bio section',
    category: 'personal' as TodoCategory,
    priority: 'low' as TodoPriority,
    status: 'pending',
    estimatedDuration: 180,
    tags: ['website', 'portfolio'],
  },
  {
    title: 'Submit tax documents',
    description: 'Gather all documents and submit to accountant',
    category: 'urgent' as TodoCategory,
    priority: 'high' as TodoPriority,
    status: 'pending',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue!
    estimatedDuration: 30,
    tags: ['taxes', 'deadline'],
  },
  {
    title: 'Read React Native documentation',
    description: 'Study new features in React Native 0.74',
    category: 'personal' as TodoCategory,
    priority: 'medium' as TodoPriority,
    status: 'pending',
    estimatedDuration: 120,
    tags: ['learning', 'development'],
  },
  {
    title: 'Organize digital photos',
    description: 'Sort and backup photos from last vacation',
    category: 'personal' as TodoCategory,
    priority: 'low' as TodoPriority,
    status: 'completed',
    completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    estimatedDuration: 90,
    tags: ['photos', 'backup'],
  },
];

export const loadSampleData = async (addTodo: (todo: any) => Promise<void>) => {
  console.log('Loading sample todos...');
  for (const todo of sampleTodos) {
    await addTodo(todo);
  }
  console.log('Sample todos loaded successfully!');
};
