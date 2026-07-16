import type { SqlJsStatic } from 'sql.js'

export interface SqlResult {
  columns: string[]
  rows: unknown[][]
}

export interface SqlOutcome {
  ok: boolean
  result?: SqlResult
  expected?: SqlResult
  passed?: boolean
  error?: string
}

function execLast(db: import('sql.js').Database, sql: string): SqlResult {
  const res = db.exec(sql)
  if (res.length === 0) return { columns: [], rows: [] }
  const last = res[res.length - 1]
  return { columns: last.columns, rows: last.values }
}

function evaluate(SQL: SqlJsStatic, schema: string, sql: string, verify?: string): SqlResult {
  const db = new SQL.Database()
  try {
    db.run(schema)
    if (verify) {
      db.run(sql)
      return execLast(db, verify)
    }
    return execLast(db, sql)
  } finally {
    db.close()
  }
}

function canonical(r: SqlResult, orderMatters: boolean): string {
  const rows = r.rows.map((row) => JSON.stringify(row))
  if (!orderMatters) rows.sort()
  return JSON.stringify(rows)
}

export function compareResults(a: SqlResult, b: SqlResult, orderMatters: boolean): boolean {
  return canonical(a, orderMatters) === canonical(b, orderMatters)
}

export function runSql(
  SQL: SqlJsStatic,
  schema: string,
  learnerSql: string,
  referenceSql: string,
  verify: string | undefined,
  orderMatters: boolean,
): SqlOutcome {
  let expected: SqlResult | undefined
  try {
    expected = evaluate(SQL, schema, referenceSql, verify)
  } catch (err) {
    return {
      ok: false,
      error: `Эталонное решение не выполнилось: ${err instanceof Error ? err.message : String(err)}`,
    }
  }

  try {
    const result = evaluate(SQL, schema, learnerSql, verify)
    return { ok: true, result, expected, passed: compareResults(result, expected, orderMatters) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err), expected }
  }
}
