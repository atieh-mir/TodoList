<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import TodoItem from "./TodoItem.vue";
import { useTodos } from "../composition/useTodos";

export default defineComponent({
  components: { TodoItem },
  setup() {
    const { todos, addTodo, updateTodo, removeTodo } = useTodos();
    const newTask = ref("");
    const inputRef = ref<HTMLInputElement | null>(null);

    function addNewTask() {
      if (newTask.value.trim() === "") {
        return;
      }
      addTodo(newTask.value.trim());
      newTask.value = "";
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      });
    }

    function toggleDone(id: string) {
      const found = todos.value.find(t => t.id === id);
      if (!found) return;
      updateTodo(id, { completed: !found.completed });
    }

    function editTitle(id: string, title: string) {
      updateTodo(id, { title });
    }

    function deleteTask(id: string) {
      removeTodo(id);
    }

    return {
      todos,
      newTask,
      addNewTask,
      toggleDone,
      editTitle,
      deleteTask,
      inputRef,
    };
  },
});
</script>

<template>
  <section class="max-w-xl mx-auto p-8 bg-[#F9F5F0] rounded-3xl shadow-lg">
    <h1 class="text-4xl font-bold mb-8 text-center text-sky-600">TodoList</h1>

    <form @submit.prevent="addNewTask" class="flex gap-2 mb-8">
      <input
        ref="inputRef"
        v-model="newTask"
        type="text"
        placeholder="مثال: خرید"
        class="px-4 py-3 rounded-2xl border-2 border-sky-300 focus:border-sky-600 focus:ring-0 transition focus:outline-none text-lg shadow-sm"
        aria-label="عنوان تسک جدید"
      />
      <button
        type="submit"
        class="px-4 py-2 rounded-2xl bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-md transition"
      >
        افزودن
      </button>
    </form>

    <p
      v-if="todos.length === 0"
      class="text-center text-gray-400 text-xl select-none py-16"
      aria-live="polite"
    >
      لیستی خالی است
    </p>

    <ul class="space-y-3">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleDone"
        @edit="editTitle"
        @remove="deleteTask"
      />
    </ul>
  </section>
</template>
