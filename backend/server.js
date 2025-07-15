import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Oracle DB configuration
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SID}`
};

// Initialize Oracle connection pool
let pool;

async function initializePool() {
  try {
    pool = await oracledb.createPool({
      ...dbConfig,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60
    });
    console.log('Oracle connection pool initialized');
  } catch (error) {
    console.error('Error initializing Oracle pool:', error);
  }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  try {
    const connection = await pool.getConnection();
    
    // Check if user already exists
    const existingUser = await connection.execute(
      'SELECT email FROM users WHERE email = :email',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await connection.close();
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, created_at) 
       VALUES (:email, :password_hash, :first_name, :last_name, :phone, CURRENT_TIMESTAMP)`,
      [email, hashedPassword, first_name, last_name, phone]
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    
    const result = await connection.execute(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = :email',
      [email]
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user[2]); // password_hash is index 2

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user[0], email: user[1] },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user[0],
        email: user[1],
        first_name: user[3],
        last_name: user[4]
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User profile route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const result = await connection.execute(
      'SELECT id, email, first_name, last_name, phone FROM users WHERE id = :userId',
      [req.user.userId]
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user[0],
      email: user[1],
      first_name: user[2],
      last_name: user[3],
      phone: user[4]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Appointments routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const result = await connection.execute(
      `SELECT id, title, description, appointment_date, appointment_time, type, status 
       FROM appointments WHERE user_id = :userId ORDER BY appointment_date DESC`,
      [req.user.userId]
    );

    await connection.close();

    const appointments = result.rows.map(row => ({
      id: row[0],
      title: row[1],
      description: row[2],
      appointment_date: row[3],
      appointment_time: row[4],
      type: row[5],
      status: row[6]
    }));

    res.json(appointments);
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  const { title, description, appointment_date, appointment_time, type } = req.body;

  try {
    const connection = await pool.getConnection();
    
    await connection.execute(
      `INSERT INTO appointments (user_id, title, description, appointment_date, appointment_time, type, status, created_at) 
       VALUES (:userId, :title, :description, TO_DATE(:appointment_date, 'YYYY-MM-DD'), :appointment_time, :type, 'scheduled', CURRENT_TIMESTAMP)`,
      [req.user.userId, title, description, appointment_date, appointment_time, type]
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Articles routes
app.get('/api/articles', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const result = await connection.execute(
      `SELECT id, title, content, category, author, created_at 
       FROM articles ORDER BY created_at DESC`
    );

    await connection.close();

    const articles = result.rows.map(row => ({
      id: row[0],
      title: row[1],
      content: row[2],
      category: row[3],
      author: row[4],
      created_at: row[5]
    }));

    res.json(articles);
  } catch (error) {
    console.error('Articles fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Forum posts routes
app.get('/api/forum/posts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const result = await connection.execute(
      `SELECT fp.id, fp.title, fp.content, fp.created_at, u.first_name, u.last_name 
       FROM forum_posts fp 
       JOIN users u ON fp.user_id = u.id 
       ORDER BY fp.created_at DESC`
    );

    await connection.close();

    const posts = result.rows.map(row => ({
      id: row[0],
      title: row[1],
      content: row[2],
      created_at: row[3],
      author: `${row[4]} ${row[5]}`
    }));

    res.json(posts);
  } catch (error) {
    console.error('Forum posts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

app.post('/api/forum/posts', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const connection = await pool.getConnection();
    
    await connection.execute(
      `INSERT INTO forum_posts (user_id, title, content, created_at) 
       VALUES (:userId, :title, :content, CURRENT_TIMESTAMP)`,
      [req.user.userId, title, content]
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'Oracle', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  await initializePool();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: Oracle - ${dbConfig.connectString}`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});
