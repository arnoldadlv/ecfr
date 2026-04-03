import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { changesAction } from '../../src/commands/changes.js'

describe('changesAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('fetches versions for a title with optional filters', async () => {
    const data = {
      content_versions: [{
        date: '2026-03-15',
        amendment_date: '2026-03-10',
        identifier: 'title-32',
        name: 'National Defense',
        part: '2002',
        substantive: true,
      }],
    }
    mockFetch.mockResolvedValueOnce(data)

    await changesAction('32', { part: '2002', since: '2025-01-01' }, { json: true })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/versioner/v1/versions/title-32')
    )
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('part=2002')
    )
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('issue_date%5Bgte%5D=2025-01-01')
    )
  })

  it('renders human table output', async () => {
    const originalIsTTY = process.stdout.isTTY
    Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true })

    const data = {
      content_versions: [{
        date: '2026-03-15',
        amendment_date: '2026-03-10',
        identifier: 'title-32',
        name: 'National Defense',
        part: '2002',
        substantive: true,
      }],
    }
    mockFetch.mockResolvedValueOnce(data)

    await changesAction('32', {}, { json: false })
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('2026-03-15')
    expect(outputText).toContain('National Defense')

    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, writable: true })
  })
})
