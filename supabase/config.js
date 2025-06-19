// Supabase Configuration and Management Tools
// Production database setup and maintenance utilities

class SupabaseManager {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
    this.isInitialized = false;
  }

  // Test database connection
  async testConnection() {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      const result = await pool.query('SELECT 1 as connected');
      await pool.end();
      
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  // Initialize database schema
  async initializeSchema() {
    try {
      const { Pool } = require('pg');
      const fs = require('fs');
      const path = require('path');
      
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      // Read and execute initialization script
      const schemaSQL = fs.readFileSync(
        path.join(__dirname, 'init.sql'), 
        'utf8'
      );
      
      console.log('🔄 Initializing database schema...');
      await pool.query(schemaSQL);
      
      // Verify tables created
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      console.log('✅ Database schema initialized');
      console.log('📊 Tables created:', result.rows.map(r => r.table_name));
      
      await pool.end();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Schema initialization failed:', error.message);
      return false;
    }
  }

  // Verify data integrity
  async verifyData() {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      console.log('🔍 Verifying database data...');
      
      // Check attorney profiles
      const attorneyCount = await pool.query('SELECT COUNT(*) FROM attorney_profiles');
      console.log(`👥 Attorney profiles: ${attorneyCount.rows[0].count}`);
      
      // Check legal resources
      const resourceCount = await pool.query('SELECT COUNT(*) FROM legal_resources');
      console.log(`📚 Legal resources: ${resourceCount.rows[0].count}`);
      
      // Check document templates
      const templateCount = await pool.query('SELECT COUNT(*) FROM document_templates');
      console.log(`📝 Document templates: ${templateCount.rows[0].count}`);
      
      // Check indexes
      const indexCount = await pool.query(`
        SELECT COUNT(*) FROM pg_indexes 
        WHERE schemaname = 'public'
      `);
      console.log(`🔍 Database indexes: ${indexCount.rows[0].count}`);
      
      await pool.end();
      return true;
    } catch (error) {
      console.error('❌ Data verification failed:', error.message);
      return false;
    }
  }

  // Optimize database performance
  async optimizeDatabase() {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      console.log('⚡ Optimizing database performance...');
      
      // Update table statistics
      await pool.query('ANALYZE;');
      console.log('✅ Table statistics updated');
      
      // Refresh materialized views
      await pool.query('REFRESH MATERIALIZED VIEW attorney_search_index;');
      console.log('✅ Materialized views refreshed');
      
      // Check for missing indexes
      const slowQueries = await pool.query(`
        SELECT query, calls, total_time, mean_time
        FROM pg_stat_statements 
        WHERE mean_time > 100
        ORDER BY mean_time DESC
        LIMIT 10
      `);
      
      if (slowQueries.rows.length > 0) {
        console.log('⚠️  Slow queries detected - consider adding indexes');
      }
      
      await pool.end();
      return true;
    } catch (error) {
      console.error('❌ Database optimization failed:', error.message);
      return false;
    }
  }

  // Backup database
  async createBackup() {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const backupFile = `militarylegalshield_backup_${timestamp}.sql`;
      
      console.log('💾 Creating database backup...');
      
      await execAsync(`pg_dump "${this.databaseUrl}" > ${backupFile}`);
      
      console.log(`✅ Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Backup creation failed:', error.message);
      return null;
    }
  }

  // Monitor database health
  async monitorHealth() {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      // Check connection count
      const connections = await pool.query(`
        SELECT count(*) as active_connections
        FROM pg_stat_activity 
        WHERE state = 'active'
      `);
      
      // Check database size
      const dbSize = await pool.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `);
      
      // Check table sizes
      const tableSizes = await pool.query(`
        SELECT 
          table_name,
          pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
        LIMIT 5
      `);
      
      const health = {
        timestamp: new Date().toISOString(),
        activeConnections: connections.rows[0].active_connections,
        databaseSize: dbSize.rows[0].database_size,
        largestTables: tableSizes.rows,
        status: 'healthy'
      };
      
      await pool.end();
      return health;
    } catch (error) {
      console.error('❌ Health monitoring failed:', error.message);
      return { status: 'error', error: error.message };
    }
  }
}

// Configuration templates for different environments
const configs = {
  development: {
    poolSize: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  production: {
    poolSize: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false
    }
  },
  
  testing: {
    poolSize: 2,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
  }
};

// Environment-specific setup
function getSupabaseConfig(environment = 'production') {
  const config = configs[environment] || configs.production;
  
  return {
    connectionString: process.env.DATABASE_URL,
    ...config
  };
}

// Automated setup function
async function setupSupabaseDatabase(databaseUrl) {
  console.log('🚀 Starting Supabase database setup...\n');
  
  const manager = new SupabaseManager(databaseUrl);
  
  // Step 1: Test connection
  const connected = await manager.testConnection();
  if (!connected) {
    console.error('❌ Setup failed: Cannot connect to database');
    return false;
  }
  
  // Step 2: Initialize schema
  const initialized = await manager.initializeSchema();
  if (!initialized) {
    console.error('❌ Setup failed: Schema initialization error');
    return false;
  }
  
  // Step 3: Verify data
  const verified = await manager.verifyData();
  if (!verified) {
    console.error('❌ Setup failed: Data verification error');
    return false;
  }
  
  // Step 4: Optimize performance
  const optimized = await manager.optimizeDatabase();
  if (!optimized) {
    console.warn('⚠️  Warning: Database optimization incomplete');
  }
  
  console.log('\n✅ Supabase database setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your application environment variables');
  console.log('2. Test API endpoints with new database');
  console.log('3. Run application health checks');
  console.log('4. Monitor database performance');
  
  return true;
}

// CLI interface
if (require.main === module) {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.log('Please set DATABASE_URL to your Supabase connection string');
    process.exit(1);
  }
  
  setupSupabaseDatabase(databaseUrl)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = {
  SupabaseManager,
  getSupabaseConfig,
  setupSupabaseDatabase
};