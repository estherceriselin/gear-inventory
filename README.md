# gear — Equipment Serial Number Tracker

A Terminal CLI for tracking camera gear serial numbers with PhotoMechanic integration.

## Setup

No install needed. Requires Python 3 (already on macOS).

```
chmod +x gear
```

## Usage

### Add gear

```
./gear add "Canon R5" --serial 012345678
./gear add "Canon RF 70-200mm f/2.8" --serial 987654321 --category lens --code 70200
./gear add "Godox V1" --serial GDX00112 -c flash --code v1 -n "on-camera"
```

| Flag | Short | Required | Description |
|------|-------|----------|-------------|
| `--serial` | `-s` | Yes | Serial number |
| `--category` | `-c` | No | Category (body, lens, flash, grip, etc.) |
| `--code` | | No | Short code for PhotoMechanic code replacement |
| `--notes` | `-n` | No | Free-text notes |

### List gear

```
./gear list              # everything
./gear list -c lens      # filter by category
```

### Search

Searches across name, serial, category, code, and notes:

```
./gear search canon
./gear search 012345
```

### Edit

Match by name or serial, then pass the fields to update:

```
./gear edit R5 --notes "primary body"
./gear edit 012345 --category body
```

### Remove

```
./gear remove "Godox V1"
```

If multiple items match, it'll ask you to be more specific.

## Exporting

### Plain text (insurance, records)

```
./gear export txt
```

Produces `gear_inventory.txt`:

```
Equipment Inventory — exported 2026-06-25

Canon R5  |  Serial: 012345678  |  body  |  body 1
Canon RF 70-200mm f/2.8  |  Serial: 987654321  |  lens
```

### CSV (spreadsheets)

```
./gear export csv
```

Produces `gear_inventory.csv` with columns: Name, Serial, Category, PM Code, Notes, Date Added.

### PhotoMechanic code replacements

```
./gear export pm
```

Produces `gear_serial_codes.txt` — a tab-delimited file mapping short codes to serial numbers:

```
r5	012345678
70200	987654321
v1	GDX00112
```

To use in PhotoMechanic:
1. Run `./gear export pm`
2. Copy `gear_serial_codes.txt` to PhotoMechanic's code replacement directory
3. In PM, type your short code (e.g. `r5`) in the Serial Number IPTC field — it expands to the full serial

All exports accept `--output`/`-o` to specify a custom filename:

```
./gear export txt -o ~/Desktop/gear_for_insurance.txt
```

## Data storage

Everything is stored in `gear_inventory.json` in the same directory as the script. It's plain JSON — human-readable and easy to back up.
