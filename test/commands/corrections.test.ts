import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/api.js', () => ({
  ecfrFetch: vi.fn(),
}))

import { ecfrFetch } from '../../src/api.js'
import { correctionsAction } from '../../src/commands/corrections.js'

describe('correctionsAction', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  const mockFetch = vi.mocked(ecfrFetch)

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('calls all-corrections endpoint when no title given', async () => {
    const data = {
      ecfr_corrections: [{
        fr_citation: '90 FR 12345',
        corrective_action: 'Correcting amendment',
        error_corrected: '2026-01-15',
        error_occurred: '2025-12-01',
        title: 32,
        cfr_references: [{ cfr_reference: '32 CFR 2002.14' }],
      }],
    }
    mockFetch.mockResolvedValueOnce(data)

    await correctionsAction({}, { json: true })
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/v1/corrections')
  })

  it('calls title-specific endpoint when title given', async () => {
    const data = { ecfr_corrections: [] }
    mockFetch.mockResolvedValueOnce(data)

    await correctionsAction({ title: '32' }, { json: true })
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/v1/corrections/title-32')
  })

  it('renders human table output', async () => {
    const originalIsTTY = process.stdout.isTTY
    Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true })

    const data = {
      ecfr_corrections: [{
        fr_citation: '90 FR 12345',
        corrective_action: 'Correcting amendment',
        error_corrected: '2026-01-15',
        error_occurred: '2025-12-01',
        title: 32,
        cfr_references: [{ cfr_reference: '32 CFR 2002.14' }],
      }],
    }
    mockFetch.mockResolvedValueOnce(data)

    await correctionsAction({}, { json: false })
    const outputText = logSpy.mock.calls[0][0] as string
    expect(outputText).toContain('90 FR 12345')
    expect(outputText).toContain('Correcting amendment')

    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, writable: true })
  })
})
