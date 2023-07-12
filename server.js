const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const port = 3000;

// Oracle Database connection configuration
const dbConfig = {
  user: 'system',
  password: 'admin',
  connectString: '//localhost:1521/XE'
};

// Enable CORS
app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Get all records
app.get('/data', (req, res) => {
  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.execute('SELECT * FROM employees', (err, result) => {
      connection.close();

      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }

      const records = result.rows.map(row => ({
        id: row[0],
        name: row[1],
        email: row[2]
      }));

      res.json(records);
    });
  });
});

// Create a record
app.post('/data', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.execute(
      'INSERT INTO employees (name, email) VALUES (:name, :email)',
      [name, email],
      { autoCommit: true },
      (err, result) => {
        connection.close();

        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query error' });
        }

        res.status(201).json({ message: 'Record created successfully' });
      }
    );
  });
});

// Update a record
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.execute(
      'UPDATE employees SET name = :name, email = :email WHERE id = :id',
      [name, email, id],
      { autoCommit: true },
      (err, result) => {
        connection.close();

        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query error' });
        }

        res.json({ message: 'Record updated successfully' });
      }
    );
  });
});

// Delete a record
app.delete('/data/:id', (req, res) => {
  const id = req.params.id;

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.execute(
      'DELETE FROM employees WHERE id = :id',
      [id],
      { autoCommit: true },
      (err, result) => {
        connection.close();

        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query error' });
        }

        res.json({ message: 'Record deleted successfully' });
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
