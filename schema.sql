  USE mydb;
  
  CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT
      );

    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_item VARCHAR(100) NOT NULL,
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
      );