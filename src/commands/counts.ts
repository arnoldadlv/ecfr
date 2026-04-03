import chalk from 'chalk'
import { ecfrFetch } from '../api.js'
import { shouldOutputJson, output } from '../formatter.js'

interface CountNode {
  count: number
  children: Record<string, CountNode>
}

interface CountsResponse {
  meta: { total_count: number }
  count: Record<string, CountNode>
}

export async function countsAction(
  query: string,
  opts: { agency?: string },
  globalOpts: { json?: boolean },
): Promise<void> {
  const params = new URLSearchParams({ query })
  if (opts.agency) params.set('agency', opts.agency)

  const data = await ecfrFetch(`/api/search/v1/counts?${params}`) as CountsResponse
  const asJson = shouldOutputJson(globalOpts)

  if (asJson) {
    output(data, '', true)
    return
  }

  const lines: string[] = []
  lines.push(chalk.bold(`Total: ${data.meta.total_count} results`))
  lines.push('')

  renderCountTree(data.count, lines, 0, 'Title')

  output(data, lines.join('\n'), false)
}

function renderCountTree(
  node: Record<string, CountNode>,
  lines: string[],
  depth: number,
  prefix: string,
): void {
  const indent = '  '.repeat(depth)
  for (const [key, value] of Object.entries(node)) {
    lines.push(`${indent}${prefix} ${key}: ${chalk.yellow(String(value.count))}`)
    if (value.children && Object.keys(value.children).length > 0) {
      const childPrefix = depth === 0 ? 'Chapter' : 'Part'
      renderCountTree(value.children, lines, depth + 1, childPrefix)
    }
  }
}
