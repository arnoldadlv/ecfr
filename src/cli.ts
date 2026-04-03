#!/usr/bin/env node
import { Command, Option } from 'commander'
import { titlesAction } from './commands/titles.js'
import { agenciesAction } from './commands/agencies.js'

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

program.parse()
