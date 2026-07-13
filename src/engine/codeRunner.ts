import RunnerWorker from './runner.worker.ts?worker'
import type { RunRequest, RunOutcome } from './runnerTypes'

export function runCode(req: RunRequest, timeoutMs = 3000): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const worker = new RunnerWorker()
    let settled = false

    const finish = (outcome: RunOutcome) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve(outcome)
    }

    const timer = setTimeout(() => {
      finish({
        ok: false,
        allPassed: false,
        timedOut: true,
        logs: [],
        compileError: '⏱ Превышено время выполнения (3 c). Похоже на бесконечный цикл.',
      })
    }, timeoutMs)

    worker.onmessage = (e: MessageEvent) => {
      const data = e.data
      const allPassed =
        Boolean(data.ok) &&
        Array.isArray(data.results) &&
        data.results.length > 0 &&
        data.results.every((r: { passed: boolean }) => r.passed)
      finish({ ...data, allPassed })
    }

    worker.onerror = (err: ErrorEvent) => {
      finish({
        ok: false,
        allPassed: false,
        logs: [],
        compileError: err.message || 'Ошибка выполнения кода',
      })
    }

    worker.postMessage(req)
  })
}
