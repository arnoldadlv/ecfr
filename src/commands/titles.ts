import chalk from 'chalk'
import Table from 'cli-table3'
import { ecfrFetch } from '../api.js'
import { shouldOutputJson, output } from '../formatter.js'

interface Title {
  number: number
  name: string
  latest_amended_on: string
  up_to_date_as_of: string
  reserved: boolean
}

interface TitlesResponse {
  titles: Title[]
}

export async function titlesAction(opts: { json?: boolean }): Promise<void> {
  const data = await ecfrFetch('/api/versioner/v1/titles') as TitlesResponse
  const asJson = shouldOutputJson(opts)

  if (asJson) {
    output(data, '', true)
    return
  }

  const table = new Table({
    head: [
      chalk.bold('#'),
      chalk.bold('Title'),
      chalk.bold('Last Amended'),
      chalk.bold('Up To Date As Of'),
    ],
    colWidths: [6, 55, 16, 20],
  })

  for (const t of data.titles) {
    if (t.reserved) continue
    table.push([
      t.number,
      t.name,
      t.latest_amended_on ?? '—',
      t.up_to_date_as_of ?? '—',
    ])
  }

  output(data, table.toString(), false)
}
