<script setup lang="ts">
import type { TheoryStep } from '@/content/types'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

defineProps<{ step: TheoryStep }>()

const calloutIcon: Record<string, string> = { info: 'ℹ️', tip: '💡', warning: '⚠️' }
</script>

<template>
  <div class="theory">
    <h2>{{ step.title }}</h2>
    <template v-for="(block, i) in step.blocks" :key="i">
      <MarkdownBlock v-if="block.type === 'text'" :source="block.md" />

      <pre
        v-else-if="block.type === 'code'"
        class="theory__code"
      ><code>{{ block.code }}</code></pre>

      <div v-else-if="block.type === 'callout'" class="callout" :class="`callout--${block.tone}`">
        <span class="callout__icon">{{ calloutIcon[block.tone] }}</span>
        <MarkdownBlock :source="block.md" />
      </div>

      <img
        v-else-if="block.type === 'image'"
        :src="block.src"
        :alt="block.alt"
        class="theory__img"
      />
    </template>
  </div>
</template>

<style scoped>
.theory {
  animation: fade-up var(--dur) var(--ease);
  font-size: 1.02rem;
}
.theory__code {
  color: var(--text);
}
.theory__code code {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
}
.callout {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  margin: 0 0 var(--sp-4);
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.callout__icon {
  font-size: 1.2rem;
  line-height: 1.5;
}
.callout :deep(p:last-child) {
  margin-bottom: 0;
}
.callout--tip {
  background: var(--success-soft);
  border-color: color-mix(in srgb, var(--success) 40%, transparent);
}
.callout--warning {
  background: var(--warning-soft);
  border-color: color-mix(in srgb, var(--warning) 40%, transparent);
}
.callout--info {
  background: color-mix(in srgb, var(--accent-cyan) 12%, transparent);
  border-color: color-mix(in srgb, var(--accent-cyan) 40%, transparent);
}
.theory__img {
  max-width: 100%;
  border-radius: var(--r-md);
  margin-bottom: var(--sp-4);
}
</style>
