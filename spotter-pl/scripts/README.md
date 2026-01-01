# migration scripts

## setup

install dependencies:
```bash
npm install
```

## running the scripts

you have three separate scripts for different operations:

### available scripts

1. **setup schema only** - creates tables and indexes:
```bash
npm run setup-schema
```

2. **download data only** - downloads and unzips csv files:
```bash
npm run download-data
```

3. **import data only** - imports csv files into database:
```bash
npm run import-data
```

4. **populate lifter search table** - creates aggregated lifter data for fast searches:
```bash
npm run populate-lifter-search
```

### typical workflow

- first time setup: run the three steps in order
- updating data: `npm run download-data` then `npm run import-data`
- schema changes only: `npm run setup-schema`

```bash
# first time setup
npm run setup-schema
npm run download-data
npm run import-data
npm run populate-lifter-search
```

## what it does

- downloads from:
  - https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip
  - https://openpowerlifting.gitlab.io/opl-csv/files/openipf-latest.zip
- creates schema `opl` with tables `opl_raw` and `ipf_raw`
- imports all csv data with proper type conversions
- creates indexes for common queries (name, federation, date, division, etc.)

## database tables

both tables have the same structure with columns for:
- athlete info (name, sex, age, bodyweight, etc.)
- lift attempts (squat1-4, bench1-4, deadlift1-4)
- best lifts and totals
- calculated points (dots, wilks, glossbrenner, goodlift)
- meet info (date, location, federation, etc.)

## notes

- the script uses batched inserts (1000 rows at a time) for efficiency
- existing data is truncated before import
- downloads are stored in `data/downloads/` directory
- zip files are cleaned up after extraction
- csv files are kept in the downloads directory for future use
- download script skips if zip files already exist
