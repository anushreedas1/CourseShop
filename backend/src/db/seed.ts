import pool from './connection';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection verified');

    // Hash password for test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    // Insert test users
    console.log('\nSeeding users...');
    const usersResult = await pool.query(`
      INSERT INTO users (name, email, password) VALUES
      ('Test User One', 'test1@example.com', $1),
      ('Test User Two', 'test2@example.com', $1),
      ('Admin User', 'admin@example.com', $2)
      RETURNING id, name, email;
    `, [hashedPassword, hashedAdminPassword]);

    console.log('✓ Created users:');
    usersResult.rows.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    // Insert test courses
    console.log('\nSeeding courses...');
    const coursesResult = await pool.query(`
      INSERT INTO courses (title, description, price, image, main_image) VALUES
      (
        'Introduction to Web Development',
        'Learn the basics of HTML, CSS, and JavaScript. This comprehensive course covers fundamental web technologies and modern development practices. Perfect for beginners looking to start their web development journey.',
        0,
        '/assets/1thumb.jpg',
        '/assets/1main.jpg'
      ),
      (
        'Advanced React Patterns',
        'Master advanced React concepts and design patterns including hooks, context, custom hooks, render props, and compound components. Build scalable and maintainable React applications with best practices.',
        99.99,
        '/assets/2thumb.jpg',
        '/assets/2main.png'
      ),
      (
        'Node.js Backend Development',
        'Build scalable backend applications with Node.js and Express. Learn RESTful API design, authentication, database integration, error handling, and deployment strategies for production-ready applications.',
        149.99,
        '/assets/3thumb.jpg',
        '/assets/3main.png'
      ),
      (
        'Database Design Fundamentals',
        'Learn SQL and database design principles from scratch. Understand normalization, relationships, indexing, query optimization, and best practices for designing efficient database schemas.',
        0,
        '/assets/4thumb.jpg',
        '/assets/4main.png'
      ),
      (
        'Full-Stack TypeScript',
        'Build end-to-end applications with TypeScript. Master type safety across frontend and backend, learn advanced TypeScript features, and create robust full-stack applications with confidence.',
        199.99,
        '/assets/5thumb.jpg',
        '/assets/5main.png'
      ),
      (
        'Docker and DevOps Essentials',
        'Master containerization and deployment workflows with Docker. Learn container orchestration, CI/CD pipelines, cloud deployment, and modern DevOps practices for efficient software delivery.',
        79.99,
        '/assets/6thumb.png',
        '/assets/6main.jpg'
      )
      RETURNING id, title, price;
    `);

    console.log('✓ Created courses:');
    coursesResult.rows.forEach(course => {
      const priceDisplay = course.price === '0.00' ? 'Free' : `$${course.price}`;
      console.log(`  - ${course.title} (${priceDisplay})`);
    });

    // Display summary
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
    
    console.log('\n✓ Database seeding completed successfully!');
    console.log(`  Total users: ${userCount.rows[0].count}`);
    console.log(`  Total courses: ${courseCount.rows[0].count}`);
    console.log('\nTest credentials:');
    console.log('  Email: test1@example.com | Password: password123');
    console.log('  Email: test2@example.com | Password: password123');
    console.log('  Email: admin@example.com | Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
