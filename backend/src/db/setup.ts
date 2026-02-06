import pool from './connection';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  console.log('Starting database setup...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection verified');

    // Read and execute schema SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schemaSql);
    console.log('✓ Database schema created successfully');

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('✓ Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
