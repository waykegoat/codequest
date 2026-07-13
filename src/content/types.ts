export type CodeLang = 'js' | 'ts' | 'html' | 'css' | 'sql'

export type TheoryBlock =
  | { type: 'text'; md: string }
  | { type: 'code'; lang: CodeLang; code: string }
  | { type: 'callout'; tone: 'info' | 'tip' | 'warning'; md: string }
  | { type: 'image'; src: string; alt: string }

export interface TheoryStep {
  kind: 'theory'
  title: string
  blocks: TheoryBlock[]
}

export interface QuizStep {
  kind: 'quiz'
  question: string
  options: string[]

  answer: number
  explanation?: string
}

export interface TestCase {
  name: string

  args: unknown[]

  expected: unknown
}

export interface CodeStep {
  kind: 'code'
  title: string

  prompt: string
  lang: CodeLang

  entry: string

  starter: string
  tests: TestCase[]
  hints?: string[]

  solution?: string
}

export type MarkupCheck =
  | { name: string; kind: 'exists'; selector: string }
  | { name: string; kind: 'count'; selector: string; equals: number }
  | { name: string; kind: 'text'; selector: string; equals: string }
  | { name: string; kind: 'contains'; selector: string; text: string }
  | { name: string; kind: 'attr'; selector: string; attr: string; equals: string }
  | { name: string; kind: 'style'; selector: string; prop: string; equals: string }

export interface MarkupStep {
  kind: 'markup'
  title: string
  prompt: string

  editors: ('html' | 'css')[]
  starterHtml?: string
  starterCss?: string
  checks: MarkupCheck[]
  hints?: string[]
  solutionHtml?: string
  solutionCss?: string
}

export interface BlankStep {
  kind: 'blank'
  title: string
  prompt: string
  lang: CodeLang
  template: string
  blanks: { answer: string; width?: number }[]
  hints?: string[]
}

export interface OrderStep {
  kind: 'order'
  title: string
  prompt: string
  lang: CodeLang
  lines: string[]
  hints?: string[]
}

export type LessonStep = TheoryStep | QuizStep | CodeStep | MarkupStep | BlankStep | OrderStep

export interface Lesson {
  id: string
  title: string

  subtitle: string

  xp: number

  icon: string
  steps: LessonStep[]
}

export interface Module {
  id: string
  title: string
  description: string

  color: string
  icon: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
}
