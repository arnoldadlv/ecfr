import chalk from 'chalk'
import Table from 'cli-table3'
import { ecfrFetch } from '../api.js'
import { shouldOutputJson, output } from '../formatter.js'

interface Agency {
  name: string
  short_name: string
  slug: string
  cfr_references: { title: number; chapter: string }[]
  children: Agency[]
}

interface AgenciesResponse {
  agencies: Agency[]
}

export async function agenciesAction(
  opts: { filter?: string },
  globalOpts: { json?: boolean },
): Promise<void> {
  const data = await ecfrFetch('/api/admin/v1/agencies.json') as AgenciesResponse
  const asJson = shouldOutputJson(globalOpts)

  let agencies = data.agencies
  if (opts.filter) {
    const term = opts.filter.toLowerCase()
    agencies = agencies.filter(a =>
      a.name.toLowerCase().includes(term) ||
      (a.short_name ?? '').toLowerCase().includes(term)
    )
  }

  if (asJson) {
    output({ agencies }, '', true)
    return
  }

  const table = new Table({
    head: [
      chalk.bold('Agency'),
      chalk.bold('Short Name'),
      chalk.bold('Slug'),
      chalk.bold('CFR Titles'),
    ],
    colWidths: [45, 15, 30, 15],
  })

  for (const a of agencies) {
    table.push([
      a.name,
      a.short_name ?? '—',
      a.slug,
      a.cfr_references.map(r => r.title).join(', ') || '—',
    ])
  }

  output({ agencies }, table.toString(), false)
}
