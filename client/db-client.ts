import { Database } from "bun:sqlite";
import { CREATE_EVENT_SERIES_TABLE, CREATE_EVENT_TAGS_TABLE, CREATE_EVENTS_TABLE, CREATE_MARKETS_TABLE, CREATE_SERIES_TABLE, CREATE_TAGS_TABLE } from "./sql-queries";


export class DBClient {

    db: Database;
    insertEvent: ReturnType<Database["prepare"]>;
    insertMarket: ReturnType<Database["prepare"]>;
    insertSeries: ReturnType<Database["prepare"]>;
    linkEventSeries: ReturnType<Database["prepare"]>;
    insertTag: ReturnType<Database["prepare"]>;
    linkEventTag: ReturnType<Database["prepare"]>;

    constructor(dbPath: string) {
        this.db = new Database(dbPath);
        this.db.run("PRAGMA journal_mode = WAL;"); // for efficient concurrent reads/writes
        this.db.run(CREATE_EVENTS_TABLE);
        this.db.run(CREATE_MARKETS_TABLE);
        this.db.run(CREATE_SERIES_TABLE);
        this.db.run(CREATE_EVENT_SERIES_TABLE);
        this.db.run(CREATE_TAGS_TABLE);
        this.db.run(CREATE_EVENT_TAGS_TABLE);
        this.insertEvent = this.db.prepare(/*sql*/ `INSERT OR REPLACE INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        this.insertMarket = this.db.prepare(/*sql*/ `INSERT OR REPLACE INTO markets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        this.insertSeries = this.db.prepare(/*sql*/ `INSERT OR REPLACE INTO series VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        this.linkEventSeries = this.db.prepare(/*sql*/ `INSERT OR IGNORE INTO event_series VALUES (?, ?)`);
        this.insertTag = this.db.prepare(/*sql*/ `INSERT OR IGNORE INTO tags VALUES (?, ?, ?, ?)`);
        this.linkEventTag = this.db.prepare(/*sql*/ `INSERT OR IGNORE INTO event_tags VALUES (?, ?)`);
    }

}