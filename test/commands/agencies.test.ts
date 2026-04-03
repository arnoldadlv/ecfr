import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { agenciesAction } from '../../src/commands/agencies.js'

describe('agenciesAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('fetches and outputs agencies as JSON', async () => {
    const data = {
      agencies: [
        { name: 'Department of Defense', short_name: 'DOD', slug: 'defense-department', cfr_references: [{ title: 32, chapter: 'I' }], children: [] },
      ],
    }
    mockFetch.mockResolvedValueOnce(data)

    await agenciesAction({}, { json: true })
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/v1/agencies.json')
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
  })

  it('filters agencies by name', async () => {
    const data = {
      agencies: [
        { name: 'Department of Defense', short_name: 'DOD', slug: 'defense-department', cfr_references: [], children: [] },
        { name: 'Environmental Protection Agency', short_name: 'EPA', slug: 'epa', cfr_references: [], children: [] },
      ],
    }
    mockFetch.mockResolvedValueOnce(data)

    await agenciesAction({ filter: 'defense' }, { json: false })
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('Department of Defense')
    expect(outputText).not.toContain('Environmental Protection')
  })
})
