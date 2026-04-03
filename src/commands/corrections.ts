import chalk from 'chalk'
import Table from 'cli-table3'
import { ecfrFetch } from '../api.js'
import { shouldOutputJson, output } from '../formatter.js'

interface Correction {
  fr_citation: string
  corrective_action: string
  error_corrected: string
  error_occurred: string
  title: number
  cfr_references: { cfr_reference: string }[]
}

interface CorrectionsResponse {
  ecfr_corrections: Correction[]
}

export async function correctionsAction(
  opts: { title?: string; date?: string },
  globalOpts: { json?: boolean },
): Promise<void> {
  let path = opts.title
    ? `/api/admin/v1/corrections/title-${opts.title}`
    : '/api/admin/v1/corrections'

  const data = await ecfrFetch(path) as CorrectionsResponse
  const asJson = shouldOutputJson(globalOpts)

  if (asJson) {
    output(data, '', true)
    return
  }

  const table = new Table({
    head: [
      chalk.bold('FR Citation'),
      chalk.bold('Title'),
      chalk.bold('CFR Reference'),
      chalk.bold('Action'),
      chalk.bold('Corrected'),
    ],
    colWidths: [18, 8, 22, 28, 14],
  })

  for (const c of data.ecfr_corrections) {
    const refs = c.cfr_references?.map(r => r.cfr_reference).join(', ') ?? '—'
    table.push([
      c.fr_citation,
      c.title,
      refs,
      c.corrective_action,
      c.error_corrected ?? '—',
    ])
  }

  output(data, table.toString(), false)
}
