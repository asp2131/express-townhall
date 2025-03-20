const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',         // replace with your MySQL username
  password: 'Makeda1!', // replace with your MySQL password
  database: 'mydb'      // replace with your database name
};

// Create a MySQL pool for connection management
const connection = mysql.createPool(dbConfig);

// Test the database connection
app.get('/test-connection', async (req, res) => {
  try {
    const connection = await connection.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Route to create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields' });
    }

    // Insert the new user
    const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [name, email, age || null]);
    console.log('Result:', result);
    res.status(201).json({ 
      id: result.insertId,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Check for duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  }
});



// Tell Rowan what Mr. Pounds and Christian the Terrible want
app.post('/order', (req, res) => {
  // Get food item and user_id
  const {food_item, user_id} = req.body;

  // Validate input
  if (!food_item || !user_id) {
    return res.status(400).json({ error: 'The type of wings and id of person are required' });
  }

  // Set up a query to the orders table to add an order for Rowan and Evil Rowan to prepare
  const data = [food_item, user_id]
  const query = 'INSERT INTO orders (food_item, user_id) VALUES (?, ?)';

  // Execute the query
  connection.query(query, data)
    .then((result)=> {
      console.log(result);
      //if successful we can let the user know
        // Respond with the order is done
      res.send("Order received! Evil Rowan will now ruin it! Or will he?").status(200)
    })
    .catch((err) => {
      console.error(err)
    })





})

// Route to get a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid user ID is required' });
    }

    // Get the user
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message 
    });
  }
});



// Initialize the database and start the server
(async () => {
  try {
    // Initialize the database and get the connection connection    
    // Create a test table if needed
    // await connection.query(`
    //   CREATE TABLE IF NOT EXISTS users (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(100) NOT NULL,
    //     email VARCHAR(100) UNIQUE NOT NULL,
    //     age INT
    //   );

    // CREATE TABLE IF NOT EXISTS orders (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   food_item VARCHAR(100) NOT NULL,
    //   user_id INT NOT NULL,
    //   FOREIGN KEY (user_id) REFERENCES users(user_id)
    //   );
    // `);
    
    // console.log('Tables initialized successfully');
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();