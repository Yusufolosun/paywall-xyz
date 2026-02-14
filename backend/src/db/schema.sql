CREATE TABLE IF NOT EXISTS unlocks (
  id SERIAL PRIMARY KEY,
  tx_id VARCHAR(66) UNIQUE NOT NULL,
  content_id INTEGER NOT NULL,
  creator_address VARCHAR(50) NOT NULL,
  user_address VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  network VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_creator ON unlocks(creator_address);
CREATE INDEX idx_content ON unlocks(content_id);
