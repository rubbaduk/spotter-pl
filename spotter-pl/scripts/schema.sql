-- create schema for openpowerlifting data
CREATE SCHEMA IF NOT EXISTS opl;

-- drop existing tables if they exist
DROP TABLE IF EXISTS opl.opl_raw CASCADE;
DROP TABLE IF EXISTS opl.ipf_raw CASCADE;

-- create table for openpowerlifting data
CREATE TABLE opl.opl_raw (
    id SERIAL PRIMARY KEY,
    name TEXT,
    sex TEXT,
    event TEXT,
    equipment TEXT,
    age NUMERIC,
    ageclass TEXT,
    birthyearclass TEXT,
    division TEXT,
    bodyweightkg NUMERIC,
    weightclasskg TEXT,
    squat1kg NUMERIC,
    squat2kg NUMERIC,
    squat3kg NUMERIC,
    squat4kg NUMERIC,
    best3squatkg NUMERIC,
    bench1kg NUMERIC,
    bench2kg NUMERIC,
    bench3kg NUMERIC,
    bench4kg NUMERIC,
    best3benchkg NUMERIC,
    deadlift1kg NUMERIC,
    deadlift2kg NUMERIC,
    deadlift3kg NUMERIC,
    deadlift4kg NUMERIC,
    best3deadliftkg NUMERIC,
    totalkg NUMERIC,
    place TEXT,
    dots NUMERIC,
    wilks NUMERIC,
    glossbrenner NUMERIC,
    goodlift NUMERIC,
    tested TEXT,
    country TEXT,
    state TEXT,
    federation TEXT,
    parentfederation TEXT,
    date DATE,
    meetcountry TEXT,
    meetstate TEXT,
    meettown TEXT,
    meetname TEXT,
    sanctioned TEXT
);

-- create table for openipf data
CREATE TABLE opl.ipf_raw (
    id SERIAL PRIMARY KEY,
    name TEXT,
    sex TEXT,
    event TEXT,
    equipment TEXT,
    age NUMERIC,
    ageclass TEXT,
    birthyearclass TEXT,
    division TEXT,
    bodyweightkg NUMERIC,
    weightclasskg TEXT,
    squat1kg NUMERIC,
    squat2kg NUMERIC,
    squat3kg NUMERIC,
    squat4kg NUMERIC,
    best3squatkg NUMERIC,
    bench1kg NUMERIC,
    bench2kg NUMERIC,
    bench3kg NUMERIC,
    bench4kg NUMERIC,
    best3benchkg NUMERIC,
    deadlift1kg NUMERIC,
    deadlift2kg NUMERIC,
    deadlift3kg NUMERIC,
    deadlift4kg NUMERIC,
    best3deadliftkg NUMERIC,
    totalkg NUMERIC,
    place TEXT,
    dots NUMERIC,
    wilks NUMERIC,
    glossbrenner NUMERIC,
    goodlift NUMERIC,
    tested TEXT,
    country TEXT,
    state TEXT,
    federation TEXT,
    parentfederation TEXT,
    date DATE,
    meetcountry TEXT,
    meetstate TEXT,
    meettown TEXT,
    meetname TEXT,
    sanctioned TEXT
);

-- create indexes for common queries
CREATE INDEX idx_opl_name ON opl.opl_raw(name);
CREATE INDEX idx_opl_federation ON opl.opl_raw(federation);
CREATE INDEX idx_opl_date ON opl.opl_raw(date);
CREATE INDEX idx_opl_division ON opl.opl_raw(division);
CREATE INDEX idx_opl_weightclass ON opl.opl_raw(weightclasskg);
CREATE INDEX idx_opl_country ON opl.opl_raw(country);
CREATE INDEX idx_opl_sex ON opl.opl_raw(sex);
CREATE INDEX idx_opl_equipment ON opl.opl_raw(equipment);

-- additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_opl_raw_federation_lower 
ON opl.opl_raw(LOWER(federation));

CREATE INDEX IF NOT EXISTS idx_opl_raw_equipment_lower 
ON opl.opl_raw(LOWER(equipment));

CREATE INDEX IF NOT EXISTS idx_opl_raw_name_filters 
ON opl.opl_raw(name, LOWER(federation), LOWER(equipment), weightclasskg);

CREATE INDEX idx_ipf_name ON opl.ipf_raw(name);
CREATE INDEX idx_ipf_federation ON opl.ipf_raw(federation);
CREATE INDEX idx_ipf_date ON opl.ipf_raw(date);
CREATE INDEX idx_ipf_division ON opl.ipf_raw(division);
CREATE INDEX idx_ipf_weightclass ON opl.ipf_raw(weightclasskg);
CREATE INDEX idx_ipf_country ON opl.ipf_raw(country);
CREATE INDEX idx_ipf_sex ON opl.ipf_raw(sex);
CREATE INDEX idx_ipf_equipment ON opl.ipf_raw(equipment);

-- lifter search table for fast lookups
CREATE TABLE IF NOT EXISTS opl.lifter_search (
  name           text PRIMARY KEY,
  sex            text,
  country        text,
  earliest_year  int,
  latest_year    int,
  federations    text[],
  meets_count    int
);

-- index for fuzzy search (requires pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_lifter_search_name_trgm
  ON opl.lifter_search USING gin (name gin_trgm_ops);
