# ecfr

CLI for the [Electronic Code of Federal Regulations](https://www.ecfr.gov) (eCFR) API.

Search, browse, and read federal regulations from your terminal.

## Install

```bash
npm install -g ecfr
```

Or run directly:

```bash
npx ecfr titles
```

## Commands

### List all CFR titles

```bash
ecfr titles
```

### List agencies

```bash
ecfr agencies
ecfr agencies --filter defense
```

### Browse title structure

```bash
ecfr structure 32
ecfr structure 32 --date 2025-01-01
```

### Read regulation text

```bash
ecfr read 32 --part 2002 --section 2002.14
ecfr read 32 --part 2002 --xml          # raw XML output
ecfr read 48 --part 252 --date 2025-06-01
```

### Search regulations

```bash
ecfr search "controlled unclassified information"
ecfr search "cybersecurity" --title 32
ecfr search "CUI" --page 2 --per-page 5
```

### Search result counts

```bash
ecfr counts "cybersecurity"
ecfr counts "cybersecurity" --agency defense-department
```

### Track changes

```bash
ecfr changes 32 --since 2025-01-01
ecfr changes 48 --part 252
```

### View corrections

```bash
ecfr corrections
ecfr corrections --title 32
```

## Output modes

| Context | Output |
|---------|--------|
| Terminal (TTY) | Colored tables and formatted text |
| Piped (`\| jq`) | JSON |
| `--json` flag | JSON (always) |

## Requirements

Node.js 18+

## API

This tool wraps the public [eCFR API](https://www.ecfr.gov/developer/documentation/api/v1). No authentication required.

## License

MIT
