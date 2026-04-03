const BASE_URL = 'https://www.ecfr.gov'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function ecfrFetch(path: string): Promise<unknown> {
  const url = `${BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    })
  } catch (err) {
    throw new Error('Could not reach ecfr.gov — check your connection')
  }

  if (response.status === 429) {
    // Retry once after a short delay
    await new Promise(r => setTimeout(r, 2000))
    try {
      response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      })
    } catch (err) {
      throw new Error('Could not reach ecfr.gov — check your connection')
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, `eCFR API returned ${response.status} — ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('json')) {
    return response.json()
  }
  return response.text()
}

export async function ecfrFetchXml(path: string): Promise<string> {
  const url = `${BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'Accept': 'application/xml' },
    })
  } catch (err) {
    throw new Error('Could not reach ecfr.gov — check your connection')
  }

  if (!response.ok) {
    throw new ApiError(response.status, `eCFR API returned ${response.status} — ${response.statusText}`)
  }

  return response.text()
}
