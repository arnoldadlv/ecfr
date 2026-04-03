import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { countsAction } from '../../src/commands/counts.js'

describe('countsAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('fetches counts with query and optional agency filter', async () => {
    const data = {
      meta: { total_count: 120 },
      count: {
        '32': { count: 45, children: { 'I': { count: 30, children: {} } } },
      },
    }
    mockFetch.mockResolvedValueOnce(data)

    await countsAction('cybersecurity', { agency: 'defense-department' }, { json: true })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/search/v1/counts?query=cybersecurity')
    )
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('agency=defense-department')
    )
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
  })

  it('renders human tree output', async () => {
    const originalIsTTY = process.stdout.isTTY
    Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true })

    const data = {
      meta: { total_count: 45 },
      count: {
        '32': { count: 45, children: { 'I': { count: 30, children: {} } } },
      },
    }
    mockFetch.mockResolvedValueOnce(data)

    await countsAction('cybersecurity', {}, { json: false })
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('45')
    expect(outputText).toContain('32')

    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, writable: true })
  })
})
