import { ref, watch } from "vue";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "vue3_todos_v1";

export function useTodos() {
  const todos = ref<Todo[]>([]);

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      todos.value = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("خطا در خواندن لیست:", e);
  }

  watch(
    todos,
    newVal => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      } catch (e) {
        console.warn("خطا در ذخیره لیست:", e);
      }
    },
    { deep: true }
  );

  function addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
    };
    if (!newTodo.title) return;
    todos.value.unshift(newTodo);
  }

  function updateTodo(id: string, updates: Partial<Todo>) {
    const idx = todos.value.findIndex(t => t.id === id);
    if (idx === -1) return;
    todos.value[idx] = { ...todos.value[idx], ...updates };
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter(t => t.id !== id);
  }

  return { todos, addTodo, updateTodo, removeTodo };
}
