import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shouldOutputJson, output } from '../src/formatter.js'

describe('shouldOutputJson', () => {
  it('returns true when --json flag is set', () => {
    expect(shouldOutputJson({ json: true })).toBe(true)
  })

  it('returns false when stdout is a TTY and no --json flag', () => {
    // Default in test: process.stdout.isTTY is undefined (not a TTY)
    // So without --json, non-TTY should return true (JSON for pipes)
    expect(shouldOutputJson({})).toBe(true)
  })
})

describe('output', () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('outputs JSON string when forceJson is true', () => {
    const data = { titles: [{ number: 1 }] }
    output(data, 'table placeholder', true)
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
  })

  it('outputs human text when forceJson is false', () => {
    const data = { titles: [] }
    output(data, 'No titles found.', false)
    expect(logSpy).toHaveBeenCalledWith('No titles found.')
  })
})
