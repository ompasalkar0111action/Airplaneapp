CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  pnr VARCHAR(6) NOT NULL UNIQUE,
  flight_id VARCHAR(120) NOT NULL,
  cabin ENUM('economy', 'premium-economy', 'business') NOT NULL,
  seat_id VARCHAR(8) NOT NULL,
  passenger_first_name VARCHAR(100) NOT NULL,
  passenger_last_name VARCHAR(100) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  checked_bags INT NOT NULL DEFAULT 0,
  priority_boarding BOOLEAN NOT NULL DEFAULT FALSE,
  total_price INT NOT NULL,
  created_at DATETIME NOT NULL,
  status ENUM('confirmed') NOT NULL DEFAULT 'confirmed',
  UNIQUE KEY bookings_flight_seat_unique (flight_id, seat_id),
  KEY bookings_pnr_index (pnr),
  KEY bookings_email_index (passenger_email)
);
