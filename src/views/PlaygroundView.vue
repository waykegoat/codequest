<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { runCode } from '@/engine/codeRunner'
import { buildSrcdoc } from '@/engine/markupRunner'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'

type Mode = 'js' | 'web'
const mode = ref<Mode>('js')

const js = ref(`function greet(name) {
  return 'Привет, ' + name + '!'
}

console.log(greet('мир'))
console.log([1, 2, 3].map((n) => n * n))`)

const html = ref(`<h1>Песочница</h1>
<p class="tag">пиши код — смотри результат</p>`)
const css = ref(`h1 { font-family: sans-serif; }
.tag {
  display: inline-block;
  padding: 6px 12px;
  border: 2px solid #111;
  border-radius: 8px;
}`)

const webTab = ref<'html' | 'css'>('html')
const logs = ref<string[]>([])
const error = ref('')
const running = ref(false)
const iframe = ref<HTMLIFrameElement>()

let timer: ReturnType<typeof setTimeout> | undefined
function renderWeb() {
  if (iframe.value) iframe.value.srcdoc = buildSrcdoc(html.value, css.value)
}
watch([html, css, mode], () => {
  clearTimeout(timer)
  timer = setTimeout(renderWeb, 250)
})
onBeforeUnmount(() => clearTimeout(timer))

async function runJs() {
  running.value = true
  logs.value = []
  error.value = ''
  const out = await runCode({ code: js.value, entry: '', tests: [] })
  running.value = false
  logs.value = out.logs
  error.value = out.compileError ?? ''
}
</script>

<template>
  <div class="pg container">
    <div class="pg__head">
      <div>
        <div class="eyebrow">// песочница</div>
        <h1 class="pg__title">Свободный код</h1>
      </div>
      <div class="pg__modes">
        <button
          class="pg__mode"
          :class="{ 'pg__mode--active': mode === 'js' }"
          @click="mode = 'js'"
        >
          JavaScript
        </button>
        <button
          class="pg__mode"
          :class="{ 'pg__mode--active': mode === 'web' }"
          @click="((mode = 'web'), renderWeb())"
        >
          HTML + CSS
        </button>
      </div>
    </div>

    <div v-if="mode === 'js'" class="pg__grid">
      <div class="pg__pane terminal">
        <div class="terminal__bar">
          <span class="terminal__dot" /><span class="terminal__dot" /><span class="terminal__dot" />
          <span class="terminal__title">script.js</span>
        </div>
        <div class="pg__editor">
          <CodeMirrorEditor v-model="js" lang="js" />
        </div>
      </div>
      <div class="pg__pane terminal">
        <div class="terminal__bar">
          <span class="terminal__dot" /><span class="terminal__dot" /><span class="terminal__dot" />
          <span class="terminal__title">output</span>
        </div>
        <div class="pg__console">
          <div v-if="error" class="pg__err">{{ error }}</div>
          <pre v-for="(l, i) in logs" :key="i" class="pg__log">{{ l }}</pre>
          <div v-if="!error && !logs.length" class="pg__empty">
            Нажми «Запустить» — вывод появится здесь.
          </div>
        </div>
      </div>
    </div>

    <div v-else class="pg__grid">
      <div class="pg__pane terminal">
        <div class="terminal__bar pg__tabs">
          <button
            class="pg__tab"
            :class="{ 'pg__tab--active': webTab === 'html' }"
            @click="webTab = 'html'"
          >
            HTML
          </button>
          <button
            class="pg__tab"
            :class="{ 'pg__tab--active': webTab === 'css' }"
            @click="webTab = 'css'"
          >
            CSS
          </button>
        </div>
        <div class="pg__editor">
          <CodeMirrorEditor v-show="webTab === 'html'" v-model="html" lang="html" />
          <CodeMirrorEditor v-show="webTab === 'css'" v-model="css" lang="css" />
        </div>
      </div>
      <div class="pg__pane terminal">
        <div class="terminal__bar">
          <span class="terminal__dot" /><span class="terminal__dot" /><span class="terminal__dot" />
          <span class="terminal__title">preview</span>
        </div>
        <iframe
          ref="iframe"
          class="pg__frame"
          title="Предпросмотр"
          sandbox="allow-same-origin"
        />
      </div>
    </div>

    <div v-if="mode === 'js'" class="pg__actions">
      <button class="btn btn--primary btn--lg" :disabled="running" @click="runJs">
        {{ running ? 'Выполняю…' : '▸ Запустить' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pg {
  padding-top: var(--sp-6);
  padding-bottom: var(--sp-8);
}
.pg__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-5);
  flex-wrap: wrap;
}
.pg__title {
  margin: 4px 0 0;
}
.pg__modes {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface);
}
.pg__mode {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--r-sm);
  transition: all var(--dur-fast) var(--ease);
}
.pg__mode--active {
  background: var(--ink);
  color: var(--ink-inverse);
}
.pg__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
  min-height: 440px;
}
.pg__pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pg__editor {
  flex: 1;
  min-height: 400px;
  background: var(--bg-3);
}
.pg__editor :deep(.cm-host) {
  height: 100%;
}
.pg__console {
  flex: 1;
  min-height: 400px;
  padding: var(--sp-4);
  overflow: auto;
  background: var(--bg-3);
}
.pg__log {
  margin: 0 0 4px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text);
  font-size: 0.88rem;
}
.pg__err {
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: var(--sp-2) var(--sp-3);
  border-left: 2px solid var(--bad);
  background: var(--bad-soft);
  white-space: pre-wrap;
  margin-bottom: var(--sp-3);
}
.pg__empty {
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.pg__frame {
  flex: 1;
  min-height: 400px;
  border: none;
  background: #fff;
  width: 100%;
}
.pg__tabs {
  gap: 2px;
  padding: 6px 6px 0;
}
.pg__tab {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--r-sm) var(--r-sm) 0 0;
}
.pg__tab--active {
  background: var(--bg-3);
  color: var(--text);
}
.pg__actions {
  margin-top: var(--sp-4);
}
@media (max-width: 820px) {
  .pg__grid {
    grid-template-columns: 1fr;
  }
}
</style>
