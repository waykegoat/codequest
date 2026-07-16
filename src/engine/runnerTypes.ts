export interface RunRequest {
  code: string
  entry: string
  tests: { name: string; args: unknown[]; expected: unknown }[]
  expectedLogs?: string[]
}

export interface TestResult {
  name: string
  passed: boolean
  expected: string
  actual: string
  error?: string
}

export interface WorkerResponse {
  ok: boolean
  compileError?: string
  results?: TestResult[]
  logs: string[]
}

export interface RunOutcome extends WorkerResponse {
  allPassed: boolean
  timedOut?: boolean
}
