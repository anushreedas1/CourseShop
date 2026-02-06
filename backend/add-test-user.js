const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/mini_course_db'
});

async function addTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Check if user exists
    const checkResult = await pool.query('SELECT id FROM users WHERE email = $1', ['test1@example.com']);
    
    if (checkResult.rows.length > 0) {
      // Update password
      await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, 'test1@example.com']);
      console.log('✓ Updated test1@example.com password');
    } else {
      // Insert user
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        ['Test User One', 'test1@example.com', hashedPassword]
      );
      console.log('✓ Created test1@example.com');
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestUser();
