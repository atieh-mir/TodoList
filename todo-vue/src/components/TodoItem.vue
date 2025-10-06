<script lang="ts">
import { defineComponent, ref, watch, nextTick, PropType } from "vue";
import type { Todo } from "../composition/useTodos";

export default defineComponent({
  props: {
    todo: { type: Object as PropType<Todo>, required: true },
  },
  emits: ["toggle", "edit", "remove"],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const tempTitle = ref(props.todo.title);
    const inputEl = ref<HTMLInputElement | null>(null);

    watch(
      () => props.todo.title,
      newVal => {
        tempTitle.value = newVal;
      }
    );

    function editStart() {
      isEditing.value = true;
      nextTick(() => {
        if (inputEl.value) {
          inputEl.value.focus();
        }
      });
    }

    function saveEdit() {
      const trimmedTitle = tempTitle.value.trim();
      if (trimmedTitle === "") {
        tempTitle.value = props.todo.title;
      } else if (trimmedTitle !== props.todo.title) {
        emit("edit", props.todo.id, trimmedTitle);
      }
      isEditing.value = false;
    }

    return { isEditing, tempTitle, editStart, saveEdit, inputEl };
  },
});
</script>

<template>
  <li
    class="flex items-center justify-between p-4 rounded-xl shadow-lg bg-gradient-to-r bg-[#FFFFF0] transform hover:scale-105 transition-transform duration-300 cursor-pointer select-none"
  >
    <div class="flex items-center gap-4">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo.id)"
        class="w-5 h-5 rounded-full accent-blue-500 cursor-pointer hover:accent-blue-600 transition"
      />

      <div
        v-if="!isEditing"
        @dblclick="editStart"
        class="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
      >
        <p
          :class="[
            'text-xl font-medium',
            todo.completed ? 'line-through opacity-70' : '',
          ]"
        >
          {{ todo.title }}
        </p>
      </div>

      <input
        v-else
        v-model="tempTitle"
        @keyup.enter="saveEdit"
        @blur="saveEdit"
        ref="inputEl"
        class="text-black rounded-md p-2 font-semibold focus:outline-none focus:ring-1"
        placeholder="تسک جدید..."
      />
    </div>

    <div class="flex gap-2 items-center">
      <button
        @click="$emit('remove', todo.id)"
        class="transition-colors text-xl"
        title="حذف"
      >
        🗙
      </button>
      <button
        v-if="!isEditing"
        @click="editStart"
        class="transition-colors"
        title="ویرایش"
      >
        ✎
      </button>
    </div>
  </li>
</template>
