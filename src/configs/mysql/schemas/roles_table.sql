CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name ENUM('Manager', 'Technician') NOT NULL
);