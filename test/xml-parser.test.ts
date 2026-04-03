import { describe, it, expect } from 'vitest'
import { xmlToText } from '../src/xml-parser.js'

describe('xmlToText', () => {
  it('converts simple CFR XML to readable text', () => {
    const xml = `
      <SECTION>
        <SECTNO>§ 2002.14</SECTNO>
        <SUBJECT>Safeguarding</SUBJECT>
        <P>(a) CUI must be safeguarded using controls.</P>
        <P>(b) Agencies shall implement requirements.</P>
      </SECTION>
    `
    const text = xmlToText(xml)
    expect(text).toContain('§ 2002.14')
    expect(text).toContain('Safeguarding')
    expect(text).toContain('(a) CUI must be safeguarded')
  })
})
