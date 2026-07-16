import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { sql, SQLite } from '@codemirror/lang-sql'
import type { Extension } from '@codemirror/state'

export type EditorLang = 'js' | 'ts' | 'html' | 'css' | 'sql'

export function langExtension(lang: EditorLang): Extension {
  switch (lang) {
    case 'html':
      return html({ autoCloseTags: true, matchClosingTags: true, selfClosingTags: true })
    case 'css':
      return css()
    case 'sql':
      return sql({ dialect: SQLite, upperCaseKeywords: true })
    case 'ts':
      return javascript({ typescript: true })
    default:
      return javascript()
  }
}

export const cqTheme = EditorView.theme(
  {
    '&': {
      color: '#f2f4fd',
      backgroundColor: 'transparent',
      fontSize: '14px',
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
      lineHeight: '1.65',
    },
    '.cm-content': {
      caretColor: '#7c5cff',
      padding: '12px 0',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#7c5cff', borderLeftWidth: '2px' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(124, 92, 255, 0.28)',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#4b5478',
      border: 'none',
      paddingRight: '4px',
    },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#9aa3c4' },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.035)' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 12px', minWidth: '28px' },
    '.cm-foldGutter .cm-gutterElement': { color: '#4b5478' },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(56, 225, 216, 0.2)',
      outline: '1px solid rgba(56, 225, 216, 0.5)',
      color: 'inherit',
    },
    '.cm-selectionMatch': { backgroundColor: 'rgba(124, 92, 255, 0.18)' },
    '.cm-tooltip': {
      backgroundColor: '#1b1f37',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 12px 32px -12px rgba(0,0,0,0.6)',
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: 'rgba(124, 92, 255, 0.28)',
      color: '#fff',
    },
    '.cm-tooltip-autocomplete ul li': { padding: '3px 8px' },
    '.cm-completionIcon': { opacity: '0.7' },
  },
  { dark: true },
)

export const cqHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.keyword, color: '#ff6fae', fontWeight: '600' },
    { tag: [t.controlKeyword, t.moduleKeyword], color: '#ff6fae' },
    { tag: [t.name, t.deleted, t.character, t.macroName], color: '#f2f4fd' },
    { tag: [t.propertyName], color: '#38e1d8' },
    { tag: [t.variableName], color: '#c7cdf0' },
    { tag: [t.function(t.variableName), t.labelName], color: '#63b3ff' },
    { tag: [t.definition(t.variableName)], color: '#f2f4fd' },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#ffb648' },
    { tag: [t.string, t.special(t.string), t.inserted], color: '#8ce99a' },
    { tag: [t.number, t.bool, t.null, t.atom], color: '#ffb648' },
    { tag: [t.definition(t.name), t.separator], color: '#f2f4fd' },
    { tag: [t.className, t.typeName, t.namespace], color: '#ffd23f' },
    { tag: [t.operator, t.operatorKeyword], color: '#9aa3c4' },
    { tag: [t.meta, t.comment], color: '#626b8f', fontStyle: 'italic' },
    { tag: [t.tagName], color: '#ff6fae' },
    { tag: [t.attributeName], color: '#b3a1ff' },
    { tag: [t.attributeValue], color: '#8ce99a' },
    { tag: t.angleBracket, color: '#626b8f' },
    { tag: [t.regexp], color: '#38e1d8' },
    { tag: [t.link, t.url], color: '#63b3ff', textDecoration: 'underline' },
    { tag: t.invalid, color: '#ff5d67' },
  ]),
)
