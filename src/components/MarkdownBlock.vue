<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ source: string }>()
const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <div class="md" v-html="html" />
</template>

<style scoped>
.md :deep(p) {
  margin: 0 0 var(--sp-3);
}
.md :deep(p:last-child) {
  margin-bottom: 0;
}
.md :deep(ul) {
  margin: 0 0 var(--sp-3);
  padding-left: 1.3em;
}
.md :deep(li) {
  margin-bottom: 4px;
}
.md :deep(strong) {
  color: var(--text);
  font-weight: 700;
}
</style>
