#!/usr/bin/env node
import { Command, Option } from 'commander'
import { titlesAction } from './commands/titles.js'

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

program.parse()
