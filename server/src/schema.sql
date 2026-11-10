-- Substrate demo-request storage.
-- Applied by `npm run migrate` (server/src/migrate.js); safe to re-run.

CREATE TABLE IF NOT EXISTS demo_requests (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(120)    NOT NULL,
  email       VARCHAR(254)    NOT NULL,
  company     VARCHAR(120)        NULL,
  message     TEXT                NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_demo_requests_created_at (created_at DESC)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
