<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, keymap, placeholder as cmPlaceholder } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { acceptCompletion, completeAnyWord } from '@codemirror/autocomplete'
import { indentUnit } from '@codemirror/language'
import { cqHighlight, cqTheme, langExtension, type EditorLang } from '@/engine/editorSetup'

const model = defineModel<string>({ required: true })
const props = withDefaults(
  defineProps<{ lang?: EditorLang; readonly?: boolean; placeholder?: string }>(),
  { lang: 'js', readonly: false, placeholder: '' },
)

const host = ref<HTMLDivElement>()
let view: EditorView | null = null
const readonlyComp = new Compartment()

function buildExtensions() {
  return [
    basicSetup,
    keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
    EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }]),
    indentUnit.of('  '),
    langExtension(props.lang),
    cqTheme,
    cqHighlight,
    cmPlaceholder(props.placeholder),
    EditorView.lineWrapping,
    readonlyComp.of(EditorState.readOnly.of(props.readonly)),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) {
        const value = u.state.doc.toString()
        if (value !== model.value) model.value = value
      }
    }),
  ]
}

onMounted(() => {
  view = new EditorView({
    parent: host.value,
    state: EditorState.create({ doc: model.value, extensions: buildExtensions() }),
  })
})

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})

watch(model, (val) => {
  if (view && val !== view.state.doc.toString()) {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: val } })
  }
})

watch(
  () => props.readonly,
  (ro) => {
    view?.dispatch({ effects: readonlyComp.reconfigure(EditorState.readOnly.of(ro)) })
  },
)
</script>

<template>
  <div ref="host" class="cm-host" :class="{ 'cm-host--ro': readonly }" />
</template>

<style scoped>
.cm-host {
  height: 100%;
  overflow: hidden;
}
.cm-host :deep(.cm-editor) {
  height: 100%;
}
.cm-host :deep(.cm-editor.cm-focused) {
  outline: none;
}
.cm-host :deep(.cm-scroller) {
  overflow: auto;
}
.cm-host--ro :deep(.cm-content) {
  opacity: 0.85;
}
</style>
