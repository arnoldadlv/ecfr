import chalk from 'chalk'
import Table from 'cli-table3'
import { ecfrFetch } from '../api.js'
import { shouldOutputJson, output } from '../formatter.js'

interface ContentVersion {
  date: string
  amendment_date: string
  identifier: string
  name: string
  part: string
  substantive: boolean
}

interface VersionsResponse {
  content_versions: ContentVersion[]
}

export async function changesAction(
  title: string,
  opts: { part?: string; section?: string; since?: string },
  globalOpts: { json?: boolean },
): Promise<void> {
  const params = new URLSearchParams()
  if (opts.part) params.set('part', opts.part)
  if (opts.section) params.set('section', opts.section)
  if (opts.since) params.set('issue_date[gte]', opts.since)

  let path = `/api/versioner/v1/versions/title-${title}`
  const qs = params.toString()
  if (qs) path += `?${qs}`

  const data = await ecfrFetch(path) as VersionsResponse
  const asJson = shouldOutputJson(globalOpts)

  if (asJson) {
    output(data, '', true)
    return
  }

  const table = new Table({
    head: [
      chalk.bold('Date'),
      chalk.bold('Amendment'),
      chalk.bold('Name'),
      chalk.bold('Part'),
      chalk.bold('Substantive'),
    ],
    colWidths: [14, 14, 40, 10, 14],
  })

  for (const v of data.content_versions) {
    table.push([
      v.date,
      v.amendment_date ?? '—',
      v.name,
      v.part ?? '—',
      v.substantive ? chalk.green('yes') : 'no',
    ])
  }

  output(data, table.toString(), false)
}
