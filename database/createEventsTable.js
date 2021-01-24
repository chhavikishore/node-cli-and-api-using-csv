module.exports.createTableQuery = `CREATE TABLE IF NOT EXISTS events (
    uuid VARCHAR(255) NOT NULL,
    tstamp TIMESTAMP NOT NULL,
    source VARCHAR(128) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    event_type VARCHAR(128) NOT NULL,
    event_category  VARCHAR(128) NOT NULL,
    event_action VARCHAR(128) NOT NULL,
    event_label VARCHAR(128) NOT NULL,
    event_value INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(128) NOT NULL,
    id SERIAL PRIMARY KEY
)`;