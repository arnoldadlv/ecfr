import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { structureAction } from '../../src/commands/structure.js'

describe('structureAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('fetches structure for a title and outputs JSON', async () => {
    const data = {
      identifier: 'title-32',
      label: 'Title 32',
      children: [{ identifier: 'chapter-I', label: 'Chapter I', children: [] }],
    }
    mockFetch.mockResolvedValueOnce(data)

    await structureAction('32', { date: '2026-04-01' }, { json: true })
    expect(mockFetch).toHaveBeenCalledWith('/api/versioner/v1/structure/2026-04-01/title-32.json')
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
  })

  it('renders a tree view for human output', async () => {
    const data = {
      identifier: 'title-32',
      label: 'Title 32',
      children: [
        {
          identifier: 'chapter-I',
          label: 'Chapter I',
          children: [
            { identifier: 'part-2002', label: 'Part 2002', label_description: 'CUI', children: [] },
          ],
        },
      ],
    }
    mockFetch.mockResolvedValueOnce(data)

    await structureAction('32', { date: '2026-04-01' }, { json: false })
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('Chapter I')
    expect(outputText).toContain('Part 2002')
  })
})
