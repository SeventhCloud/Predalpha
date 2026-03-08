export const CREATE_EVENTS_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL,
            ticker TEXT,
            title TEXT,
            active INTEGER NOT NULL,
            closed INTEGER NOT NULL,
            start_date INTEGER,
            end_date INTEGER,
            created_at INTEGER NOT NULL,
            updated_at INTEGER,
            liquidity REAL,
            volume REAL,
            open_interest REAL,
            payload TEXT NOT NULL CHECK (json_valid(payload))
);`;

export const CREATE_MARKETS_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  slug TEXT,
  question TEXT,
  active INTEGER NOT NULL,
  closed INTEGER NOT NULL,
  start_date INTEGER,
  end_date INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  liquidity REAL,
  volume REAL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_markets_event ON markets(event_id);
CREATE INDEX IF NOT EXISTS idx_markets_active ON markets(active);
`;

export const CREATE_SERIES_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS series (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT,
  active INTEGER NOT NULL,
  closed INTEGER NOT NULL,

  start_date INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,

  payload TEXT NOT NULL CHECK (json_valid(payload))
);`;

export const CREATE_EVENT_SERIES_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS event_series (
  event_id TEXT NOT NULL,
  series_id TEXT NOT NULL,
  PRIMARY KEY (event_id, series_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);`;

export const CREATE_TAGS_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  label TEXT,
  payload TEXT NOT NULL CHECK (json_valid(payload))
);`;

export const CREATE_EVENT_TAGS_TABLE = /*sql*/ ` CREATE TABLE IF NOT EXISTS event_tags (
  event_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (event_id, tag_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);`;