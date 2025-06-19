// Database Health Monitoring System for Supabase
// Real-time monitoring and alerting for production database

const { Pool } = require('pg');

class DatabaseHealthMonitor {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
    this.pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    this.metrics = {
      connectionCount: 0,
      queryCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      lastHealthCheck: null
    };
    
    this.thresholds = {
      maxConnections: 80,
      maxResponseTime: 1000,
      maxErrorRate: 0.05
    };
  }

  async checkConnectionHealth() {
    const start = Date.now();
    
    try {
      const result = await this.pool.query('SELECT NOW() as timestamp, version() as postgres_version');
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: result.rows[0].timestamp,
        version: result.rows[0].postgres_version,
        connectionPool: {
          total: this.pool.totalCount,
          idle: this.pool.idleCount,
          waiting: this.pool.waitingCount
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        responseTime: Date.now() - start
      };
    }
  }

  async checkTableHealth() {
    try {
      const queries = [
        // Check attorney profiles table
        {
          name: 'attorney_profiles',
          query: 'SELECT COUNT(*) as count FROM attorney_profiles WHERE availability_status = $1',
          params: ['available']
        },
        // Check case analyses
        {
          name: 'case_analyses', 
          query: 'SELECT COUNT(*) as active_cases FROM case_analyses WHERE status IN ($1, $2)',
          params: ['pending', 'active']
        },
        // Check emergency consultations
        {
          name: 'emergency_consultations',
          query: 'SELECT COUNT(*) as pending_emergencies FROM emergency_consultations WHERE status = $1',
          params: ['pending']
        },
        // Check legal resources
        {
          name: 'legal_resources',
          query: 'SELECT COUNT(*) as total_resources FROM legal_resources WHERE is_featured = $1',
          params: [true]
        }
      ];

      const results = {};
      
      for (const { name, query, params } of queries) {
        const start = Date.now();
        const result = await this.pool.query(query, params);
        const responseTime = Date.now() - start;
        
        results[name] = {
          data: result.rows[0],
          responseTime,
          status: responseTime < this.thresholds.maxResponseTime ? 'healthy' : 'slow'
        };
      }

      return results;
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async checkIndexPerformance() {
    try {
      const indexQuery = `
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch,
          CASE 
            WHEN idx_tup_read = 0 THEN 0
            ELSE (idx_tup_fetch::float / idx_tup_read::float * 100)::numeric(5,2)
          END as hit_rate
        FROM pg_stat_user_indexes 
        WHERE schemaname = 'public'
        ORDER BY idx_tup_read DESC
        LIMIT 10
      `;

      const result = await this.pool.query(indexQuery);
      
      return {
        status: 'healthy',
        indexes: result.rows,
        totalIndexes: result.rows.length
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async checkSlowQueries() {
    try {
      // Note: pg_stat_statements extension required for this
      const slowQueryCheck = `
        SELECT EXISTS (
          SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
        ) as extension_exists
      `;

      const extensionResult = await this.pool.query(slowQueryCheck);
      
      if (!extensionResult.rows[0].extension_exists) {
        return {
          status: 'warning',
          message: 'pg_stat_statements extension not available'
        };
      }

      const slowQueries = `
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          (total_time / sum(total_time) OVER()) * 100 as percentage
        FROM pg_stat_statements 
        WHERE mean_time > 100
        ORDER BY mean_time DESC
        LIMIT 5
      `;

      const result = await this.pool.query(slowQueries);
      
      return {
        status: result.rows.length > 0 ? 'warning' : 'healthy',
        slowQueries: result.rows
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async checkDiskUsage() {
    try {
      const diskQuery = `
        SELECT 
          pg_size_pretty(pg_database_size(current_database())) as database_size,
          (SELECT pg_size_pretty(sum(pg_total_relation_size(oid))) 
           FROM pg_class WHERE relkind = 'r') as tables_size,
          (SELECT pg_size_pretty(sum(pg_total_relation_size(oid))) 
           FROM pg_class WHERE relkind = 'i') as indexes_size
      `;

      const result = await this.pool.query(diskQuery);
      
      // Get largest tables
      const largestTables = `
        SELECT 
          table_name,
          pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size,
          pg_total_relation_size(quote_ident(table_name)) as size_bytes
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
        LIMIT 5
      `;

      const tablesResult = await this.pool.query(largestTables);

      return {
        status: 'healthy',
        usage: result.rows[0],
        largestTables: tablesResult.rows
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async performComprehensiveHealthCheck() {
    const healthReport = {
      timestamp: new Date().toISOString(),
      overall_status: 'healthy',
      checks: {}
    };

    try {
      // Connection health
      healthReport.checks.connection = await this.checkConnectionHealth();
      
      // Table health
      healthReport.checks.tables = await this.checkTableHealth();
      
      // Index performance
      healthReport.checks.indexes = await this.checkIndexPerformance();
      
      // Slow queries
      healthReport.checks.slowQueries = await this.checkSlowQueries();
      
      // Disk usage
      healthReport.checks.diskUsage = await this.checkDiskUsage();

      // Determine overall status
      const hasErrors = Object.values(healthReport.checks).some(check => 
        check.status === 'error'
      );
      
      const hasWarnings = Object.values(healthReport.checks).some(check => 
        check.status === 'warning' || check.status === 'slow'
      );

      if (hasErrors) {
        healthReport.overall_status = 'error';
      } else if (hasWarnings) {
        healthReport.overall_status = 'warning';
      }

      this.metrics.lastHealthCheck = healthReport.timestamp;
      
      return healthReport;
    } catch (error) {
      healthReport.overall_status = 'error';
      healthReport.error = error.message;
      return healthReport;
    }
  }

  async monitorRealtime(intervalMs = 30000) {
    console.log('Starting real-time database monitoring...');
    
    const monitor = async () => {
      try {
        const report = await this.performComprehensiveHealthCheck();
        
        console.log(`[${report.timestamp}] Database Status: ${report.overall_status.toUpperCase()}`);
        
        // Connection info
        if (report.checks.connection) {
          console.log(`  Connection: ${report.checks.connection.responseTime}ms`);
          console.log(`  Pool: ${report.checks.connection.connectionPool.total} total, ${report.checks.connection.connectionPool.idle} idle`);
        }
        
        // Table health
        if (report.checks.tables) {
          const tables = report.checks.tables;
          console.log(`  Available Attorneys: ${tables.attorney_profiles?.data?.count || 'N/A'}`);
          console.log(`  Active Cases: ${tables.case_analyses?.data?.active_cases || 'N/A'}`);
          console.log(`  Pending Emergencies: ${tables.emergency_consultations?.data?.pending_emergencies || 'N/A'}`);
        }
        
        // Alerts
        if (report.overall_status === 'error') {
          console.error('🚨 DATABASE ERROR DETECTED - Immediate attention required!');
        } else if (report.overall_status === 'warning') {
          console.warn('⚠️  Database warnings detected - Monitor closely');
        }
        
        console.log('---');
        
      } catch (error) {
        console.error('Monitoring error:', error.message);
      }
    };

    // Initial check
    await monitor();
    
    // Set up interval
    return setInterval(monitor, intervalMs);
  }

  async generateHealthReport() {
    const report = await this.performComprehensiveHealthCheck();
    
    const summary = {
      status: report.overall_status,
      timestamp: report.timestamp,
      connection: {
        healthy: report.checks.connection?.status === 'healthy',
        responseTime: report.checks.connection?.responseTime || 'N/A'
      },
      data: {
        attorneyCount: report.checks.tables?.attorney_profiles?.data?.count || 0,
        activeCases: report.checks.tables?.case_analyses?.data?.active_cases || 0,
        pendingEmergencies: report.checks.tables?.emergency_consultations?.data?.pending_emergencies || 0
      },
      performance: {
        slowQueries: report.checks.slowQueries?.slowQueries?.length || 0,
        indexHealth: report.checks.indexes?.status === 'healthy'
      },
      storage: {
        databaseSize: report.checks.diskUsage?.usage?.database_size || 'Unknown',
        largestTable: report.checks.diskUsage?.largestTables?.[0]?.table_name || 'N/A'
      }
    };

    return summary;
  }

  async close() {
    await this.pool.end();
  }
}

// CLI interface for health monitoring
if (require.main === module) {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const monitor = new DatabaseHealthMonitor(databaseUrl);
  
  const command = process.argv[2] || 'check';
  
  switch (command) {
    case 'check':
      monitor.performComprehensiveHealthCheck()
        .then(report => {
          console.log(JSON.stringify(report, null, 2));
          process.exit(report.overall_status === 'healthy' ? 0 : 1);
        })
        .catch(error => {
          console.error('Health check failed:', error);
          process.exit(1);
        });
      break;
      
    case 'monitor':
      const interval = parseInt(process.argv[3]) || 30000;
      monitor.monitorRealtime(interval)
        .then(() => {
          console.log('Monitoring started. Press Ctrl+C to stop.');
        })
        .catch(error => {
          console.error('Monitoring failed:', error);
          process.exit(1);
        });
      break;
      
    case 'summary':
      monitor.generateHealthReport()
        .then(summary => {
          console.log('Database Health Summary:');
          console.log('Status:', summary.status.toUpperCase());
          console.log('Connection Response Time:', summary.connection.responseTime + 'ms');
          console.log('Available Attorneys:', summary.data.attorneyCount);
          console.log('Active Cases:', summary.data.activeCases);
          console.log('Database Size:', summary.storage.databaseSize);
          process.exit(0);
        })
        .catch(error => {
          console.error('Summary failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node health-monitor.js [check|monitor|summary] [interval_ms]');
      process.exit(1);
  }
}

module.exports = DatabaseHealthMonitor;