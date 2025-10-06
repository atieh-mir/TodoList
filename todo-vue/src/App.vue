<script lang="ts">
import { defineComponent } from "vue";
import TodoList from "./components/TodoList.vue";

export default defineComponent({
  components: { TodoList },
});
</script>

<template>
  <div class="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-8">
    <TodoList />
  </div>
</template>
