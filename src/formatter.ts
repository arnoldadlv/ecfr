export function shouldOutputJson(opts: { json?: boolean }): boolean {
  if (opts.json) return true
  return !process.stdout.isTTY
}

export function output(data: unknown, humanText: string, asJson: boolean): void {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2))
  } else {
    console.log(humanText)
  }
}
