#!/usr/bin/env node
import { Command, Option } from 'commander'
import { titlesAction } from './commands/titles.js'
import { agenciesAction } from './commands/agencies.js'
import { structureAction } from './commands/structure.js'
import { searchAction } from './commands/search.js'
import { countsAction } from './commands/counts.js'
import { changesAction } from './commands/changes.js'

const program = new Command()

program
  .name('ecfr')
  .description('CLI for the Electronic Code of Federal Regulations (eCFR)')
  .version('0.1.0')

program.addOption(
  new Option('--json', 'Output raw JSON').default(false)
)

program
  .command('titles')
  .description('List all CFR titles')
  .action(async (_opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await titlesAction(globalOpts)
  })

program
  .command('agencies')
  .description('List all CFR agencies')
  .option('--filter <text>', 'Filter agencies by name')
  .action(async (opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await agenciesAction(opts, globalOpts)
  })

program
  .command('structure <title>')
  .description('Browse hierarchy of a CFR title')
  .option('--date <date>', 'Date in YYYY-MM-DD format (defaults to today)')
  .action(async (title, opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await structureAction(title, opts, globalOpts)
  })

program
  .command('search <query>')
  .description('Search across all CFR text')
  .option('--title <n>', 'Filter by CFR title number')
  .option('--agency <slug>', 'Filter by agency slug')
  .option('--page <n>', 'Page number')
  .option('--per-page <n>', 'Results per page')
  .action(async (query, opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await searchAction(query, opts, globalOpts)
  })

program
  .command('counts <query>')
  .description('Search result counts by hierarchy')
  .option('--agency <slug>', 'Filter by agency slug')
  .action(async (query, opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await countsAction(query, opts, globalOpts)
  })

program
  .command('changes <title>')
  .description('Track regulation amendments for a title')
  .option('--part <n>', 'Filter by part number')
  .option('--section <n>', 'Filter by section number')
  .option('--since <date>', 'Only show changes after this date (YYYY-MM-DD)')
  .action(async (title, opts, cmd) => {
    const globalOpts = cmd.optsWithGlobals()
    await changesAction(title, opts, globalOpts)
  })

program.parse()
