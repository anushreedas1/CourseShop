const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/mini_course_db'
});

async function checkDatabase() {
  try {
    // Check courses
    const coursesResult = await pool.query('SELECT id, title, price FROM courses ORDER BY price');
    console.log('\n=== Courses in Database ===');
    coursesResult.rows.forEach(course => {
      const priceDisplay = parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`;
      console.log(`${course.id} | ${course.title} | ${priceDisplay}`);
    });
    
    // Check users
    const usersResult = await pool.query('SELECT id, email, name FROM users');
    console.log('\n=== Users in Database ===');
    usersResult.rows.forEach(user => {
      console.log(`${user.id} | ${user.email} | ${user.name || 'N/A'}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
