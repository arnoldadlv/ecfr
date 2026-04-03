import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: false,
  trimValues: true,
})

export function xmlToText(xml: string): string {
  const parsed = parser.parse(xml)
  const lines: string[] = []
  extractText(parsed, lines, 0)
  return lines.join('\n')
}

function extractText(node: unknown, lines: string[], depth: number): void {
  if (typeof node === 'string' || typeof node === 'number') {
    lines.push(String(node))
    return
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      extractText(item, lines, depth)
    }
    return
  }

  if (typeof node === 'object' && node !== null) {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('@_')) continue // skip attributes
      if (['SECTNO', 'SUBJECT', 'HD'].includes(key)) {
        lines.push('')
        lines.push(String(value))
      } else if (key === 'P') {
        if (Array.isArray(value)) {
          for (const p of value) {
            lines.push(typeof p === 'string' ? p : extractInline(p))
          }
        } else {
          lines.push(typeof value === 'string' ? value : extractInline(value))
        }
      } else {
        extractText(value, lines, depth + 1)
      }
    }
  }
}

function extractInline(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractInline).join('')
  if (typeof node === 'object' && node !== null) {
    return Object.entries(node)
      .filter(([k]) => !k.startsWith('@_'))
      .map(([_, v]) => extractInline(v))
      .join('')
  }
  return ''
}
