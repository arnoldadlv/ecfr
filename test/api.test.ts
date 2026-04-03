import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ecfrFetch, ApiError } from '../src/api.js'

describe('ecfrFetch', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches JSON from the eCFR API', async () => {
    const data = { titles: [{ number: 1, name: 'General Provisions' }] }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })

    const result = await ecfrFetch('/api/versioner/v1/titles')
    expect(result).toEqual(data)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.ecfr.gov/api/versioner/v1/titles',
      expect.objectContaining({ headers: expect.any(Object) })
    )
  })

  it('throws ApiError on non-ok responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('Not found'),
    })

    await expect(ecfrFetch('/api/versioner/v1/titles'))
      .rejects.toThrow(ApiError)
  })

  it('throws friendly error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'))

    await expect(ecfrFetch('/api/versioner/v1/titles'))
      .rejects.toThrow('Could not reach ecfr.gov')
  })

  it('retries once on 429 then throws if still 429', async () => {
    const rateLimited = {
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      text: () => Promise.resolve('Rate limited'),
    }
    mockFetch
      .mockResolvedValueOnce(rateLimited)
      .mockResolvedValueOnce(rateLimited)

    await expect(ecfrFetch('/api/versioner/v1/titles'))
      .rejects.toThrow(ApiError)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})
