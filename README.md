# SpotterPL.com

A powerlifting database and athlete comparison tool.
This site uses data from the OpenPowerlifting project,
https://www.openpowerlifting.org

[Data Service Reference](https://openpowerlifting.gitlab.io/opl-csv/introduction.html)

## Features

- Search powerlifting athletes across multiple federations
- Users can also manually enter SBD (Squat, Bench, Deadlift) numbers to compare against pre-existing athletes
- Compare athlete rankings and personal records
- View progression charts and meet history
- Filter by federation, weight class, division, and tested status
- Find athletes with similar strength levels


## Contributing!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request


## Tech Stack

- Next.js 16
- TypeScript
- PostgreSQL (Aiven)
- Tailwind CSS
- DaisyUI


## Technical Features
- Automated weekly cron job, using custom ETL pipeline to ingest 3+ million rows
- Utilizes PostgreSQL for indexing and trigram (pg_trgm) implementation for fuzzy athlete searches
- Maintains mappings of 100+ federations and countries with respective athletes in each
- URL-based state persistence allows filters and search results to be reflected in the URL - allowing shares and bookmarking
- Database managed on Aiven, deployed on Vercel


## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```


## Environment Variables

Required for database connection:

```
DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
SSL_CERT=-----BEGIN CERTIFICATE-----
[Your SSL certificate]
-----END CERTIFICATE-----
```

Or use individual variables:
```
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
SSL_CERT=
```


## Database Setup

The database uses the Open Powerlifting dataset. To populate:

```bash
npm run setup-schema
npm run download-data
npm run import-data
npm run populate-lifter-search
```

For automated weekly updates:

```bash
npm run update-db
```

To schedule automatic updates (runs Sundays at 2:00 AM):

```bash
bash scripts/setup-cron.sh
```

## Project Structure

```
app/
├── api/           # API routes
├── components/    # React components
└── page.tsx       # Main page
lib/
├── db.ts          # Database connection
└── db-config.ts   # Database configuration
data/              # Static data files
scripts/           # Database scripts
```

## Performance Notes

- Database queries may take 10-30 seconds for broad filter combinations
- Site and database are currently hosted in Sydney, Australia
- Connection pooling is configured with max 3 connections
- SSL is required for database connections
