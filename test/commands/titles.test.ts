import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the api module before importing the command
vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { titlesAction } from '../../src/commands/titles.js'

describe('titlesAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('fetches and outputs titles as JSON when json option is set', async () => {
    const data = {
      titles: [
        { number: 1, name: 'General Provisions', latest_amended_on: '2026-03-15', up_to_date_as_of: '2026-03-20' },
        { number: 32, name: 'National Defense', latest_amended_on: '2026-03-30', up_to_date_as_of: '2026-04-01' },
      ],
    }
    mockFetch.mockResolvedValueOnce(data)

    await titlesAction({ json: true })

    expect(mockFetch).toHaveBeenCalledWith('/api/versioner/v1/titles')
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
  })

  it('fetches and outputs titles as a table when not json', async () => {
    const data = {
      titles: [
        { number: 1, name: 'General Provisions', latest_amended_on: '2026-03-15', up_to_date_as_of: '2026-03-20' },
      ],
    }
    mockFetch.mockResolvedValueOnce(data)

    await titlesAction({ json: false })

    expect(mockFetch).toHaveBeenCalledWith('/api/versioner/v1/titles')
    // Should output a table string containing the title info
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('General Provisions')
  })
})
